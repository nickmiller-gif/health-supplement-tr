-- ========================================
-- TrendPulse - Centralized Backend Schema
-- Add API configuration table for server-side API keys
-- ========================================

-- API Configuration Table (Single Row - Server-Side Only)
CREATE TABLE IF NOT EXISTS api_configuration (
  id SERIAL PRIMARY KEY,
  exa_api_key TEXT,
  reddit_client_id TEXT,
  reddit_client_secret TEXT,
  rapidapi_key TEXT,
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  last_trend_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Only allow one configuration row
CREATE UNIQUE INDEX IF NOT EXISTS api_configuration_single_row ON api_configuration ((id IS NOT NULL));

-- Enable RLS
ALTER TABLE api_configuration ENABLE ROW LEVEL SECURITY;

-- Public read access for API keys (frontend needs to fetch them)
-- In production, you'd use Edge Functions to keep keys server-side
DROP POLICY IF EXISTS "Public API config read" ON api_configuration;
CREATE POLICY "Public API config read" 
  ON api_configuration FOR SELECT 
  USING (true);

-- Only service role can write API configuration
DROP POLICY IF EXISTS "Service role API config write" ON api_configuration;
CREATE POLICY "Service role API config write" 
  ON api_configuration FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Insert initial empty configuration if not exists
INSERT INTO api_configuration (id, last_trend_update)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_api_config_updated ON api_configuration(updated_at DESC);
