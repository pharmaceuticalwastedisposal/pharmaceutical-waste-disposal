import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BLAND_API_KEY = process.env.BLAND_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { leadId, delay } = await request.json()
    
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }
    
    // Wait for the specified delay
    if (delay) {
      await new Promise(resolve => setTimeout(resolve, delay * 1000))
    }
    
    // Get lead data from database
    if (!supabase) {
      console.error('Database not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()
    
    if (error || !lead) {
      console.error('Lead not found:', error)
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    // Make the call
    const cleanPhone = lead.phone.replace(/\D/g, '')
    const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`
    
    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Authorization': BLAND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: formattedPhone,
        from: '+18555924560',
        task: `You are Sarah from Pharmaceutical Waste Disposal. Call ${lead.company || 'this facility'} about their quote request for ${lead.waste_types.join(', ')} disposal. Facility type: ${lead.facility_type}. Volume: ${lead.volume_range}. ZIP: ${lead.zip_code}. Discuss pricing and schedule consultation.`,
        first_sentence: `Hi, this is Sarah from Pharmaceutical Waste Disposal. Is this ${lead.company || 'the facility'} that just requested a quote?`,
        voice: 'maya',
        model: 'enhanced',
        max_duration: 300,
        answered_by_enabled: true,
        wait_for_greeting: true,
        record: false
      })
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Delayed call initiated:', result.call_id)
      return NextResponse.json({ success: true, callId: result.call_id })
    } else {
      console.error('❌ Call failed:', result)
      return NextResponse.json({ error: 'Call failed', details: result }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Trigger call error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}