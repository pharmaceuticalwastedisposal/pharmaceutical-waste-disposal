import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import { makeOutboundCall, calculateOptimalCallTime, SPECIALIST_PHONE } from '@/lib/bland-ai'
import { validatePhoneNumber } from '@/lib/twilio-sms'
import { scheduleEmailSequence } from '@/lib/email-scheduler'
import { scheduleSMSSequence } from '@/lib/sms-scheduler'

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received form data:', JSON.stringify(body, null, 2))
    console.log('Email field specifically:', body.email, 'Type:', typeof body.email)
    
    // Validate required fields
    if (!body.email || !body.phone || !body.facility_type || !body.waste_types || !body.volume || !body.zip_code) {
      return NextResponse.json(
        { error: 'Missing required fields: email, phone, facility type, waste types, volume, and ZIP code are all required' },
        { status: 400 }
      )
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(body)

    // Prepare lead data
    const leadData = {
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      facility_type: body.facility_type,
      waste_types: body.waste_types,
      volume_range: body.volume,
      zip_code: body.zip_code,
      lead_score: leadScore,
      source: body.source || 'website_form',
      status: 'new' as const,
    }

    // Save to Supabase with duplicate handling
    let savedLead = null
    if (supabase) {
      // First, check if lead exists
      const { data: existingLead } = await supabase
        .from('leads')
        .select('*')
        .eq('email', leadData.email)
        .single()

      if (existingLead) {
        // Lead exists - update it with new information
        console.log('Existing lead found, updating...', existingLead.id)
        
        const { data: updatedLead, error: updateError } = await supabase
          .from('leads')
          .update({
            ...leadData,
            submission_count: (existingLead.submission_count || 1) + 1,
            last_submission_at: new Date().toISOString(),
            // Keep the higher lead score
            lead_score: Math.max(leadData.lead_score, existingLead.lead_score || 0),
            // Update status if it was closed
            status: existingLead.status === 'closed_lost' ? 'new' : existingLead.status,
            notes: `${existingLead.notes || ''}\n[${new Date().toISOString()}] New submission - Score: ${leadData.lead_score}`,
          })
          .eq('id', existingLead.id)
          .select()
          .single()

        if (updateError) {
          console.error('Update error:', updateError)
        } else {
          savedLead = updatedLead
          
          // Track this as a re-submission
          await supabase
            .from('lead_interactions')
            .insert([{
              lead_id: existingLead.id,
              interaction_type: 'form_resubmission',
              interaction_data: leadData,
              source: leadData.source,
            }])
        }
      } else {
        // New lead - insert it
        const { data, error } = await supabase
          .from('leads')
          .insert([leadData])
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
        } else {
          savedLead = data
          
          // Track initial submission
          await supabase
            .from('lead_interactions')
            .insert([{
              lead_id: data.id,
              interaction_type: 'form_submission',
              interaction_data: leadData,
              source: leadData.source,
            }])
        }
      }
    }

    // Multi-channel follow-up sequence
    if (savedLead) {
      // 1. Schedule professional SMS sequence
      if (savedLead.phone) {
        const phoneValidation = await validatePhoneNumber(savedLead.phone)
        if (phoneValidation.valid && phoneValidation.type !== 'landline') {
          await scheduleSMSSequence(savedLead)
          console.log('SMS sequence scheduled for lead:', savedLead.id)
        }
      }
      
      // 2. Schedule call with 90-second delay
      if (savedLead.phone) {
        try {
          // Trigger delayed call via separate endpoint
          fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/trigger-call`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              leadId: savedLead.id,
              delay: 90 // 90 seconds
            })
          }).catch(error => {
            console.error('❌ Failed to schedule call:', error)
          })
          
          console.log('⏰ Call scheduled for 90 seconds from now')
        } catch (error) {
          console.error('❌ Call scheduling error:', error)
        }
      }

      // Schedule follow-up calls for later
      const firstCallTime = calculateOptimalCallTime(savedLead, 2) // Changed to 2nd attempt
      const secondCallTime = calculateOptimalCallTime(savedLead, 3)
      const finalCallTime = calculateOptimalCallTime(savedLead, 4)
      
      // Store call schedule in database
      if (supabase) {
        await supabase
          .from('lead_interactions')
          .insert([
            {
              lead_id: savedLead.id,
              interaction_type: 'scheduled_call',
              interaction_data: {
                attempt: 1,
                scheduled_time: firstCallTime.toISOString(),
                specialist_phone: SPECIALIST_PHONE
              },
              source: 'automation'
            },
            {
              lead_id: savedLead.id,
              interaction_type: 'scheduled_call',
              interaction_data: {
                attempt: 2,
                scheduled_time: secondCallTime.toISOString(),
                specialist_phone: SPECIALIST_PHONE
              },
              source: 'automation'
            },
            {
              lead_id: savedLead.id,
              interaction_type: 'scheduled_call',
              interaction_data: {
                attempt: 3,
                scheduled_time: finalCallTime.toISOString(),
                specialist_phone: SPECIALIST_PHONE
              },
              source: 'automation'
            }
          ])
        
        console.log('AI call schedule created:', {
          leadId: savedLead.id,
          firstCall: firstCallTime,
          secondCall: secondCallTime,
          finalCall: finalCallTime
        })
      }

      // 3. Send immediate welcome email to user
      if (resend) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Sarah Johnson <sarah@pharmaceuticalwastedisposal.com>',
            to: savedLead.email,
            subject: 'Your Pharmaceutical Waste Quote Request - Next Steps',
            html: generateWelcomeEmailHTML(savedLead),
          })
          console.log('Welcome email sent immediately to:', savedLead.email)
        } catch (welcomeEmailError) {
          console.error('Welcome email failed:', welcomeEmailError)
        }
      }

      // 4. Schedule follow-up email drip sequence (excluding welcome since we just sent it)
      await scheduleEmailSequence(savedLead)
      console.log('Follow-up email sequence scheduled for lead:', savedLead.id)
    }
    
    // Send notification email to admin (if configured)
    if (resend && process.env.NOTIFICATION_EMAIL) {
      try {
        const isReturning = savedLead?.submission_count > 1
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'PharmWaste Disposal <noreply@pharmaceuticalwastedisposal.com>',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `🚨 ${isReturning ? '🔄 RETURNING' : 'New'} ${leadScore >= 70 ? 'HIGH PRIORITY' : ''} Lead: ${body.company || body.email}`,
          html: generateAdminEmailHTML(leadData, leadScore, isReturning, savedLead?.submission_count),
        })
        console.log('Admin notification email sent')
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
      }
    } else {
      console.log('Email notifications not configured - skipping')
    }

    // Note: Welcome email is now handled by the scheduled email sequence
    // The drip sequence starts with an enhanced welcome email immediately

    return NextResponse.json({
      success: true,
      leadId: savedLead?.id || `temp_${Date.now()}`,
      message: 'Lead captured successfully'
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateLeadScore(data: any): number {
  let score = 0
  
  // Facility type scoring
  if (data.facility_type === 'hospital') score += 30
  else if (data.facility_type === 'pharmacy_chain') score += 25
  else if (data.facility_type === 'clinic') score += 20
  else if (data.facility_type === 'long_term_care') score += 20
  else score += 10

  // Waste type scoring
  if (data.waste_types?.includes('controlled')) score += 20
  if (data.waste_types?.includes('hazardous')) score += 15
  if (data.waste_types?.includes('chemotherapy')) score += 15
  
  // Volume scoring
  if (data.volume === 'enterprise') score += 25
  else if (data.volume === 'large') score += 20
  else if (data.volume === 'medium') score += 10
  else score += 5
  
  // Contact info scoring
  if (data.phone) score += 10
  if (data.company) score += 5
  
  return Math.min(score, 100)
}

function generateAdminEmailHTML(lead: any, score: number, isReturning: boolean = false, submissionCount?: number): string {
  const priority = score >= 70 ? '🔥 HIGH PRIORITY' : score >= 50 ? '⚡ MEDIUM PRIORITY' : '📋 STANDARD'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .score { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .high { background: #ff4444; color: white; }
        .medium { background: #ffaa00; color: white; }
        .low { background: #00C851; color: white; }
        .field { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .cta { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isReturning ? '🔄 Returning Lead Re-engaged!' : 'New Lead Received!'}</h1>
          <p>${priority} - Score: ${score}/100</p>
          ${isReturning ? `<p style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px;">This lead has submitted ${submissionCount} times - they're highly interested!</p>` : ''}
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Company:</span>
            <span class="value">${lead.company || 'Not provided'}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${lead.email}</span>
          </div>
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${lead.phone || 'Not provided'}</span>
          </div>
          <div class="field">
            <span class="label">Facility Type:</span>
            <span class="value">${lead.facility_type.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">Waste Types:</span>
            <span class="value">${lead.waste_types.join(', ')}</span>
          </div>
          <div class="field">
            <span class="label">Volume:</span>
            <span class="value">${lead.volume_range.toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">ZIP Code:</span>
            <span class="value">${lead.zip_code}</span>
          </div>
          
          <h3>Recommended Actions:</h3>
          <ul>
            ${score >= 70 ? '<li>🔥 Call within 15 minutes</li>' : ''}
            ${score >= 50 ? '<li>⚡ Send quote within 1 hour</li>' : '<li>📧 Send quote within 24 hours</li>'}
            ${lead.waste_types.includes('controlled') ? '<li>💊 Prepare DEA compliance documentation</li>' : ''}
            ${lead.facility_type === 'hospital' ? '<li>🏥 Assign to enterprise sales team</li>' : ''}
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmaceuticalwastedisposal.com'}/admin/leads/${lead.id || ''}" class="cta">
            View Lead Details
          </a>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateWelcomeEmailHTML(lead: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-bottom: 2px solid #dee2e6; }
        .content { background: #ffffff; padding: 20px; }
        .info-box { background: #f8f9fa; padding: 15px; border-left: 3px solid #667eea; margin: 20px 0; }
        .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        a { color: #667eea; }
        h1 { color: #212529; font-size: 24px; margin: 0; }
        h2 { color: #495057; font-size: 18px; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Request Received</h1>
        </div>
        <div class="content">
          <p>Hello${lead.company ? ` ${lead.company}` : ''},</p>
          
          <p>We have received your request for pharmaceutical waste disposal services on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
          
          <div class="info-box">
            <strong>Your Request Details:</strong>
            <ul>
              <li>Facility Type: ${lead.facility_type?.replace(/_/g, ' ')}</li>
              <li>Waste Types: ${lead.waste_types?.join(', ')}</li>
              <li>Service Location: ${lead.zip_code}</li>
            </ul>
          </div>
          
          <h2>Next Steps</h2>
          <p>A waste management specialist will review your requirements and contact you within one business day with:</p>
          <ul>
            <li>Customized pricing for your facility</li>
            <li>Service schedule options</li>
            <li>Compliance documentation requirements</li>
          </ul>
          
          <h2 style="color: #28a745; margin: 20px 0;">📞 Speak with Our Specialist Now!</h2>
          <p style="font-size: 18px; font-weight: bold;">Call ${SPECIALIST_PHONE || '1-855-DISPOSE-1'} for instant pricing</p>
          <p style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            Our specialist is available to:<br>
            • Provide immediate custom pricing<br>
            • Answer compliance questions<br>
            • Schedule service setup<br>
            • Compare savings vs your current vendor
          </p>
          
          <p>${lead.phone ? `We'll also be calling you shortly at ${lead.phone} to discuss your needs.` : ''}</p>
          
          <p>If you need immediate assistance, please call: ${SPECIALIST_PHONE || '1-855-DISPOSE-1'}</p>
          
          <p>Thank you for considering Pharmaceutical Waste Disposal for your waste management needs.</p>
          
          <p>Best regards,<br>
          The Pharmaceutical Waste Disposal Team</p>
          
          <div class="footer">
            <p>Pharmaceutical Waste Disposal<br>
            EPA Certified | DEA Registered<br>
            <a href="https://pharmaceuticalwastedisposal.com">pharmaceuticalwastedisposal.com</a></p>
            
            <p>This email was sent to ${lead.email} because a quote was requested from our website. 
            If you did not make this request, please disregard this email.</p>
            
            <p><a href="https://pharmaceuticalwastedisposal.com/unsubscribe">Unsubscribe</a> | 
            <a href="https://pharmaceuticalwastedisposal.com/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}