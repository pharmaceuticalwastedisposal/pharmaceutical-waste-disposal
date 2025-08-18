import { NextRequest, NextResponse } from 'next/server'

const BLAND_API_KEY = process.env.BLAND_API_KEY
const PATHWAY_ID = 'c1ad63ef-ca2b-442c-b9ef-4c19333b44fc'

export async function POST(request: NextRequest) {
  try {
    // Get the form data from Twilio
    const formData = await request.formData()
    
    // Convert FormData to URLSearchParams for forwarding
    const params = new URLSearchParams()
    formData.forEach((value, key) => {
      params.append(key, value.toString())
    })
    
    console.log('Incoming call webhook from Twilio:', Object.fromEntries(formData.entries()))
    
    // Forward to Bland.ai with authentication
    const response = await fetch(`https://api.bland.ai/v1/inbound/${PATHWAY_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': BLAND_API_KEY || '',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })
    
    if (!response.ok) {
      console.error('Bland.ai webhook failed:', response.status, await response.text())
      
      // Fallback TwiML - transfer to your cell
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">Thank you for calling Pharmaceutical Waste Disposal. Please hold while we connect you with a specialist.</Say>
          <Dial>+19125366544</Dial>
        </Response>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' }
        }
      )
    }
    
    // Return Bland.ai's response
    const blandResponse = await response.text()
    console.log('Bland.ai response:', blandResponse)
    
    return new Response(blandResponse, {
      status: 200,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'text/xml' }
    })
    
  } catch (error) {
    console.error('Voice webhook error:', error)
    
    // Fallback TwiML - transfer to your cell
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">Thank you for calling Pharmaceutical Waste Disposal. Please hold while we connect you with a specialist.</Say>
        <Dial>+19125366544</Dial>
      </Response>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      }
    )
  }
}