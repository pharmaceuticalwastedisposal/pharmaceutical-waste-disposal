import { Lead } from './supabase'

// Bland.ai configuration
const BLAND_API_KEY = process.env.BLAND_API_KEY
const BLAND_API_URL = 'https://api.bland.ai/v1'
const SPECIALIST_PHONE = process.env.SPECIALIST_PHONE || '1-855-DISPOSE-1' // Your specialist direct line

// Conversion optimization settings
const CONVERSION_SETTINGS = {
  // Timing for follow-ups (in minutes)
  FIRST_SMS_DELAY: 0, // Immediate
  REMINDER_SMS_DELAY: 15,
  FIRST_CALL_DELAY: 60, // 1 hour
  SECOND_SMS_DELAY: 240, // 4 hours
  SECOND_CALL_DELAY: 1440, // Next day
  FINAL_CALL_DELAY: 4320, // Day 3
  
  // Lead priority thresholds
  HIGH_PRIORITY_SCORE: 70,
  MEDIUM_PRIORITY_SCORE: 40,
  
  // Optimal calling windows (in 24hr format)
  CALLING_WINDOWS: {
    morning: { start: 10, end: 12 },
    afternoon: { start: 14, end: 16 }
  }
}

export interface BlandCallRequest {
  phone_number: string
  from?: string
  task: string
  model?: string
  first_sentence?: string
  wait_for_greeting?: boolean
  record?: boolean
  max_duration?: number
  answered_by_enabled?: boolean
  temperature?: number
  transfer_phone_number?: string
  transfer_list?: Record<string, string>
  metadata?: Record<string, any>
  pronunciation_guide?: Array<{
    word: string
    pronunciation: string
    case_sensitive?: boolean
    spaced?: boolean
  }>
  start_time?: string
  request_data?: Record<string, any>
  tools?: Array<any>
  webhook?: string
  analysis_preset?: string
  analysis_schema?: Record<string, any>
  pathway_id?: string
  local_dialing?: boolean
  voicemail_message?: string
  voicemail_detection_timeout?: number
  interruption_threshold?: number
  voice?: string
  voice_preset_id?: string
  voice_id?: string
  voice_settings?: Record<string, any>
  language?: string
  calendly?: Record<string, any>
}

export interface BlandInboundSettings {
  prompt: string
  webhook?: string
  voice?: string
  first_sentence?: string
  model?: string
  record?: boolean
  transfer_phone_number?: string
  transfer_list?: Record<string, string>
  metadata?: Record<string, any>
  interruption_threshold?: number
  temperature?: number
  voice_settings?: Record<string, any>
  language?: string
  pathway_id?: string
}

// Generate personalized specialist script based on lead data
function generateSpecialistScript(lead: Lead): string {
  const wasteTypesText = lead.waste_types.join(', ')
  const facilityType = lead.facility_type.replace(/_/g, ' ')
  
  return `You are Sarah, a senior waste disposal specialist at PharmaceuticalWasteDisposal.com with 12 years of experience in pharmaceutical compliance. 
You're calling ${lead.company || 'this facility'} about their request for ${wasteTypesText} disposal services.

Your goal is to:
1. Confirm they submitted a quote request
2. Verify their ${facilityType} needs ${wasteTypesText} disposal
3. Confirm their volume is ${lead.volume_range}
4. Schedule a 15-minute consultation with our compliance team
5. If they're not ready, schedule a follow-up call

Key points to mention:
- We serve over 2,847 healthcare facilities nationwide
- 30-40% average savings compared to Stericycle/Waste Management
- Full EPA and DEA compliance with all documentation
- Same-day quote turnaround

Be conversational, helpful, and focus on understanding their urgency. If they mention compliance deadlines or current vendor issues, emphasize our immediate availability.

Always end by either:
1. Scheduling the consultation
2. Setting a specific follow-up time
3. Confirming they'll receive their quote via email within 1 hour`
}

// Make outbound call via Bland.ai
async function makeOutboundCall(
  lead: Lead, 
  attemptNumber: number = 1
): Promise<{ success: boolean; callId?: string; error?: string }> {
  if (!BLAND_API_KEY) {
    console.error('Bland.ai API key not configured')
    return { success: false, error: 'API key not configured' }
  }

  if (!lead.phone) {
    return { success: false, error: 'No phone number provided' }
  }

  try {
    const callRequest: BlandCallRequest = {
      phone_number: lead.phone,
      from: SPECIALIST_PHONE,
      task: generateSpecialistScript(lead),
      first_sentence: `Hi, this is Sarah from Pharmaceutical Waste Disposal. Is this ${lead.company || 'the facility'} that just requested a quote?`,
      voice: 'maya', // Professional female voice
      model: 'enhanced',
      record: true,
      max_duration: 300, // 5 minutes max
      temperature: 0.7,
      answered_by_enabled: true,
      local_dialing: true,
      interruption_threshold: 100,
      webhook: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bland-webhook`,
      metadata: {
        lead_id: lead.id,
        attempt_number: attemptNumber,
        lead_score: lead.lead_score,
        facility_type: lead.facility_type
      },
      voicemail_message: `Hi, this is Sarah from PharmaceuticalWasteDisposal.com calling about your waste disposal quote request. We have competitive pricing ready for your ${lead.facility_type.replace(/_/g, ' ')}. Please call me back at ${SPECIALIST_PHONE} to discuss your needs. I'm available to help you get started. Thank you!`,
      voicemail_detection_timeout: 5000,
      analysis_preset: 'lead_qualification',
      request_data: {
        lead_email: lead.email,
        lead_company: lead.company,
        waste_types: lead.waste_types,
        volume: lead.volume_range
      }
    }

    const response = await fetch(`${BLAND_API_URL}/calls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLAND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(callRequest)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to initiate call')
    }

    console.log(`Outbound call initiated for lead ${lead.id}:`, result)
    return { success: true, callId: result.call_id }

  } catch (error) {
    console.error('Bland.ai call error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Configure inbound number for specialist line
async function configureInboundNumber(): Promise<boolean> {
  if (!BLAND_API_KEY) {
    console.error('Bland.ai API key not configured')
    return false
  }

  try {
    const inboundSettings: BlandInboundSettings = {
      prompt: `You are Sarah, a senior waste disposal specialist at PharmaceuticalWasteDisposal.com with extensive experience in healthcare compliance.
      
When someone calls, you should:
1. Warmly greet them and ask how you can help
2. If they're calling about a quote, get their company name and email
3. Ask about their facility type and waste disposal needs
4. Provide immediate pricing ranges based on their volume
5. Offer to schedule a compliance consultation
6. Always capture their contact information

Key information to provide:
- We serve 2,847+ healthcare facilities
- EPA and DEA fully certified
- 30-40% savings vs major competitors
- Same-day quote turnaround
- 100% compliance guarantee

Be professional, knowledgeable, and always work toward scheduling a consultation or capturing their information for follow-up.`,
      
      webhook: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bland-inbound-webhook`,
      voice: 'maya',
      first_sentence: 'Thank you for calling Pharmaceutical Waste Disposal, this is Sarah, your specialist. How can I help you with your medical waste needs today?',
      model: 'enhanced',
      record: true,
      temperature: 0.7,
      interruption_threshold: 100,
      language: 'en',
      voice_settings: {
        speed: 1.0,
        emotion: 'professional'
      }
    }

    const response = await fetch(`${BLAND_API_URL}/inbound/${SPECIALIST_PHONE}/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLAND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inboundSettings)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to configure inbound number')
    }

    console.log('Inbound specialist line configured successfully')
    return true

  } catch (error) {
    console.error('Failed to configure inbound number:', error)
    return false
  }
}

// Schedule optimal call time based on lead score and facility type
function calculateOptimalCallTime(lead: Lead, attemptNumber: number): Date {
  const now = new Date()
  
  // Standard delay based on attempt number
  let delayMinutes: number
  switch (attemptNumber) {
    case 1:
      delayMinutes = 5 // All first calls at 5 minutes
      break
    case 2:
      delayMinutes = CONVERSION_SETTINGS.SECOND_CALL_DELAY
      break
    case 3:
      delayMinutes = CONVERSION_SETTINGS.FINAL_CALL_DELAY
      break
    default:
      delayMinutes = CONVERSION_SETTINGS.FINAL_CALL_DELAY
  }
  
  const callTime = new Date(now.getTime() + delayMinutes * 60 * 1000)
  
  // For first attempts (5 minutes), skip business hours adjustment
  // to ensure immediate response for hot leads
  if (attemptNumber === 1 && delayMinutes <= 5) {
    // Keep exact 5-minute timing for immediate follow-up
    return callTime
  }
  
  // Adjust to optimal calling window for subsequent attempts
  const hour = callTime.getHours()
  const { morning, afternoon } = CONVERSION_SETTINGS.CALLING_WINDOWS
  
  // If outside calling windows, schedule for next window
  if (hour < morning.start) {
    callTime.setHours(morning.start, 0, 0, 0)
  } else if (hour >= morning.end && hour < afternoon.start) {
    callTime.setHours(afternoon.start, 0, 0, 0)
  } else if (hour >= afternoon.end) {
    // Schedule for next morning
    callTime.setDate(callTime.getDate() + 1)
    callTime.setHours(morning.start, 0, 0, 0)
  }
  
  // Skip weekends for business facilities
  if (callTime.getDay() === 0) { // Sunday
    callTime.setDate(callTime.getDate() + 1)
  } else if (callTime.getDay() === 6) { // Saturday
    callTime.setDate(callTime.getDate() + 2)
  }
  
  return callTime
}

// Get call analytics for a specific call
async function getCallAnalytics(callId: string): Promise<any> {
  if (!BLAND_API_KEY) {
    return null
  }

  try {
    const response = await fetch(`${BLAND_API_URL}/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${BLAND_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch call analytics')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to get call analytics:', error)
    return null
  }
}

// Check if lead answered the call
async function checkCallOutcome(callId: string): Promise<{
  answered: boolean
  duration?: number
  voicemail?: boolean
  transferred?: boolean
  sentiment?: string
}> {
  const analytics = await getCallAnalytics(callId)
  
  if (!analytics) {
    return { answered: false }
  }

  return {
    answered: analytics.answered || false,
    duration: analytics.duration,
    voicemail: analytics.voicemail_detected || false,
    transferred: analytics.transferred || false,
    sentiment: analytics.sentiment
  }
}

export {
  makeOutboundCall,
  configureInboundNumber,
  calculateOptimalCallTime,
  getCallAnalytics,
  checkCallOutcome,
  SPECIALIST_PHONE,
  CONVERSION_SETTINGS
}