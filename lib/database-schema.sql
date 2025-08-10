-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    facility_type VARCHAR(100) NOT NULL,
    waste_types TEXT[] NOT NULL,
    volume_range VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    lead_score INTEGER DEFAULT 0,
    source VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost')),
    notes TEXT,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    form_name VARCHAR(100) NOT NULL,
    step_completed INTEGER NOT NULL,
    total_steps INTEGER NOT NULL,
    field_data JSONB NOT NULL,
    completion_rate DECIMAL(5,2) NOT NULL,
    abandoned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    page_title VARCHAR(255) NOT NULL,
    time_on_page INTEGER DEFAULT 0,
    scroll_depth INTEGER DEFAULT 0,
    cta_clicked VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    monthly_volume INTEGER,
    current_vendor VARCHAR(100),
    current_monthly_cost DECIMAL(10,2),
    proposed_monthly_cost DECIMAL(10,2),
    savings_amount DECIMAL(10,2),
    savings_percentage DECIMAL(5,2),
    quote_valid_until DATE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'expired', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_alerts table
CREATE TABLE IF NOT EXISTS compliance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('epa', 'dea', 'state', 'general')),
    state_code VARCHAR(2), -- For state-specific alerts
    active BOOLEAN DEFAULT TRUE,
    display_priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_facility_type ON leads(facility_type);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);

CREATE INDEX IF NOT EXISTS idx_form_submissions_lead_id ON form_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_name ON form_submissions(form_name);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_lead_id ON page_views(lead_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

CREATE INDEX IF NOT EXISTS idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_alerts_updated_at 
    BEFORE UPDATE ON compliance_alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample compliance alerts
INSERT INTO compliance_alerts (title, message, alert_type, active) VALUES
('EPA Surprise Audits Announced', 'California EPA announced surprise audits starting next week', 'epa', TRUE),
('Texas Pharmacy Violations', '3 pharmacies fined $47,000 in Texas this month for improper disposal', 'state', TRUE),
('New DEA Requirements', 'New DEA disposal requirements effective in 30 days', 'dea', TRUE),
('Joint Commission Increase', 'Joint Commission increasing pharmaceutical waste inspections by 40%', 'general', TRUE);

-- Row Level Security (RLS) policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for lead capture
CREATE POLICY "Allow anonymous lead creation" ON leads
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow anonymous form submission tracking
CREATE POLICY "Allow anonymous form submission tracking" ON form_submissions
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow anonymous page view tracking
CREATE POLICY "Allow anonymous page view tracking" ON page_views
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow reading compliance alerts
CREATE POLICY "Allow reading compliance alerts" ON compliance_alerts
    FOR SELECT TO anon
    USING (active = TRUE);