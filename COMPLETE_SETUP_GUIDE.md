# 🚀 Complete TrendPulse Setup Guide

**Get your TrendPulse app fully configured and deployed in under 30 minutes.**

---

## 📋 What You'll Set Up

1. ✅ **Supabase Database** - Centralized data storage (10 minutes)
2. ✅ **API Keys** - Trend discovery from social media & forums (10 minutes)
3. ✅ **Lovable Deployment** - Share your app with the world (5 minutes)

**Total Time: ~25 minutes** ⏱️

---

## 🎯 Quick Decision: What Do You Need?

### Minimum Setup (Free)
Just want to try it out? You need:
- ✅ Supabase account (free)
- ✅ At least ONE API: EXA (free) OR Reddit (free)

**Cost: $0/month**

### Recommended Setup
For better trend coverage:
- ✅ Supabase (free)
- ✅ EXA API (free tier: 1,000 searches/month)
- ✅ Reddit API (free, unlimited)
- ✅ OpenAI API (optional, ~$5/month with normal usage)

**Cost: $0-10/month**

### Full Setup
Maximum trend discovery:
- ✅ All of the above, plus:
- ✅ RapidAPI (for Twitter/X, TikTok, LinkedIn)
- ✅ Anthropic API (alternative to OpenAI)

**Cost: ~$20-50/month depending on usage**

---

## 🗄️ Part 1: Supabase Database (10 minutes)

### Why Supabase?
- **Free tier**: 500MB storage, perfect for this app
- **Real-time updates**: Changes sync instantly
- **Secure**: Built-in authentication and row-level security
- **Fast**: Optimized PostgreSQL database

### Setup Steps

#### 1. Create Account & Project (3 mins)

1. Go to https://supabase.com/dashboard
2. Sign up (use GitHub for fastest signup)
3. Click "New Project"
4. Fill in:
   - **Name**: `trendpulse-db`
   - **Password**: Generate & save securely
   - **Region**: Choose closest to you
   - **Plan**: Free
5. Click "Create new project"
6. Wait ~2 minutes

#### 2. Get Your Credentials (1 min)

1. Click **Settings** (gear icon) → **API**
2. Copy these two values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **Anon/Public Key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

> 💡 Paste these into a text file temporarily - you'll need them soon!

#### 3. Create Database Tables (3 mins)

1. Click **SQL Editor** → "+ New query"
2. Copy the contents of `SUPABASE_SCHEMA_UPDATE.sql` from this project
3. Paste into the SQL editor
4. Click **"Run"**
5. You should see: ✅ "Success. No rows returned"
6. Verify: Click **Table Editor** - you should see 4 tables

#### 4. Connect to Your App (2 mins)

**Option A: For Lovable (Recommended)**
- We'll add these as environment variables in Part 3

**Option B: For Local Testing**
1. Run TrendPulse locally
2. Click "Admin" → "Connections" → "Supabase Database"
3. Paste Project URL and Anon Key
4. Click "Save"

✅ **Supabase is now connected!**

---

## 🔑 Part 2: API Keys (10 minutes)

### Why API Keys?
API keys let TrendPulse discover real trends from:
- Reddit discussions (r/Supplements, r/Nootropics, r/Biohacking)
- Forums (Longecity, ExamineLearn, etc.)
- Social media (Twitter/X, TikTok, LinkedIn)
- Research papers and medical journals

### Recommended: Start with These Two (Both Free!)

#### API #1: EXA (FREE - Recommended First)

**What it does:** Searches across Reddit, forums, blogs, and the broader web

**Cost:** FREE (1,000 searches/month)

**Setup:**
1. Go to https://exa.ai
2. Sign up for free account
3. Navigate to API settings
4. Copy your API key
5. Save it (you'll add it in a moment)

#### API #2: Reddit (FREE - Great Supplement)

**What it does:** Direct access to Reddit communities

**Cost:** FREE (unlimited)

**Setup:**
1. Go to https://www.reddit.com/prefs/apps
2. Scroll down, click "Create App" or "Create Another App"
3. Fill in:
   - **Name**: TrendPulse
   - **Type**: script
   - **Description**: Supplement trend tracker
   - **Redirect URI**: http://localhost:8000
4. Click "Create app"
5. Copy:
   - **Client ID** (under app name, random chars)
   - **Client Secret** (labeled "secret")

### Optional: Add More Coverage

#### API #3: OpenAI (Optional, Pay-as-you-go)

**What it does:** Powers AI insights and predictions

**Cost:** ~$0.01-0.03 per request (~$5/month with normal usage)

**Setup:**
1. Go to https://platform.openai.com/api-keys
2. Sign up / Sign in
3. Click "Create new secret key"
4. Name it "TrendPulse"
5. Copy the key (you won't see it again!)

#### API #4: RapidAPI (Optional, Paid)

**What it does:** Access to Twitter/X, TikTok, LinkedIn

**Cost:** ~$10-30/month depending on plan

**Setup:**
1. Go to https://rapidapi.com/hub
2. Sign up
3. Subscribe to social media APIs
4. Copy your X-RapidAPI-Key from dashboard

#### API #5: Anthropic (Optional, Pay-as-you-go)

**What it does:** Claude AI for alternative insights

**Cost:** Similar to OpenAI

**Setup:**
1. Go to https://console.anthropic.com/settings/keys
2. Sign up / Sign in
3. Click "Create Key"
4. Copy the API key

### Add API Keys to Your App

**Option A: For Lovable (Part 3)**
- We'll set these up in Admin panel after deployment

**Option B: For Local Testing**
1. Run TrendPulse
2. Click "Admin" → "Connections" → "API Keys"
3. Paste each API key into its field
4. Click "Save API Keys"

✅ **API keys are now configured!**

---

## 🌐 Part 3: Deploy to Lovable (5 minutes)

### Why Lovable?
- **Instant deployment**: Push to GitHub, get a live URL
- **Free hosting**: Perfect for personal projects
- **Custom domains**: Add your own domain later
- **Auto-updates**: Push code, it deploys automatically

### Prerequisites

1. **GitHub Account**: https://github.com/signup
2. **Lovable Account**: https://lovable.dev (sign up with GitHub)
3. **Your code on GitHub**: Push this TrendPulse repo to GitHub

### Deployment Steps

#### 1. Push to GitHub (if not done already)

```bash
git init
git add .
git commit -m "Initial TrendPulse setup"
git remote add origin https://github.com/YOUR_USERNAME/trendpulse.git
git push -u origin main
```

#### 2. Import to Lovable

1. Go to https://lovable.dev
2. Sign in with GitHub
3. Click "Import from GitHub"
4. Select your TrendPulse repository
5. Click "Import"
6. Wait ~30 seconds for initial build

#### 3. Add Environment Variables

1. In Lovable, click **Settings** → **Environment Variables**
2. Add these **two** variables (from Part 1):

   ```
   Name: VITE_SUPABASE_URL
   Value: https://xxxxxxxxxxxxx.supabase.co
   (your Supabase Project URL)
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   (your Supabase Anon Key)
   ```

3. Click "Save"
4. Lovable will redeploy (~30 seconds)

#### 4. Configure API Keys in the App

1. Open your Lovable app URL (shown in Lovable dashboard)
2. Click "Admin" button (top-right)
3. You may need to authenticate as owner (sign in with GitHub)
4. Go to "Connections" → "API Keys"
5. Paste your API keys from Part 2
6. Click "Save API Keys"

#### 5. Run Your First Update

1. Still in Admin, go to "Trend Scheduler" tab
2. Click "Run Manual Update Now"
3. Wait 30-60 seconds (it's fetching real data!)
4. Go back to main app
5. 🎉 You should see real supplement trends!

✅ **Your app is live!**

---

## ✅ Verification Checklist

### Database Connection
- [ ] No "Supabase not configured" warning
- [ ] Admin → Overview shows "Database Connection: Connected"
- [ ] Supabase Table Editor shows data in `supplements` table

### API Keys
- [ ] Admin → Connections shows green checkmarks
- [ ] At least 1/6 APIs configured (minimum)
- [ ] EXA or Reddit API is set up (recommended)

### Data & Updates
- [ ] Main app shows supplement cards
- [ ] Can filter by category (Peptides, Vitamins, etc.)
- [ ] Can view supplement stacks
- [ ] Chatbot responds to questions
- [ ] Last updated time shows in header

### Deployment (if using Lovable)
- [ ] App loads at your Lovable URL
- [ ] Can access from any device
- [ ] All features work (not just showing locally)

---

## 🎨 Next Steps

### Customize Your App

1. **Change the color scheme**
   - Edit `src/index.css`
   - Modify the `:root` CSS variables

2. **Add your branding**
   - Update `index.html` title
   - Add your logo to header in `App.tsx`

3. **Schedule automated updates**
   - Admin → Trend Scheduler
   - Set daily update time (default: 8:00 AM)
   - Enable email reports (optional)

### Share Your App

1. **Get your URL**
   - Lovable provides: `https://your-app.lovable.app`
   - Or add custom domain in Lovable settings

2. **Invite users**
   - Share the URL - no signup required!
   - Users see trends and can use chatbot
   - Only you (owner) can access Admin

3. **Monitor usage**
   - Check API usage in each provider's dashboard
   - Monitor Supabase database size
   - Free tiers are generous for normal usage

---

## 🆘 Troubleshooting

### "No data showing"

**Solutions:**
1. Check API keys are configured
2. Run manual update from Admin → Trend Scheduler
3. Check browser console for errors
4. Verify Supabase connection

### "Supabase connection failed"

**Solutions:**
1. Double-check URL and key are correct
2. Ensure no extra spaces in environment variables
3. Verify tables were created (check Table Editor)
4. Try regenerating anon key in Supabase

### "API rate limit exceeded"

**Solutions:**
1. Wait for rate limit to reset (usually 1 hour)
2. Add additional APIs to distribute load
3. Reduce update frequency
4. Upgrade API plan if needed

### "Admin dashboard shows Access Denied"

**Solutions:**
1. Sign in with the GitHub account that owns the repo
2. Check that you're the app owner in Lovable
3. Clear browser cache and try again

---

## 📊 Understanding Costs

### Free Forever
- Supabase: 500MB storage, 2GB bandwidth/month
- EXA: 1,000 searches/month
- Reddit: Unlimited
- Lovable: Basic hosting (check current plans)

**This covers:** ~100-500 users/month with daily updates

### If You Exceed Free Tier

**Supabase:**
- $25/month for 8GB storage, 100GB bandwidth
- Unlikely to need this unless you have thousands of users

**EXA:**
- $10/month for 10,000 searches
- Needed if updating multiple times per day

**OpenAI:**
- Pay-as-you-go: ~$5-20/month depending on chatbot usage
- Set usage limits in OpenAI dashboard

**RapidAPI:**
- Varies by API: ~$10-50/month
- Only needed for comprehensive social media coverage

---

## 📚 More Resources

- **Detailed Supabase Setup**: `SUPABASE_CONNECTION_GUIDE.md`
- **API Setup Details**: `ALL_CONNECTIONS_SETUP.md`
- **Lovable Deployment**: `CONNECT_TO_LOVABLE.md`
- **Troubleshooting**: `SUPABASE_TROUBLESHOOTING.md`
- **Architecture**: `BACKEND_ARCHITECTURE.md`

---

## 🎉 You're Done!

Your TrendPulse app is now:
- ✅ Connected to Supabase database
- ✅ Configured with API keys
- ✅ Deployed and accessible online
- ✅ Updating automatically daily
- ✅ Ready to share with others

**Enjoy tracking supplement trends!** 🚀

---

**Questions?** Check the troubleshooting section above or review the detailed guides in the documentation.
