-- Simple database cleanup script - copy and paste this exactly
-- Run this in your Supabase SQL Editor

-- Step 1: Delete any corrupted interaction records
DELETE FROM lead_interactions 
WHERE interaction_data IS NULL 
   OR interaction_data::text = 'null' 
   OR interaction_data::text = '';

-- Step 2: Fix scheduled_call records with proper JSON structure
UPDATE lead_interactions 
SET interaction_data = '{"attempt": 1, "scheduled_time": "2025-08-14T18:00:00.000Z", "specialist_phone": "+18555924560", "completed": false}'::jsonb
WHERE interaction_type = 'scheduled_call';

-- Step 3: Fix scheduled_email records
UPDATE lead_interactions 
SET interaction_data = '{"email_type": "welcome", "scheduled_time": "2025-08-14T18:00:00.000Z", "scheduled": true, "sent": false}'::jsonb
WHERE interaction_type = 'scheduled_email';

-- Step 4: Fix scheduled_sms records  
UPDATE lead_interactions 
SET interaction_data = '{"sms_type": "immediate_response", "template": "IMMEDIATE_RESPONSE", "scheduled_time": "2025-08-14T18:00:00.000Z", "scheduled": true, "sent": false}'::jsonb
WHERE interaction_type = 'scheduled_sms';

-- Step 5: Ensure all other records have valid JSON
UPDATE lead_interactions 
SET interaction_data = '{}'::jsonb
WHERE interaction_data IS NULL;

-- Done - this should fix the JSON parsing errors