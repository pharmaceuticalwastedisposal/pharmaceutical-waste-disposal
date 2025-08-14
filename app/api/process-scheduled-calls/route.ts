import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { makeOutboundCall, checkCallOutcome } from '@/lib/bland-ai'
import { sendTemplateSMS } from '@/lib/twilio-sms'

// This endpoint should be called by a cron job every 5 minutes
// Can be set up with Vercel Cron, GitHub Actions, or any external cron service
export async function GET(request: NextRequest) {
  // Verify this is from an authorized source (cron job)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  // Capture supabase client for use in callbacks
  const supabaseClient = supabase

  try {
    // Get scheduled calls that are due
    const now = new Date()
    const { data: scheduledCalls, error: fetchError } = await supabaseClient
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
      .eq('interaction_type', 'scheduled_call')
      .lte('interaction_data->>scheduled_time', now.toISOString())
      .eq('interaction_data->>completed', 'false')
      .limit(10) // Process max 10 calls at a time

    if (fetchError) {
      console.error('Error fetching scheduled calls:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch scheduled calls' }, { status: 500 })
    }

    if (!scheduledCalls || scheduledCalls.length === 0) {
      return NextResponse.json({ message: 'No scheduled calls to process' })
    }

    const results = []

    for (const scheduledCall of scheduledCalls) {
      const lead = scheduledCall.leads
      const attemptNumber = scheduledCall.interaction_data?.attempt || 1

      // Skip if lead is already closed or converted
      if (lead.status === 'closed_won' || lead.status === 'closed_lost') {
        // Mark this scheduled call as completed
        await supabaseClient
          .from('lead_interactions')
          .update({
            interaction_data: {
              ...scheduledCall.interaction_data,
              completed: true,
              skipped_reason: 'Lead already closed'
            }
          })
          .eq('id', scheduledCall.id)
        
        continue
      }

      // Make the outbound call
      const callResult = await makeOutboundCall(lead, attemptNumber)

      if (callResult.success && callResult.callId) {
        // Update the scheduled call record
        await supabaseClient
          .from('lead_interactions')
          .update({
            interaction_data: {
              ...scheduledCall.interaction_data,
              completed: true,
              call_id: callResult.callId,
              called_at: now.toISOString()
            }
          })
          .eq('id', scheduledCall.id)

        // Create a new interaction record for this call
        await supabaseClient
          .from('lead_interactions')
          .insert([{
            lead_id: lead.id,
            interaction_type: 'outbound_call',
            interaction_data: {
              call_id: callResult.callId,
              attempt_number: attemptNumber,
              initiated_at: now.toISOString()
            },
            source: 'automation'
          }])

        // Update lead status to contacted
        if (lead.status === 'new') {
          await supabaseClient
            .from('leads')
            .update({ 
              status: 'contacted',
              updated_at: now.toISOString()
            })
            .eq('id', lead.id)
        }

        // Wait 30 seconds then check if call was answered
        setTimeout(async () => {
          if (!callResult.callId) return
          const outcome = await checkCallOutcome(callResult.callId)
          
          if (!outcome.answered && attemptNumber === 1) {
            // Send missed call SMS if first attempt
            await sendTemplateSMS(lead, 'MISSED_CALL_FOLLOWUP')
          }
          
          // Log call outcome
          await supabaseClient
            .from('lead_interactions')
            .insert([{
              lead_id: lead.id,
              interaction_type: 'call_outcome',
              interaction_data: outcome,
              source: 'automation'
            }])
        }, 30000)

        results.push({
          leadId: lead.id,
          success: true,
          callId: callResult.callId,
          attempt: attemptNumber
        })
      } else {
        // Call failed - mark as completed with error
        await supabaseClient
          .from('lead_interactions')
          .update({
            interaction_data: {
              ...scheduledCall.interaction_data,
              completed: true,
              error: callResult.error,
              failed_at: now.toISOString()
            }
          })
          .eq('id', scheduledCall.id)

        results.push({
          leadId: lead.id,
          success: false,
          error: callResult.error,
          attempt: attemptNumber
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    })

  } catch (error) {
    console.error('Error processing scheduled calls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Manual trigger for testing specific lead
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { leadId, attemptNumber = 1 } = await request.json()

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Capture supabase client for use in callbacks
    const supabaseClient = supabase

    // Fetch lead data
    const { data: lead, error } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Make the call
    const callResult = await makeOutboundCall(lead, attemptNumber)

    if (callResult.success) {
      // Log the interaction
      await supabaseClient
        .from('lead_interactions')
        .insert([{
          lead_id: lead.id,
          interaction_type: 'manual_outbound_call',
          interaction_data: {
            call_id: callResult.callId,
            attempt_number: attemptNumber,
            initiated_at: new Date().toISOString()
          },
          source: 'manual'
        }])
    }

    return NextResponse.json({
      success: callResult.success,
      callId: callResult.callId,
      error: callResult.error
    })

  } catch (error) {
    console.error('Error making manual call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}