-- Fix Row Level Security for leads table
-- This allows your website to save leads

-- First, disable RLS temporarily
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS but fix the policies:
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- 
-- -- Drop existing policy if it exists
-- DROP POLICY IF EXISTS "Allow anonymous lead creation" ON leads;
-- 
-- -- Create a more permissive policy for inserts
-- CREATE POLICY "Enable insert for all users" ON leads
--     FOR INSERT 
--     WITH CHECK (true);
-- 
-- -- Allow reading own leads (optional)
-- CREATE POLICY "Enable read for all users" ON leads
--     FOR SELECT
--     USING (true);