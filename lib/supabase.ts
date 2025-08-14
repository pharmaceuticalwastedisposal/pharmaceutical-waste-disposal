import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if we have real Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder_anon_key'

export const supabase: SupabaseClient | null = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Lead {
  id: string
  email: string
  phone?: string
  company?: string
  facility_type: string
  waste_types: string[]
  volume_range: string
  zip_code: string
  lead_score: number
  source: string
  created_at: string
  updated_at: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'closed_won' | 'closed_lost'
  notes?: string
  assigned_to?: string
  // Multi-channel tracking fields
  submission_count?: number
  last_submission_at?: string
  last_contact_at?: string
  call_attempts?: number
  sms_sent_count?: number
  email_sent_count?: number
  // Lead interaction tracking
  last_call_at?: string
  last_sms_at?: string
  last_email_at?: string
  conversion_sequence_started_at?: string
}

export interface FormSubmission {
  id: string
  lead_id: string
  form_name: string
  step_completed: number
  total_steps: number
  field_data: Record<string, any>
  completion_rate: number
  abandoned_at?: string
  completed_at?: string
  created_at: string
}

export interface LeadInteraction {
  id: string
  lead_id: string
  interaction_type: 'form_submission' | 'form_resubmission' | 'scheduled_call' | 'completed_call' | 'scheduled_email' | 'email_sent' | 'scheduled_sms' | 'sms_sent' | 'voicemail_left' | 'appointment_scheduled'
  interaction_data: Record<string, any>
  source: string
  created_at: string
}

export interface PageView {
  id: string
  session_id: string
  lead_id?: string
  page_url: string
  page_title: string
  time_on_page: number
  scroll_depth: number
  cta_clicked?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  user_agent: string
  ip_address: string
  created_at: string
}

// Lead capture function
export async function captureLeadData(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  // If no Supabase client, simulate success for demo purposes
  if (!supabase) {
    console.log('Demo mode: Lead would be captured:', leadData)
    return {
      id: `demo_${Date.now()}`,
      ...leadData,
      status: 'new' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error capturing lead:', error)
      throw error
    }

    // Track form submission
    await trackFormSubmission({
      lead_id: data.id,
      form_name: leadData.source,
      step_completed: 4,
      total_steps: 4,
      field_data: leadData,
      completion_rate: 100,
      completed_at: new Date().toISOString(),
    })

    return data
  } catch (error) {
    console.error('Failed to capture lead:', error)
    throw error
  }
}

// Form tracking
export async function trackFormSubmission(
  submissionData: Omit<FormSubmission, 'id' | 'created_at'>
) {
  // If no Supabase client, just log for demo
  if (!supabase) {
    console.log('Demo mode: Form submission would be tracked:', submissionData)
    return { id: `demo_${Date.now()}`, ...submissionData, created_at: new Date().toISOString() }
  }

  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{
        ...submissionData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to track form submission:', error)
    throw error
  }
}

// Page view tracking
export async function trackPageView(
  pageData: Omit<PageView, 'id' | 'created_at'>
) {
  // If no Supabase client, just return null for demo
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('page_views')
      .insert([{
        ...pageData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to track page view:', error)
    // Don't throw error for page tracking failures
    return null
  }
}

// Get lead by email
export async function getLeadByEmail(email: string) {
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to get lead by email:', error)
    return null
  }
}

// Update lead status
export async function updateLeadStatus(leadId: string, status: Lead['status'], notes?: string) {
  if (!supabase) {
    console.log('Demo mode: Lead status would be updated:', { leadId, status, notes })
    return null
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to update lead status:', error)
    throw error
  }
}