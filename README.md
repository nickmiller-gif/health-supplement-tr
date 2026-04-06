# TrendPulse - Daily Supplement Intelligence Platform

> **🎉 v2.0: Centralized Backend Architecture - No User Configuration Required!**

A simplified, centralized supplement intelligence platform where users access daily curated trends from a shared backend and get personalized insights through an AI chatbot.

## 🆕 What's New in V2.0

- **🔄 Centralized Architecture** - Single Supabase backend with server-side API management
- **👥 Shared Daily Trends** - All users see the same curated data (updated daily)
- **🤖 AI Chatbot** - Natural language queries without any setup
- **🎯 Simplified UX** - Clean 2-tab interface focused on viewing and chatting
- **🔒 Enhanced Security** - API keys stored server-side, never in frontend

## 🚀 Quick Start

### For Users (Zero Setup)

1. Navigate to the deployed app
2. Browse trending supplements instantly
3. Use the chatbot for personalized recommendations

That's it! No API keys, no configuration needed.

### For Administrators (Deploying Your Own Instance)

**📚 Complete Setup Guide: [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md)**

**Quick Version:**
1. Set up Supabase database ([`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md))
2. Run schema migration ([`SUPABASE_SCHEMA_UPDATE.sql`](./SUPABASE_SCHEMA_UPDATE.sql))
3. Add API keys to database
4. Run initial trend update
5. Deploy frontend

See [`V2_SUMMARY.md`](./V2_SUMMARY.md) for architecture overview.

## 📚 Documentation

### v2.0 Architecture (Current)
- **[V2_SUMMARY.md](./V2_SUMMARY.md)** - Executive summary of v2.0 changes
- **[CENTRALIZED_BACKEND.md](./CENTRALIZED_BACKEND.md)** - Complete architecture guide
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step deployment guide
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Upgrading from v1.x

### Database Setup
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete database configuration (10 min)
- **[SUPABASE_SCHEMA_UPDATE.sql](./SUPABASE_SCHEMA_UPDATE.sql)** - v2.0 schema migration
- **[SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)** - Common issues

### Legacy Documentation (v1.x)
- **[README_V2.md](./README_V2.md)** - Previous version docs
- **[QUICK_START.md](./QUICK_START.md)** - Old quick start guide  
- **[API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)** - User API configuration (deprecated)

## 🏗️ Architecture

### Centralized Backend Model

```
┌─────────────────────────────────────────────────┐
│        Admin/Automation (Trend Updates)          │
│  • Fetches API keys from Supabase               │
│  • Calls external APIs (EXA, Reddit, etc.)       │
│  • AI analyzes and saves to database            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │      Supabase       │
         │  (Single Database)  │
         │                     │
         │  • api_configuration│ ← API keys (server-side)
         │  • supplements      │ ← Daily trends
         │  • combinations     │ ← Supplement stacks
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Frontend (Users)  │
         │    (Read-Only)      │
         │                     │
         │  • Browse trends    │
         │  • Use chatbot      │
         │  • View insights    │
         └─────────────────────┘
```

**Key Principle**: One backend, all users see the same daily data

## ✨ Features

### For Users
- ✅ **Zero Setup** - No API keys or configuration needed
- ✅ **Daily Trends** - Curated supplement insights updated automatically
- ✅ **AI Chatbot** - Ask questions in natural language
- ✅ **Detailed Insights** - AI-generated analysis for each supplement
- ✅ **Supplement Stacks** - Popular combinations and protocols
- ✅ **Mobile Optimized** - Responsive design for any device

### For Administrators  
- ✅ **Centralized Management** - One set of API keys for all users
- ✅ **Automated Updates** - Schedule daily trend refreshes
- ✅ **Cost Efficient** - Shared API costs across all users
- ✅ **Secure** - API keys stored server-side only
- ✅ **Scalable** - Handle thousands of users with ease

## 🤖 Using the Chatbot

Click the chat button (bottom-right floating button) and ask:
- "What's trending for sleep?"
- "Show me peptides for muscle recovery"
- "Which nootropics are rising?"
- "Tell me about popular supplement stacks"

The chatbot uses the supplement data and configured AI APIs to provide intelligent, context-aware responses.

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS v4** with custom design tokens
- **Supabase** for backend (optional)
- **shadcn/ui v4** components
- **Framer Motion** for animations
- **Spark Runtime SDK** for LLM features
- **D3.js** for visualizations

## 📱 Mobile Experience

Fully responsive with:
- Touch-friendly 44px minimum tap targets
- Bottom-right floating chat button
- Horizontal scrolling filters
- Responsive 1-3 column grid
- Optimized typography

## 🔒 Security

- ✅ Zero API keys in source code
- ✅ Environment variable support
- ✅ Ready for server-side API calls
- ✅ Supabase Row Level Security
- ✅ `.env` in `.gitignore`

## 🚢 Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Netlify
- Build: `npm run build`
- Publish: `dist`
- Add environment variables
- Deploy!

## 📖 Database Persistence

### Without Supabase (Default)
The app works immediately with local mock data. Great for:
- Quick testing and demos
- Local development
- Learning the features

**Limitation**: Data resets on page refresh

### With Supabase (Recommended for Production)
Connect a free PostgreSQL database to get:
- ✅ **Persistent storage** - Data survives refreshes and sessions
- ✅ **Real-time updates** - Changes sync instantly
- ✅ **Multi-user ready** - Share data across devices
- ✅ **Scalable** - Handles millions of records
- ✅ **Backups** - Automatic point-in-time recovery
- ✅ **Free tier** - 500MB storage, unlimited API requests

**Setup Time**: 10 minutes  
**Cost**: Free forever (with generous limits)  
**Guide**: Follow [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

The app automatically detects Supabase configuration and uses it when available. No code changes needed!

## 📁 Project Structure

```
src/
├── components/
│   ├── Chatbot.tsx           # 🤖 AI chatbot
│   ├── SupplementCard.tsx    # Enhanced with animations
│   └── ui/                   # shadcn components
├── lib/
│   ├── supabase.ts          # 🔐 Database client
│   ├── supplement-service.ts # Service layer
│   ├── trend-discovery.ts    # AI trend analysis
│   └── types.ts             # TypeScript interfaces
├── App.tsx                   # Main app (with chatbot)
└── index.css                 # Design system
```

## 🎨 Customization

### Colors
Edit `src/index.css` to change the OKLCH color values:
```css
--primary: oklch(0.42 0.12 235);  /* Deep blue */
--accent: oklch(0.58 0.18 220);   /* Cyan */
```

### Fonts
Change font imports in `index.html` and update CSS variables in `src/index.css`

### Chatbot Responses
Customize patterns in `src/components/Chatbot.tsx` function `generateResponse()`

## 🆘 Troubleshooting

**App not loading?**
- Run `npm install` first
- Check console for errors (F12)

**Supabase connection issues?**
- Verify `.env` credentials
- Check Supabase dashboard is accessible
- App still works with mock data if Supabase fails

**TypeScript errors?**
- Some pre-existing errors from V1 code (don't affect functionality)
- Can be ignored or fixed later

## 🤝 Contributing

This is a Spark template project. Feel free to:
- Customize for your needs
- Add new features
- Improve the design
- Share your modifications

## 📄 License

MIT License - See LICENSE file

The Spark Template files and resources from GitHub are licensed under MIT, Copyright GitHub, Inc.

---

**Ready to explore?** Try the AI chatbot by clicking the icon in the bottom-right! 💬✨

For detailed V2 features, see [`UPGRADE_SUMMARY.md`](./UPGRADE_SUMMARY.md)
