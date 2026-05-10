# health-supplement-tr — Unification Audit (2026-05-10)

_From the R2 Unification pass. Companion: `../R2-Unification-Audit.md`._

## Status
- **MEG integration:** ❌ Zero references.
- **Site registry:** ⚠️ Not directly registered. Linked to `smartplrx.com` per `R2-SEO-Snapshot.json#brands` (smartplrx is the public face, this repo is a sub-surface).
- **SEO baseline (before audit):** robots ❌ / sitemap ❌ / JSON-LD ❌ / meta description ❌ / canonical ❌ — **worst SEO baseline in the portfolio.**

## Fixes applied
- `index.html`: added meta description, author, theme-color, og:type/title/description, twitter:card/title/description, WebApplication JSON-LD.
- `public/robots.txt`: created (was missing entirely).

## Known issues
- Sitemap still missing — add once a vanity domain is wired.
- Health-claim content review per regulatory requirements (deferred per Phase 5+).

## Next
1. Lovable redeploy after this audit's index.html + robots.txt changes ship.
2. ADR-0005 Wave-A: add MEG columns to primary `supplement_trends` / `ingredients` table(s).
3. Confirm public/private status — currently treated as a sub-surface of smartplrx.com.
