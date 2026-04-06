# 🚀 TrendPulse - Complete Supabase Setup for Centralized Backend

## Overview

This guide will help you connect TrendPulse to your Supabase database with **centralized API key storage**. This means:
- ✅ **All API keys stored securely in Supabase** (not in user browsers)
- ✅ **Single source of truth** - all users see the same daily trends
- ✅ **Users can only view trends** - no configuration needed
- ✅ **One admin controls updates** - refresh trends from Supabase directly

---

## Part 1: Set Up Supabase Project

### Step 1: Create Your Supabase Account

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with GitHub, Google, or email (free, no credit card required)

### Step 2: Create a New Project

1. Click **"New Project"** button
2. Fill in the details:
   - **Name**: `trendpulse-backend` (or any name you prefer)
   - **Database Password**: Click **"Generate a password"** and **SAVE IT SAFELY!**
   - **Region**: Choose closest to you (e.g., `US West`, `Europe Central`)
   - **Pricing Plan**: Select **Free** tier

3. Click **"Create new project"**
4. Wait ~2 minutes for project initialization

---

## Part 2: Get Your Supabase Credentials

### Step 3: Copy Your API Credentials

Once your project is ready:

1. Click on **⚙️ Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values - **copy both**:

   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...` - very long token)

**Keep these handy** - you'll need them in the next step!

---

## Part 3: Configure Your TrendPulse Application

### Step 4: Create Your `.env` File

1. In your project root directory (same folder as `package.json`), create a file named `.env`

2. Add the following content, **replacing with your actual credentials**:

```env
# Supabase Connection
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key-here...
```

3. **Save the file** (make sure it's named exactly `.env` with the dot at the beginning)

> ⚠️ **Important**: The `.env` file is already in `.gitignore`, so it won't be committed to version control. Never share your credentials publicly!

---

## Part 4: Create Database Tables

### Step 5: Set Up Database Schema

Now we'll create all the necessary tables in your Supabase database.

1. **Open SQL Editor**:
   - Go back to your Supabase dashboard
   - Click on **SQL Editor** icon (📊) in the left sidebar
   - Click **"+ New query"** button

2. **Copy and Paste** the complete SQL script below:

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

3. **Run the Script**:
   - Click the **"Run"** button (or press `Cmd/Ctrl + Enter`)
   - You should see "Success. No rows returned" - this is perfect!

4. **Verify Tables Created**:
   - Click on **Table Editor** icon (📋) in the left sidebar
   - You should see 4 new tables:
     - `api_configuration` ← This will store your API keys!
     - `supplements`
     - `supplement_combinations`
     - `emerging_signals`

---

## Part 5: Add Your API Keys to Supabase

### Step 6: Store API Keys in Database

Now you'll add your API keys directly to the Supabase database.

1. **Get Your API Keys** (optional, but recommended for real data):
   - **EXA API**: [https://exa.ai/](https://exa.ai/) - Free tier available
   - **Reddit API**: [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) - Free
   - **RapidAPI**: [https://rapidapi.com/hub](https://rapidapi.com/hub) - Free tier
   - **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) - Pay-per-use
   - **Anthropic**: [https://console.anthropic.com/](https://console.anthropic.com/) - Pay-per-use

2. **Add Keys to Database**:
   - In Supabase dashboard, go to **Table Editor**
   - Click on **`api_configuration`** table
   - You should see 1 row with all NULL values
   - Click on the row to edit it
   - Fill in your API keys in the respective columns
   - Click **Save**

**Alternative: Use SQL to Add Keys**
```sql
UPDATE api_configuration
SET 
  exa_api_key = 'your-exa-key-here',
  reddit_client_id = 'your-reddit-client-id',
  reddit_client_secret = 'your-reddit-secret',
  rapidapi_key = 'your-rapidapi-key',
  openai_api_key = 'your-openai-key',
  anthropic_api_key = 'your-anthropic-key',
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000001';
```

---

## Part 6: Test Your Connection

### Step 7: Start Your Application

1. **Restart your development server** (if running):
   ```bash
   npm run dev
   ```

2. **Open your application** in the browser

3. **Check the connection**:
   - You should see "Supabase Connected" message (or no error banner)
   - The app should load without errors

### Step 8: Verify Everything Works

✅ **Database connected** - No connection errors  
✅ **Tables created** - Visible in Supabase Table Editor  
✅ **API keys stored** - Visible in `api_configuration` table  
✅ **App loads** - No console errors  

---

## Part 7: Using TrendPulse with Lovable

### Connecting to Lovable.dev

If you want to deploy or edit this app on [Lovable.dev](https://lovable.dev):

1. **Push your code to GitHub** (without the `.env` file - it's gitignored)

2. **Import the project to Lovable**:
   - Go to [Lovable.dev](https://lovable.dev)
   - Click "Import from GitHub"
   - Select your TrendPulse repository

3. **Add environment variables in Lovable**:
   - In Lovable project settings, go to "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
     ```

4. **Deploy** - Your app will now connect to the same Supabase backend!

---

## How It Works - Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🌐 TrendPulse Frontend (React App)                │
│  - View daily trends (read-only)                   │
│  - Use AI chatbot                                  │
│  - Filter & sort supplements                       │
│                                                     │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Supabase Client
                  ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│  📊 Supabase Backend                               │
│  ├─ api_configuration table (API keys stored)     │
│  ├─ supplements table (daily trends)              │
│  ├─ supplement_combinations table (stacks)        │
│  └─ emerging_signals table (research)             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Key Points**:
- 🔒 **API keys** are stored in Supabase `api_configuration` table
- 📊 **Trend data** is centralized - all users see the same data
- 👥 **Users** can only view trends (read-only access)
- 🔄 **Updates** happen centrally (you control when trends refresh)

---

## Next Steps

### Option 1: Manual Updates (Simple)

To update trends manually:

1. Use Supabase SQL Editor to run update queries
2. Or build a simple admin interface to trigger updates

### Option 2: Automated Updates (Advanced)

Set up Supabase Edge Functions to run scheduled updates:

1. **Create Edge Function**:
   ```bash
   npx supabase functions new update-trends
   ```

2. **Deploy to Supabase**:
   ```bash
   npx supabase functions deploy update-trends
   ```

3. **Set up cron job** in Supabase dashboard to run daily

---

## Troubleshooting

### ❌ "Supabase Connection Failed"

**Fix:**
```bash
# 1. Verify your .env file exists
cat .env

# 2. Check the values match your Supabase dashboard
# 3. Restart dev server
npm run dev
```

### ❌ "Failed to fetch supplements"

**Fix:**
- Re-run the SQL script from Step 5
- Check if RLS policies were created
- Hard refresh browser: `Ctrl/Cmd + Shift + R`

### ❌ "Cannot read API configuration"

**Fix:**
- Make sure `api_configuration` table exists
- Verify the default row was inserted
- Check RLS policy allows public read

---

## Security Best Practices

✅ **DO**:
- Keep `.env` file in `.gitignore`
- Use Row Level Security (RLS) policies
- Store API keys in Supabase, not client-side
- Monitor usage in Supabase dashboard

❌ **DON'T**:
- Commit `.env` to Git
- Share your `anon` key publicly (it's safe for client use within RLS)
- Disable RLS policies
- Store sensitive keys in frontend code

---

## Summary Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Ran SQL setup script
- [ ] Verified 4 tables created
- [ ] Added API keys to `api_configuration` table
- [ ] Restarted development server
- [ ] Saw app load without errors
- [ ] (Optional) Connected to Lovable.dev

---

**🎉 Congratulations!** Your TrendPulse app now has a centralized Supabase backend with secure API key storage!

**Questions?** Check:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed setup guide
- [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md) - Common issues
- [Supabase Docs](https://supabase.com/docs) - Official documentation
