# ✅ TrendPulse v2.0 Setup Checklist

Use this checklist to deploy your own TrendPulse instance with the new centralized backend architecture.

## Prerequisites

- [ ] Supabase account created (https://supabase.com)
- [ ] Node.js 18+ installed
- [ ] Git repository cloned
- [ ] At least one API key (EXA recommended for best results)

## Database Setup

- [ ] Create new Supabase project
- [ ] Save Project URL and anon key
- [ ] Run base schema from `SUPABASE_SETUP.md`
- [ ] Run migration from `SUPABASE_SCHEMA_UPDATE.sql`
- [ ] Verify all 6 tables created:
  - [ ] `supplements`
  - [ ] `supplement_combinations`
  - [ ] `emerging_signals`
  - [ ] `user_tracked_supplements`
  - [ ] `chat_conversations`
  - [ ] `api_configuration` ← **New in v2.0**

## API Configuration

- [ ] Get EXA API key (https://exa.ai) - Free tier available
- [ ] (Optional) Get Reddit API credentials (https://www.reddit.com/prefs/apps)
- [ ] (Optional) Get OpenAI API key (https://platform.openai.com/api-keys)
- [ ] (Optional) Get RapidAPI key (https://rapidapi.com/hub)

- [ ] Insert API keys into Supabase:

```sql
INSERT INTO api_configuration (
  id,
  exa_api_key,
  reddit_client_id,
  reddit_client_secret,
  rapidapi_key,
  openai_api_key,
  anthropic_api_key
)
VALUES (
  1,
  'your-exa-key-here',
  'reddit-client-id',
  'reddit-client-secret',
  'rapidapi-key',
  'openai-key',
  'anthropic-key'
)
ON CONFLICT (id) DO UPDATE SET
  exa_api_key = EXCLUDED.exa_api_key,
  reddit_client_id = EXCLUDED.reddit_client_id,
  reddit_client_secret = EXCLUDED.reddit_client_secret,
  rapidapi_key = EXCLUDED.rapidapi_key,
  openai_api_key = EXCLUDED.openai_api_key,
  anthropic_api_key = EXCLUDED.anthropic_api_key,
  updated_at = timezone('utc'::text, now());
```

## Frontend Setup

- [ ] Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

- [ ] Install dependencies:

```bash
npm install
```

- [ ] Test local development:

```bash
npm run dev
```

- [ ] Verify Supabase connection (should NOT show connection error)

## Initial Data Population

Choose one method to populate initial trend data:

### Method A: Manual Script (Recommended)

- [ ] Create `scripts/update-trends.ts` (see `CENTRALIZED_BACKEND.md` for template)
- [ ] Run the script:

```bash
tsx scripts/update-trends.ts
```

- [ ] Verify data in Supabase Table Editor:
  - [ ] Check `supplements` table has rows
  - [ ] Check `supplement_combinations` table has rows
  - [ ] Check timestamps are recent

### Method B: Use Old App (If Migrating)

- [ ] Load previous version of app
- [ ] Click "Refresh Trends"
- [ ] Data automatically saves to Supabase
- [ ] Switch to new version

## Testing

- [ ] Open app in browser
- [ ] Verify trends display:
  - [ ] "All Trends" tab shows supplements
  - [ ] "Stacks" tab shows combinations
  - [ ] Last updated timestamp is recent
- [ ] Test filtering:
  - [ ] Category badges filter correctly
  - [ ] Search box filters by name/description
  - [ ] Sort dropdown changes order
- [ ] Test chatbot:
  - [ ] Click chat button (bottom-right)
  - [ ] Ask: "What's trending?"
  - [ ] Verify AI responds with relevant supplements
  - [ ] Ask follow-up question
  - [ ] Verify context is maintained
- [ ] Test insights:
  - [ ] Click "View Insight" on any supplement
  - [ ] Verify AI-generated insight appears
  - [ ] Check discussion links (if EXA API configured)
- [ ] Mobile testing:
  - [ ] Open on mobile device or DevTools mobile view
  - [ ] Verify responsive layout
  - [ ] Test touch scrolling
  - [ ] Test chatbot on mobile

## Deployment

- [ ] Build production bundle:

```bash
npm run build
```

- [ ] Deploy to hosting platform:
  - [ ] **Vercel**: Connect Git repo → Auto-deploy
  - [ ] **Netlify**: Drop dist folder → Deploy
  - [ ] **GitHub Pages**: Push to gh-pages branch
  - [ ] **Custom**: Upload dist folder to server

- [ ] Set environment variables in hosting platform:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

- [ ] Verify production deployment:
  - [ ] App loads without errors
  - [ ] Trends display correctly
  - [ ] Chatbot works
  - [ ] Mobile responsive

## Automation (Optional but Recommended)

Set up automated daily trend updates:

### Option A: Cron Job (Linux/Mac Server)

- [ ] SSH into server
- [ ] Install project dependencies
- [ ] Create update script at `/path/to/update-trends.ts`
- [ ] Add to crontab:

```bash
crontab -e

# Add this line (runs daily at 6 AM):
0 6 * * * cd /path/to/trendpulse && tsx scripts/update-trends.ts >> /var/log/trendpulse-cron.log 2>&1
```

### Option B: Supabase Edge Function

- [ ] Create Edge Function in Supabase dashboard
- [ ] Add trend update logic (see `CENTRALIZED_BACKEND.md`)
- [ ] Set up cron trigger:
  - [ ] Schedule: `0 6 * * *` (6 AM daily)
  - [ ] Enable function

### Option C: GitHub Actions

- [ ] Create `.github/workflows/update-trends.yml`
- [ ] Add workflow (see example below)
- [ ] Enable GitHub Actions in repo
- [ ] Add secrets (Supabase URL, anon key)

Example workflow:

```yaml
name: Update Daily Trends

on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  update-trends:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: tsx scripts/update-trends.ts
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Security Hardening (Production)

For production deployments, implement these security measures:

- [ ] Move chatbot to Supabase Edge Function
- [ ] Update RLS policies to restrict `api_configuration`:

```sql
-- Remove public read access
DROP POLICY "Public API config read" ON api_configuration;

-- Allow only service role
CREATE POLICY "Service role only" 
  ON api_configuration FOR ALL
  USING (auth.role() = 'service_role');
```

- [ ] Implement rate limiting for chatbot
- [ ] Add user authentication (Supabase Auth)
- [ ] Set up monitoring/alerts
- [ ] Enable Supabase database backups
- [ ] Add error tracking (Sentry, LogRocket, etc.)

## Documentation

- [ ] Update team on new architecture
- [ ] Share admin credentials securely (1Password, etc.)
- [ ] Document update process
- [ ] Create runbook for common tasks

## Post-Launch

- [ ] Monitor usage in Supabase dashboard
- [ ] Check API usage/costs
- [ ] Review chatbot conversations (if logged)
- [ ] Gather user feedback
- [ ] Plan next features

## Troubleshooting

If anything goes wrong, check:

- [ ] `SUPABASE_TROUBLESHOOTING.md` - Common issues
- [ ] `CENTRALIZED_BACKEND.md` - Architecture details
- [ ] Supabase logs (Dashboard → Logs)
- [ ] Browser console for frontend errors
- [ ] Network tab for API failures

## Success Criteria

You've successfully deployed when:

✅ Users can access app without configuration  
✅ Trends load in <2 seconds  
✅ Chatbot responds to queries  
✅ Data updates daily (manually or automated)  
✅ No API keys visible in frontend code  
✅ Mobile experience is smooth

---

**Estimated Setup Time**:
- Basic setup: 30 minutes
- With automation: 1 hour
- Production hardening: 2-3 hours

**Difficulty**: Moderate (requires Supabase + basic SQL)

**Support**: See documentation files or create an issue
