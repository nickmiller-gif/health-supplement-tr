/*
 * TrendPulse API Configuration
 * 
 * Add your API keys here to enable real-time supplement trend discovery.
 * 
 * GETTING STARTED:
 * ================
 * 
 * ⭐ EXA API (RECOMMENDED - Best single API for comprehensive coverage)
 * --------------------------------------------------------------------
 * 1. Go to: https://exa.ai
 * 2. Sign up for a free account (1,000 searches/month free tier)
 * 3. Create an API key from your dashboard
 * 4. Replace 'YOUR_EXA_API_KEY_HERE' below with your actual key
 * 
 * EXA covers: Reddit, forums, blogs, biohacking communities, and the broader web
 * Cost: Free (1,000/month) or $10/month for 10,000 searches
 * 
 * OPTIONAL APIs:
 * ==============
 * 
 * Reddit API (FREE - Direct Reddit access)
 * ----------------------------------------
 * Get credentials at: https://www.reddit.com/prefs/apps
 * Add clientId and clientSecret below
 * 
 * RapidAPI (PAID - Premium social media)
 * ---------------------------------------
 * Access Twitter/X, TikTok, LinkedIn via: https://rapidapi.com/hub
 * Add your RapidAPI key below (one key works for all platforms)
 * 
 * For detailed instructions, see: API_KEYS_SETUP.md
 */

export const API_KEYS = {
  exa: 'YOUR_EXA_API_KEY_HERE',
  
  reddit: {
    clientId: '',
    clientSecret: ''
  },
  
  rapidApi: ''
}
