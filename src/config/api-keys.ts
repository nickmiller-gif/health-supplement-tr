/*
 * TrendPulse API Configuration
 * 
 * SECURITY NOTICE:
 * ================
 * ⚠️ DO NOT add API keys directly to this file!
 * 
 * This file is for development/demo purposes only. API keys should NEVER be
 * committed to code as they are secrets that could be exposed.
 * 
 * HOW TO ADD YOUR API KEYS (RECOMMENDED METHOD):
 * ==============================================
 * 
 * 1. Click the "API Settings" button in the app's header (gear icon)
 * 2. Enter your API keys in the secure dialog
 * 3. Keys are stored locally in your browser using the KV store
 * 4. Keys are never committed to code or shared publicly
 * 
 * GETTING YOUR API KEYS:
 * ======================
 * 
 * ⭐ EXA API (RECOMMENDED - Best single API for comprehensive coverage)
 * --------------------------------------------------------------------
 * Website: https://exa.ai
 * Sign up for a free account (1,000 searches/month free tier)
 * EXA covers: Reddit, forums, blogs, biohacking communities, and the broader web
 * Cost: Free (1,000/month) or $10/month for 10,000 searches
 * 
 * Reddit API (FREE - Direct Reddit access)
 * ----------------------------------------
 * Website: https://www.reddit.com/prefs/apps
 * Create a new app and get your client ID and secret
 * Cost: Free
 * 
 * RapidAPI (PAID - Premium social media)
 * ---------------------------------------
 * Website: https://rapidapi.com/hub
 * Access Twitter/X, TikTok, LinkedIn (one key works for all platforms)
 * Cost: Varies by plan
 * 
 * OpenAI API (OPTIONAL - Enhanced AI analysis)
 * --------------------------------------------
 * Website: https://platform.openai.com/api-keys
 * Use GPT-4 or GPT-3.5 for AI-powered insights
 * Cost: Pay-per-use (typically $0.01-0.03 per request)
 * 
 * Anthropic API (OPTIONAL - Claude AI models)
 * -------------------------------------------
 * Website: https://console.anthropic.com/settings/keys
 * Use Claude 3 models for AI analysis
 * Cost: Pay-per-use (typically $0.01-0.03 per request)
 * 
 * DEVELOPER NOTE:
 * ===============
 * If you're developing locally and want to hardcode keys for testing,
 * you can add them below (but NEVER commit them to a repository):
 */

export const API_KEYS = {
  exa: '8805b859-b175-4097-9ceb-eb424e40ef0e',
  rapidApi: 'fbd977f6d6msha78628ae99e0e78p18c74cjsne54b63bfded9',
  reddit: {
    clientId: '',
    clientSecret: ''
  },
  openai: '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',
  anthropic: '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'
}
