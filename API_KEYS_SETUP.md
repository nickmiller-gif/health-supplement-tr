# API Keys Setup Guide

This guide will help you add your actual API keys to enable real-time supplement trend discovery from social media platforms and the web.

## Where to Add Your API Keys

Open the file: **`src/config/api-keys.ts`**

This file contains a simple configuration object where you can paste your API keys.

## Step-by-Step Instructions

### 1. EXA Search API (Recommended - Best Coverage)

**What it does:** Searches Reddit, forums, and communities across the web for supplement discussions.

**Cost:** Free tier available with 1,000 searches/month, then $10/month for 10,000 searches.

**How to get your key:**
1. Go to [exa.ai](https://exa.ai)
2. Sign up for an account
3. Navigate to your dashboard and create an API key
4. Copy the API key

**Add to config:**
```typescript
export const API_KEYS = {
  exa: 'your_exa_api_key_here',  // Paste your key between the quotes
  // ... rest of config
}
```

### 2. Reddit API (Free - Good Coverage)

**What it does:** Directly searches Reddit supplement communities like r/Nootropics, r/Supplements, r/Biohacking.

**Cost:** 100% Free

**How to get your credentials:**
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **Name:** TrendPulse (or any name you prefer)
   - **App type:** Select "script"
   - **Description:** (optional) "Supplement trend discovery"
   - **About URL:** (leave blank)
   - **Redirect URI:** http://localhost:8000
4. Click "Create app"
5. You'll see your credentials:
   - **Client ID:** The string under "personal use script" (14 characters)
   - **Client Secret:** The string labeled "secret"

**Add to config:**
```typescript
export const API_KEYS = {
  // ... exa config
  reddit: {
    clientId: 'your_reddit_client_id_here',      // 14 character string
    clientSecret: 'your_reddit_client_secret_here'  // 27 character string
  },
  // ... rest of config
}
```

### 3. RapidAPI (Paid - Premium Social Media Access)

**What it does:** Provides access to Twitter/X, TikTok, and LinkedIn APIs for comprehensive social media trend analysis.

**Cost:** Varies by plan, typically $10-50/month depending on usage.

**How to get your key:**
1. Go to [rapidapi.com/hub](https://rapidapi.com/hub)
2. Sign up for an account
3. Subscribe to these APIs (you can choose which ones you want):
   - **Twitter/X API:** Search for "Twitter API" on RapidAPI
   - **TikTok API:** Search for "TikTok API" on RapidAPI  
   - **LinkedIn API:** Search for "LinkedIn API" on RapidAPI
4. Once subscribed, go to your dashboard
5. Copy your RapidAPI key (it's the same key for all APIs)

**Add to config:**
```typescript
export const API_KEYS = {
  // ... previous configs
  rapidApi: 'your_rapidapi_key_here'  // Paste your key between the quotes
}
```

## Complete Example

Here's what your `src/config/api-keys.ts` file should look like with all keys filled in:

```typescript
export const API_KEYS = {
  exa: 'abc123xyz789',
  reddit: {
    clientId: 'a1b2c3d4e5f6g7',
    clientSecret: 'x1y2z3a4b5c6d7e8f9g0h1i2'
  },
  rapidApi: 'def456uvw012'
}
```

## Recommendations

**For best results, we recommend:**
1. **Start with Reddit API (FREE)** - Great coverage of supplement communities
2. **Add EXA API** - Broader web coverage including forums and blogs
3. **Optionally add RapidAPI** - For premium social media coverage (Twitter, TikTok, LinkedIn)

**Minimum setup:**
- Just Reddit API (free) will give you good supplement trend data from Reddit communities

**Recommended setup:**
- Reddit API + EXA API - Best balance of coverage and cost (~$10/month)

**Premium setup:**
- All three - Complete social media coverage from Reddit, Twitter, TikTok, LinkedIn, and the broader web

## After Adding Your Keys

1. Save the `src/config/api-keys.ts` file
2. The app will automatically use your keys when you click "Refresh Trends"
3. You can also still use the "API Settings" button in the app UI to add/update keys (they'll be stored locally in your browser)

## Privacy & Security

- **Config file keys:** These are compiled into your app and work automatically
- **UI-entered keys:** Stored locally in your browser using KV storage
- **API calls:** Your keys are only sent to their respective services (EXA, Reddit, RapidAPI)
- **Never shared:** Your API keys are never sent to any third-party services except the ones they're intended for

## Troubleshooting

**Keys not working?**
- Make sure there are no extra spaces before or after your keys
- Verify the keys are between the single quotes `'like this'`
- Check that you've saved the file

**Still using AI-generated data?**
- The app falls back to AI analysis when no API keys are configured
- Once you add keys and click "Refresh Trends", it will switch to real data

**Need help?**
- Check the browser console (F12) for any error messages
- Verify your API keys are valid in their respective dashboards
- Make sure you haven't exceeded your API rate limits
