import { NextRequest, NextResponse } from 'next/server'

// Simple test endpoint to verify Bland.ai connection
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    const BLAND_API_KEY = process.env.BLAND_API_KEY
    const SPECIALIST_PHONE = process.env.SPECIALIST_PHONE

    if (!BLAND_API_KEY) {
      return NextResponse.json({ error: 'Bland.ai API key not configured' }, { status: 500 })
    }

    console.log('Testing Bland.ai call to:', phone)

    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BLAND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: phone,
        from: SPECIALIST_PHONE,
        task: `You are Sarah, a pharmaceutical waste disposal specialist. This is a test call to verify the system is working. Just say: "Hi, this is Sarah from Pharmaceutical Waste Disposal. This is a test call to make sure our system is working correctly. Can you hear me clearly? Great! The test was successful, have a great day!"`,
        voice: 'maya',
        first_sentence: 'Hi, this is Sarah from Pharmaceutical Waste Disposal. This is just a test call.',
        max_duration: 60,
        answered_by_enabled: true
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Bland.ai API error:', result)
      return NextResponse.json({ 
        error: 'Bland.ai API error', 
        details: result 
      }, { status: response.status })
    }

    console.log('Bland.ai test call initiated:', result)

    return NextResponse.json({
      success: true,
      message: 'Test call initiated successfully',
      callId: result.call_id,
      phone,
      from: SPECIALIST_PHONE
    })

  } catch (error) {
    console.error('Test call error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate test call', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}