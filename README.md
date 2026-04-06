# TrendPulse - AI-Powered Supplement Trend Discovery

An intelligent platform that discovers and analyzes real-time supplement trends from social media and the web using multiple data sources including Reddit, EXA search, Twitter/X, TikTok, and LinkedIn.

## 🚀 Quick Start - Add Your API Keys

To enable real-time trend discovery from social platforms, you need to add your API keys.

### Option 1: Add Keys to Config File (Recommended)

1. Open the file: **`src/config/api-keys.ts`**
2. Add your API keys between the quotes:

```typescript
export const API_KEYS = {
  exa: 'your_exa_api_key_here',
  
  reddit: {
    clientId: 'your_reddit_client_id',
    clientSecret: 'your_reddit_client_secret'
  },
  
  rapidApi: 'your_rapidapi_key_here'
}
```

3. Save the file - that's it! Your keys will work automatically.

### Option 2: Use the UI Settings Dialog

1. Click the **"API Settings"** button in the app header
2. Enter your API keys in the dialog
3. Click "Save Settings"

Keys entered this way are stored locally in your browser.

## 📖 Getting Your API Keys

**See the detailed guide:** [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)

### Quick Links:
- **Reddit API** (FREE): [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
- **EXA Search**: [exa.ai](https://exa.ai) (Free tier: 1,000 searches/month)
- **RapidAPI**: [rapidapi.com/hub](https://rapidapi.com/hub) (For Twitter, TikTok, LinkedIn)

### Recommended Setup:
1. **Start with Reddit** (100% free, great coverage)
2. **Add EXA** for broader web coverage (~$10/month)
3. **Optionally add RapidAPI** for premium social media access

## 🎯 Features

- **Real-Time Trend Discovery**: Analyzes discussions from Reddit, forums, and social media
- **Multi-Platform Coverage**: Aggregates data from Reddit, Twitter/X, TikTok, LinkedIn, and the web
- **AI-Powered Analysis**: Uses GPT-4 to identify trends and generate insights
- **Smart Caching**: Reduces API costs with 24-hour result caching
- **Supplement Tracking**: Save and monitor your favorite supplements
- **Stack Discovery**: Find popular supplement combinations being discussed
- **Filtering & Sorting**: Search, filter by category, and sort by popularity or trend direction

## 🛠️ What's Inside

- **React 19** + **TypeScript** for the frontend
- **Tailwind CSS v4** for styling
- **Shadcn UI v4** components
- **Framer Motion** for animations
- **D3.js** for trend visualizations
- **Spark Runtime SDK** for LLM integration and persistence
- **Real API Integrations**: Reddit, EXA, RapidAPI

## 📁 Project Structure

```
src/
├── config/
│   └── api-keys.ts          # 👈 Add your API keys here
├── components/
│   ├── ApiSettings.tsx      # API configuration dialog
│   ├── SupplementCard.tsx   # Individual supplement display
│   ├── CombinationCard.tsx  # Supplement stack display
│   └── ui/                  # Shadcn components
├── lib/
│   ├── trend-discovery.ts   # Main trend analysis logic
│   ├── exa-api.ts          # EXA search integration
│   ├── social-media-apis.ts # Reddit, Twitter, TikTok APIs
│   └── data.ts             # Initial supplement data
└── App.tsx                  # Main application component
```

## 🔒 Privacy & Security

- API keys in config file are compiled into your app
- API keys from UI are stored locally in your browser (KV storage)
- Keys are only sent to their respective services (EXA, Reddit, RapidAPI)
- No third-party tracking or data sharing

## 💡 How It Works

1. **Data Collection**: Fetches recent discussions from configured platforms
2. **Trend Analysis**: AI analyzes mentions, sentiment, and engagement
3. **Scoring**: Calculates popularity and trend direction (rising/stable/declining)
4. **Caching**: Stores results for 24 hours to minimize API costs
5. **Visualization**: Displays trends with sparklines and detailed insights

## 🎨 Customization

The app uses a clean, modern design with:
- **Space Grotesk** for headings
- **Inter** for body text
- Blue/cyan color scheme with accent highlights
- Responsive grid layouts

You can customize colors in `src/index.css` and fonts in `index.html`.

## 🆘 Troubleshooting

**API keys not working?**
- Check for extra spaces in your keys
- Verify keys are valid in their respective dashboards
- Check browser console (F12) for error messages

**Still seeing AI-generated data?**
- Add at least one API key (Reddit is free and easy)
- Click "Refresh Trends" to fetch real data

**Rate limit errors?**
- Clear the cache in API Settings
- Wait for rate limit reset (varies by API)
- Consider upgrading your API tier

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

**Ready to discover trends?** Add your API keys and click "Refresh Trends"!
