## Repo Purpose

`health-supplement-tr` is a trend intelligence app for supplement and wellness signal discovery.

## Inherited Workspace Conventions

- This repo follows umbrella conventions from `/Users/nick/Desktop/R2 Complete/AGENTS.md`.
- Prefer execution-first once a plan is approved.
- Keep changes merge-ready and complete.

## Repo-Specific Priorities

- Preserve data export reliability for scheduled trend ingestion into R2.
- Keep trend payloads auditable with stable provenance metadata.
- Protect modern UI clarity for trend-heavy experiences.
- Maintain consistency with shared token and naming conventions.

## Working Rules

- Export scripts are production-sensitive; keep retries/idempotency behavior stable.
- Add metadata fields additively; avoid breaking ingest payload shape.
- Prefer targeted updates over broad UI churn.
- Verify scheduled/export code paths after changes.
