# 🚀 Connect TrendPulse to Lovable - Quick Start Guide

## What You'll Accomplish
This guide will help you connect your TrendPulse application to Lovable.dev with Supabase backend, following the centralized architecture where:
- ✅ All API keys are stored in Supabase (secure backend)
- ✅ Users only view trends (no configuration needed)
- ✅ Single source of truth for all data
- ✅ Works seamlessly on Lovable.dev

---

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] A Supabase account ([sign up free](https://supabase.com/dashboard))
- [ ] A Lovable account ([sign up](https://lovable.dev))
- [ ] Your TrendPulse code pushed to GitHub
- [ ] (Optional) API keys for trend data sources

---

## Part 1: Set Up Supabase Backend

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Click "New Project"**
3. **Fill in details**:
   - Name: `trendpulse-backend` (or your choice)
   - Database Password: **Generate and SAVE it!** (you'll need this)
   - Region: Choose closest to you (e.g., US West, Europe Central)
   - Plan: **Free** tier is fine
4. **Click "Create new project"**
5. **Wait ~2 minutes** for initialization

---

### Step 2: Get Supabase Credentials

1. In your new Supabase project, click **⚙️ Settings** (left sidebar)
2. Click **API** in the settings menu
3. **Copy these two values** (save them in a note):

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGc... (very long token)
   ```

**Keep these safe!** You'll use them in both local development and Lovable.

---

### Step 3: Create Database Tables

1. **Go to SQL Editor**:
   - Click **SQL Editor** icon (📊) in left sidebar
   - Click **"+ New query"** button

2. **Copy the SQL script** from `LOVABLE_SUPABASE_SETUP.md` (lines 86-253) or use this:

<details>
<summary>Click to expand SQL script</summary>

```sql
-- ========================================
-- TrendPulse Database Schema
-- Centralized backend with API configuration
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- API CONFIGURATION TABLE
-- Stores centralized API keys (server-side only)
-- ========================================
CREATE TABLE IF NOT EXISTS api_configuration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exa_api_key TEXT,
  reddit_client_id TEXT,
  reddit_client_secret TEXT,
  rapidapi_key TEXT,
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- SUPPLEMENTS TABLE
-- Stores individual supplement trends
-- ========================================
CREATE TABLE IF NOT EXISTS supplements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  description TEXT NOT NULL,
  trend_data INTEGER[] NOT NULL,
  discussion_links JSONB DEFAULT '{}'::jsonb,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- SUPPLEMENT COMBINATIONS TABLE
-- Stores supplement stacks and protocols
-- ========================================
CREATE TABLE IF NOT EXISTS supplement_combinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  supplement_ids TEXT[] NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  trend_data INTEGER[] NOT NULL,
  references TEXT[] NOT NULL DEFAULT '{}',
  discussion_links JSONB DEFAULT '{}'::jsonb,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- EMERGING SIGNALS TABLE
-- Stores early research signals
-- ========================================
CREATE TABLE IF NOT EXISTS emerging_signals (
  id TEXT PRIMARY KEY,
  compound_name TEXT NOT NULL,
  category TEXT NOT NULL,
  research_phase TEXT NOT NULL,
  confidence_score DECIMAL NOT NULL,
  time_to_trend TEXT NOT NULL,
  signal_strength DECIMAL NOT NULL,
  research_summary TEXT NOT NULL,
  potential_benefits TEXT[] NOT NULL DEFAULT '{}',
  research_links TEXT[] NOT NULL DEFAULT '{}',
  emergence_score DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_supplements_category ON supplements(category);
CREATE INDEX IF NOT EXISTS idx_supplements_trend ON supplements(trend_direction);
CREATE INDEX IF NOT EXISTS idx_supplements_popularity ON supplements(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_supplements_updated ON supplements(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_combinations_popularity ON supplement_combinations(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_combinations_updated ON supplement_combinations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_signals_category ON emerging_signals(category);
CREATE INDEX IF NOT EXISTS idx_signals_confidence ON emerging_signals(confidence_score DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE api_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emerging_signals ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES - PUBLIC READ ACCESS
-- Anyone can view supplements and trends
-- ========================================
DROP POLICY IF EXISTS "Public supplements read" ON supplements;
CREATE POLICY "Public supplements read" 
  ON supplements FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public combinations read" ON supplement_combinations;
CREATE POLICY "Public combinations read" 
  ON supplement_combinations FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public signals read" ON emerging_signals;
CREATE POLICY "Public signals read" 
  ON emerging_signals FOR SELECT 
  USING (true);

-- ========================================
-- RLS POLICIES - API CONFIG (READ ONLY)
-- Allow reading API keys (for backend use)
-- ========================================
DROP POLICY IF EXISTS "Public API config read" ON api_configuration;
CREATE POLICY "Public API config read" 
  ON api_configuration FOR SELECT 
  USING (true);

-- ========================================
-- ADMIN POLICIES - FOR DATA UPDATES
-- Allow service role to write supplement data
-- ========================================
DROP POLICY IF EXISTS "Service role supplements write" ON supplements;
CREATE POLICY "Service role supplements write" 
  ON supplements FOR ALL 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role combinations write" ON supplement_combinations;
CREATE POLICY "Service role combinations write" 
  ON supplement_combinations FOR ALL 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role signals write" ON emerging_signals;
CREATE POLICY "Service role signals write" 
  ON emerging_signals FOR ALL 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role API config write" ON api_configuration;
CREATE POLICY "Service role API config write" 
  ON api_configuration FOR ALL 
  USING (true)
  WITH CHECK (true);

-- ========================================
-- INSERT DEFAULT API CONFIGURATION ROW
-- Creates a single row for storing API keys
-- ========================================
INSERT INTO api_configuration (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
```
</details>

3. **Run the script**:
   - Click **"Run"** button (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

4. **Verify tables**:
   - Click **Table Editor** (📋) in left sidebar
   - You should see 4 tables:
     - `api_configuration`
     - `supplements`
     - `supplement_combinations`
     - `emerging_signals`

---

### Step 4: Add API Keys to Supabase (Optional but Recommended)

To get real trend data, you'll need API keys. Here's where to get them:

**API Key Sources:**
- **EXA API**: https://exa.ai/ (Free tier available)
- **Reddit API**: https://www.reddit.com/prefs/apps (Free)
- **OpenAI**: https://platform.openai.com/api-keys (For chatbot - pay-per-use)

**Add keys to Supabase:**

1. **Option A: Via Table Editor**:
   - Go to **Table Editor** → `api_configuration`
   - Click the single row
   - Fill in your API keys
   - Click **Save**

2. **Option B: Via SQL**:
   ```sql
   UPDATE api_configuration
   SET 
     exa_api_key = 'your-exa-key-here',
     reddit_client_id = 'your-reddit-client-id',
     reddit_client_secret = 'your-reddit-secret',
     openai_api_key = 'sk-your-openai-key',
     updated_at = now()
   WHERE id = '00000000-0000-0000-0000-000000000001';
   ```

**Note**: Without API keys, the app will still work but won't fetch live data.

---

## Part 2: Connect to Lovable

### Step 5: Push Code to GitHub

1. **Make sure your code is on GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Lovable deployment"
   git push origin main
   ```

2. **Verify `.env` is NOT committed**:
   - Check your `.gitignore` includes `.env`
   - Make sure `.env` doesn't appear in your GitHub repo

---

### Step 6: Import Project to Lovable

1. **Go to Lovable**: https://lovable.dev
2. **Sign in** with your GitHub account
3. **Click "New Project"** or **"Import from GitHub"**
4. **Select your TrendPulse repository**
5. **Wait for import** to complete

---

### Step 7: Add Environment Variables in Lovable

This is the **most important step**!

1. **In Lovable, go to your project settings**:
   - Click on **Settings** or **Environment Variables**

2. **Add these two variables**:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   ```
   
   *(Use the values you copied from Supabase in Step 2)*

3. **Save** the environment variables

4. **Redeploy** your Lovable project (if needed)

---

### Step 8: Test Your Connection

1. **Open your Lovable app** in the browser
2. **Check for success**:
   - ✅ No "Supabase not configured" banner
   - ✅ App loads without errors
   - ✅ You see the TrendPulse interface

3. **If you see errors**:
   - Double-check environment variables match exactly
   - Verify Supabase URL and key are correct
   - Check browser console for specific errors

---

## Part 3: Add Sample Data (Optional)

To test with sample data before setting up real APIs:

### Option A: Add Sample Supplement Manually

1. **Go to Supabase** → **Table Editor** → `supplements`
2. **Click "Insert row"**
3. **Fill in**:
   ```
   id: "vitamin-d3"
   name: "Vitamin D3"
   category: "vitamin"
   trend_direction: "rising"
   popularity_score: 85
   description: "Essential vitamin for bone health and immune function"
   trend_data: [70, 75, 80, 85]
   discussion_links: {}
   ```
4. **Click "Save"**

### Option B: Use SQL to Insert Sample Data

```sql
INSERT INTO supplements (id, name, category, trend_direction, popularity_score, description, trend_data)
VALUES 
  ('vitamin-d3', 'Vitamin D3', 'vitamin', 'rising', 85, 'Essential vitamin for bone health and immune function', '{70, 75, 80, 85}'),
  ('magnesium-glycinate', 'Magnesium Glycinate', 'mineral', 'rising', 78, 'Highly bioavailable magnesium for sleep and relaxation', '{65, 70, 75, 78}'),
  ('lions-mane', 'Lions Mane Mushroom', 'nootropic', 'rising', 92, 'Cognitive enhancement and neuroprotection', '{80, 85, 90, 92}');

INSERT INTO supplement_combinations (id, name, description, purpose, supplement_ids, trend_direction, popularity_score, trend_data, references)
VALUES 
  ('sleep-stack', 'Deep Sleep Stack', 'Comprehensive sleep optimization protocol', 'Improve sleep quality and duration', '{magnesium-glycinate, vitamin-d3}', 'rising', 88, '{75, 80, 85, 88}', '{}');
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  👤 You (Admin)                         │
│  - Configure API keys in Supabase      │
│  - Update trends manually/scheduled     │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  📊 Supabase Backend                    │
│  ├─ api_configuration (API keys)       │
│  ├─ supplements (trends)                │
│  ├─ supplement_combinations (stacks)    │
│  └─ emerging_signals (research)         │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  🌐 Lovable Deployment                  │
│  - TrendPulse app                       │
│  - Environment variables configured     │
│  - Connected to Supabase                │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  👥 Users                                │
│  - View daily trends (read-only)        │
│  - Use AI chatbot                       │
│  - Filter and sort supplements          │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### ❌ "Supabase not configured" banner still showing

**Fix:**
1. Verify environment variables in Lovable settings
2. Make sure variable names are exactly:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy the Lovable project
4. Hard refresh browser (Ctrl/Cmd + Shift + R)

### ❌ "Failed to fetch supplements"

**Fix:**
1. Check that SQL script ran successfully
2. Verify RLS policies were created
3. Add sample data to test (see Part 3)
4. Check Supabase logs for errors

### ❌ Chatbot not working

**Fix:**
1. Make sure you added OpenAI API key to `api_configuration` table
2. Check OpenAI API key is valid
3. Verify you have credits in OpenAI account
4. Fallback: The app will use Spark's built-in LLM if OpenAI fails

---

## Complete Checklist

### Supabase Setup
- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL
- [ ] Copied anon key
- [ ] Ran SQL setup script
- [ ] Verified 4 tables created
- [ ] Added API keys to `api_configuration` table
- [ ] (Optional) Added sample data

### Lovable Setup
- [ ] Pushed code to GitHub
- [ ] Imported project to Lovable
- [ ] Added `VITE_SUPABASE_URL` environment variable
- [ ] Added `VITE_SUPABASE_ANON_KEY` environment variable
- [ ] Redeployed project
- [ ] Tested app loads without errors

### Testing
- [ ] App loads on Lovable
- [ ] No Supabase error banner
- [ ] Can see supplements (if data added)
- [ ] Chatbot responds (if OpenAI key added)
- [ ] No console errors

---

## Next Steps

### Populate Real Data

Once connected, you can populate real trend data by:

1. **Manual Updates**: Use Supabase Table Editor or SQL
2. **Automated Scripts**: Set up a scheduled job to fetch trends
3. **Edge Functions**: Use Supabase Edge Functions for automation

See `BACKEND_ARCHITECTURE.md` for more details on data updates.

---

## Support Resources

- **This Project**:
  - `LOVABLE_SUPABASE_SETUP.md` - Detailed setup guide
  - `SUPABASE_TROUBLESHOOTING.md` - Common issues
  - `BACKEND_ARCHITECTURE.md` - Architecture overview

- **External Docs**:
  - [Supabase Documentation](https://supabase.com/docs)
  - [Lovable Documentation](https://docs.lovable.dev)
  - [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Success!

Once you complete all the steps above, you'll have:
- ✅ TrendPulse running on Lovable
- ✅ Connected to your Supabase backend
- ✅ Secure API key storage
- ✅ Ready for users to view trends

**Questions?** Review the troubleshooting section or check the other documentation files.
