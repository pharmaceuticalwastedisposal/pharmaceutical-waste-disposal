import { Resend } from 'resend'
import { supabase } from './supabase'
import { Lead } from './supabase'
import {
  EMAIL_SEQUENCE_TIMING,
  generateWelcomeEmail,
  generateQuoteReadyEmail,
  generateComplianceAlertEmail,
  generateSuccessStoryEmail,
  generateFinalNoticeEmail,
  generateCompetitorIssuesEmail,
  generateLastChanceEmail
} from './email-sequences'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type EmailSequenceType = 
  | 'welcome'
  | 'quote_ready'
  | 'compliance_alert'
  | 'success_story'
  | 'final_notice'
  | 'competitor_issues'
  | 'last_chance'

// Email sequence configuration
export const EMAIL_SEQUENCES: Array<{
  type: EmailSequenceType
  delayMinutes: number
  generator: (lead: Lead) => { subject: string, html: string }
}> = [
  {
    type: 'welcome',
    delayMinutes: EMAIL_SEQUENCE_TIMING.IMMEDIATE,
    generator: generateWelcomeEmail
  },
  {
    type: 'quote_ready',
    delayMinutes: EMAIL_SEQUENCE_TIMING.QUOTE_READY,
    generator: generateQuoteReadyEmail
  },
  {
    type: 'compliance_alert',
    delayMinutes: EMAIL_SEQUENCE_TIMING.COMPLIANCE_ALERT,
    generator: generateComplianceAlertEmail
  },
  {
    type: 'success_story',
    delayMinutes: EMAIL_SEQUENCE_TIMING.SUCCESS_STORY,
    generator: generateSuccessStoryEmail
  },
  {
    type: 'final_notice',
    delayMinutes: EMAIL_SEQUENCE_TIMING.FINAL_NOTICE,
    generator: generateFinalNoticeEmail
  },
  {
    type: 'competitor_issues',
    delayMinutes: EMAIL_SEQUENCE_TIMING.COMPETITOR_ISSUES,
    generator: generateCompetitorIssuesEmail
  },
  {
    type: 'last_chance',
    delayMinutes: EMAIL_SEQUENCE_TIMING.LAST_CHANCE,
    generator: generateLastChanceEmail
  }
]

// Schedule complete email sequence for a new lead (excluding welcome email)
export async function scheduleEmailSequence(lead: Lead): Promise<void> {
  if (!supabase) {
    console.log('Database not configured - skipping email sequence scheduling')
    return
  }

  const now = new Date()
  // Skip welcome email since it's sent immediately in the API route
  const followUpSequences = EMAIL_SEQUENCES.filter(seq => seq.type !== 'welcome')
  const scheduledEmails = followUpSequences.map(sequence => ({
    lead_id: lead.id,
    interaction_type: 'scheduled_email',
    interaction_data: {
      email_type: sequence.type,
      scheduled_time: new Date(now.getTime() + sequence.delayMinutes * 60 * 1000).toISOString(),
      subject_preview: sequence.generator(lead).subject.substring(0, 100) + '...',
      scheduled: true,
      sent: false
    },
    source: 'automation'
  }))

  try {
    await supabase
      .from('lead_interactions')
      .insert(scheduledEmails)

    console.log(`Scheduled ${scheduledEmails.length} emails for lead ${lead.id}`)
  } catch (error) {
    console.error('Failed to schedule email sequence:', error)
  }
}

// Send a single email and track it
export async function sendScheduledEmail(
  lead: Lead,
  emailType: EmailSequenceType,
  interactionId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.error('Resend not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const sequence = EMAIL_SEQUENCES.find(s => s.type === emailType)
    if (!sequence) {
      return { success: false, error: `Unknown email type: ${emailType}` }
    }

    const { subject, html } = sequence.generator(lead)

    const result = await resend.emails.send({
      from: 'Sarah Johnson <sarah@pharmaceuticalwastedisposal.com>',
      to: lead.email,
      replyTo: 'sarah@pharmaceuticalwastedisposal.com',
      subject,
      html,
      headers: {
        'X-Entity-Ref-ID': `lead-${lead.id}-${emailType}`,
        'List-Unsubscribe': '<https://pharmaceuticalwastedisposal.com/unsubscribe>',
        'X-Lead-Score': lead.lead_score.toString(),
        'X-Facility-Type': lead.facility_type
      },
      tags: [
        { name: 'sequence', value: emailType },
        { name: 'lead_score', value: lead.lead_score > 70 ? 'high' : lead.lead_score > 40 ? 'medium' : 'low' },
        { name: 'facility_type', value: lead.facility_type }
      ]
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return { success: false, error: result.error.message }
    }

    // Track the email send in database
    if (supabase) {
      // Update scheduled email as sent
      if (interactionId) {
        await supabase
          .from('lead_interactions')
          .update({
            interaction_data: {
              email_type: emailType,
              sent: true,
              sent_at: new Date().toISOString(),
              message_id: result.data?.id,
              subject
            }
          })
          .eq('id', interactionId)
      }

      // Create email sent interaction
      await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: lead.id,
          interaction_type: 'email_sent',
          interaction_data: {
            email_type: emailType,
            message_id: result.data?.id,
            subject,
            sent_at: new Date().toISOString()
          },
          source: 'automation'
        }])

      // Update lead's last contact timestamp
      await supabase
        .from('leads')
        .update({
          last_contact_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id)
    }

    console.log(`Email sent successfully: ${emailType} to ${lead.email}`)
    return { success: true, messageId: result.data?.id }

  } catch (error) {
    console.error('Failed to send scheduled email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Process all scheduled emails that are due
export async function processScheduledEmails(): Promise<{
  processed: number
  successful: number
  failed: number
  results: Array<{ leadId: string; emailType: string; success: boolean; error?: string }>
}> {
  if (!supabase) {
    console.error('Database not configured')
    return { processed: 0, successful: 0, failed: 0, results: [] }
  }

  try {
    // Get scheduled emails that are due
    const now = new Date()
    const { data: scheduledEmails, error: fetchError } = await supabase
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
          status
        )
      `)
      .eq('interaction_type', 'scheduled_email')
      .lte('interaction_data->scheduled_time', now.toISOString())
      .eq('interaction_data->sent', false)
      .limit(20) // Process max 20 emails at a time

    if (fetchError) {
      console.error('Error fetching scheduled emails:', fetchError)
      return { processed: 0, successful: 0, failed: 0, results: [] }
    }

    if (!scheduledEmails || scheduledEmails.length === 0) {
      return { processed: 0, successful: 0, failed: 0, results: [] }
    }

    const results = []
    let successful = 0
    let failed = 0

    for (const scheduledEmail of scheduledEmails) {
      const lead = scheduledEmail.leads
      const emailType = scheduledEmail.interaction_data?.email_type as EmailSequenceType

      // Skip if lead is already converted or opted out
      if (lead.status === 'closed_won' || lead.status === 'closed_lost') {
        // Mark as completed but skipped
        await supabase
          .from('lead_interactions')
          .update({
            interaction_data: {
              ...scheduledEmail.interaction_data,
              sent: true,
              skipped: true,
              skipped_reason: `Lead status: ${lead.status}`,
              skipped_at: now.toISOString()
            }
          })
          .eq('id', scheduledEmail.id)

        continue
      }

      // Send the email
      const result = await sendScheduledEmail(lead, emailType, scheduledEmail.id)

      results.push({
        leadId: lead.id,
        emailType,
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
    console.error('Error processing scheduled emails:', error)
    return { processed: 0, successful: 0, failed: 0, results: [] }
  }
}

// Stop email sequence for a lead (when they convert or opt out)
export async function stopEmailSequence(
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
      .eq('interaction_type', 'scheduled_email')
      .eq('interaction_data->sent', false)

    console.log(`Stopped email sequence for lead ${leadId}: ${reason}`)
  } catch (error) {
    console.error('Failed to stop email sequence:', error)
  }
}

// Get email performance metrics
export async function getEmailMetrics(days: number = 30): Promise<{
  totalSent: number
  openRate: number
  clickRate: number
  conversionRate: number
  bySequence: Record<string, { sent: number; opens: number; clicks: number }>
}> {
  if (!supabase) {
    return { totalSent: 0, openRate: 0, clickRate: 0, conversionRate: 0, bySequence: {} }
  }

  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: emailStats } = await supabase
      .from('lead_interactions')
      .select(`
        interaction_data,
        leads!inner(status)
      `)
      .eq('interaction_type', 'email_sent')
      .gte('created_at', startDate.toISOString())

    if (!emailStats) {
      return { totalSent: 0, openRate: 0, clickRate: 0, conversionRate: 0, bySequence: {} }
    }

    const totalSent = emailStats.length
    const bySequence: Record<string, { sent: number; opens: number; clicks: number }> = {}

    // Process email stats (would need webhook data for opens/clicks)
    emailStats.forEach(stat => {
      const emailType = stat.interaction_data?.email_type
      if (emailType) {
        if (!bySequence[emailType]) {
          bySequence[emailType] = { sent: 0, opens: 0, clicks: 0 }
        }
        bySequence[emailType].sent++
      }
    })

    // Calculate conversion rate from email recipients
    const convertedLeads = emailStats.filter(stat => 
      stat.leads?.status === 'closed_won'
    ).length

    return {
      totalSent,
      openRate: 0, // Would need webhook data
      clickRate: 0, // Would need webhook data
      conversionRate: totalSent > 0 ? (convertedLeads / totalSent) * 100 : 0,
      bySequence
    }

  } catch (error) {
    console.error('Failed to get email metrics:', error)
    return { totalSent: 0, openRate: 0, clickRate: 0, conversionRate: 0, bySequence: {} }
  }
}

export default {
  scheduleEmailSequence,
  sendScheduledEmail,
  processScheduledEmails,
  stopEmailSequence,
  getEmailMetrics,
  EMAIL_SEQUENCES
}