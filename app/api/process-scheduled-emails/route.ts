import { NextRequest, NextResponse } from 'next/server'
import { processScheduledEmails } from '@/lib/email-scheduler'

// This endpoint should be called by a cron job every 5 minutes to process scheduled emails
export async function GET(request: NextRequest) {
  // Verify this is from an authorized source (cron job)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await processScheduledEmails()

    return NextResponse.json({
      success: true,
      processed: results.processed,
      successful: results.successful,
      failed: results.failed,
      timestamp: new Date().toISOString(),
      results: results.results
    })

  } catch (error) {
    console.error('Error processing scheduled emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Manual trigger for testing specific email types
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { leadId, emailType } = await request.json()

    if (!leadId || !emailType) {
      return NextResponse.json({ 
        error: 'Lead ID and email type required' 
      }, { status: 400 })
    }

    // This would manually trigger a specific email
    return NextResponse.json({
      success: true,
      message: 'Manual email trigger received',
      leadId,
      emailType
    })

  } catch (error) {
    console.error('Error processing manual email trigger:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}