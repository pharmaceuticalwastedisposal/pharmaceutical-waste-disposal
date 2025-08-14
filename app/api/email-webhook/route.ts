import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { stopEmailSequence } from '@/lib/email-scheduler'

// Webhook to receive email events from Resend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Resend webhook received:', JSON.stringify(body, null, 2))

    const {
      type,
      data: {
        email_id,
        to,
        subject,
        created_at,
        from,
        tags
      }
    } = body

    if (!email_id || !supabase) {
      return NextResponse.json({ received: true })
    }

    // Extract lead ID from entity ref if available
    const entityRef = body.data?.headers?.['X-Entity-Ref-ID']
    const leadId = entityRef?.match(/lead-([^-]+)/)?.[1]

    // Process different email events
    switch (type) {
      case 'email.sent':
        console.log(`Email sent: ${email_id}`)
        break

      case 'email.delivered':
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: leadId,
            interaction_type: 'email_delivered',
            interaction_data: {
              email_id,
              to,
              subject,
              delivered_at: created_at,
              tags
            },
            source: 'resend_webhook'
          }])
        break

      case 'email.opened':
        // Track email open
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: leadId,
            interaction_type: 'email_opened',
            interaction_data: {
              email_id,
              to,
              subject,
              opened_at: created_at,
              tags
            },
            source: 'resend_webhook'
          }])

        // Update lead engagement score
        if (leadId) {
          await supabase
            .from('leads')
            .update({
              last_contact_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', leadId)
        }
        break

      case 'email.clicked':
        // Track email click - high engagement
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: leadId,
            interaction_type: 'email_clicked',
            interaction_data: {
              email_id,
              to,
              subject,
              clicked_at: created_at,
              url: body.data?.link?.url,
              tags
            },
            source: 'resend_webhook'
          }])

        // High engagement - update lead status if still new
        if (leadId) {
          const { data: lead } = await supabase
            .from('leads')
            .select('status')
            .eq('id', leadId)
            .single()

          if (lead?.status === 'new') {
            await supabase
              .from('leads')
              .update({
                status: 'contacted',
                notes: 'High engagement - clicked email link',
                updated_at: new Date().toISOString()
              })
              .eq('id', leadId)
          }
        }
        break

      case 'email.bounced':
        // Email bounced - mark lead email as invalid
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: leadId,
            interaction_type: 'email_bounced',
            interaction_data: {
              email_id,
              to,
              subject,
              bounced_at: created_at,
              bounce_type: body.data?.bounce_type,
              bounce_reason: body.data?.bounce_reason,
              tags
            },
            source: 'resend_webhook'
          }])

        // Stop email sequence for bounced emails
        if (leadId) {
          await stopEmailSequence(leadId, 'Email bounced')
        }
        break

      case 'email.complained':
        // Spam complaint - immediately stop all communication
        await supabase
          .from('lead_interactions')
          .insert([{
            lead_id: leadId,
            interaction_type: 'email_complained',
            interaction_data: {
              email_id,
              to,
              subject,
              complained_at: created_at,
              tags
            },
            source: 'resend_webhook'
          }])

        // Stop all sequences and mark lead as closed
        if (leadId) {
          await stopEmailSequence(leadId, 'Spam complaint')
          await supabase
            .from('leads')
            .update({
              status: 'closed_lost',
              notes: 'Spam complaint - do not contact',
              updated_at: new Date().toISOString()
            })
            .eq('id', leadId)
        }
        break

      default:
        console.log(`Unknown email event type: ${type}`)
    }

    return NextResponse.json({ 
      received: true,
      processed: true,
      event_type: type,
      email_id
    })

  } catch (error) {
    console.error('Email webhook processing error:', error)
    // Return success to prevent Resend from retrying
    return NextResponse.json({ received: true, error: true })
  }
}