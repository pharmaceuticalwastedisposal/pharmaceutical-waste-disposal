# Lead Capture & Email Notification Setup Guide

## ✅ What's Been Set Up

1. **Lead Capture Form** - Multi-step form that collects:
   - Email, Phone, Company
   - Facility Type (Hospital, Pharmacy, Clinic, etc.)
   - Waste Types (Controlled, Hazardous, Chemotherapy, etc.)
   - Volume Range
   - ZIP Code

2. **Lead Scoring System** - Automatically scores leads 0-100 based on:
   - Facility type (Hospitals = 30 points)
   - Waste types (Controlled substances = 20 points)
   - Volume (Enterprise = 25 points)
   - Contact completeness

3. **API Route** (`/api/leads`) that:
   - Saves leads to Supabase database
   - Sends admin notification email with lead score
   - Sends welcome email to the lead
   - Returns success/error response

4. **Email Templates**:
   - Admin notification with priority indicators
   - Professional welcome email for leads

## 🚀 Quick Setup (5 minutes)

### Step 1: Set Up Supabase (Free)

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Create a new project (free tier is fine)
3. Once created, go to Settings → API
4. Copy your project URL and anon key

### Step 2: Set Up Resend for Emails (Free for 100 emails/day)

1. Go to [https://resend.com](https://resend.com) and sign up
2. Verify your email domain (or use their test domain)
3. Go to API Keys and create a new key
4. Copy the API key (starts with `re_`)

### Step 3: Configure Environment Variables

Edit `.env.local` file and replace with your actual values:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

# From Resend
RESEND_API_KEY=re_your_api_key_here
NOTIFICATION_EMAIL=your-email@example.com
FROM_EMAIL=noreply@yourdomain.com
```

### Step 4: Create Database Tables

1. Go to Supabase SQL Editor
2. Run the SQL from `lib/database-schema.sql`
3. This creates tables for leads, quotes, form submissions, etc.

### Step 5: Test the System

```bash
npm run dev
```

1. Go to http://localhost:3000
2. Fill out the lead form
3. Check your email for notifications
4. Check Supabase Table Editor to see the saved lead

## 📊 Lead Management

### View Leads in Supabase
1. Go to Table Editor in Supabase
2. Select the `leads` table
3. You'll see all captured leads with scores

### Lead Scoring Breakdown
- **70-100**: 🔥 High Priority (call within 15 min)
- **50-69**: ⚡ Medium Priority (quote within 1 hour)
- **0-49**: 📋 Standard (quote within 24 hours)

### High-Value Indicators
- Hospital facility type
- Controlled substances disposal
- Large/Enterprise volume
- Complete contact information

## 🔧 Customization

### Adjust Lead Scoring
Edit the `calculateLeadScore` function in `/app/api/leads/route.ts`

### Modify Email Templates
Edit `generateAdminEmailHTML` and `generateWelcomeEmailHTML` in the same file

### Add Custom Fields
1. Update the form schema in `ProgressiveLeadForm.tsx`
2. Add fields to database schema
3. Update API route to handle new fields

## 🐛 Troubleshooting

### Emails Not Sending?
- Check RESEND_API_KEY is set correctly
- Verify FROM_EMAIL domain is verified in Resend
- Check console for error messages

### Leads Not Saving?
- Verify Supabase credentials are correct
- Check browser console for errors
- Ensure database tables are created

### Form Not Submitting?
- Check browser console for errors
- Verify all required fields are filled
- Check network tab for API response

## 📈 Next Steps

1. **Set up analytics**: Add PostHog or Plausible for conversion tracking
2. **Add SMS notifications**: Configure Twilio for instant alerts
3. **Create admin dashboard**: Build a Next.js page to manage leads
4. **Set up CRM integration**: Connect to HubSpot or Salesforce
5. **Add A/B testing**: Test different form variations

## 🆘 Need Help?

- Check the browser console for errors
- Review the API route logs in terminal
- Verify all environment variables are set
- Test with the example values first

The system works even without Supabase/Resend configured - it will:
- Log leads to console in demo mode
- Show success message to users
- Redirect to thank you page