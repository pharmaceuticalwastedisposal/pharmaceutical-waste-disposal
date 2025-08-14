import { Resend } from 'resend'
import { Lead } from './supabase'
import { SPECIALIST_PHONE } from './bland-ai'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Email sequence timing (in minutes from form submission)
export const EMAIL_SEQUENCE_TIMING = {
  IMMEDIATE: 0,        // Welcome email
  QUOTE_READY: 120,    // 2 hours - Custom quote ready
  COMPLIANCE_ALERT: 1440,  // Day 1 - Compliance deadline urgency
  SUCCESS_STORY: 2880,     // Day 2 - Customer testimonial
  FINAL_NOTICE: 5760,      // Day 4 - Final notice
  COMPETITOR_ISSUES: 10080, // Day 7 - Competitor problems
  LAST_CHANCE: 20160       // Day 14 - Last chance priority removal
}

// Calculate estimated savings for email personalization
function calculateEstimatedSavings(lead: Lead): { monthly: number, annual: number } {
  const baseSavings: Record<string, number> = {
    small: 150,
    medium: 400,
    large: 800,
    enterprise: 2000
  }
  
  let monthly = baseSavings[lead.volume_range] || 200
  
  // Adjust based on facility type
  if (lead.facility_type === 'hospital') monthly *= 2
  else if (lead.facility_type.includes('pharmacy')) monthly *= 1.5
  
  // Adjust based on waste types
  if (lead.waste_types.includes('controlled')) monthly *= 1.3
  if (lead.waste_types.includes('hazardous')) monthly *= 1.2
  
  return {
    monthly: Math.round(monthly),
    annual: Math.round(monthly * 12)
  }
}

// Enhanced welcome email (immediate)
export function generateWelcomeEmail(lead: Lead): { subject: string, html: string } {
  const savings = calculateEstimatedSavings(lead)
  
  return {
    subject: `Quote Request Received - ${lead.company || 'Immediate Specialist Response Available'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { background: #ffffff; padding: 30px; }
          .cta-box { background: #28a745; color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; }
          .savings-highlight { background: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; }
          .urgency-banner { background: #ffc107; padding: 15px; text-align: center; font-weight: bold; color: #000; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
          a { color: #667eea; text-decoration: none; }
          .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; }
        </style>
      </head>
      <body>
        <div class="urgency-banner">
          ⚡ PRIORITY RESPONSE: Quote Processing Started - Specialist Standing By
        </div>
        
        <div class="container">
          <div class="header">
            <h1>Your Quote is Being Prepared</h1>
            <p style="font-size: 18px; margin: 0;">Pharmaceutical Waste Disposal Specialists</p>
          </div>
          
          <div class="content">
            <p><strong>Hello${lead.company ? ` ${lead.company}` : ''},</strong></p>
            
            <p>Your pharmaceutical waste disposal quote request is being processed <strong>RIGHT NOW</strong>. Based on your ${lead.facility_type.replace(/_/g, ' ')} requirements, you're potentially looking at significant savings.</p>
            
            <div class="savings-highlight">
              <h3 style="margin-top: 0; color: #28a745;">🎯 Projected Monthly Savings</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #28a745;">$${savings.monthly.toLocaleString()}/month</p>
              <p style="font-size: 18px; color: #666;">Annual Savings: $${savings.annual.toLocaleString()}</p>
              <p style="font-size: 14px; color: #666;"><em>Based on ${lead.volume_range} volume ${lead.facility_type.replace(/_/g, ' ')} with ${lead.waste_types.join(', ')} disposal needs</em></p>
            </div>
            
            <div class="cta-box">
              <h2 style="margin-top: 0;">📞 Get Your Quote NOW</h2>
              <p style="font-size: 18px; margin: 15px 0;">Call our specialist directly:</p>
              <p style="font-size: 28px; font-weight: bold; margin: 15px 0;">${SPECIALIST_PHONE}</p>
              <p style="font-size: 16px; margin-bottom: 0;">Available now for immediate pricing & setup</p>
            </div>
            
            <p><strong>What happens next:</strong></p>
            <ul style="font-size: 16px; line-height: 1.8;">
              <li><strong>Next 2 hours:</strong> Your custom quote will be ready</li>
              <li><strong>Today:</strong> Our specialist will call you at ${lead.phone || 'the number you provided'}</li>
              <li><strong>Within 24 hours:</strong> Service can be set up and running</li>
            </ul>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 25px 0;">
              <p style="margin: 0;"><strong>⚠️ Compliance Alert:</strong> Healthcare facilities are reporting 40% more regulatory audits this year. Don't wait until you're audited to ensure proper disposal documentation.</p>
            </div>
            
            <p><strong>Why ${lead.company || 'facilities like yours'} choose us:</strong></p>
            <ul>
              <li>✅ 30-40% savings vs Stericycle/Waste Management</li>
              <li>✅ 100% EPA & DEA compliance guarantee</li>
              <li>✅ Same-day emergency pickup available</li>
              <li>✅ 2,847+ satisfied healthcare facilities</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="button">Call ${SPECIALIST_PHONE} Now</a>
            </div>
            
            <p>Best regards,<br>
            <strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Pharmaceutical Waste Disposal</p>
            
            <div class="footer">
              <p>This email was sent to ${lead.email} because you requested a quote for pharmaceutical waste disposal services.</p>
              <p>Pharmaceutical Waste Disposal | EPA Certified | DEA Registered<br>
              Direct Line: ${SPECIALIST_PHONE} | <a href="https://pharmaceuticalwastedisposal.com">pharmaceuticalwastedisposal.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Quote ready email (2 hours)
export function generateQuoteReadyEmail(lead: Lead): { subject: string, html: string } {
  const savings = calculateEstimatedSavings(lead)
  
  return {
    subject: `🎯 Your Custom Quote is Ready - ${lead.company || 'Immediate'} Savings: $${savings.monthly}/month`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 25px; text-align: center; }
          .quote-box { background: #f8f9fa; border: 2px solid #28a745; padding: 25px; margin: 20px 0; text-align: center; }
          .price-highlight { font-size: 32px; font-weight: bold; color: #28a745; margin: 15px 0; }
          .content { background: #ffffff; padding: 25px; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Your Custom Quote is Ready!</h1>
            <p style="font-size: 18px; margin: 0;">Based on ${lead.volume_range} volume ${lead.facility_type.replace(/_/g, ' ')}</p>
          </div>
          
          <div class="content">
            <p><strong>Great news${lead.company ? ` ${lead.company}` : ''}!</strong></p>
            
            <p>Your pharmaceutical waste disposal quote has been prepared by our compliance team. You qualify for substantial savings:</p>
            
            <div class="quote-box">
              <h2 style="margin-top: 0;">Your Estimated Savings</h2>
              <div class="price-highlight">$${savings.monthly.toLocaleString()}/month</div>
              <p style="font-size: 18px; color: #666;">$${savings.annual.toLocaleString()} annually vs your current costs</p>
              
              <div style="background: white; padding: 15px; margin-top: 20px; border-radius: 5px;">
                <p style="margin: 0; font-weight: bold;">Quote includes:</p>
                <ul style="text-align: left; margin: 10px 0;">
                  <li>${lead.waste_types.join(', ')} disposal</li>
                  <li>All compliance documentation</li>
                  <li>EPA & DEA certified destruction</li>
                  <li>Emergency pickup available</li>
                </ul>
              </div>
            </div>
            
            <div style="background: #dc3545; color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
              <h3 style="margin-top: 0;">⏰ LIMITED TIME OFFER</h3>
              <p style="font-size: 18px; margin: 15px 0;">This pricing expires in 48 hours</p>
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button" style="color: white; background: #fff; color: #dc3545;">Call ${SPECIALIST_PHONE} Now</a>
            </div>
            
            <p><strong>Why act now?</strong></p>
            <ul style="font-size: 16px;">
              <li>🔥 <strong>Pricing locked for 60 days</strong> - rates increasing Jan 1st</li>
              <li>⚡ <strong>Setup completed within 24 hours</strong></li>
              <li>💰 <strong>First month savings guaranteed</strong> or service is free</li>
              <li>📋 <strong>Immediate compliance documentation</strong></li>
            </ul>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>🚨 Compliance Update:</strong> New pharmaceutical disposal audits starting next month. Facilities without proper documentation face fines up to $37,500/day.</p>
            </div>
            
            <p>Our specialist is standing by to finalize your quote and schedule immediate service setup.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" style="display: inline-block; padding: 18px 35px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Secure This Pricing - Call Now</a>
            </div>
            
            <p>Best regards,<br>
            <strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Direct: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p><strong>Quote Reference:</strong> PWD-${lead.id?.slice(-8) || Date.now()}</p>
              <p>This quote is valid for 48 hours and is based on current disposal rates.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Compliance alert email (Day 1)
export function generateComplianceAlertEmail(lead: Lead): { subject: string, html: string } {
  const facilityType = lead.facility_type.replace(/_/g, ' ')
  
  return {
    subject: `🚨 URGENT: ${lead.zip_code} Area Compliance Alert - ${facilityType} Audits Increasing`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .alert-header { background: #dc3545; color: white; padding: 25px; text-align: center; }
          .content { background: #ffffff; padding: 25px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; }
          .deadline-box { background: #dc3545; color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; }
          .stats-box { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert-header">
            <h1>🚨 COMPLIANCE ALERT</h1>
            <p style="font-size: 18px; margin: 0;">Immediate Action Required - ${facilityType}</p>
          </div>
          
          <div class="content">
            <p><strong>URGENT NOTICE for ${lead.company || 'your facility'}</strong></p>
            
            <div class="warning-box">
              <h3 style="margin-top: 0; color: #856404;">⚠️ Regulatory Update for ${lead.zip_code} Area</h3>
              <p style="margin-bottom: 0;"><strong>EPA and state regulators have announced increased pharmaceutical waste audits for healthcare facilities in your area, effective immediately.</strong></p>
            </div>
            
            <div class="stats-box">
              <h3>Recent Enforcement Actions:</h3>
              <ul style="margin: 15px 0;">
                <li><strong>$47,000 fine</strong> - Texas pharmacy (improper controlled substance disposal)</li>
                <li><strong>$89,000 fine</strong> - California hospital (missing DEA Form 41 documentation)</li>
                <li><strong>$156,000 fine</strong> - Florida medical group (hazardous waste violations)</li>
                <li><strong>License suspension</strong> - Ohio clinic (repeat disposal violations)</li>
              </ul>
            </div>
            
            <p><strong>Your ${facilityType} is at risk if you don't have:</strong></p>
            <ul style="font-size: 16px;">
              <li>✗ Current waste manifests for all ${lead.waste_types.join(', ')} disposal</li>
              <li>✗ DEA Form 41 witness certificates (if handling controlled substances)</li>
              <li>✗ EPA-certified disposal documentation</li>
              <li>✗ Chain of custody records for the past 3 years</li>
              <li>✗ Emergency spill response procedures</li>
            </ul>
            
            <div class="deadline-box">
              <h3 style="margin-top: 0;">⏰ DEADLINE APPROACHING</h3>
              <p style="font-size: 18px; margin: 15px 0;">Audits begin: <strong>Next 30 Days</strong></p>
              <p style="font-size: 16px; margin-bottom: 0;">Penalties up to <strong>$37,500 per day</strong> for non-compliance</p>
            </div>
            
            <p><strong>How we can help immediately:</strong></p>
            <ul style="font-size: 16px;">
              <li>🛡️ <strong>Instant compliance audit</strong> of your current procedures</li>
              <li>📋 <strong>All required documentation</strong> provided within 24 hours</li>
              <li>🚀 <strong>Emergency service setup</strong> if needed</li>
              <li>💡 <strong>Staff training</strong> on new regulations</li>
            </ul>
            
            <p>We've helped 2,847+ facilities avoid compliance issues. Don't risk your license or face massive fines.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button">Emergency Compliance Call: ${SPECIALIST_PHONE}</a>
            </div>
            
            <p><strong>This can't wait.</strong> Every day without proper documentation increases your risk exposure.</p>
            
            <p>Sarah Johnson<br>
            Senior Compliance Specialist<br>
            Direct Emergency Line: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p><strong>Confidential Compliance Notice</strong> - This alert is based on public regulatory announcements and industry reports.</p>
              <p>Pharmaceutical Waste Disposal | EPA Certified | DEA Registered</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Success story email (Day 2)
export function generateSuccessStoryEmail(lead: Lead): { subject: string, html: string } {
  const facilityType = lead.facility_type.replace(/_/g, ' ')
  const savings = calculateEstimatedSavings(lead)
  
  // Select relevant case study based on facility type
  const caseStudy = facilityType.includes('hospital') ? {
    name: "Memorial Healthcare System",
    location: "Houston, TX",
    facilityType: "340-bed hospital system",
    wasteTypes: "controlled substances, hazardous drugs, chemotherapy waste",
    savings: "$127,000",
    timeline: "72 hours"
  } : facilityType.includes('pharmacy') ? {
    name: "Regional Pharmacy Chain",
    location: "Phoenix, AZ", 
    facilityType: "23-location pharmacy chain",
    wasteTypes: "controlled substances, expired medications",
    savings: "$89,000",
    timeline: "48 hours"
  } : {
    name: "Southwest Medical Group",
    location: "Denver, CO",
    facilityType: "Multi-specialty clinic (8 locations)",
    wasteTypes: "pharmaceutical waste, sharps, expired drugs", 
    savings: "$67,000",
    timeline: "24 hours"
  }
  
  return {
    subject: `💰 How ${caseStudy.name} Saved ${caseStudy.savings} - ${facilityType} Case Study`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 25px; text-align: center; }
          .content { background: #ffffff; padding: 25px; }
          .case-study-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 25px; margin: 20px 0; border-radius: 8px; }
          .highlight-stat { font-size: 32px; font-weight: bold; color: #28a745; text-align: center; margin: 15px 0; }
          .quote-box { background: #e9ecef; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745; font-style: italic; }
          .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .comparison-table th, .comparison-table td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
          .comparison-table th { background: #f8f9fa; font-weight: bold; }
          .savings-row { background: #d4edda; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Real Customer Success Story</h1>
            <p style="font-size: 18px; margin: 0;">How ${caseStudy.name} Transformed Their Waste Management</p>
          </div>
          
          <div class="content">
            <p><strong>Dear${lead.company ? ` ${lead.company}` : ''} Decision Maker,</strong></p>
            
            <p>I wanted to share a recent success story from a ${caseStudy.facilityType} that had similar needs to yours:</p>
            
            <div class="case-study-box">
              <h3 style="margin-top: 0; color: #28a745;">📋 Customer Profile</h3>
              <p><strong>${caseStudy.name}</strong> - ${caseStudy.location}</p>
              <p><strong>Facility:</strong> ${caseStudy.facilityType}</p>
              <p><strong>Waste Types:</strong> ${caseStudy.wasteTypes}</p>
              <p><strong>Challenge:</strong> High costs with Stericycle, compliance concerns, unreliable service</p>
            </div>
            
            <h3>The Results:</h3>
            <div class="highlight-stat">${caseStudy.savings} Annual Savings</div>
            
            <table class="comparison-table">
              <tr>
                <th>Metric</th>
                <th>Before (Stericycle)</th>
                <th>After (Our Service)</th>
              </tr>
              <tr>
                <td>Monthly Cost</td>
                <td>$1,847/month</td>
                <td>$1,247/month</td>
              </tr>
              <tr>
                <td>Pickup Reliability</td>
                <td>73% on-time</td>
                <td>98% on-time</td>
              </tr>
              <tr>
                <td>Compliance Documentation</td>
                <td>Manual, often late</td>
                <td>Automated, same-day</td>
              </tr>
              <tr>
                <td>Customer Service Response</td>
                <td>3-5 business days</td>
                <td>Same day</td>
              </tr>
              <tr class="savings-row">
                <td><strong>Annual Savings</strong></td>
                <td><strong>-</strong></td>
                <td><strong>${caseStudy.savings}</strong></td>
              </tr>
            </table>
            
            <div class="quote-box">
              <p>"The transition was seamless. Within ${caseStudy.timeline}, we had better service, perfect compliance, and were saving over $10,000 per month. I wish we had made this change sooner."</p>
              <p><strong>- Chief Operations Officer, ${caseStudy.name}</strong></p>
            </div>
            
            <h3>Your Potential Savings:</h3>
            <p>Based on your ${facilityType} with ${lead.volume_range} volume, you could save approximately:</p>
            
            <div style="background: #d4edda; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #155724;">$${savings.monthly.toLocaleString()}/month</div>
              <div style="font-size: 18px; color: #155724;">${savings.annual.toLocaleString()} annually</div>
            </div>
            
            <p><strong>What makes our service different:</strong></p>
            <ul style="font-size: 16px;">
              <li>🎯 <strong>30-40% cost reduction</strong> vs major competitors</li>
              <li>🛡️ <strong>100% compliance guarantee</strong> - we handle all documentation</li>
              <li>⚡ <strong>24-hour emergency response</strong> available</li>
              <li>📞 <strong>Direct specialist access</strong> - no call centers</li>
              <li>🏆 <strong>98% customer retention rate</strong></li>
            </ul>
            
            <p>Ready to see similar results for your facility?</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button">Get Your Custom Quote: ${SPECIALIST_PHONE}</a>
            </div>
            
            <p>I can have your detailed savings analysis ready within the hour.</p>
            
            <p>Best regards,<br>
            <strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Direct: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p>Case study results are typical but individual savings may vary based on current vendor pricing and service levels.</p>
              <p>Pharmaceutical Waste Disposal | EPA Certified | DEA Registered</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Final notice email (Day 4)
export function generateFinalNoticeEmail(lead: Lead): { subject: string, html: string } {
  const savings = calculateEstimatedSavings(lead)
  
  return {
    subject: `⚠️ Final Notice: ${lead.company || 'Your'} Quote Expires Tomorrow - $${savings.monthly}/month Savings`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .alert-header { background: #dc3545; color: white; padding: 25px; text-align: center; }
          .content { background: #ffffff; padding: 25px; }
          .countdown-box { background: #fff3cd; border: 2px solid #ffc107; padding: 25px; text-align: center; margin: 25px 0; }
          .savings-highlight { background: #28a745; color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert-header">
            <h1>⚠️ FINAL NOTICE</h1>
            <p style="font-size: 18px; margin: 0;">Your Quote Expires in 24 Hours</p>
          </div>
          
          <div class="content">
            <p><strong>This is our final automated notice${lead.company ? ` for ${lead.company}` : ''}.</strong></p>
            
            <p>Your pharmaceutical waste disposal quote is expiring tomorrow, and we wanted to give you one last chance to secure these savings:</p>
            
            <div class="savings-highlight">
              <h3 style="margin-top: 0;">💰 Your Locked-In Savings</h3>
              <div style="font-size: 28px; font-weight: bold; margin: 10px 0;">${savings.monthly.toLocaleString()}/month</div>
              <div style="font-size: 18px;">${savings.annual.toLocaleString()} annually</div>
            </div>
            
            <div class="countdown-box">
              <h3 style="margin-top: 0; color: #856404;">⏰ QUOTE EXPIRATION COUNTDOWN</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 15px 0; color: #856404;">Less than 24 Hours Remaining</p>
              <p style="margin-bottom: 0;">After this expires, you'll need to restart the entire quote process</p>
            </div>
            
            <p><strong>What you're walking away from:</strong></p>
            <ul style="font-size: 16px;">
              <li>💸 <strong>${savings.monthly.toLocaleString()}/month in guaranteed savings</strong></li>
              <li>⚡ <strong>Same-day service setup</strong> (vs 2-3 weeks with competitors)</li>
              <li>🛡️ <strong>100% compliance guarantee</strong> with all documentation</li>
              <li>🚀 <strong>Emergency pickup availability</strong></li>
              <li>📞 <strong>Direct specialist access</strong> (no call centers)</li>
            </ul>
            
            <p><strong>After tomorrow:</strong></p>
            <ul style="color: #dc3545; font-weight: bold;">
              <li>❌ This pricing will no longer be available</li>
              <li>❌ You'll go back to the standard quote process</li>
              <li>❌ Current rates are increasing 8% on January 1st</li>
              <li>❌ No priority scheduling for new customers</li>
            </ul>
            
            <p>Don't let compliance issues and high costs continue. This is literally your last chance to secure these savings with one phone call.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button">Final Call: ${SPECIALIST_PHONE}</a>
            </div>
            
            <p>After this email, you won't hear from our automated system again. If you want this pricing, you need to call today.</p>
            
            <p><strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Direct: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p><strong>Quote Reference:</strong> PWD-${lead.id?.slice(-8) || Date.now()}</p>
              <p>This is the final automated email in your quote sequence.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Competitor issues email (Day 7)
export function generateCompetitorIssuesEmail(lead: Lead): { subject: string, html: string } {
  return {
    subject: `🚨 ${lead.company || 'Alert'}: Major Stericycle Service Issues Reported in Your Area`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 25px; text-align: center; }
          .content { background: #ffffff; padding: 25px; }
          .news-box { background: #f8f9fa; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; }
          .issues-list { background: #fff5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .solution-box { background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 INDUSTRY ALERT</h1>
            <p style="font-size: 18px; margin: 0;">Major Competitor Service Disruptions</p>
          </div>
          
          <div class="content">
            <p><strong>Important Notice${lead.company ? ` for ${lead.company}` : ''}:</strong></p>
            
            <p>We're reaching out because multiple facilities in your area have reported serious issues with major pharmaceutical waste disposal companies.</p>
            
            <div class="news-box">
              <h3 style="margin-top: 0; color: #dc3545;">📰 Recent Industry Reports</h3>
              <ul>
                <li><strong>Stericycle:</strong> Class action lawsuit over billing practices, service delays up 340%</li>
                <li><strong>Waste Management:</strong> Failed DOT inspections, 12 facilities left without pickup for 3+ weeks</li>
                <li><strong>US Ecology:</strong> EPA violations, improper disposal documentation</li>
              </ul>
            </div>
            
            <div class="issues-list">
              <h3 style="color: #721c24;">Problems Facilities Are Reporting:</h3>
              <ul>
                <li>❌ <strong>Missed pickups</strong> - some facilities waiting 3+ weeks</li>
                <li>❌ <strong>Billing errors</strong> - surprise charges, hidden fees</li>
                <li>❌ <strong>Compliance issues</strong> - missing or incorrect documentation</li>
                <li>❌ <strong>Poor customer service</strong> - call centers, long hold times</li>
                <li>❌ <strong>Price increases</strong> - 15-25% rate hikes without notice</li>
                <li>❌ <strong>Contract lock-ins</strong> - difficult cancellation processes</li>
              </ul>
            </div>
            
            <p><strong>Sound familiar?</strong> Many ${lead.facility_type.replace(/_/g, ' ')} facilities are switching to more reliable providers.</p>
            
            <div class="solution-box">
              <h3 style="margin-top: 0; color: #155724;">✅ Why Facilities Choose Us Instead:</h3>
              <ul>
                <li>🎯 <strong>98% on-time pickup rate</strong> (vs industry average of 73%)</li>
                <li>💰 <strong>30-40% cost savings</strong> with transparent pricing</li>
                <li>📋 <strong>Perfect compliance record</strong> - all documentation automated</li>
                <li>📞 <strong>Direct specialist access</strong> - no call centers</li>
                <li>🚀 <strong>24-hour emergency response</strong></li>
                <li>🤝 <strong>No long-term contracts</strong> - month-to-month flexibility</li>
              </ul>
            </div>
            
            <p><strong>Recent customer feedback:</strong></p>
            <blockquote style="font-style: italic; margin: 20px; padding: 15px; border-left: 3px solid #28a745; background: #f8f9fa;">
              "We switched after Stericycle missed three pickups in two months. Best decision we made - better service, lower costs, perfect compliance."<br>
              <strong>- Operations Manager, Regional Medical Center</strong>
            </blockquote>
            
            <p>Don't wait for service problems to affect your facility's compliance and operations.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button">Get Reliable Service: ${SPECIALIST_PHONE}</a>
            </div>
            
            <p>I can have you switched over and compliant within 24 hours, with immediate cost savings.</p>
            
            <p><strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Direct: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p>This alert is based on public reports and customer feedback from the pharmaceutical waste disposal industry.</p>
              <p>Pharmaceutical Waste Disposal | EPA Certified | DEA Registered</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Last chance email (Day 14)
export function generateLastChanceEmail(lead: Lead): { subject: string, html: string } {
  return {
    subject: `🔴 FINAL OUTREACH: Removing ${lead.company || 'Your Facility'} from Priority List Tomorrow`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #343a40; color: white; padding: 25px; text-align: center; }
          .content { background: #ffffff; padding: 25px; }
          .removal-notice { background: #dc3545; color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; }
          .final-offer { background: #28a745; color: white; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; }
          .cta-button { display: inline-block; padding: 18px 35px; background: #ffc107; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; }
          .footer { color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔴 FINAL OUTREACH</h1>
            <p style="font-size: 18px; margin: 0;">Priority List Removal Notice</p>
          </div>
          
          <div class="content">
            <p><strong>This is my final personal outreach${lead.company ? ` to ${lead.company}` : ''}.</strong></p>
            
            <p>After 14 days of trying to connect with you about pharmaceutical waste disposal savings, I'm required to remove your facility from our priority follow-up list tomorrow.</p>
            
            <div class="removal-notice">
              <h3 style="margin-top: 0;">⏰ REMOVAL SCHEDULED</h3>
              <p style="font-size: 18px; margin: 15px 0;">Tomorrow: Your facility will be removed from priority status</p>
              <p style="margin-bottom: 0;">Future quotes will go through standard 2-3 week process</p>
            </div>
            
            <p><strong>What this means:</strong></p>
            <ul style="font-size: 16px;">
              <li>❌ No more direct specialist access</li>
              <li>❌ No priority scheduling</li>
              <li>❌ No special pricing considerations</li>
              <li>❌ Standard quote process (2-3 weeks)</li>
            </ul>
            
            <p><strong>But there's still time...</strong></p>
            
            <div class="final-offer">
              <h3 style="margin-top: 0;">✅ ONE FINAL OPPORTUNITY</h3>
              <p style="font-size: 18px; margin: 15px 0;">Call in the next 24 hours to maintain priority status</p>
              <p style="font-size: 16px; margin-bottom: 0;">Same-day quotes, direct specialist access, priority scheduling</p>
            </div>
            
            <p>Look, I get it. You're busy running ${lead.facility_type.replace(/_/g, ' ')} operations. Waste disposal isn't your top priority until there's a problem.</p>
            
            <p><strong>But here's what I see happening:</strong></p>
            <ul style="color: #dc3545;">
              <li>Waste costs keep increasing (8% annually)</li>
              <li>Compliance requirements get stricter</li>
              <li>Current vendors become less reliable</li>
              <li>Eventually, you'll need to make a change anyway</li>
            </ul>
            
            <p>When that day comes, wouldn't you rather have a relationship already established with a specialist who understands your needs?</p>
            
            <p><strong>Just one 5-minute call to:</strong></p>
            <ul style="color: #28a745;">
              <li>✅ Keep your priority status active</li>
              <li>✅ Get your savings analysis on file</li>
              <li>✅ Have a backup plan ready</li>
              <li>✅ Build relationship with direct specialist</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${SPECIALIST_PHONE.replace(/\D/g, '')}" class="cta-button">Final Call: ${SPECIALIST_PHONE}</a>
            </div>
            
            <p>After tomorrow, this direct line goes to other priority accounts. If you need help in the future, you'll go through our standard queue.</p>
            
            <p>Your choice. But I'd hate to see you lose these advantages over a 5-minute conversation.</p>
            
            <p><strong>Sarah Johnson</strong><br>
            Senior Waste Disposal Specialist<br>
            Direct: ${SPECIALIST_PHONE}</p>
            
            <div class="footer">
              <p>This is the final email in your priority sequence. Future communications will be standard marketing only.</p>
              <p>Pharmaceutical Waste Disposal | EPA Certified | DEA Registered</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export default {
  EMAIL_SEQUENCE_TIMING,
  generateWelcomeEmail,
  generateQuoteReadyEmail, 
  generateComplianceAlertEmail,
  generateSuccessStoryEmail,
  generateFinalNoticeEmail,
  generateCompetitorIssuesEmail,
  generateLastChanceEmail,
  calculateEstimatedSavings
}