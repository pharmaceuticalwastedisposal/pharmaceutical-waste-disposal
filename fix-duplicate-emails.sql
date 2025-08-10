-- Professional solution for handling duplicate email submissions
-- This allows the same email to submit multiple times while tracking everything

-- Option 1: Remove UNIQUE constraint on email (allows multiple submissions)
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_email_key;

-- Option 2: Create a lead_interactions table to track every submission
CREATE TABLE IF NOT EXISTS lead_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'form_submission', 'phone_call', 'email', etc.
    interaction_data JSONB,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON lead_interactions(created_at);

-- Add RLS policy for lead_interactions
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for anon users" ON lead_interactions
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Add a submission_count column to track how many times they've submitted
ALTER TABLE leads ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE leads ADD COLUMN IF NOT EXISTS previous_data JSONB;

-- Create a function to handle duplicate submissions intelligently
CREATE OR REPLACE FUNCTION handle_duplicate_lead()
RETURNS TRIGGER AS $$
BEGIN
    -- Store the previous data before updating
    NEW.previous_data = to_jsonb(OLD);
    -- Increment submission count
    NEW.submission_count = COALESCE(OLD.submission_count, 0) + 1;
    -- Update last submission time
    NEW.last_submission_at = NOW();
    -- Update the updated_at timestamp
    NEW.updated_at = NOW();
    
    -- If lead score improved, keep the higher score
    IF NEW.lead_score < OLD.lead_score THEN
        NEW.lead_score = OLD.lead_score;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling updates
DROP TRIGGER IF EXISTS handle_duplicate_lead_trigger ON leads;
CREATE TRIGGER handle_duplicate_lead_trigger
    BEFORE UPDATE ON leads
    FOR EACH ROW
    WHEN (OLD.email = NEW.email)
    EXECUTE FUNCTION handle_duplicate_lead();