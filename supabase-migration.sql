-- Migration to add multi-channel tracking columns to leads table
-- Run this in your Supabase SQL editor

-- Add new columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_attempts INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_sent_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_sent_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_call_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_sms_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversion_sequence_started_at TIMESTAMPTZ;

-- Create lead_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS lead_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (
        interaction_type IN (
            'form_submission',
            'form_resubmission',
            'scheduled_call',
            'completed_call',
            'scheduled_email',
            'email_sent',
            'sms_sent',
            'voicemail_left',
            'appointment_scheduled'
        )
    ),
    interaction_data JSONB DEFAULT '{}',
    source TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON lead_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON lead_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);

-- Update existing leads to have submission_count = 1 and last_submission_at = created_at
UPDATE leads 
SET 
    submission_count = 1,
    last_submission_at = created_at
WHERE 
    submission_count IS NULL;

COMMENT ON TABLE lead_interactions IS 'Tracks all interactions with leads including calls, emails, SMS, and form submissions';
COMMENT ON COLUMN leads.submission_count IS 'Number of times this lead has submitted the form';
COMMENT ON COLUMN leads.last_submission_at IS 'Timestamp of the most recent form submission';
COMMENT ON COLUMN leads.last_contact_at IS 'Timestamp of the most recent contact attempt (call, SMS, or email)';
COMMENT ON COLUMN leads.conversion_sequence_started_at IS 'When the automated conversion sequence was initiated';