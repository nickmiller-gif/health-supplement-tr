-- health-supplement-tr — MEG Phase-A link columns (Wave-A repo #4)
--
-- ADR: ../../../docs/adr/ADR-0005-meg-coverage-extension.md
-- Plan: ../../../R2-Drift-Resolution-Plan.md § Hotspot 1 Wave-A repo #4
-- Catalog: @r2/meg-catalog v1.0.0 (R2/packages/meg-catalog/src/v1.ts)
-- Depends on: 20260514100000_initial_schema_capture.sql
--
-- Purpose: add meg_entity_id (uuid) + meg_canonical_id (text) columns to
-- the two domain tables in TrendPulse — supplements and supplement_combinations.
-- Both map to meg:topic in the catalog (each supplement is a topic node;
-- a combination is also a topic node since it represents a researchable
-- subject).
--
-- Source-system literal: 'health_supplement_tr' (catalog v1.0.0).
--
-- Identity strategy:
--   supplements             -> meg:topic   (self_assigned, key by lowercased name slug)
--   supplement_combinations -> meg:topic   (self_assigned, key by combination id)
--
-- Idempotent and reversible.

BEGIN;

-- =============================================================
-- 1) Add MEG link columns.
-- =============================================================

ALTER TABLE public.supplements
  ADD COLUMN IF NOT EXISTS meg_entity_id    UUID,
  ADD COLUMN IF NOT EXISTS meg_canonical_id TEXT;

ALTER TABLE public.supplement_combinations
  ADD COLUMN IF NOT EXISTS meg_entity_id    UUID,
  ADD COLUMN IF NOT EXISTS meg_canonical_id TEXT;

CREATE INDEX IF NOT EXISTS idx_supplements_meg_entity_id
  ON public.supplements (meg_entity_id) WHERE meg_entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_supplements_meg_canonical_id
  ON public.supplements (meg_canonical_id) WHERE meg_canonical_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_supplement_combinations_meg_entity_id
  ON public.supplement_combinations (meg_entity_id) WHERE meg_entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_supplement_combinations_meg_canonical_id
  ON public.supplement_combinations (meg_canonical_id) WHERE meg_canonical_id IS NOT NULL;

-- =============================================================
-- 2) Deterministic canonical-id helper for supplements (cross-repo dedup).
--    The same supplement appearing in centralr2 and health-supplement-tr
--    should resolve to the same MEG node. Key on lowercased name slug.
-- =============================================================

-- Hardened: STRICT, length cap, control-char strip, dash collapse, search_path locked.
-- Supplement names in commerce catalogs are typically <100 chars; cap at 256 for safety.
CREATE OR REPLACE FUNCTION public.meg_canonical_id_for_supplement(p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
STRICT
SECURITY INVOKER
SET search_path = public, pg_catalog
AS $$
DECLARE
  trimmed TEXT;
  cleaned TEXT;
BEGIN
  trimmed := trim(p_name);
  IF length(trimmed) = 0 THEN
    RETURN NULL;
  END IF;
  IF length(trimmed) > 256 THEN
    RAISE EXCEPTION 'meg_canonical_id_for_supplement: input too long (%>256)', length(trimmed);
  END IF;
  cleaned := regexp_replace(lower(trimmed), '[[:cntrl:]]', '', 'g');
  cleaned := regexp_replace(cleaned, '[^a-z0-9-]+', '-', 'g');
  cleaned := regexp_replace(cleaned, '-{2,}', '-', 'g');
  cleaned := regexp_replace(cleaned, '^-+|-+$', '', 'g');
  IF length(cleaned) = 0 THEN
    RETURN NULL;
  END IF;
  RETURN 'meg:topic:supplement-' || cleaned;
END;
$$;

COMMENT ON FUNCTION public.meg_canonical_id_for_supplement(TEXT) IS
  'Deterministic meg_canonical_id for supplements keyed on normalized name. Cross-repo dedup pivot — the same supplement (e.g. "Magnesium L-Threonate") resolves to the same MEG canonical identifier across centralr2-core, health-supplement-tr, formahealth peptide_knowledge, and any future producer.';

-- Backfill: populate canonical_id where name is known.
UPDATE public.supplements
   SET meg_canonical_id = public.meg_canonical_id_for_supplement(name)
 WHERE meg_canonical_id IS NULL
   AND name IS NOT NULL;

-- For combinations: derive canonical_id from the combination's id (already a stable identifier).
UPDATE public.supplement_combinations
   SET meg_canonical_id = 'meg:topic:supplement-combo-' || regexp_replace(lower(trim(id)), '[^a-z0-9-]+', '-', 'g')
 WHERE meg_canonical_id IS NULL
   AND id IS NOT NULL;

-- =============================================================
-- 3) CHECK constraint on canonical-id format.
-- =============================================================

ALTER TABLE public.supplements DROP CONSTRAINT IF EXISTS supplements_meg_canonical_id_format_chk;
ALTER TABLE public.supplements ADD CONSTRAINT supplements_meg_canonical_id_format_chk CHECK (
  meg_canonical_id IS NULL
  OR meg_canonical_id ~ '^meg:(person(:(athlete|operator|speaker))?|company(:(law_firm|investor))?|property(:(tower|residential|commercial))?|event(:(retreat|session))?|closing_file|ip_matter|patent|thesis|opportunity|document|topic):[a-z0-9_-]+$'
);

ALTER TABLE public.supplement_combinations DROP CONSTRAINT IF EXISTS supplement_combinations_meg_canonical_id_format_chk;
ALTER TABLE public.supplement_combinations ADD CONSTRAINT supplement_combinations_meg_canonical_id_format_chk CHECK (
  meg_canonical_id IS NULL
  OR meg_canonical_id ~ '^meg:(person(:(athlete|operator|speaker))?|company(:(law_firm|investor))?|property(:(tower|residential|commercial))?|event(:(retreat|session))?|closing_file|ip_matter|patent|thesis|opportunity|document|topic):[a-z0-9_-]+$'
);

-- =============================================================
-- 4) Comments.
-- =============================================================

COMMENT ON COLUMN public.supplements.meg_entity_id IS
  'MEG canonical entity UUID (catalog v1.0.0). Populated by application code via cross-project meg_resolve_or_create RPC.';
COMMENT ON COLUMN public.supplements.meg_canonical_id IS
  'MEG canonical identifier string. Use public.meg_canonical_id_for_supplement(name) for cross-repo dedup.';

COMMENT ON COLUMN public.supplement_combinations.meg_entity_id IS
  'MEG canonical entity UUID (catalog v1.0.0).';
COMMENT ON COLUMN public.supplement_combinations.meg_canonical_id IS
  'MEG canonical identifier string. Derived from id at backfill; new rows should mint via meg_resolve_or_create.';

COMMENT ON SCHEMA public IS
  'health-supplement-tr / TrendPulse schema. Initial schema captured 2026-05-14 by 20260514100000. MEG Phase-A link columns added 2026-05-15 by 20260515000000. Source-system literal: health_supplement_tr (catalog v1.0.0).';

-- =============================================================
-- Post-migration assertion.
-- =============================================================

DO $$
DECLARE
  actual_columns INT;
  helper_present INT;
BEGIN
  SELECT count(*) INTO actual_columns
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name IN ('supplements','supplement_combinations')
     AND column_name IN ('meg_entity_id','meg_canonical_id');
  IF actual_columns < 4 THEN
    RAISE EXCEPTION 'meg_phase_a assertion failed: expected 4 MEG columns, found %', actual_columns;
  END IF;

  SELECT count(*) INTO helper_present
    FROM pg_proc
   WHERE proname = 'meg_canonical_id_for_supplement'
     AND pronamespace = 'public'::regnamespace;
  IF helper_present <> 1 THEN
    RAISE EXCEPTION 'meg_phase_a assertion failed: meg_canonical_id_for_supplement helper missing';
  END IF;

  IF (SELECT public.meg_canonical_id_for_supplement('Magnesium L-Threonate'))
     <> 'meg:topic:supplement-magnesium-l-threonate' THEN
    RAISE EXCEPTION 'meg_phase_a assertion failed: supplement helper produces wrong output';
  END IF;

  RAISE NOTICE 'meg_phase_a OK: % cols, helper validated', actual_columns;
END $$;

COMMIT;

-- =============================================================
-- ROLLBACK
-- =============================================================
-- BEGIN;
-- ALTER TABLE public.supplements DROP CONSTRAINT IF EXISTS supplements_meg_canonical_id_format_chk;
-- ALTER TABLE public.supplement_combinations DROP CONSTRAINT IF EXISTS supplement_combinations_meg_canonical_id_format_chk;
-- DROP INDEX IF EXISTS public.idx_supplements_meg_canonical_id;
-- DROP INDEX IF EXISTS public.idx_supplements_meg_entity_id;
-- DROP INDEX IF EXISTS public.idx_supplement_combinations_meg_canonical_id;
-- DROP INDEX IF EXISTS public.idx_supplement_combinations_meg_entity_id;
-- ALTER TABLE public.supplements DROP COLUMN IF EXISTS meg_canonical_id;
-- ALTER TABLE public.supplements DROP COLUMN IF EXISTS meg_entity_id;
-- ALTER TABLE public.supplement_combinations DROP COLUMN IF EXISTS meg_canonical_id;
-- ALTER TABLE public.supplement_combinations DROP COLUMN IF EXISTS meg_entity_id;
-- DROP FUNCTION IF EXISTS public.meg_canonical_id_for_supplement(TEXT);
-- COMMIT;
