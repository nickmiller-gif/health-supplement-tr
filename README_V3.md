# 🧬 TrendPulse - Daily Supplement Intelligence

> **Centralized AI-powered platform for discovering trending supplements, stacks, and getting personalized recommendations**

## What is TrendPulse?

TrendPulse is a supplement intelligence platform that provides daily curated trends from across the biohacking community. Instead of spending hours browsing Reddit, forums, and social media, users get instant access to:

- 📊 **Daily Trending Supplements** - What's rising in popularity right now
- 🔬 **Supplement Stacks** - Popular combinations being discussed
- 🤖 **AI Chatbot** - Ask questions and get personalized recommendations
- 📈 **Trend Insights** - AI-generated analysis of why supplements are trending

## Key Features

### 🎯 Centralized Data Model

Unlike traditional apps where each user manages their own data, TrendPulse uses a **single source of truth**:

- All trends updated daily from a central Supabase database
- API keys managed server-side for security  
- Everyone sees the same curated daily data
- No user configuration required

### 🤖 AI-Powered Chatbot

Ask natural language questions like:
- "What's trending for sleep?"
- "Show me peptides for muscle recovery"
- "What nootropics are rising?"
- "Tell me about popular supplement stacks"

The chatbot uses your configured AI provider (OpenAI, Anthropic, or Spark LLM) to provide intelligent, context-aware responses based on the latest trend data.

### 📊 Clean, Focused Interface

- **All Trends Tab** - Browse all supplements with filtering and sorting
- **Stacks Tab** - Explore popular supplement combinations
- **Search & Filter** - Find exactly what you're looking for
- **Mobile Optimized** - Responsive design for any device

## Architecture

### Centralized Backend

```
┌─────────────┐
│   Supabase  │
│  (Database) │
└──────┬──────┘
       │
       ├─ api_configuration (API keys - server side)
       ├─ supplements (daily trends)
       ├─ supplement_combinations (stacks)
       └─ emerging_signals (research data)
       
┌──────┴──────┐
│  Frontend   │
│ (Read-only) │
└─────────────┘
```

### How Trends Are Updated

1. **Admin/Cron Job** runs trend discovery script
2. Script fetches API keys from Supabase `api_configuration` table
3. Calls external APIs (EXA, Reddit, RapidAPI, etc.)
4. AI analyzes and categorizes findings
5. Saves to Supabase (`supplements`, `supplement_combinations`)
6. Frontend reads latest data (no API calls needed)

## Setup

### For End Users

If you're just using the app:

1. Navigate to the deployed URL
2. Browse trends immediately - no setup required!
3. Use the chatbot for personalized queries

That's it. No API keys, no configuration.

### For Administrators

If you're deploying your own instance:

#### 1. Supabase Setup

Follow `SUPABASE_SETUP.md` for detailed instructions. Quick version:

```sql
-- Run in Supabase SQL Editor
-- Creates all necessary tables including api_configuration

\i SUPABASE_SCHEMA_UPDATE.sql
```

#### 2. Configure API Keys

Add your API keys to the database (one-time setup):

```sql
INSERT INTO api_configuration (
  id,
  exa_api_key,
  reddit_client_id,
  reddit_client_secret,
  openai_api_key
)
VALUES (
  1,
  'your-exa-key',
  'your-reddit-id',
  'your-reddit-secret',
  'your-openai-key'
)
ON CONFLICT (id) DO UPDATE SET
  exa_api_key = EXCLUDED.exa_api_key,
  openai_api_key = EXCLUDED.openai_api_key;
```

#### 3. Set Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

#### 4. Run Initial Trend Update

```bash
# Create a script to populate initial data
tsx scripts/update-trends.ts
```

See `CENTRALIZED_BACKEND.md` for full update script example.

#### 5. (Optional) Automate Updates

Set up a cron job or scheduled function:

```bash
# Daily at 6 AM
0 6 * * * tsx /path/to/update-trends.ts
```

Or use:
- Supabase Edge Functions with cron triggers
- GitHub Actions scheduled workflows
- Vercel Cron (for Next.js)
- AWS EventBridge

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling  
- **shadcn/ui** component library
- **Framer Motion** for animations
- **Phosphor Icons** for iconography

### Backend
- **Supabase** (PostgreSQL database)
- **Row Level Security** policies
- **Centralized API configuration**

### AI/APIs
- **Spark LLM** (built-in GPT-4o-mini)
- **OpenAI API** (optional, for chatbot)
- **Anthropic API** (optional, for chatbot)
- **EXA API** (web/community search)
- **Reddit API** (free, for r/supplements, r/peptides, etc.)
- **RapidAPI** (optional, for Twitter/TikTok/LinkedIn)

## Documentation

| Document | Description |
|----------|-------------|
| `CENTRALIZED_BACKEND.md` | Architecture details and backend setup |
| `MIGRATION_GUIDE.md` | Upgrading from v1.x to v2.0 |
| `SUPABASE_SETUP.md` | Complete Supabase configuration guide |
| `SUPABASE_TROUBLESHOOTING.md` | Common issues and solutions |
| `PRD.md` | Product requirements and design decisions |

## Security

### Current Model

⚠️ **Development Mode**: API keys are fetched from Supabase in the frontend for chatbot queries. This works but is **not production-ready**.

### Recommended Production Setup

For production deployments:

1. **Move chatbot to Supabase Edge Functions**
2. **Restrict `api_configuration` to service role only**
3. **Implement rate limiting**  
4. **Add user authentication** (Supabase Auth)

See `CENTRALIZED_BACKEND.md` for Edge Function example.

## API Keys

### Required (for trend updates)

- **None for basic usage** - Sample data works out of the box

### Recommended (for real trends)

- **EXA API** (free tier: 1,000 searches/month)
  - Get at: https://exa.ai
  - Covers: Reddit, forums, blogs, biohacking communities

### Optional (enhanced functionality)

- **Reddit API** (free, unlimited)
  - Direct access to supplement subreddits
  - Get at: https://www.reddit.com/prefs/apps

- **OpenAI API** (pay-per-use)
  - Enhanced chatbot responses
  - Get at: https://platform.openai.com/api-keys

- **RapidAPI** (paid tiers)
  - Twitter/X, TikTok, LinkedIn data
  - Get at: https://rapidapi.com/hub

## Benefits of Centralized Architecture

✅ **For Users**
- Zero configuration required
- Instant access to daily trends
- Consistent, curated data
- No API costs

✅ **For Administrators**
- Single point of management
- Shared API costs across all users
- Easy to maintain and update
- Scalable to thousands of users

✅ **For Developers**
- Clean separation of concerns
- Easier to secure (API keys server-side)
- Better performance (pre-computed data)
- Simpler deployment

## Use Cases

### Biohackers
- Track what supplements are gaining traction
- Discover new peptides or nootropics
- See what stacks others are using

### Supplement Enthusiasts
- Stay updated on trends
- Learn about emerging compounds
- Get AI-powered recommendations

### Researchers
- Monitor community adoption of new supplements
- Identify patterns in supplement use
- Analyze trend directions over time

## Roadmap

Future enhancements planned:

- [ ] User authentication for personal tracking
- [ ] Email/SMS trend alerts  
- [ ] Historical trend charts
- [ ] Admin dashboard for key management
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Public API for developers

## Contributing

This is a Spark template project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See `LICENSE` file for details

## Support

Questions? Issues? Check:

1. `SUPABASE_SETUP.md` - Database configuration
2. `CENTRALIZED_BACKEND.md` - Architecture details
3. `MIGRATION_GUIDE.md` - Upgrading from older versions
4. `SUPABASE_TROUBLESHOOTING.md` - Common issues

---

**Version**: 2.0 (Centralized Backend)  
**Last Updated**: 2024  
**Built with**: React, TypeScript, Supabase, Tailwind CSS

Made with ❤️ for the biohacking community
