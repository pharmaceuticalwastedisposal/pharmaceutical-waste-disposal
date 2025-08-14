import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendTemplateSMS } from '@/lib/twilio-sms'

// Webhook to receive call status updates from Bland.ai
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Bland.ai webhook received:', JSON.stringify(body, null, 2))

    // Extract call details
    const {
      call_id,
      call_length,
      from,
      to,
      answered,
      recording_url,
      transcription,
      summary,
      metadata,
      analysis,
      end_reason
    } = body

    if (!metadata?.lead_id || !supabase) {
      console.log('Missing lead_id or database not configured')
      return NextResponse.json({ received: true })
    }

    // Store call details in database
    await supabase
      .from('lead_interactions')
      .insert([{
        lead_id: metadata.lead_id,
        interaction_type: 'call_completed',
        interaction_data: {
          call_id,
          call_length,
          answered,
          recording_url,
          transcription,
          summary,
          end_reason,
          analysis,
          attempt_number: metadata.attempt_number
        },
        source: 'bland_webhook'
      }])

    // Get lead data for follow-up actions
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', metadata.lead_id)
      .single()

    if (!lead) {
      return NextResponse.json({ received: true })
    }

    // Handle different call outcomes
    if (answered) {
      // Call was answered - check the analysis
      if (analysis?.interested === true || analysis?.appointment_scheduled) {
        // Lead is interested or appointment scheduled
        await supabase
          .from('leads')
          .update({
            status: 'qualified',
            notes: `Call answered - ${analysis.appointment_scheduled ? 'Appointment scheduled' : 'Lead interested'}. Summary: ${summary}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.lead_id)

        // Send confirmation SMS if appointment scheduled
        if (analysis.appointment_scheduled && analysis.appointment_time) {
          await sendTemplateSMS(
            lead, 
            'APPOINTMENT_CONFIRMATION',
            { appointmentTime: analysis.appointment_time }
          )
        }
      } else if (analysis?.not_interested === true) {
        // Lead not interested
        await supabase
          .from('leads')
          .update({
            status: 'closed_lost',
            notes: `Not interested. Reason: ${analysis.objection || 'Not specified'}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.lead_id)
      } else {
        // Neutral or unclear outcome - keep as contacted
        await supabase
          .from('leads')
          .update({
            status: 'contacted',
            notes: `Call completed. Summary: ${summary}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.lead_id)
      }
    } else {
      // Call not answered
      const attemptNumber = metadata.attempt_number || 1

      if (end_reason === 'voicemail') {
        // Voicemail left
        console.log(`Voicemail left for lead ${metadata.lead_id}`)
        
        // Send follow-up SMS if first or second attempt
        if (attemptNumber <= 2) {
          await sendTemplateSMS(lead, 'MISSED_CALL_FOLLOWUP')
        }
      }

      // Check if this was the final attempt
      if (attemptNumber >= 3) {
        // Final attempt - send last chance SMS
        await sendTemplateSMS(lead, 'FINAL_ATTEMPT')
        
        // Update lead status
        await supabase
          .from('leads')
          .update({
            status: 'contacted',
            notes: `3 call attempts made, no answer. Final SMS sent.`,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.lead_id)
      }
    }

    // Calculate conversion metrics
    if (answered && call_length > 30) {
      // Call lasted more than 30 seconds - likely a quality conversation
      await supabase
        .from('lead_interactions')
        .insert([{
          lead_id: metadata.lead_id,
          interaction_type: 'quality_conversation',
          interaction_data: {
            call_length,
            lead_score: metadata.lead_score,
            facility_type: metadata.facility_type
          },
          source: 'automation'
        }])
    }

    return NextResponse.json({ 
      received: true,
      processed: true,
      lead_id: metadata.lead_id
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return success to prevent Bland.ai from retrying
    return NextResponse.json({ received: true, error: true })
  }
}