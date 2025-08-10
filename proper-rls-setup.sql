-- Proper Row Level Security Setup for Pharmaceutical Waste Disposal
-- This maintains security while allowing your website to function correctly

-- Step 1: Enable RLS on all tables (keeps them secure)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON leads;
DROP POLICY IF EXISTS "Allow anonymous form submission tracking" ON form_submissions;
DROP POLICY IF EXISTS "Allow anonymous page view tracking" ON page_views;
DROP POLICY IF EXISTS "Allow reading compliance alerts" ON compliance_alerts;

-- Step 3: Create proper policies for the leads table
-- Allow the anon key (your website) to insert new leads
CREATE POLICY "Enable insert for anon users" ON leads
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Allow the anon key to read leads (useful for duplicate checking)
CREATE POLICY "Enable select for anon users" ON leads
    FOR SELECT
    TO anon
    USING (true);

-- Allow the anon key to update leads (for status updates)
CREATE POLICY "Enable update for anon users" ON leads
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Step 4: Create policies for form_submissions table
CREATE POLICY "Enable all operations for anon users" ON form_submissions
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Step 5: Create policies for page_views table  
CREATE POLICY "Enable insert for anon users" ON page_views
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Enable select for anon users" ON page_views
    FOR SELECT
    TO anon
    USING (true);

-- Step 6: Create policies for quotes table
CREATE POLICY "Enable all operations for anon users" ON quotes
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Step 7: Create policies for compliance_alerts table
-- Anyone can read active alerts
CREATE POLICY "Enable read access for anon users" ON compliance_alerts
    FOR SELECT
    TO anon
    USING (active = true);

-- Only authenticated users can modify alerts (admin feature)
CREATE POLICY "Enable all for authenticated users only" ON compliance_alerts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Step 8: Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verification query - run this to check if policies are set correctly
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;