-- Fix corrupted JSON data and update database structure for automation system
-- Run this in your Supabase SQL editor

-- Step 1: Add new interaction types to the constraint if it exists
DO $$ 
BEGIN
    -- Drop the old constraint if it exists and create a new one
    ALTER TABLE lead_interactions DROP CONSTRAINT IF EXISTS lead_interactions_interaction_type_check;
    
    ALTER TABLE lead_interactions ADD CONSTRAINT lead_interactions_interaction_type_check 
    CHECK (interaction_type IN (
        'form_submission',
        'form_resubmission', 
        'scheduled_call',
        'completed_call',
        'scheduled_email',
        'email_sent',
        'scheduled_sms',
        'sms_sent',
        'voicemail_left',
        'appointment_scheduled',
        'outbound_call',
        'call_outcome',
        'manual_outbound_call'
    ));
EXCEPTION 
    WHEN others THEN 
        -- If constraint doesn't exist, just add the new one
        ALTER TABLE lead_interactions ADD CONSTRAINT lead_interactions_interaction_type_check 
        CHECK (interaction_type IN (
            'form_submission',
            'form_resubmission',
            'scheduled_call', 
            'completed_call',
            'scheduled_email',
            'email_sent',
            'scheduled_sms',
            'sms_sent',
            'voicemail_left',
            'appointment_scheduled',
            'outbound_call',
            'call_outcome',
            'manual_outbound_call'
        ));
END $$;

-- Step 2: Clean up any corrupted JSON data
-- Delete records with invalid JSON (these are likely corrupted)
DELETE FROM lead_interactions 
WHERE interaction_data::text = 'null' 
   OR interaction_data::text = '' 
   OR interaction_data IS NULL;

-- Step 3: Fix any scheduled_call records that might have invalid structure
UPDATE lead_interactions 
SET interaction_data = jsonb_build_object(
    'attempt', COALESCE((interaction_data->>'attempt')::int, 1),
    'scheduled_time', COALESCE(interaction_data->>'scheduled_time', NOW()::text),
    'specialist_phone', COALESCE(interaction_data->>'specialist_phone', '+18555924560'),
    'completed', COALESCE((interaction_data->>'completed')::boolean, false)
)
WHERE interaction_type = 'scheduled_call' 
  AND (
    interaction_data IS NULL 
    OR NOT (interaction_data ? 'scheduled_time')
    OR NOT (interaction_data ? 'completed')
  );

-- Step 4: Fix any scheduled_email records
UPDATE lead_interactions 
SET interaction_data = jsonb_build_object(
    'email_type', COALESCE(interaction_data->>'email_type', 'welcome'),
    'scheduled_time', COALESCE(interaction_data->>'scheduled_time', NOW()::text),
    'scheduled', COALESCE((interaction_data->>'scheduled')::boolean, true),
    'sent', COALESCE((interaction_data->>'sent')::boolean, false)
)
WHERE interaction_type = 'scheduled_email'
  AND (
    interaction_data IS NULL
    OR NOT (interaction_data ? 'scheduled_time')
    OR NOT (interaction_data ? 'sent')
  );

-- Step 5: Fix any scheduled_sms records  
UPDATE lead_interactions 
SET interaction_data = jsonb_build_object(
    'sms_type', COALESCE(interaction_data->>'sms_type', 'immediate_response'),
    'template', COALESCE(interaction_data->>'template', 'IMMEDIATE_RESPONSE'),
    'scheduled_time', COALESCE(interaction_data->>'scheduled_time', NOW()::text),
    'phone_number', COALESCE(interaction_data->>'phone_number', ''),
    'scheduled', COALESCE((interaction_data->>'scheduled')::boolean, true),
    'sent', COALESCE((interaction_data->>'sent')::boolean, false)
)
WHERE interaction_type = 'scheduled_sms'
  AND (
    interaction_data IS NULL
    OR NOT (interaction_data ? 'scheduled_time')
    OR NOT (interaction_data ? 'sent')
  );

-- Step 6: Ensure all interaction_data fields have proper JSON structure
UPDATE lead_interactions 
SET interaction_data = '{}'::jsonb
WHERE interaction_data IS NULL;

-- Step 7: Add indexes for better performance on automation queries
CREATE INDEX IF NOT EXISTS idx_lead_interactions_scheduled_calls 
ON lead_interactions(interaction_type, (interaction_data->>'scheduled_time')) 
WHERE interaction_type = 'scheduled_call' 
  AND (interaction_data->>'completed')::boolean = false;

CREATE INDEX IF NOT EXISTS idx_lead_interactions_scheduled_emails
ON lead_interactions(interaction_type, (interaction_data->>'scheduled_time'))
WHERE interaction_type = 'scheduled_email'
  AND (interaction_data->>'sent')::boolean = false;

CREATE INDEX IF NOT EXISTS idx_lead_interactions_scheduled_sms
ON lead_interactions(interaction_type, (interaction_data->>'scheduled_time'))
WHERE interaction_type = 'scheduled_sms'
  AND (interaction_data->>'sent')::boolean = false;

-- Step 8: Clean up any orphaned lead_interactions (leads that don't exist)
DELETE FROM lead_interactions 
WHERE lead_id NOT IN (SELECT id FROM leads);

-- Step 9: Update any leads that are missing the new tracking columns
UPDATE leads 
SET 
    submission_count = COALESCE(submission_count, 1),
    last_submission_at = COALESCE(last_submission_at, created_at),
    call_attempts = COALESCE(call_attempts, 0),
    sms_sent_count = COALESCE(sms_sent_count, 0),
    email_sent_count = COALESCE(email_sent_count, 0)
WHERE submission_count IS NULL 
   OR last_submission_at IS NULL
   OR call_attempts IS NULL
   OR sms_sent_count IS NULL
   OR email_sent_count IS NULL;

-- Verification queries (run these to check the fixes)
-- SELECT COUNT(*) as total_interactions FROM lead_interactions;
-- SELECT interaction_type, COUNT(*) FROM lead_interactions GROUP BY interaction_type;
-- SELECT COUNT(*) as scheduled_calls_ready FROM lead_interactions 
-- WHERE interaction_type = 'scheduled_call' AND (interaction_data->>'completed')::boolean = false;

COMMENT ON SCRIPT IS 'Database cleanup script to fix JSON corruption and update automation system structure';

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Database cleanup completed successfully. Automation system should now work properly.';
END $$;