# AI-Powered Conversion System Setup Guide

## Overview
This system creates a multi-channel follow-up sequence that maximizes conversions from form submissions using Bland.ai for voice calls and Twilio for SMS.

## Conversion Flow
1. **Immediate (0-2 min)**: SMS sent with specialist phone number
2. **15 minutes**: "Quote Ready" SMS if no inbound call received
3. **1 hour**: First outbound call from specialist (5 min for high-priority leads)
4. **4 hours**: Second SMS if no connection
5. **Next day 9am**: Second call attempt
6. **Day 3**: Final call attempt before human takeover

## Required Services

### 1. Bland.ai Setup
1. Sign up at [bland.ai](https://bland.ai)
2. Purchase a phone number or port existing number
3. Get your API key from dashboard
4. Configure webhook URL: `https://yourdomain.com/api/bland-webhook`

### 2. Twilio Setup
1. Sign up at [twilio.com](https://twilio.com)
2. Purchase a phone number for SMS
3. Get Account SID and Auth Token
4. Configure webhook for SMS replies: `https://yourdomain.com/api/sms-webhook`

### 3. Database Setup
Run the schema updates in Supabase:
```sql
-- Run the contents of lib/lead-interactions-schema.sql
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Bland.ai Configuration
BLAND_API_KEY=your_bland_api_key
SPECIALIST_PHONE=1-855-DISPOSE-1  # Your Bland.ai phone number

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio SMS number

# Cron Job Security
CRON_SECRET=generate_a_random_secret_here

# Existing Variables (update if needed)
NEXT_PUBLIC_SITE_URL=https://pharmaceuticalwastedisposal.com
NOTIFICATION_EMAIL=admin@pharmaceuticalwastedisposal.com
FROM_EMAIL=info@pharmaceuticalwastedisposal.com
```

## Cron Job Setup

### Option 1: Vercel Cron (Recommended)
Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/process-scheduled-calls",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Option 2: GitHub Actions
Create `.github/workflows/process-calls.yml`:

```yaml
name: Process Scheduled Calls
on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:

jobs:
  process-calls:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger API
        run: |
          curl -X GET https://pharmaceuticalwastedisposal.com/api/process-scheduled-calls \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: External Cron Service
Use services like EasyCron, Cron-job.org, or UptimeRobot to call:
```
GET https://pharmaceuticalwastedisposal.com/api/process-scheduled-calls
Headers: Authorization: Bearer YOUR_CRON_SECRET
```

## Testing the System

### 1. Test Specialist Line Configuration
```bash
curl -X POST http://localhost:3000/api/configure-specialist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 2. Test Manual Call
```bash
curl -X POST http://localhost:3000/api/process-scheduled-calls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -d '{"leadId": "test-lead-id", "attemptNumber": 1}'
```

### 3. Test Form Submission
Submit a test lead through the form and monitor:
- SMS delivery (immediate)
- Scheduled calls in database
- Cron job execution

## Monitoring & Analytics

### Key Metrics to Track
- **Contact Rate**: % of leads reached within 1 hour
- **Answer Rate**: % of calls answered
- **Conversion Rate**: % of leads that become customers
- **Average Call Duration**: Quality indicator
- **SMS Response Rate**: Engagement metric

### Database Queries for Monitoring

```sql
-- Daily conversion metrics
SELECT * FROM conversion_metrics 
ORDER BY date DESC 
LIMIT 30;

-- Lead interaction timeline
SELECT 
  l.company,
  l.email,
  li.interaction_type,
  li.interaction_data,
  li.created_at
FROM leads l
JOIN lead_interactions li ON l.id = li.lead_id
WHERE l.created_at > NOW() - INTERVAL '7 days'
ORDER BY l.created_at DESC, li.created_at ASC;

-- Call performance
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_calls,
  SUM(CASE WHEN answered THEN 1 ELSE 0 END) as answered,
  AVG(duration_seconds) as avg_duration
FROM call_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Optimizing Conversion Rates

### Best Practices
1. **Timing**: Call within 5 minutes for hot leads (score 70+)
2. **Personalization**: Reference specific waste types and facility type
3. **Urgency**: Mention compliance deadlines and current fines
4. **Value**: Lead with potential savings amount
5. **Persistence**: 3 attempts optimal, more seems pushy

### Script Customization
Edit the specialist script in `lib/bland-ai.ts`:
- Adjust opening based on facility type
- Customize objection handling
- Add local compliance requirements
- Update pricing ranges

### SMS Templates
Customize messages in `lib/twilio-sms.ts`:
- Add seasonal urgency (audits, deadlines)
- Include specific savings amounts
- Reference competitor issues
- Add testimonials

## Troubleshooting

### Common Issues

1. **Calls not being made**
   - Check cron job is running
   - Verify BLAND_API_KEY is set
   - Check lead has valid phone number

2. **SMS not sending**
   - Verify Twilio credentials
   - Check phone number format
   - Ensure number is mobile (not landline)

3. **Low answer rates**
   - Adjust calling windows in `bland-ai.ts`
   - Test different voice options
   - Shorten initial greeting

4. **Database errors**
   - Run schema migrations
   - Check Supabase connection
   - Verify RLS policies

## Support

For issues or questions:
- Bland.ai: support@bland.ai
- Twilio: console.twilio.com/support
- Implementation: Create GitHub issue

## Compliance Notes

- Always honor opt-outs immediately
- Follow TCPA regulations for automated calls
- Maintain Do Not Call list
- Log all interactions for compliance
- Respect time zones for calling