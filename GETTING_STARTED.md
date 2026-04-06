# 🚀 Getting Started with TrendPulse v2.0

Welcome! This guide will help you get TrendPulse up and running with the new centralized backend architecture.

## Choose Your Path

### 👤 I'm a User
You don't need to do anything! Just:
1. Navigate to the deployed TrendPulse URL
2. Start browsing trending supplements
3. Use the chatbot for personalized queries

**That's it!** No configuration, no API keys, no setup required.

---

### 👨‍💼 I'm an Administrator (Deploying My Own Instance)

Follow these steps to deploy your own TrendPulse instance:

## Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd trendpulse
npm install
```

## Step 2: Set Up Supabase Database

### A. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - Name: `trendpulse`
   - Database Password: (generate and save it)
   - Region: Closest to you
4. Wait 2 minutes for setup

### B. Run Database Migrations

1. Click "SQL Editor" in sidebar
2. Click "+ New query"
3. Paste contents of `SUPABASE_SETUP.md` SQL script
4. Click "Run"
5. Paste contents of `SUPABASE_SCHEMA_UPDATE.sql`
6. Click "Run"

✅ You should now have 6 tables created

### C. Get Your Credentials

1. Click "Settings" → "API"
2. Copy "Project URL" (looks like `https://xxxxx.supabase.co`)
3. Copy "anon public" key (starts with `eyJ...`)

## Step 3: Configure Environment

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

## Step 4: Add API Keys to Database

In Supabase SQL Editor, run:

```sql
INSERT INTO api_configuration (
  id,
  exa_api_key,
  openai_api_key
)
VALUES (
  1,
  'your-exa-key-from-exa.ai',
  'your-openai-key-from-platform.openai.com'
)
ON CONFLICT (id) DO UPDATE SET
  exa_api_key = EXCLUDED.exa_api_key,
  openai_api_key = EXCLUDED.openai_api_key;
```

**Where to get API keys:**
- EXA: https://exa.ai (free tier: 1,000 searches/month)
- OpenAI: https://platform.openai.com/api-keys (pay-per-use)

## Step 5: Populate Initial Data

Create `scripts/update-trends.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { discoverSupplementTrends, discoverSupplementCombinations } from './src/lib/trend-discovery'
import { SupplementService } from './src/lib/supplement-service'

async function updateTrends() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  )
  
  // Fetch API keys
  const { data: config } = await supabase
    .from('api_configuration')
    .select('*')
    .single()
  
  if (!config) {
    console.error('No API configuration found')
    return
  }
  
  // Discover trends
  console.log('Discovering trends...')
  const trendData = await discoverSupplementTrends(
    config.exa_api_key,
    {
      redditClientId: config.reddit_client_id,
      redditClientSecret: config.reddit_client_secret,
      rapidApiKey: config.rapidapi_key
    }
  )
  
  // Save supplements
  await SupplementService.upsertSupplements(trendData.supplements)
  console.log(`✅ Saved ${trendData.supplements.length} supplements`)
  
  // Discover combinations
  const combos = await discoverSupplementCombinations(
    trendData.supplements,
    config.exa_api_key,
    {
      redditClientId: config.reddit_client_id,
      redditClientSecret: config.reddit_client_secret,
      rapidApiKey: config.rapidapi_key
    }
  )
  
  // Save combinations
  await SupplementService.upsertCombinations(combos)
  console.log(`✅ Saved ${combos.length} combinations`)
  
  // Update timestamp
  await supabase
    .from('api_configuration')
    .update({ last_trend_update: new Date().toISOString() })
    .eq('id', 1)
  
  console.log('✅ Trends updated successfully!')
}

updateTrends().catch(console.error)
```

Run it:

```bash
tsx scripts/update-trends.ts
```

This will populate your database with real supplement trends.

## Step 6: Test Locally

```bash
npm run dev
```

Open http://localhost:5173

✅ You should see:
- Supplements loading
- No "Supabase not configured" warning
- Chatbot button in bottom-right
- Data persists on refresh

## Step 7: Deploy

### Option A: Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Option B: Netlify

1. Build production:
   ```bash
   npm run build
   ```
2. Drag `dist` folder to https://app.netlify.com/drop
3. Add environment variables in site settings
4. Redeploy

## Step 8: Automate Updates (Optional)

Set up daily trend updates so users always see fresh data.

### GitHub Actions (Easiest)

Create `.github/workflows/update-trends.yml`:

```yaml
name: Update Daily Trends

on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
  workflow_dispatch:     # Manual trigger

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

Add secrets in GitHub → Settings → Secrets → Actions

## You're Done! 🎉

Your TrendPulse instance is now:
- ✅ Running on your own infrastructure
- ✅ Connected to Supabase database
- ✅ Populated with real supplement trends
- ✅ Accessible to unlimited users
- ✅ (Optional) Updating automatically daily

## What Users See

When users visit your deployed URL:
1. Clean interface with two tabs (All Trends, Stacks)
2. Search and filter controls
3. Supplement cards with trend indicators
4. Floating chatbot button (bottom-right)
5. No configuration or setup required

## Next Steps

### Immediate
- [ ] Share your deployed URL with users
- [ ] Test chatbot functionality
- [ ] Verify trends are updating

### Soon
- [ ] Monitor API usage/costs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add custom branding

### Later
- [ ] Implement Edge Functions for production security
- [ ] Add user authentication
- [ ] Build admin dashboard
- [ ] Create mobile app

## Need Help?

| Issue | See |
|-------|-----|
| Database not connecting | `SUPABASE_TROUBLESHOOTING.md` |
| Understanding architecture | `CENTRALIZED_BACKEND.md` |
| Deployment checklist | `SETUP_CHECKLIST.md` |
| Migrating from v1.x | `MIGRATION_GUIDE.md` |

## Common Questions

**Q: Do users need API keys?**  
A: No! All API keys are stored server-side. Users just browse and chat.

**Q: How much does it cost?**  
A: Supabase is free up to 500MB database. API costs depend on usage (EXA free tier: 1,000 searches/month).

**Q: Can I use my own AI model?**  
A: Yes! Configure any OpenAI-compatible API or use Anthropic. See `api_configuration` table.

**Q: Is it secure?**  
A: For development, yes. For production, implement Edge Functions to keep API keys fully server-side. See `CENTRALIZED_BACKEND.md` for details.

**Q: How do I update trends manually?**  
A: Run `tsx scripts/update-trends.ts` anytime.

---

**Congratulations!** You've successfully deployed TrendPulse v2.0 with centralized backend architecture.

For detailed information, see:
- Architecture: `CENTRALIZED_BACKEND.md`
- Full checklist: `SETUP_CHECKLIST.md`
- Executive summary: `V2_SUMMARY.md`
