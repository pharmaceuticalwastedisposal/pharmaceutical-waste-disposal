import { NextRequest, NextResponse } from 'next/server'

// Master cron job that handles all scheduled tasks
export async function GET(request: NextRequest) {
  // Verify this is from Vercel cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    timestamp: new Date().toISOString(),
    emails: { success: false, error: null },
    calls: { success: false, error: null }
  }

  try {
    // Get the base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmaceutical-waste-disposal.vercel.app'
    
    // Process scheduled emails
    try {
      console.log('Processing scheduled emails...')
      const emailResponse = await fetch(`${baseUrl}/api/process-scheduled-emails`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (emailResponse.ok) {
        const emailData = await emailResponse.json()
        results.emails.success = true
        results.emails.data = emailData
        console.log('Email processing completed successfully')
      } else {
        results.emails.error = `HTTP ${emailResponse.status}`
        console.error('Email processing failed:', emailResponse.status)
      }
    } catch (error) {
      results.emails.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('Email processing error:', error)
    }

    // Process scheduled calls
    try {
      console.log('Processing scheduled calls...')
      const callResponse = await fetch(`${baseUrl}/api/process-scheduled-calls`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (callResponse.ok) {
        const callData = await callResponse.json()
        results.calls.success = true
        results.calls.data = callData
        console.log('Call processing completed successfully')
      } else {
        results.calls.error = `HTTP ${callResponse.status}`
        console.error('Call processing failed:', callResponse.status)
      }
    } catch (error) {
      results.calls.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('Call processing error:', error)
    }

    // Return comprehensive results
    const successCount = (results.emails.success ? 1 : 0) + (results.calls.success ? 1 : 0)
    
    return NextResponse.json({
      success: successCount > 0,
      message: `Master cron completed: ${successCount}/2 tasks successful`,
      results
    })

  } catch (error) {
    console.error('Master cron job failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Master cron job failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      results
    }, { status: 500 })
  }
}