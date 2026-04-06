# 🔗 Supabase Database Connection Guide

This guide will help you configure your Supabase database connection for TrendPulse in **under 10 minutes**.

---

## 🎯 Overview

TrendPulse uses Supabase as a centralized database to store:
- Daily supplement trends
- Supplement combinations (stacks)
- Emerging research signals
- AI-generated insights
- API configuration (optional)

**All users of your app will access the same database** - this is intentional. You maintain one central data source that updates daily.

---

## 📝 Prerequisites

Before you start, you need:
- [ ] A Supabase account (free tier is perfect) - [Sign up here](https://supabase.com)
- [ ] 10 minutes of time

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Supabase Project (3 minutes)

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Sign in or create a free account

2. **Create New Project**
   - Click "New Project" button
   - Fill in the details:
     - **Name**: `trendpulse-db` (or your preferred name)
     - **Database Password**: Generate a strong password
     - **Region**: Choose the region closest to you or your users
     - **Pricing Plan**: Free (500MB database, 2GB bandwidth/month)
   - Click "Create new project"
   - ⏱️ Wait 1-2 minutes for setup to complete

3. **Save Your Credentials**
   - Once the project is ready, go to **Settings** (gear icon) → **API**
   - You'll need two values:
     
     **A. Project URL**
     - Found under "Project URL"
     - Format: `https://xxxxxxxxxxxxx.supabase.co`
     - Click the copy icon to copy it
     
     **B. Anon/Public Key**
     - Found under "Project API keys" section
     - Look for the "anon" "public" key
     - It's a long string starting with `eyJ...`
     - Click the copy icon to copy it

   > ⚠️ **Save these somewhere safe!** You'll need them in the next steps.

---

### Step 2: Set Up Database Tables (3 minutes)

1. **Open SQL Editor**
   - In your Supabase project, click **SQL Editor** in the left sidebar
   - Click "**+ New query**" button

2. **Run Database Schema**
   - Open the file `SUPABASE_SCHEMA_UPDATE.sql` from your TrendPulse project
   - Copy the entire contents
   - Paste into the Supabase SQL editor
   - Click **"Run"** button (or press `Cmd/Ctrl + Enter`)
   - You should see: ✅ "Success. No rows returned"

3. **Verify Tables Were Created**
   - Click **Table Editor** in the left sidebar
   - You should see these tables:
     - ✅ `supplements`
     - ✅ `supplement_combinations`
     - ✅ `emerging_signals`
     - ✅ `api_configuration`
     - ✅ `user_tracked_supplements` (optional)
     - ✅ `chat_conversations` (optional)

---

### Step 3: Connect to Your App (2 minutes)

You have **two options** for connecting:

#### Option A: For Lovable Deployment (Recommended)

1. **In Lovable:**
   - Go to your project in Lovable
   - Click **Settings** → **Environment Variables**
   - Add these two variables:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://xxxxxxxxxxxxx.supabase.co
   (paste your Project URL from Step 1)
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGc...
   (paste your Anon/Public Key from Step 1)
   ```

2. **Save and Redeploy**
   - Click "Save"
   - Lovable will automatically redeploy your app
   - Wait 30-60 seconds for deployment

#### Option B: For Local Development

1. **Open TrendPulse App**
   - Run your app locally
   - Click the **Admin** button in the top-right corner
   - Go to **Connections** tab → **Supabase Database** tab

2. **Enter Credentials**
   - Paste your **Project URL** into the first field
   - Paste your **Anon/Public Key** into the second field
   - Click **"Save Supabase Configuration"**
   - You should see a green "Connected" badge

---

## ✅ Verification

### Check Connection Status

1. **In TrendPulse:**
   - The "Supabase not configured" warning should be gone
   - Admin Dashboard should show "Database Connection: Connected"

2. **Test with Data:**
   - Go to Admin → **Trend Scheduler** tab
   - Click "Run Manual Update Now"
   - Wait 30-60 seconds
   - Refresh the main app
   - You should see supplements appear!

3. **In Supabase:**
   - Go to **Table Editor** → `supplements` table
   - You should see rows of data after running the update

---

## 🔐 Security Notes

### Environment Variables vs KV Storage

- **Environment Variables** (Lovable): Credentials are securely stored in Lovable's infrastructure
- **KV Storage** (Local): Credentials are stored in your browser's local storage

Both methods are secure. Environment variables are recommended for production deployment.

### Single Database for All Users

- ✅ **This is intentional**: All users see the same supplement trends
- ✅ **You control the data**: Only you (the admin) can update trends
- ✅ **No user authentication needed**: Users just view data
- ⚠️ **API keys are separate**: API keys for trend discovery should ONLY be configured by you

### About the Anon Key

The "anon" key is safe to expose in your frontend app because:
- It has Row Level Security (RLS) policies that restrict what users can do
- By default, users can only READ data, not modify it
- You can customize RLS policies in Supabase if needed

---

## 🛠️ Troubleshooting

### "Supabase not configured" warning still shows

**Solutions:**
1. Double-check that both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
2. Make sure there are no extra spaces before/after the values
3. Verify the URL starts with `https://` and ends with `.supabase.co`
4. Redeploy your app in Lovable
5. Clear your browser cache and reload

### "Failed to fetch" or network errors

**Solutions:**
1. Verify your Supabase project is still active (not paused)
2. Check that your database password is saved somewhere safe
3. Ensure your internet connection is stable
4. Try regenerating the anon key in Supabase → Settings → API

### No supplements showing after update

**Solutions:**
1. Check if API keys are configured (Admin → Connections → API Keys)
2. At minimum, you need ONE of: EXA API, Reddit API, or OpenAI API
3. Run the manual update again from Admin → Trend Scheduler
4. Check the browser console for error messages

### Tables not created

**Solutions:**
1. Make sure you copied the ENTIRE SQL schema (it's long!)
2. Try running the SQL again
3. Check the SQL Editor for error messages
4. Verify you have permissions to create tables in your project

---

## 📊 Managing Your Data

### Viewing Data

1. **In Supabase:**
   - Go to **Table Editor**
   - Click on any table to view/edit data
   - You can manually add, edit, or delete rows

2. **In TrendPulse:**
   - Main app shows all supplements and combinations
   - Admin → Overview shows statistics
   - Admin → Trend Scheduler shows last update time

### Updating Data

**Automatically:**
- TrendPulse updates daily at 8:00 AM automatically
- You can configure the schedule in Admin → Trend Scheduler

**Manually:**
- Click "Run Manual Update Now" in Admin → Trend Scheduler
- This fetches the latest trends from configured APIs

**Directly in Supabase:**
- Use Table Editor to add/edit specific supplements
- Use SQL Editor to run custom queries or bulk updates

---

## 🎨 Optional: Row Level Security (RLS)

By default, the database allows:
- ✅ Anyone can READ all data (supplements, combinations, etc.)
- ❌ No one can WRITE data (except through your app's API keys)

If you want to restrict access:

1. **Go to Supabase:**
   - Click **Authentication** → **Policies**
   - Select a table (e.g., `supplements`)

2. **Enable RLS:**
   - Toggle "Enable RLS" if not already enabled

3. **Create Policies:**
   - Click "New Policy"
   - Choose a template or create custom
   - Example: Only allow reads, no writes

> 💡 For most users, the default settings are perfect!

---

## 📱 What Your Users Experience

When you share your TrendPulse app:

**Users CAN:**
- ✅ View all supplement trends
- ✅ Filter and search supplements
- ✅ View supplement combinations
- ✅ Use the AI chatbot
- ✅ See the latest data (refreshed daily)

**Users CANNOT:**
- ❌ See or modify API keys
- ❌ Modify supplement data
- ❌ Access the Admin dashboard (owner only)
- ❌ Change Supabase settings
- ❌ Trigger manual updates

**Everything is read-only for regular users!**

---

## 🔄 Next Steps

Once Supabase is connected:

1. **Configure API Keys** (if not done already)
   - Go to Admin → Connections → API Keys
   - Add at least one API (EXA or Reddit recommended)
   - See `ALL_CONNECTIONS_SETUP.md` for API setup guide

2. **Run Your First Update**
   - Go to Admin → Trend Scheduler
   - Click "Run Manual Update Now"
   - Wait for data to populate

3. **Deploy to Lovable**
   - Push your code to GitHub
   - Import to Lovable
   - Add environment variables
   - Share your app URL!

---

## 📚 Related Documentation

- **API Setup**: `ALL_CONNECTIONS_SETUP.md`
- **Lovable Deployment**: `CONNECT_TO_LOVABLE.md`
- **Quick Checklist**: `QUICK_CONNECT_CHECKLIST.md`
- **Troubleshooting**: `SUPABASE_TROUBLESHOOTING.md`
- **Full Supabase Guide**: `LOVABLE_SUPABASE_SETUP.md`

---

## 💬 Still Need Help?

Common issues are covered in `SUPABASE_TROUBLESHOOTING.md`.

For Supabase-specific issues, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

---

**Total Setup Time: ~8 minutes** ⏱️

You're all set! 🎉
