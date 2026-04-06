# 🔌 Complete Connection Setup Guide

This guide will help you configure all API connections and Supabase database for TrendPulse in one place.

## 📍 Quick Access

Click the **Admin** button in the top-right of the app header, then go to the **Connections** tab. Here you can configure:

1. **API Keys** - For trend discovery from social media and forums
2. **Supabase Database** - For centralized data storage

---

## 🔑 Part 1: API Keys Setup

### Why API Keys?

API keys enable TrendPulse to:
- Search Reddit, forums, and biohacking communities for trending supplements
- Analyze social media discussions on Twitter/X, TikTok, LinkedIn
- Generate AI-powered insights about supplements and combinations
- Predict emerging trends before they go mainstream

### Recommended APIs (in priority order)

#### 1. EXA API ⭐ **HIGHLY RECOMMENDED**

**What it does:** Best single API for comprehensive trend coverage across Reddit, forums, blogs, and the broader web.

**Cost:** FREE tier includes 1,000 searches/month. Paid tier: $10/month for 10,000 searches.

**Setup:**
1. Go to [https://exa.ai](https://exa.ai)
2. Sign up for a free account
3. Navigate to API settings
4. Copy your API key
5. Paste it into the **EXA API Key** field in the Admin → Connections tab
6. Click "Save API Keys"

**What you get:** Access to Reddit's r/Supplements, r/Nootropics, r/Biohacking, Longecity forums, examine.com discussions, and thousands of health blogs.

---

#### 2. Reddit API 🆓 **FREE**

**What it does:** Direct access to Reddit for real-time supplement discussions.

**Cost:** Completely FREE

**Setup:**
1. Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Scroll to the bottom and click "Create App" or "Create Another App"
3. Fill in:
   - **Name:** TrendPulse
   - **App type:** Select "script"
   - **Description:** Supplement trend tracker
   - **Redirect URI:** http://localhost:8000 (required, but we won't use it)
4. Click "Create app"
5. Copy the **Client ID** (under your app name, looks like random characters)
6. Copy the **Client Secret** (labeled "secret")
7. Paste both into the **Reddit API** fields in Admin → Connections
8. Click "Save API Keys"

**What you get:** Direct access to r/Supplements, r/Nootropics, r/Peptides, r/Biohacking, and other health-related subreddits.

---

#### 3. RapidAPI 💰 **PAID** (Optional)

**What it does:** Access to Twitter/X, TikTok, and LinkedIn for social media trend discovery.

**Cost:** Varies by plan (typically starts around $10-30/month)

**Setup:**
1. Go to [https://rapidapi.com/hub](https://rapidapi.com/hub)
2. Sign up for an account
3. Subscribe to social media APIs (Twitter API, TikTok API, etc.)
4. Go to your [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
5. Copy your **X-RapidAPI-Key**
6. Paste into the **RapidAPI Key** field in Admin → Connections
7. Click "Save API Keys"

**What you get:** Trending posts from TikTok health influencers, Twitter biohacking discussions, LinkedIn health professional posts.

---

#### 4. OpenAI API 🤖 **OPTIONAL**

**What it does:** Powers GPT-4 for enhanced AI insights and predictions.

**Cost:** Pay-per-use (~$0.01-0.03 per request, typically under $5/month for normal usage)

**Setup:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up / Log in
3. Click "Create new secret key"
4. Name it "TrendPulse"
5. Copy the key (you won't see it again!)
6. Paste into the **OpenAI API Key** field in Admin → Connections
7. Click "Save API Keys"

**What you get:** More sophisticated trend analysis, better predictions, higher quality insights.

---

#### 5. Anthropic API 🧠 **OPTIONAL**

**What it does:** Powers Claude 3 models as an alternative to OpenAI.

**Cost:** Pay-per-use (~$0.01-0.03 per request)

**Setup:**
1. Go to [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Sign up / Log in
3. Click "Create Key"
4. Copy the API key
5. Paste into the **Anthropic API Key** field in Admin → Connections
6. Click "Save API Keys"

**What you get:** Alternative AI analysis engine, different perspective on trends.

---

## 🗄️ Part 2: Supabase Database Setup

### Why Supabase?

Supabase provides:
- **Centralized storage** for all supplement data
- **Single source of truth** - all users see the same data
- **Automated daily updates** - trends refresh automatically
- **Fast queries** - instant search and filtering
- **Free tier** - 500MB database storage, 2GB bandwidth/month

### Setup Steps

#### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

#### Step 2: Create New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Fill in project details:
   - **Name:** trendpulse-db (or your choice)
   - **Database Password:** Generate a strong password and **save it securely**
   - **Region:** Choose closest to you or your users
   - **Pricing Plan:** Free (500MB database, perfect for this app)
4. Click "Create new project"
5. Wait 1-2 minutes for setup to complete

#### Step 3: Run Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Open the file `SUPABASE_SCHEMA_UPDATE.sql` from this project
4. Copy the entire contents
5. Paste into the Supabase SQL editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this is correct!

#### Step 4: Get Your Connection Credentials

1. In Supabase, click **Settings** (gear icon) in the left sidebar
2. Click **API** under Project Settings
3. You'll see two important values:

   **Project URL:**
   - Found under "Project URL"
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

   **Anon/Public Key:**
   - Found under "Project API keys" → "anon" "public"
   - It's a long string starting with `eyJ...`
   - Click the copy icon to copy it

#### Step 5: Add to TrendPulse

1. Go back to TrendPulse
2. Click **Admin** button → **Connections** tab → **Supabase Database** tab
3. Paste your **Project URL** into the first field
4. Paste your **Anon/Public Key** into the second field
5. Click "Save Supabase Configuration"
6. You should see the status change to "Connected" with a green indicator

---

## ✅ Verification

### Check API Status

1. Go to Admin → Connections → API Keys tab
2. You should see green checkmarks next to configured APIs
3. The badge at the top shows "X / 6 configured"

### Check Supabase Status

1. Go to Admin → Connections → Supabase Database tab
2. Look for the "Connected" badge with a pulsing green dot
3. Go to Admin → Overview tab
4. Under "System Status", "Database Connection" should show "Connected"

### Test Trend Updates

1. Go to Admin → Trend Scheduler tab
2. Click "Run Manual Update Now"
3. Wait 30-60 seconds
4. You should see supplements and stacks populate
5. Go back to main app - you should see the data!

---

## 🔒 Security Notes

### Where Are Keys Stored?

- All API keys and Supabase credentials are stored in **your browser's local storage** using the Spark KV system
- They are **never sent to external servers** except when making authorized API calls
- When you deploy to Lovable, these settings persist for all users accessing your deployment

### Sharing Your App

When you share this app via Lovable:
- ✅ Your API keys **WILL** be shared (single centralized backend)
- ✅ All users will see the **same trending supplements**
- ✅ This is the **intended behavior** - one data source, many viewers
- ⚠️ Only share your deployed app URL with trusted users
- ⚠️ Consider adding authentication if needed (not included by default)

### Best Practices

1. **Use API keys with usage limits** to prevent abuse
2. **Monitor your API usage** in each provider's dashboard
3. **Rotate keys periodically** if you suspect unauthorized access
4. **Keep your Supabase database password** in a secure location
5. **Don't commit credentials to GitHub** (already handled - they're in KV store)

---

## 🚀 What Happens Next?

Once you've configured everything:

### Automatic Daily Updates

- TrendPulse will automatically fetch new trends **every day at 8:00 AM**
- The system searches Reddit, forums, social media for trending supplements
- AI analyzes discussions and generates insights
- Data is stored in your Supabase database
- All users see the latest trends when they visit

### Manual Updates

- You can trigger updates anytime from **Admin → Trend Scheduler**
- Useful for testing or getting fresh data immediately

### User Experience

- Regular users just see the main app
- They can browse trending supplements
- They can use the AI chatbot for questions
- They don't need to configure anything
- All data comes from your centralized Supabase database

---

## 🆘 Troubleshooting

### "No supplements found"

**Solution:** Run a manual update from Admin → Trend Scheduler

### "Database Connection Failed"

**Solutions:**
1. Check your Supabase URL and key are correct
2. Verify the SQL schema was run successfully
3. Check if your Supabase project is still active (free tier doesn't expire)

### "API Rate Limit Exceeded"

**Solutions:**
1. Wait for the rate limit to reset (usually 1 hour)
2. Upgrade your API plan
3. Configure additional APIs to distribute load

### "Invalid API Key"

**Solutions:**
1. Double-check you copied the entire key (they're long!)
2. Regenerate the key in the provider's dashboard
3. Make sure there are no extra spaces before/after the key

---

## 📞 Need Help?

Check these resources:
- `SUPABASE_SETUP.md` - Detailed Supabase setup guide
- `API_SETUP_GUIDE.md` - API-specific setup instructions  
- `TROUBLESHOOTING.md` - Common issues and solutions
- Each API provider's documentation for account-specific issues

---

## 🎯 Minimum Recommended Setup

To get started with basic functionality:

**Required:**
- ✅ Supabase Database (FREE)

**Recommended:**
- ✅ EXA API (FREE tier) OR Reddit API (FREE)
- ⚠️ Without APIs, the app will use mock data

**Optional for enhanced features:**
- OpenAI API for better insights
- RapidAPI for social media coverage
- Anthropic API for alternative AI analysis

You can always add more APIs later!

---

**Ready to configure?** Click the **Admin** button in the app header and go to the **Connections** tab!
