# 🔧 Supabase Troubleshooting Guide

Common issues when setting up Supabase for TrendPulse and how to fix them.

---

## Issue: "Supabase Connection Failed" 🔴

### Symptoms
- Red banner in app showing "Supabase Connection Failed"
- Badge shows "Offline"
- App falls back to mock data

### Solutions

#### 1. Check Environment Variables
```bash
# View your .env file
cat .env

# Should show:
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

**Common mistakes:**
- ❌ Using `SUPABASE_URL` instead of `VITE_SUPABASE_URL`
- ❌ Missing the `VITE_` prefix (required for Vite)
- ❌ Quotes around values (don't use quotes!)
- ❌ Spaces around the `=` sign
- ❌ Using placeholder values instead of real credentials

#### 2. Restart Development Server
Environment variables are only loaded on startup:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

#### 3. Verify Credentials in Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy **Project URL** and **anon public** key again
5. Update `.env` file
6. Restart server

#### 4. Check Project Status
- Make sure your Supabase project isn't paused
- Free tier projects pause after 1 week of inactivity
- Click "Resume Project" if needed

---

## Issue: "Failed to fetch supplements" ⚠️

### Symptoms
- Connected to Supabase but can't load data
- Console shows database errors
- Empty state even after seeding

### Solutions

#### 1. Verify Tables Exist
In Supabase dashboard:
1. Click **Table Editor** (📋)
2. You should see 5 tables:
   - `supplements`
   - `supplement_combinations`
   - `emerging_signals`
   - `user_tracked_supplements`
   - `chat_conversations`

If tables are missing, re-run the SQL setup script.

#### 2. Check Row Level Security (RLS) Policies
```sql
-- Run in Supabase SQL Editor to view policies:
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

You should see policies like:
- `Public supplements read`
- `Public combinations read`
- `Public signals read`

If missing, re-run the complete SQL script from `SUPABASE_SETUP.md`.

#### 3. Test Database Connection Directly
In Supabase SQL Editor:
```sql
-- Should return count of supplements
SELECT COUNT(*) FROM supplements;

-- Should return count of combinations
SELECT COUNT(*) FROM supplement_combinations;
```

If these queries fail, RLS policies are blocking access.

#### 4. Temporarily Disable RLS (for testing only!)
```sql
-- ⚠️ ONLY FOR TESTING - Re-enable for production!
ALTER TABLE supplements DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations DISABLE ROW LEVEL SECURITY;

-- Test if app works now
-- Then re-enable:
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations ENABLE ROW LEVEL SECURITY;
```

---

## Issue: Tables Not Created ❌

### Symptoms
- SQL script runs but tables don't appear
- "Relation does not exist" errors
- Empty Table Editor

### Solutions

#### 1. Run Script as Separate Statements
Instead of running the entire script at once:
1. Copy one `CREATE TABLE` statement at a time
2. Run each individually
3. Watch for specific error messages

#### 2. Check for Existing Tables
Tables might exist already. Try:
```sql
-- Drop all tables (⚠️ deletes data!)
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS user_tracked_supplements CASCADE;
DROP TABLE IF EXISTS emerging_signals CASCADE;
DROP TABLE IF EXISTS supplement_combinations CASCADE;
DROP TABLE IF EXISTS supplements CASCADE;

-- Then re-run the full setup script
```

#### 3. Enable UUID Extension First
Run this FIRST, before any CREATE TABLE statements:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Issue: "Seed Sample Data" Button Not Working 🌱

### Symptoms
- Button appears but nothing happens when clicked
- No error message
- Database still shows 0 records

### Solutions

#### 1. Check Browser Console
1. Open DevTools (F12)
2. Click Console tab
3. Click "Seed Sample Data"
4. Look for error messages

Common errors:
- RLS policy violations
- Network errors
- Invalid data format

#### 2. Manual Seeding via SQL
Run in Supabase SQL Editor:
```sql
-- Insert sample supplements
INSERT INTO supplements (id, name, category, trend_direction, popularity_score, description, trend_data, discussion_links)
VALUES 
  ('bpc-157', 'BPC-157', 'peptide', 'rising', 95, 
   'A regenerative peptide known for healing properties and tissue repair', 
   ARRAY[65, 68, 72, 75, 80, 85, 90, 95],
   '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT COUNT(*) FROM supplements;
```

#### 3. Check Service Imports
Make sure these files exist:
- `src/lib/supabase.ts`
- `src/lib/supplement-service.ts`
- `src/lib/seed-database.ts`

---

## Issue: Data Not Persisting 💾

### Symptoms
- Can add data but it disappears on refresh
- Supabase shows connected
- No error messages

### Solutions

#### 1. Verify Data in Supabase
1. Go to Table Editor in Supabase dashboard
2. Click on `supplements` table
3. Check if data is actually there
4. If missing, data isn't being written

#### 2. Check Write Permissions
Your RLS policies need to allow service role writes:

```sql
-- Add service role write policy if missing
CREATE POLICY "Service role supplements write" 
  ON supplements FOR ALL 
  USING (true)
  WITH CHECK (true);
```

#### 3. Check Upsert Function
In browser console after clicking "Refresh Trends":
```javascript
// Should see log message if configured
// "Supabase not configured: Would upsert X supplements"
// OR successful upsert
```

---

## Issue: CORS Errors 🚫

### Symptoms
- Browser console shows CORS policy errors
- Requests blocked by CORS
- Network tab shows preflight failures

### Solutions

#### 1. Verify Supabase URL Format
Must be exactly: `https://xxxxx.supabase.co`

**Wrong:**
- ❌ `xxxxx.supabase.co` (missing https://)
- ❌ `https://xxxxx.supabase.co/` (trailing slash)
- ❌ `https://app.supabase.co/project/xxxxx` (dashboard URL)

#### 2. Supabase Handles CORS Automatically
You don't need to configure CORS yourself. If you're getting CORS errors:
- Your Supabase URL is wrong
- You're hitting the wrong endpoint
- Your project is paused

---

## Issue: Slow Database Queries 🐌

### Symptoms
- App takes a long time to load data
- "Loading..." state persists
- Eventually works but slow

### Solutions

#### 1. Check Indexes
Run in SQL Editor:
```sql
-- View existing indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```

Should include indexes on:
- `supplements.popularity_score`
- `supplements.category`
- `supplements.trend_direction`

If missing, re-run the setup script.

#### 2. Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

Free tier handles up to 500MB well.

---

## Issue: Environment Variables Not Loading 🔄

### Symptoms
- `.env` file exists but app doesn't use it
- Still seeing "not configured" message
- `import.meta.env` is undefined

### Solutions

#### 1. Verify File Name
Must be exactly `.env` with a dot at the start:
- ✅ `.env`
- ❌ `env`
- ❌ `.env.local`
- ❌ `.env.txt`

Check file name:
```bash
ls -la | grep env
```

#### 2. Restart Dev Server
Vite only loads `.env` on startup:
```bash
# Kill server (Ctrl+C)
npm run dev
```

#### 3. Check Vite Config
In `vite.config.ts`, environment variables should be accessible.

Test in browser console:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
// Should print your Supabase URL
```

If undefined, your `.env` isn't being read.

---

## Issue: Multiple Projects/Confusion 🤔

### Symptoms
- Have multiple Supabase projects
- Not sure which credentials to use
- Mixed up URLs and keys

### Solutions

#### 1. Identify Your Project
In Supabase dashboard:
1. Look at URL: `https://app.supabase.com/project/xxxxx`
2. The `xxxxx` matches your Project URL
3. Each project has unique credentials

#### 2. Use Consistent Project
1. Pick ONE project for TrendPulse
2. Get credentials from that project only
3. Delete other test projects if confused

#### 3. Name Your Project Clearly
1. Go to Settings → General
2. Update name to "TrendPulse Production"
3. Easier to identify later

---

## Quick Diagnosis Checklist ✅

Run through these in order:

```bash
# 1. Check .env file exists and has content
cat .env

# 2. Verify it has VITE_ prefix
grep VITE .env

# 3. Restart dev server
npm run dev

# 4. Check browser console for errors
# (Open DevTools → Console)

# 5. Check Supabase connection in app
# Look for green "Supabase Connected" banner
```

In Supabase Dashboard:
- [ ] Project is not paused (Settings → General)
- [ ] 5 tables exist (Table Editor)
- [ ] Can run: `SELECT * FROM supplements LIMIT 1;`
- [ ] RLS policies exist (Authentication → Policies)

In Your App:
- [ ] `.env` file exists in project root
- [ ] Has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server restarted after creating `.env`
- [ ] Green "Supabase Connected" banner visible

---

## Still Having Issues? 🆘

### 1. Check Logs
**Supabase Dashboard:**
- Logs → Database logs
- Look for error messages

**Browser Console:**
- F12 → Console tab
- Filter for "supabase" or "error"

### 2. Test Minimal Example
Create `test-supabase.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <script>
    const supabase = window.supabase.createClient(
      'YOUR_SUPABASE_URL',
      'YOUR_ANON_KEY'
    )
    
    supabase.from('supplements').select('*').limit(1)
      .then(result => console.log('Success:', result))
      .catch(err => console.error('Error:', err))
  </script>
</body>
</html>
```

If this works, issue is in your app config, not Supabase.

### 3. Reset Everything
Nuclear option - start fresh:

```bash
# 1. Delete .env
rm .env

# 2. In Supabase, drop all tables
# (Run in SQL Editor)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# 3. Re-run complete setup from SUPABASE_SETUP.md
```

### 4. Ask for Help
When asking for help, provide:
- Error messages from browser console
- Error messages from Supabase logs
- Output of `cat .env` (with sensitive parts redacted)
- Screenshot of Table Editor
- Which step failed

---

## Prevention Tips 💡

### Do This:
✅ Keep `.env` in `.gitignore`  
✅ Backup your database regularly  
✅ Test after each setup step  
✅ Use descriptive project names  
✅ Enable point-in-time recovery  

### Don't Do This:
❌ Share your anon key publicly (it's OK in client code though)  
❌ Use service_role key in frontend  
❌ Disable RLS in production  
❌ Forget to restart dev server after `.env` changes  
❌ Have multiple .env files (use just one)  

---

**Need more help?** 
- [Supabase Discord](https://discord.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- Check `SUPABASE_SETUP.md` for detailed setup instructions
