import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.facility_type || !body.waste_types || !body.volume || !body.zip_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Send welcome email to lead (if configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'PharmWaste Disposal <noreply@pharmaceuticalwastedisposal.com>',
          to: body.email,
          subject: 'Welcome to Pharmaceutical Waste Disposal - Your Quote is Being Prepared',
          html: generateWelcomeEmailHTML(body),
        })
        console.log('Welcome email sent to lead')
      } catch (emailError) {
        console.error('Welcome email failed:', emailError)
      }
    }

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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
        .checkmark { color: #00C851; font-size: 18px; }
        .timeline { background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .cta { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Pharmaceutical Waste Disposal</h1>
          <p>Your Compliance Partner in Medical Waste Management</p>
        </div>
        <div class="content">
          <h2>Thank you for your interest, ${lead.company ? lead.company : 'valued customer'}!</h2>
          
          <p>We've received your request for pharmaceutical waste disposal services and our team is already working on finding the perfect solution for your facility.</p>
          
          <div class="timeline">
            <h3>What Happens Next:</h3>
            <p>✅ <strong>Within 15 minutes:</strong> A specialist will review your requirements</p>
            <p>✅ <strong>Within 1 hour:</strong> You'll receive personalized quotes from certified partners</p>
            <p>✅ <strong>Within 24 hours:</strong> Complete compliance documentation package</p>
          </div>
          
          <h3>Your Requirements:</h3>
          <ul>
            <li><strong>Facility Type:</strong> ${lead.facility_type?.replace(/_/g, ' ').toUpperCase() || 'Healthcare Facility'}</li>
            <li><strong>Waste Types:</strong> ${lead.waste_types?.join(', ') || 'Pharmaceutical Waste'}</li>
            <li><strong>Service Area:</strong> ZIP ${lead.zip_code}</li>
          </ul>
          
          <h3>Why Choose Our Network:</h3>
          <ul>
            <li>✓ EPA Certified & DEA Registered Partners</li>
            <li>✓ 30-40% Average Cost Savings</li>
            <li>✓ Complete Compliance Documentation</li>
            <li>✓ 24/7 Emergency Response Available</li>
            <li>✓ Serving 2,847+ Healthcare Facilities</li>
          </ul>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmaceuticalwastedisposal.com'}/resources" class="cta">
              Access Compliance Resources
            </a>
          </center>
          
          <p><strong>Need immediate assistance?</strong><br>
          Call us directly at: <a href="tel:1-800-PHARMWASTE">1-800-PHARMWASTE</a></p>
          
          <div class="footer">
            <p>This email was sent because you requested information about pharmaceutical waste disposal services.<br>
            © 2024 Pharmaceutical Waste Disposal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}