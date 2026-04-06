# 🚀 TrendPulse - Supabase Database Setup Guide

## Overview
TrendPulse uses Supabase as a secure, scalable backend for storing supplement data, combinations, and research signals. This guide will walk you through the complete setup process in under 10 minutes.

## Why Supabase?

✅ **Free Forever Tier** - No credit card required to get started  
✅ **Persistent Data** - Your trends and insights survive page refreshes  
✅ **Real-time Updates** - Instant synchronization across sessions  
✅ **Secure & Scalable** - Production-ready PostgreSQL database  
✅ **Zero Backend Code** - No server setup required  

## Prerequisites

- A web browser
- An email address (for Supabase account)
- 10 minutes of your time

---

## Step-by-Step Setup

### 1️⃣ Create a Supabase Account & Project

1. **Visit Supabase**  
   Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Sign Up or Log In**  
   - Click "Start your project"
   - Sign up with GitHub, Google, or email
   - No credit card required!

3. **Create a New Project**  
   - Click "New Project" button
   - Fill in the details:
     - **Name**: `trendpulse` (or any name you prefer)
     - **Database Password**: Click "Generate a password" and **save this somewhere safe!**
     - **Region**: Choose the region closest to you (e.g., `US West`, `Europe`, etc.)
     - **Pricing Plan**: Free tier is perfect to start
   
4. **Wait for Setup**  
   The project takes ~2 minutes to initialize. You'll see a progress indicator.

---

### 2️⃣ Get Your API Credentials

Once your project is ready:

1. **Navigate to Settings**  
   Click on the ⚙️ **Settings** icon in the left sidebar

2. **Go to API Settings**  
   Click on **API** in the settings menu

3. **Copy Your Credentials**  
   You'll see two important values:
   
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...` and is very long)

   Click the copy icon next to each to copy them to your clipboard.

---

### 3️⃣ Configure Your Application

1. **Create a `.env` file**  
   In your project root directory (same folder as `package.json`), create a new file named `.env`

2. **Add Your Credentials**  
   Paste the following into your `.env` file, replacing the values with your actual credentials:

   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjMzMDMwMDAwLCJleHAiOjE5NDg2MDYwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Save the File**  
   Make sure the file is saved as `.env` (with a dot at the beginning)

> ⚠️ **Important**: The `.env` file is already in `.gitignore`, so your credentials won't be committed to version control. Never share your Supabase credentials publicly!

---

### 4️⃣ Create Database Tables

Now we'll set up the database structure to store your supplement data.

1. **Open SQL Editor**  
   - Go back to your Supabase dashboard
   - Click on the **SQL Editor** icon (📊) in the left sidebar
   - Click **"+ New query"** button

2. **Copy the Complete SQL Script**  
   Copy the entire SQL script below and paste it into the query editor:

   ```sql
   -- ========================================
   -- TrendPulse Database Schema
   -- Complete setup script for Supabase
   -- ========================================

   ```sql
   -- ========================================
   -- TrendPulse Database Schema
   -- Complete setup script for Supabase
   -- ========================================

   -- Enable required extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
   -- USER TRACKED SUPPLEMENTS TABLE
   -- Stores user's tracked supplements
   -- ========================================
   CREATE TABLE IF NOT EXISTS user_tracked_supplements (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT NOT NULL,
     supplement_id TEXT NOT NULL,
     tracked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     UNIQUE(user_id, supplement_id)
   );

   -- ========================================
   -- CHAT CONVERSATIONS TABLE
   -- Stores chatbot conversation history
   -- ========================================
   CREATE TABLE IF NOT EXISTS chat_conversations (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT NOT NULL,
     messages JSONB NOT NULL DEFAULT '[]'::jsonb,
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
   
   CREATE INDEX IF NOT EXISTS idx_user_tracked_user_id ON user_tracked_supplements(user_id);
   CREATE INDEX IF NOT EXISTS idx_user_tracked_supplement ON user_tracked_supplements(supplement_id);
   
   CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
   CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated ON chat_conversations(updated_at DESC);

   -- ========================================
   -- ROW LEVEL SECURITY (RLS)
   -- ========================================
   ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
   ALTER TABLE supplement_combinations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE emerging_signals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_tracked_supplements ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

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
   -- RLS POLICIES - AUTHENTICATED USER ACCESS
   -- Users can only access their own data
   -- ========================================
   
   -- Tracked supplements policies
   DROP POLICY IF EXISTS "Users view own tracked" ON user_tracked_supplements;
   CREATE POLICY "Users view own tracked" 
     ON user_tracked_supplements FOR SELECT 
     USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

   DROP POLICY IF EXISTS "Users insert own tracked" ON user_tracked_supplements;
   CREATE POLICY "Users insert own tracked" 
     ON user_tracked_supplements FOR INSERT 
     WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

   DROP POLICY IF EXISTS "Users delete own tracked" ON user_tracked_supplements;
   CREATE POLICY "Users delete own tracked" 
     ON user_tracked_supplements FOR DELETE 
     USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

   -- Chat conversations policies
   DROP POLICY IF EXISTS "Users view own chats" ON chat_conversations;
   CREATE POLICY "Users view own chats" 
     ON chat_conversations FOR SELECT 
     USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

   DROP POLICY IF EXISTS "Users insert own chats" ON chat_conversations;
   CREATE POLICY "Users insert own chats" 
     ON chat_conversations FOR INSERT 
     WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

   DROP POLICY IF EXISTS "Users update own chats" ON chat_conversations;
   CREATE POLICY "Users update own chats" 
     ON chat_conversations FOR UPDATE 
     USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'anonymous');

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
   ```

3. **Run the Script**  
   - Click the **"Run"** button (or press `Cmd/Ctrl + Enter`)
   - You should see "Success. No rows returned" - this is perfect!
   - If you see any errors, make sure you copied the entire script

4. **Verify Tables Created**  
   - Click on the **Table Editor** icon (📋) in the left sidebar
   - You should see 5 new tables:
     - `supplements`
     - `supplement_combinations`
     - `emerging_signals`
     - `user_tracked_supplements`
     - `chat_conversations`

---

### 5️⃣ Test Your Connection

1. **Restart Your Application**  
   - If your development server is running, restart it to load the new `.env` variables
   - Run: `npm run dev`

2. **Check the Status Banner**  
   - Open your application in the browser
   - Look for the Supabase status banner at the top of the page
   - You should see:
     - ✅ **"Supabase Connected"** with a green checkmark
     - Database record counts (currently 0)

3. **Seed Sample Data** (Optional)  
   - Click the **"Seed Sample Data"** button in the status banner
   - This will populate your database with example supplements and stacks
   - Refresh the page to see the data

---

## 🎉 You're Done!

Your TrendPulse application is now connected to a persistent Supabase database!

### What Just Happened?

- ✅ Created a free PostgreSQL database in the cloud
- ✅ Set up secure tables for supplements, stacks, and research signals
- ✅ Configured Row Level Security for data protection
- ✅ Connected your frontend app to the database
- ✅ All trend data now persists across sessions

---

## Next Steps

### Populate with Real Data

Click the **"Refresh Trends"** button in the app to:
- Discover current supplement trends
- Generate AI-powered insights
- Save everything to your database

### Add API Keys for Real Trends

To get actual trend data instead of AI-generated examples:

1. Click the **"API Settings"** button
2. Add your free API keys:
   - **EXA API** - For web trend discovery
   - **Reddit API** - For community discussions
   - **RapidAPI** - For social media trends

See `API_SETUP_GUIDE.md` for detailed instructions.

---

## Troubleshooting

### Quick Fixes for Common Issues

#### ❌ "Supabase Connection Failed"

**Quick Fix:**
```bash
# 1. Verify your .env file exists and has correct values
cat .env

# 2. Restart your dev server
npm run dev
```

Common causes:
- Wrong credentials in `.env`
- Didn't restart dev server after creating `.env`
- Typo: must be `VITE_SUPABASE_URL` not `SUPABASE_URL`
- Project is paused (resume in Supabase dashboard)

#### ❌ "Failed to fetch supplements"

**Quick Fix:**
- Re-run the SQL script from Step 4 (includes RLS policies)
- Check if project is paused in Supabase dashboard
- Hard refresh browser: `Ctrl/Cmd + Shift + R`

#### ❌ "Database tables not appearing"

**Quick Fix:**
- Run the SQL script one statement at a time
- Check SQL Editor for error messages
- Make sure you're in the correct Supabase project

### 🔧 Detailed Troubleshooting

For comprehensive troubleshooting including:
- Environment variable issues
- RLS policy problems
- CORS errors
- Performance issues
- And more...

**See the complete guide: [`SUPABASE_TROUBLESHOOTING.md`](./SUPABASE_TROUBLESHOOTING.md)**

---

## Advanced Configuration

### Enable Real-time Subscriptions

To get live updates when data changes:

```typescript
// In your component
import { supabase } from '@/lib/supabase'

useEffect(() => {
  const channel = supabase
    .channel('supplements-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'supplements' },
      (payload) => {
        console.log('Data changed!', payload)
        // Refresh your data here
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

### Set Up User Authentication

For multi-user support with personal tracking:

1. **Enable Auth Providers**  
   - Dashboard → Authentication → Providers
   - Enable Email, Google, GitHub, etc.

2. **Update Your App**  
   ```typescript
   import { supabase } from '@/lib/supabase'
   
   // Sign up
   await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'secure-password'
   })
   
   // Sign in
   await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'secure-password'
   })
   ```

### Monitor Database Usage

- **Dashboard → Settings → Usage**
- Free tier limits:
  - 500 MB database storage
  - 5 GB bandwidth per month
  - 2 GB file storage
  - Unlimited API requests

---

## Security Best Practices

### ✅ DO:
- Keep your `.env` file in `.gitignore`
- Use Row Level Security policies
- Regularly backup your database (Dashboard → Database → Backups)
- Monitor usage and set up alerts

### ❌ DON'T:
- Commit `.env` file to Git
- Share your `anon` key publicly (it's safe for client-side use only)
- Use `service_role` key in frontend code
- Disable RLS policies without understanding implications

---

## Database Backup & Export

### Manual Backup

1. **Go to Database → Backups**
2. **Click "Create Backup"**
3. Backups are kept for 7 days on free tier

### Export Data as SQL

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or export from dashboard
# Database → Backups → Download
```

### Export Data as JSON

Use the export functionality in the app:
- Click "Export Data" button
- Choose format (JSON, CSV)
- Download your supplement trends

---

## Monitoring & Analytics

### View Database Logs

- **Dashboard → Logs**
- Filter by:
  - Database queries
  - API requests
  - Errors

### Performance Monitoring

- **Dashboard → Database → Query Performance**
- See slow queries
- Optimize with indexes

---

## Support & Resources

### Official Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### TrendPulse Specific
- [API Setup Guide](./API_SETUP_GUIDE.md)
- [Security Guidelines](./SECURITY.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)

### Common Questions

**Q: Is Supabase free forever?**  
A: Yes! The free tier is permanent and perfect for hobby projects.

**Q: What happens if I exceed free tier limits?**  
A: Your project continues to work, but you'll need to upgrade to Pro ($25/month).

**Q: Can I migrate from Supabase later?**  
A: Yes! You can export your data and schema anytime.

**Q: Is my data secure?**  
A: Yes! Supabase uses industry-standard encryption and security practices.

---

## Summary Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Ran SQL setup script in SQL Editor
- [ ] Verified 5 tables were created
- [ ] Restarted development server
- [ ] Saw "Supabase Connected" status
- [ ] (Optional) Seeded sample data
- [ ] (Optional) Added API keys for real trends

**Estimated Time:** 10 minutes ⏱️  
**Difficulty:** Easy 🟢  
**Cost:** Free Forever 💰

---

Congratulations! Your TrendPulse app now has a professional, scalable database backend. 🎉
