-- health-supplement-tr — initial schema capture
--
-- Plan: ../../R2-Drift-Resolution-Plan.md § Hotspot 1 Wave-A repo #4
--
-- Purpose: capture the existing health-supplement-tr (TrendPulse) schema into
-- a proper migration so subsequent MEG link-column work has a versioned
-- baseline. The pre-2026-05-14 state lived only in:
--   - health-supplement-tr/SUPABASE_SCHEMA_UPDATE.sql (api_configuration)
--   - health-supplement-tr/src/lib/supabase.ts (TypeScript Database type
--     declaring `supplements` and `supplement_combinations`)
--
-- Idempotent — every CREATE uses IF NOT EXISTS. Safe to apply against an
-- environment where the schema already exists.

BEGIN;

-- =============================================================
-- 1) api_configuration — single-row server-side API key holder.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.api_configuration (
  id                   SERIAL      PRIMARY KEY,
  exa_api_key          TEXT,
  reddit_client_id     TEXT,
  reddit_client_secret TEXT,
  rapidapi_key         TEXT,
  openai_api_key       TEXT,
  anthropic_api_key    TEXT,
  last_trend_update    TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE UNIQUE INDEX IF NOT EXISTS api_configuration_single_row
  ON public.api_configuration ((id IS NOT NULL));

ALTER TABLE public.api_configuration ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public API config read" ON public.api_configuration;
CREATE POLICY "Public API config read"
  ON public.api_configuration FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role API config write" ON public.api_configuration;
CREATE POLICY "Service role API config write"
  ON public.api_configuration FOR ALL
  USING (true) WITH CHECK (true);

INSERT INTO public.api_configuration (id, last_trend_update)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_api_config_updated
  ON public.api_configuration(updated_at DESC);

-- =============================================================
-- 2) supplements — domain table for individual supplement records.
--    Schema derived from src/lib/supabase.ts Database['public']['Tables']['supplements'].
-- =============================================================

CREATE TABLE IF NOT EXISTS public.supplements (
  id                  TEXT        PRIMARY KEY,
  name                TEXT        NOT NULL,
  category            TEXT        NOT NULL,
  trend_direction     TEXT        NOT NULL,
  popularity_score    NUMERIC,
  description         TEXT,
  trend_data          JSONB,                -- numeric array as JSONB for flexibility
  discussion_links    JSONB,
  ai_insight          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public supplements read" ON public.supplements;
CREATE POLICY "Public supplements read"
  ON public.supplements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role supplements write" ON public.supplements;
CREATE POLICY "Service role supplements write"
  ON public.supplements FOR ALL
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_supplements_category ON public.supplements(category);
CREATE INDEX IF NOT EXISTS idx_supplements_trend_direction ON public.supplements(trend_direction);
CREATE INDEX IF NOT EXISTS idx_supplements_updated_at ON public.supplements(updated_at DESC);

-- =============================================================
-- 3) supplement_combinations — paired/stacked supplement records.
--    Schema derived from Database['public']['Tables']['supplement_combinations'].
-- =============================================================

CREATE TABLE IF NOT EXISTS public.supplement_combinations (
  id                  TEXT        PRIMARY KEY,
  name                TEXT        NOT NULL,
  description         TEXT,
  purpose             TEXT,
  supplement_ids      TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  trend_direction     TEXT        NOT NULL,
  popularity_score    NUMERIC,
  trend_data          JSONB,
  -- "references" is a reserved word — must be double-quoted. The TypeScript
  -- Database type in src/lib/supabase.ts exposes this as `references: string[]`.
  -- ORM/client code accesses via the quoted form: select("references").
  "references"        TEXT[]      DEFAULT ARRAY[]::TEXT[],
  discussion_links    JSONB,
  ai_insight          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.supplement_combinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public supplement_combinations read" ON public.supplement_combinations;
CREATE POLICY "Public supplement_combinations read"
  ON public.supplement_combinations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role supplement_combinations write" ON public.supplement_combinations;
CREATE POLICY "Service role supplement_combinations write"
  ON public.supplement_combinations FOR ALL
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_supplement_combinations_trend_direction ON public.supplement_combinations(trend_direction);
CREATE INDEX IF NOT EXISTS idx_supplement_combinations_updated_at ON public.supplement_combinations(updated_at DESC);

COMMIT;
