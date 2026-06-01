-- Enable Row Level Security on the content table
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) SELECT only — the homepage reads content via the anon key
DROP POLICY IF EXISTS "Allow public SELECT" ON content;
CREATE POLICY "Allow public SELECT" ON content
  FOR SELECT
  TO anon
  USING (true);

-- Allow service role full access (INSERT, UPDATE, DELETE bypass RLS automatically
-- for the service role, but we explicitly allow it for clarity)
DROP POLICY IF EXISTS "Allow service role all" ON content;
CREATE POLICY "Allow service role all" ON content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Deny everything else (INSERT, UPDATE, DELETE for anon/authenticated roles)
-- This is the default when RLS is enabled, but we make it explicit:
DROP POLICY IF EXISTS "Deny anon write" ON content;
CREATE POLICY "Deny anon write" ON content
  FOR ALL
  TO anon
  USING (false);

-- Revoke all on the table from public to prevent direct table access
REVOKE ALL ON content FROM anon;
GRANT SELECT ON content TO anon;
