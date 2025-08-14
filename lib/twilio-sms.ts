import twilio from 'twilio'
import { Lead } from './supabase'

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
const SPECIALIST_PHONE = process.env.SPECIALIST_PHONE || '1-855-DISPOSE-1'

// Initialize Twilio client
const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN 
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null

// SMS Templates for different stages
export const SMS_TEMPLATES = {
  IMMEDIATE_RESPONSE: (lead: Lead) => `
Hi ${lead.company || 'there'}! 👋

Your pharmaceutical waste disposal quote is being prepared.

📞 Call our specialist NOW for instant pricing: ${SPECIALIST_PHONE}

Or we'll call you shortly to discuss:
✅ ${lead.waste_types.join(', ')} disposal
✅ Compliance documentation
✅ 30-40% savings vs competitors

Reply STOP to opt out.
`.trim(),

  QUOTE_READY: (lead: Lead) => `
${lead.company || 'Hi'}, your custom quote is ready! 📋

Based on your ${lead.volume_range} volume, you could save $${calculateEstimatedSavings(lead)}/month.

📞 Call ${SPECIALIST_PHONE} now to review your quote
⏰ Specialist available for immediate assistance

Your quote expires in 48 hours.
`.trim(),

  MISSED_CALL_FOLLOWUP: (lead: Lead) => `
We just tried calling about your waste disposal quote.

Your facility qualifies for:
• EPA/DEA compliant disposal
• Significant cost savings
• Same-day service setup

📞 Call us back: ${SPECIALIST_PHONE}
Or reply with a good time to call.
`.trim(),

  FINAL_ATTEMPT: (lead: Lead) => `
Last chance for your custom pharmaceutical waste disposal quote!

${lead.company || 'Your facility'} qualifies for exclusive pricing that expires tomorrow.

This is our final automated attempt.
📞 ${SPECIALIST_PHONE} (Direct specialist line)

After this, you'll need to resubmit for a new quote.
`.trim(),

  APPOINTMENT_CONFIRMATION: (lead: Lead, appointmentTime: string) => `
Appointment confirmed! ✅

${lead.company || 'Your'} compliance consultation:
📅 ${appointmentTime}
📞 We'll call: ${lead.phone}

What we'll cover:
• Custom pricing for your ${lead.facility_type.replace(/_/g, ' ')}
• ${lead.waste_types.join(', ')} disposal process
• Compliance documentation

Reply to reschedule.
`.trim()
}

// Calculate estimated savings based on lead data
function calculateEstimatedSavings(lead: Lead): number {
  const baseSavings: Record<string, number> = {
    small: 75,
    medium: 200,
    large: 500,
    enterprise: 1500
  }
  
  let savings = baseSavings[lead.volume_range] || 100
  
  // Adjust based on facility type
  if (lead.facility_type === 'hospital') {
    savings *= 1.5
  } else if (lead.facility_type === 'pharmacy_chain') {
    savings *= 1.3
  }
  
  // Adjust based on waste types
  if (lead.waste_types.includes('controlled')) {
    savings *= 1.2
  }
  if (lead.waste_types.includes('hazardous')) {
    savings *= 1.15
  }
  
  return Math.round(savings)
}

// Send SMS to lead
export async function sendSMS(
  to: string,
  message: string,
  leadId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!twilioClient) {
    console.error('Twilio not configured')
    return { success: false, error: 'SMS service not configured' }
  }

  // Clean phone number
  const cleanPhone = to.replace(/\D/g, '')
  const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
      statusCallback: leadId 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/sms-status?lead_id=${leadId}`
        : undefined
    })

    console.log(`SMS sent successfully to ${formattedPhone}:`, result.sid)
    return { success: true, messageId: result.sid }

  } catch (error) {
    console.error('Failed to send SMS:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send SMS' 
    }
  }
}

// Send templated SMS based on stage
export async function sendTemplateSMS(
  lead: Lead,
  template: keyof typeof SMS_TEMPLATES,
  additionalData?: any
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!lead.phone) {
    return { success: false, error: 'No phone number provided' }
  }

  let message: string
  
  if (template === 'APPOINTMENT_CONFIRMATION' && additionalData?.appointmentTime) {
    message = SMS_TEMPLATES[template](lead, additionalData.appointmentTime)
  } else {
    message = SMS_TEMPLATES[template](lead)
  }

  return await sendSMS(lead.phone, message, lead.id)
}

// Send SMS sequence for new lead
export async function sendNewLeadSMSSequence(lead: Lead): Promise<void> {
  // Immediate SMS
  await sendTemplateSMS(lead, 'IMMEDIATE_RESPONSE')
  
  // Schedule follow-up SMS based on lead score
  if (lead.lead_score >= 70) {
    // High priority - send quote ready in 15 minutes
    setTimeout(async () => {
      await sendTemplateSMS(lead, 'QUOTE_READY')
    }, 15 * 60 * 1000)
  } else {
    // Standard priority - send quote ready in 1 hour
    setTimeout(async () => {
      await sendTemplateSMS(lead, 'QUOTE_READY')
    }, 60 * 60 * 1000)
  }
}

// Handle SMS replies
export async function handleSMSReply(
  from: string, 
  body: string,
  leadPhone: string
): Promise<string> {
  const replyBody = body.toLowerCase().trim()
  
  // Handle opt-out
  if (replyBody === 'stop' || replyBody === 'unsubscribe') {
    return 'You have been unsubscribed from SMS notifications. Reply START to resubscribe.'
  }
  
  // Handle opt-in
  if (replyBody === 'start' || replyBody === 'subscribe') {
    return `Welcome back! Call ${SPECIALIST_PHONE} for your quote or reply with a good time to call you.`
  }
  
  // Check for time preferences
  if (replyBody.includes('morning') || replyBody.includes('am')) {
    return `Perfect! Our specialist will call you tomorrow morning. Or call ${SPECIALIST_PHONE} now for immediate assistance.`
  }
  
  if (replyBody.includes('afternoon') || replyBody.includes('pm')) {
    return `Great! We'll call you this afternoon. For immediate help, call ${SPECIALIST_PHONE}.`
  }
  
  // Default response
  return `Thanks for your reply! Call ${SPECIALIST_PHONE} to speak with our specialist now, or reply with a preferred time for us to call you.`
}

// Get SMS delivery status
export async function getSMSStatus(messageId: string): Promise<{
  status: string
  errorCode?: string
  errorMessage?: string
}> {
  if (!twilioClient) {
    return { status: 'unknown', errorMessage: 'Twilio not configured' }
  }

  try {
    const message = await twilioClient.messages(messageId).fetch()
    
    return {
      status: message.status,
      errorCode: message.errorCode?.toString(),
      errorMessage: message.errorMessage
    }
  } catch (error) {
    console.error('Failed to get SMS status:', error)
    return { 
      status: 'error', 
      errorMessage: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Check if phone number is valid and can receive SMS
export async function validatePhoneNumber(phone: string): Promise<{
  valid: boolean
  carrier?: string
  type?: string
}> {
  if (!twilioClient) {
    // If Twilio not configured, do basic validation
    const cleaned = phone.replace(/\D/g, '')
    return { valid: cleaned.length === 10 || cleaned.length === 11 }
  }

  try {
    const cleanPhone = phone.replace(/\D/g, '')
    const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    const lookup = await twilioClient.lookups.v1
      .phoneNumbers(formattedPhone)
      .fetch()
    
    return {
      valid: true,
      carrier: lookup.carrier?.name || 'unknown',
      type: lookup.carrier?.type || 'unknown'
    }
  } catch (error) {
    console.error('Phone validation error:', error)
    return { valid: false }
  }
}

export default {
  sendSMS,
  sendTemplateSMS,
  sendNewLeadSMSSequence,
  handleSMSReply,
  getSMSStatus,
  validatePhoneNumber,
  SMS_TEMPLATES
}