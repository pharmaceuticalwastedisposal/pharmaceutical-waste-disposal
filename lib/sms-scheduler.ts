import { supabase } from './supabase'
import { Lead } from './supabase'
import { sendTemplateSMS, SMS_TEMPLATES } from './twilio-sms'

// SMS sequence timing (in minutes)
export const SMS_SEQUENCE_TIMING = {
  IMMEDIATE: 0,        // Welcome SMS - immediate
  QUOTE_READY: 120,    // 2 hours later
  MISSED_CALL: 1500,   // Day 1 (25 hours) - after first call attempt
  FINAL_ATTEMPT: 4380  // Day 3 (73 hours) - final push
}

export type SMSSequenceType = 'immediate_response' | 'quote_ready' | 'missed_call_followup' | 'final_attempt'

// SMS sequence configuration
export const SMS_SEQUENCES: Array<{
  type: SMSSequenceType
  delayMinutes: number
  template: keyof typeof SMS_TEMPLATES
}> = [
  {
    type: 'immediate_response',
    delayMinutes: SMS_SEQUENCE_TIMING.IMMEDIATE,
    template: 'IMMEDIATE_RESPONSE'
  },
  {
    type: 'quote_ready', 
    delayMinutes: SMS_SEQUENCE_TIMING.QUOTE_READY,
    template: 'QUOTE_READY'
  },
  {
    type: 'missed_call_followup',
    delayMinutes: SMS_SEQUENCE_TIMING.MISSED_CALL,
    template: 'MISSED_CALL_FOLLOWUP'
  },
  {
    type: 'final_attempt',
    delayMinutes: SMS_SEQUENCE_TIMING.FINAL_ATTEMPT,
    template: 'FINAL_ATTEMPT'
  }
]

// Schedule complete SMS sequence for a new lead
export async function scheduleSMSSequence(lead: Lead): Promise<void> {
  if (!supabase) {
    console.log('Database not configured - skipping SMS sequence scheduling')
    return
  }

  // Skip if no phone number
  if (!lead.phone) {
    console.log('No phone number provided - skipping SMS sequence')
    return
  }

  const now = new Date()
  const scheduledSMS = SMS_SEQUENCES.map(sequence => ({
    lead_id: lead.id,
    interaction_type: 'scheduled_sms',
    interaction_data: {
      sms_type: sequence.type,
      template: sequence.template,
      scheduled_time: new Date(now.getTime() + sequence.delayMinutes * 60 * 1000).toISOString(),
      phone_number: lead.phone,
      scheduled: true,
      sent: false
    },
    source: 'automation'
  }))

  try {
    await supabase
      .from('lead_interactions')
      .insert(scheduledSMS)

    console.log(`Scheduled ${scheduledSMS.length} SMS messages for lead ${lead.id}`)
  } catch (error) {
    console.error('Failed to schedule SMS sequence:', error)
  }
}

// Send a single SMS and track it
export async function sendScheduledSMS(
  lead: Lead,
  smsType: SMSSequenceType,
  template: keyof typeof SMS_TEMPLATES,
  interactionId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  
  if (!lead.phone) {
    return { success: false, error: 'No phone number provided' }
  }

  try {
    // Send the SMS using existing template system
    const result = await sendTemplateSMS(lead, template)

    // Track the SMS send in database
    if (supabase) {
      // Update scheduled SMS as sent
      if (interactionId) {
        await supabase
          .from('lead_interactions')
          .update({
            interaction_data: {
              sms_type: smsType,
              template,
              sent: true,
              sent_at: new Date().toISOString(),
              message_id: result.messageId,
              phone_number: lead.phone
            }
          })
          .eq('id', interactionId)
      }

      // Create SMS sent interaction
      await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: lead.id,
          interaction_type: 'sms_sent',
          interaction_data: {
            sms_type: smsType,
            template,
            message_id: result.messageId,
            phone_number: lead.phone,
            sent_at: new Date().toISOString()
          },
          source: 'automation'
        }])

      // Update lead's last contact timestamp
      await supabase
        .from('leads')
        .update({
          last_sms_at: new Date().toISOString(),
          last_contact_at: new Date().toISOString(),
          sms_sent_count: (lead.sms_sent_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id)
    }

    console.log(`SMS sent successfully: ${smsType} to ${lead.phone}`)
    return { success: true, messageId: result.messageId }

  } catch (error) {
    console.error('Failed to send scheduled SMS:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send SMS' 
    }
  }
}

// Process all scheduled SMS that are due
export async function processScheduledSMS(): Promise<{
  processed: number
  successful: number
  failed: number
  results: Array<{ leadId: string; smsType: string; success: boolean; error?: string }>
}> {
  if (!supabase) {
    console.error('Database not configured')
    return { processed: 0, successful: 0, failed: 0, results: [] }
  }

  try {
    // Get scheduled SMS that are due
    const now = new Date()
    const { data: scheduledSMS, error: fetchError } = await supabase
      .from('lead_interactions')
      .select(`
        *,
        leads!inner (
          id,
          email,
          phone,
          company,
          facility_type,
          waste_types,
          volume_range,
          zip_code,
          lead_score,
          status,
          sms_sent_count
        )
      `)
      .eq('interaction_type', 'scheduled_sms')
      .lte('interaction_data->scheduled_time', now.toISOString())
      .eq('interaction_data->sent', false)
      .limit(20) // Process max 20 SMS at a time

    if (fetchError) {
      console.error('Error fetching scheduled SMS:', fetchError)
      return { processed: 0, successful: 0, failed: 0, results: [] }
    }

    if (!scheduledSMS || scheduledSMS.length === 0) {
      return { processed: 0, successful: 0, failed: 0, results: [] }
    }

    const results = []
    let successful = 0
    let failed = 0

    for (const scheduledMessage of scheduledSMS) {
      const lead = scheduledMessage.leads
      const smsType = scheduledMessage.interaction_data?.sms_type as SMSSequenceType
      const template = scheduledMessage.interaction_data?.template as keyof typeof SMS_TEMPLATES

      // Skip if lead is already converted or opted out
      if (lead.status === 'closed_won' || lead.status === 'closed_lost') {
        // Mark as completed but skipped
        await supabase
          .from('lead_interactions')
          .update({
            interaction_data: {
              ...scheduledMessage.interaction_data,
              sent: true,
              skipped: true,
              skipped_reason: `Lead status: ${lead.status}`,
              skipped_at: now.toISOString()
            }
          })
          .eq('id', scheduledMessage.id)

        continue
      }

      // Send the SMS
      const result = await sendScheduledSMS(lead, smsType, template, scheduledMessage.id)

      results.push({
        leadId: lead.id,
        smsType,
        success: result.success,
        error: result.error
      })

      if (result.success) {
        successful++
      } else {
        failed++
      }
    }

    return {
      processed: results.length,
      successful,
      failed,
      results
    }

  } catch (error) {
    console.error('Error processing scheduled SMS:', error)
    return { processed: 0, successful: 0, failed: 0, results: [] }
  }
}

// Stop SMS sequence for a lead (when they convert or opt out)
export async function stopSMSSequence(
  leadId: string, 
  reason: string = 'Lead converted'
): Promise<void> {
  if (!supabase) return

  try {
    await supabase
      .from('lead_interactions')
      .update({
        interaction_data: { stopped: true }
      })
      .eq('lead_id', leadId)
      .eq('interaction_type', 'scheduled_sms')
      .eq('interaction_data->sent', false)

    console.log(`Stopped SMS sequence for lead ${leadId}: ${reason}`)
  } catch (error) {
    console.error('Failed to stop SMS sequence:', error)
  }
}

export default {
  scheduleSMSSequence,
  sendScheduledSMS,
  processScheduledSMS,
  stopSMSSequence,
  SMS_SEQUENCES
}