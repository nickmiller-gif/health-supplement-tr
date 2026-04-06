# Supabase Configuration Verification Guide

## Overview

TrendPulse now includes a comprehensive Supabase verification tool that will help you confirm your database is configured correctly. This tool checks:

- **Database Connection**: Verifies your Supabase credentials
- **Table Schema**: Confirms all required tables exist and are accessible
- **Data Status**: Shows record counts and last update times
- **Configuration Source**: Identifies whether you're using environment variables or KV storage

## How to Verify Your Configuration

### Step 1: Access the Admin Dashboard

1. Click the **"Admin"** button in the top right of the TrendPulse homepage
2. You must be the app owner to access this dashboard

### Step 2: Navigate to Verification Tab

1. In the Admin Dashboard, you'll see 4 tabs at the top
2. Click on the **"Verify"** tab (second tab with the checkmark icon)

### Step 3: Run Verification

1. Click the **"Run Verification"** button
2. The tool will test your Supabase configuration
3. Results will appear in seconds

## Understanding the Results

### Database Connection

✅ **Success**: Shows your Supabase URL and configuration source
- "Environment Variables" = Configured in Lovable (recommended for deployment)
- "KV Storage" = Configured in the Admin Dashboard

❌ **Error**: No credentials found
- Go to "Connections" tab and configure your Supabase settings

### Database Tables

The verification checks these 5 required tables:

1. **supplements** - Stores trending supplement data
2. **supplement_combinations** - Stores supplement stacks
3. **emerging_signals** - Stores research-based predictions
4. **user_tracked_supplements** - User tracking data (optional)
5. **chat_conversations** - Chat history storage (optional)

#### Possible Results:

✅ **"Table accessible"**: Perfect! Table exists and is working
❌ **"Table does not exist"**: Run the SQL schema (see below)
❌ **"Permission denied"**: Check your RLS policies or API key

### Data Status

Shows you:
- **Supplements count**: Total number of supplements in database
- **Combinations count**: Total number of stacks in database
- **Last Data Update**: When the data was last refreshed

⚠️ **Warning**: If it's been more than 24 hours since last update
- Consider running a manual update in the "Trend Scheduler" tab

## Common Issues and Solutions

### ❌ "Table does not exist"

**Solution**: Run the SQL schema in your Supabase project

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file `SUPABASE_SCHEMA_UPDATE.sql` in this project
4. Copy the entire SQL script
5. Paste it into the Supabase SQL Editor
6. Click **"Run"**
7. Return to TrendPulse and click "Run Verification" again

### ❌ "Permission denied"

**Solution**: Check your Row Level Security (RLS) policies

Your tables should have RLS enabled with policies that allow:
- Public read access (`SELECT`)
- Service role write access (handled by your API keys)

Or you can disable RLS for now (not recommended for production):

```sql
ALTER TABLE supplements DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE emerging_signals DISABLE ROW LEVEL SECURITY;
```

### ❌ "No Supabase credentials configured"

**Solution**: Add your credentials

**Option 1: Via Admin Dashboard (Quick Start)**
1. Go to "Connections" tab
2. Click "Supabase Database"
3. Enter your Project URL and anon key
4. Click "Save Supabase Configuration"

**Option 2: Via Environment Variables (Recommended for Lovable)**
1. Get your credentials from Supabase → Settings → API
2. In Lovable, go to Settings → Environment Variables
3. Add:
   - `VITE_SUPABASE_URL` = Your project URL
   - `VITE_SUPABASE_ANON_KEY` = Your anon/public key

### ⚠️ "Last updated X days ago" or "No data in database"

**Solution**: Run the trend updater

1. Go to the "Trend Scheduler" tab
2. Click **"Run Update Now"**
3. Wait for the update to complete (may take 1-2 minutes)
4. Return to "Verify" tab and check data status again

## What Happens After Successful Verification?

Once all checks pass:

✅ Your Supabase database is properly connected
✅ All tables are created and accessible
✅ The app can store and retrieve trend data
✅ Daily automated updates will populate new data
✅ Users can see real trending supplements (not demo data)
✅ The chatbot can query actual data

## Next Steps After Verification

1. **Run Initial Data Update**
   - Go to "Trend Scheduler" tab
   - Click "Run Update Now" to populate your database

2. **Configure API Keys** (for real trend discovery)
   - Go to "Connections" → "API Keys" tab
   - Add EXA, OpenAI, or other API keys
   - These enable real trend discovery from Reddit, forums, etc.

3. **Set Up Automated Updates**
   - The app will automatically update trends daily
   - Check the "Trend Scheduler" tab to see when next update runs

4. **Share Your App**
   - Once verified, your app is ready to share
   - All users will see the same centralized data
   - No per-user configuration needed

## FAQ

**Q: Do I need to configure Supabase for each user?**
A: No! Supabase is configured once by the app owner. All users access the same centralized database.

**Q: Can I use the app without Supabase?**
A: Yes, but you'll only see demo/mock data. To get real trends, you need Supabase.

**Q: What's the difference between Environment Variables and KV Storage?**
A: 
- **Environment Variables**: Set in Lovable, better for production deployment
- **KV Storage**: Set in Admin Dashboard, good for quick testing

**Q: How often should I run verification?**
A: Run it once after initial setup, and again if you encounter any database errors.

**Q: All tables show "Success" but I still see demo data?**
A: Run a manual trend update in the "Trend Scheduler" tab to populate real data.

## Support

If you continue to have issues after following this guide:

1. Check the browser console for error messages
2. Verify your Supabase project is active (not paused)
3. Ensure you're using the correct anon key (not the service role key)
4. Review the `SUPABASE_SETUP.md` for detailed setup instructions

---

**Pro Tip**: Bookmark the verification page! It's a quick way to check your database health at any time.
