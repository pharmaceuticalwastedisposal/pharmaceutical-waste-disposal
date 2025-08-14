-- Create lead_interactions table for tracking all touchpoints
CREATE TABLE IF NOT EXISTS lead_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN (
        'form_submission',
        'form_resubmission', 
        'scheduled_call',
        'outbound_call',
        'inbound_call',
        'call_completed',
        'call_outcome',
        'manual_outbound_call',
        'quality_conversation',
        'sms_sent',
        'sms_received',
        'email_sent',
        'email_opened',
        'email_clicked',
        'quote_viewed',
        'appointment_scheduled'
    )),
    interaction_data JSONB NOT NULL,
    source VARCHAR(50) DEFAULT 'automation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns to leads table for better tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversion_score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_attempts INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sms_sent_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS total_call_duration INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON lead_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON lead_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_scheduled_time ON lead_interactions((interaction_data->>'scheduled_time'));

-- Create call_analytics table for detailed call tracking
CREATE TABLE IF NOT EXISTS call_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    call_id VARCHAR(255) UNIQUE NOT NULL,
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')),
    from_number VARCHAR(50),
    to_number VARCHAR(50),
    duration_seconds INTEGER,
    answered BOOLEAN DEFAULT FALSE,
    voicemail_left BOOLEAN DEFAULT FALSE,
    recording_url TEXT,
    transcription TEXT,
    summary TEXT,
    sentiment VARCHAR(20),
    interested BOOLEAN,
    objections TEXT[],
    appointment_scheduled BOOLEAN DEFAULT FALSE,
    appointment_time TIMESTAMP WITH TIME ZONE,
    end_reason VARCHAR(50),
    cost_cents INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversion_metrics table for tracking performance
CREATE TABLE IF NOT EXISTS conversion_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_leads INTEGER DEFAULT 0,
    contacted_leads INTEGER DEFAULT 0,
    qualified_leads INTEGER DEFAULT 0,
    converted_leads INTEGER DEFAULT 0,
    total_calls_made INTEGER DEFAULT 0,
    calls_answered INTEGER DEFAULT 0,
    avg_call_duration INTEGER DEFAULT 0,
    sms_sent INTEGER DEFAULT 0,
    sms_replied INTEGER DEFAULT 0,
    appointments_scheduled INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    contact_rate DECIMAL(5,2),
    answer_rate DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Create function to update conversion metrics
CREATE OR REPLACE FUNCTION update_conversion_metrics()
RETURNS void AS $$
DECLARE
    today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO conversion_metrics (
        date,
        total_leads,
        contacted_leads,
        qualified_leads,
        converted_leads,
        total_calls_made,
        calls_answered,
        avg_call_duration,
        sms_sent,
        appointments_scheduled
    )
    SELECT
        today,
        COUNT(DISTINCT l.id) as total_leads,
        COUNT(DISTINCT CASE WHEN l.status IN ('contacted', 'qualified', 'proposal_sent', 'closed_won') THEN l.id END) as contacted_leads,
        COUNT(DISTINCT CASE WHEN l.status IN ('qualified', 'proposal_sent', 'closed_won') THEN l.id END) as qualified_leads,
        COUNT(DISTINCT CASE WHEN l.status = 'closed_won' THEN l.id END) as converted_leads,
        COUNT(DISTINCT CASE WHEN li.interaction_type IN ('outbound_call', 'manual_outbound_call') THEN li.id END) as total_calls_made,
        COUNT(DISTINCT CASE WHEN li.interaction_type = 'call_completed' AND (li.interaction_data->>'answered')::boolean = true THEN li.id END) as calls_answered,
        AVG(CASE WHEN li.interaction_type = 'call_completed' THEN (li.interaction_data->>'call_length')::integer END) as avg_call_duration,
        COUNT(DISTINCT CASE WHEN li.interaction_type = 'sms_sent' THEN li.id END) as sms_sent,
        COUNT(DISTINCT CASE WHEN li.interaction_type = 'appointment_scheduled' THEN li.id END) as appointments_scheduled
    FROM leads l
    LEFT JOIN lead_interactions li ON l.id = li.lead_id AND DATE(li.created_at) = today
    WHERE DATE(l.created_at) = today OR DATE(li.created_at) = today
    ON CONFLICT (date) DO UPDATE SET
        total_leads = EXCLUDED.total_leads,
        contacted_leads = EXCLUDED.contacted_leads,
        qualified_leads = EXCLUDED.qualified_leads,
        converted_leads = EXCLUDED.converted_leads,
        total_calls_made = EXCLUDED.total_calls_made,
        calls_answered = EXCLUDED.calls_answered,
        avg_call_duration = EXCLUDED.avg_call_duration,
        sms_sent = EXCLUDED.sms_sent,
        appointments_scheduled = EXCLUDED.appointments_scheduled,
        conversion_rate = CASE WHEN EXCLUDED.total_leads > 0 THEN (EXCLUDED.converted_leads::decimal / EXCLUDED.total_leads) * 100 ELSE 0 END,
        contact_rate = CASE WHEN EXCLUDED.total_leads > 0 THEN (EXCLUDED.contacted_leads::decimal / EXCLUDED.total_leads) * 100 ELSE 0 END,
        answer_rate = CASE WHEN EXCLUDED.total_calls_made > 0 THEN (EXCLUDED.calls_answered::decimal / EXCLUDED.total_calls_made) * 100 ELSE 0 END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- RLS policies for lead_interactions
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_metrics ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to lead_interactions" ON lead_interactions
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to call_analytics" ON call_analytics
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to conversion_metrics" ON conversion_metrics
    FOR ALL USING (true);

-- Create a scheduled job to update metrics daily (if using pg_cron)
-- SELECT cron.schedule('update-conversion-metrics', '0 0 * * *', 'SELECT update_conversion_metrics();');