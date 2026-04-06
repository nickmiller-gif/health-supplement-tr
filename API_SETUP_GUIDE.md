# API Setup Guide for TrendPulse

This guide will walk you through obtaining all the API keys needed to power TrendPulse's real-time supplement trend discovery.

---

## 🔍 EXA API (Web Search & Research)

**What it does:** Powers intelligent web search across Reddit, forums, research papers, and community discussions to discover supplement trends.

**Cost:** Free tier available (1,000 searches/month)

### Steps to Get Your EXA API Key:

1. **Visit EXA's Website**
   - Go to [https://exa.ai](https://exa.ai)

2. **Sign Up**
   - Click "Get Started" or "Sign Up"
   - Create an account with your email

3. **Access Dashboard**
   - After signing up, you'll be redirected to your dashboard
   - Navigate to the API section

4. **Generate API Key**
   - Click "Create API Key" or "Generate New Key"
   - Copy your API key (it looks like: `exa_xxxxxxxxxxxxxxxxxxxxxx`)

5. **Add to TrendPulse**
   - Click the settings icon (⚙️) in the top-right of TrendPulse
   - Paste your EXA API key in the "EXA API Key" field
   - Click "Save Settings"

**Documentation:** [https://docs.exa.ai](https://docs.exa.ai)

---

## 🐦 Reddit API (Community Discussions)

**What it does:** Fetches real discussions from r/Nootropics, r/Supplements, r/Biohacking, and other health communities.

**Cost:** Free

### Steps to Get Reddit API Credentials:

1. **Create a Reddit Account**
   - Go to [https://www.reddit.com](https://www.reddit.com)
   - Sign up if you don't have an account

2. **Navigate to App Preferences**
   - Go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
   - Or: Click your profile → Settings → Safety & Privacy → Manage third-party app authorization

3. **Create an Application**
   - Scroll to the bottom and click "Create App" or "Create Another App"

4. **Fill Out the Form**
   - **Name:** TrendPulse (or any name you prefer)
   - **App type:** Select "script"
   - **Description:** Supplement trend discovery (optional)
   - **About URL:** Leave blank (optional)
   - **Redirect URI:** http://localhost:8080 (required, but not used)
   - Click "Create app"

5. **Copy Your Credentials**
   - **Client ID:** The short string under your app name (looks random, 14 characters)
   - **Client Secret:** Click "edit" and copy the secret key

6. **Add to TrendPulse**
   - Click the settings icon (⚙️) in TrendPulse
   - Paste **Client ID** in "Reddit Client ID"
   - Paste **Client Secret** in "Reddit Client Secret"
   - Click "Save Settings"

**Documentation:** [https://www.reddit.com/dev/api](https://www.reddit.com/dev/api)

---

## 📱 RapidAPI (Twitter, TikTok, LinkedIn, Facebook)

**What it does:** Provides access to social media APIs for trend discovery across multiple platforms.

**Cost:** Free tier available (varies by API, typically 100-500 requests/month)

### Steps to Get RapidAPI Key:

1. **Create RapidAPI Account**
   - Go to [https://rapidapi.com](https://rapidapi.com)
   - Click "Sign Up" (top-right)
   - Sign up with email or Google

2. **Get Your API Key**
   - After signing up, go to [https://rapidapi.com/developer/dashboard](https://rapidapi.com/developer/dashboard)
   - Your default API key is displayed in the dashboard
   - Copy the key (starts with something like `xxxxxxxxxxxxxxxxxxxxxxx`)

3. **Subscribe to Social Media APIs** (Optional but recommended)

   **For Twitter/X Data:**
   - Visit [https://rapidapi.com/search/twitter](https://rapidapi.com/search/twitter)
   - Popular options:
     - "Twitter API v2" - Official Twitter data
     - "Twitter V2" - Community APIs
   - Click "Subscribe to Test" on your chosen API
   - Select the **Free** plan
   - Click "Subscribe"

   **For TikTok Data:**
   - Visit [https://rapidapi.com/search/tiktok](https://rapidapi.com/search/tiktok)
   - Popular options:
     - "TikTok API" - Video and trend data
     - "TikTok Data" - Hashtag and user data
   - Click "Subscribe to Test"
   - Select the **Free** plan

   **For LinkedIn Data:**
   - Visit [https://rapidapi.com/search/linkedin](https://rapidapi.com/search/linkedin)
   - Options include:
     - "LinkedIn API" - Profile and post data
   - Subscribe to free tier

4. **Add to TrendPulse**
   - Click the settings icon (⚙️) in TrendPulse
   - Paste your RapidAPI key in "RapidAPI Key"
   - Click "Save Settings"

**Your Dashboard:** [https://rapidapi.com/developer/dashboard](https://rapidapi.com/developer/dashboard)

---

## 🎯 Quick Setup Checklist

- [ ] Get EXA API key → Paste in TrendPulse settings
- [ ] Get Reddit Client ID & Secret → Paste in TrendPulse settings
- [ ] Get RapidAPI key → Paste in TrendPulse settings
- [ ] Subscribe to social media APIs on RapidAPI (optional)
- [ ] Click "Refresh Trends" in TrendPulse to test

---

## 💡 Usage Tiers

### Free Tier (No APIs)
- **What you get:** AI-generated trends based on general knowledge
- **Best for:** Exploring the app, casual use
- **Limitations:** Not real-time, may hallucinate

### EXA Only
- **What you get:** Real web data from Reddit, forums, research papers
- **Best for:** Accurate supplement trend discovery
- **Free tier:** 1,000 searches/month
- **Limitations:** No social media real-time data

### Full Setup (EXA + Reddit + RapidAPI)
- **What you get:** Complete real-time data from all sources
- **Best for:** Comprehensive trend analysis
- **Free tier:** Varies by API
- **Limitations:** Rate limits on free tiers

---

## 🔐 Security Notes

- **Never share your API keys publicly**
- **Keys are stored locally** in your browser (not on any server)
- **You can rotate keys** anytime in the respective API dashboards
- **Delete keys** from TrendPulse settings if you regenerate them

---

## 🆘 Troubleshooting

### "Failed to fetch trends"
- Check that API keys are entered correctly (no extra spaces)
- Verify your API keys are active in their respective dashboards
- Check you haven't exceeded free tier limits

### Reddit API not working
- Make sure you created a "script" type app (not "web app")
- Verify both Client ID AND Client Secret are entered
- Reddit API is read-only for public posts

### RapidAPI not working
- Confirm you've subscribed to at least one social media API
- Check your usage limits in RapidAPI dashboard
- Some APIs require additional endpoint subscriptions

---

## 📊 Testing Your Setup

1. Add at least one API key to TrendPulse
2. Click "Refresh Trends" button
3. Watch the toast notification:
   - "Discovering latest supplement trends..." = No APIs (AI-generated)
   - "Using EXA to discover real web trends..." = EXA connected
   - "Scanning Reddit, Twitter, TikTok & LinkedIn..." = Full social media connected

4. Check supplement cards for real data indicators

---

## 📚 Additional Resources

- **EXA Documentation:** [https://docs.exa.ai](https://docs.exa.ai)
- **Reddit API Docs:** [https://www.reddit.com/dev/api](https://www.reddit.com/dev/api)
- **RapidAPI Help:** [https://docs.rapidapi.com](https://docs.rapidapi.com)

---

## 💰 Pricing Summary (as of 2024)

| API | Free Tier | Paid Plans Start At |
|-----|-----------|---------------------|
| EXA | 1,000 searches/month | $29/month |
| Reddit | Unlimited read access | Free for read-only |
| RapidAPI | Varies by API (100-500 req/month) | $5-50/month depending on API |

**Recommendation:** Start with free tiers to test, upgrade only if you need more requests.

---

**Questions?** All APIs have support documentation linked above. Each dashboard shows your current usage and limits.
