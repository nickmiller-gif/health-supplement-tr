# TrendPulse - AI-Powered Supplement Intelligence Platform

> **🎉 Now with AI Chatbot, Supabase Backend & Premium UI!**

An intelligent platform for discovering supplement trends with conversational AI search, secure backend storage, and beautiful responsive design.

## ✨ What's New in V2.0

- **🤖 AI Chatbot** - Ask questions in natural language: "Show me peptides for muscle recovery"
- **🔐 Supabase Backend** - Secure PostgreSQL database with real-time capabilities
- **🎨 Premium UI/UX** - Modern design with smooth animations
- **📱 Mobile-First** - Fully optimized for touch devices
- **🔒 Security** - No API keys exposed in frontend code

## 🚀 Quick Start

### 1. Install & Run (30 seconds)
```bash
npm install
npm run dev
```

The app works immediately with sample data! Open `http://localhost:5173`

### 2. Connect Supabase Database (10 minutes) - **Recommended**

For persistent data storage and production-ready backend:

**📚 Complete Supabase Documentation: [`SUPABASE_DOCS_INDEX.md`](./SUPABASE_DOCS_INDEX.md)**

**Quick Links:**
- 🚀 **Fast Setup:** [`SUPABASE_QUICKSTART.md`](./SUPABASE_QUICKSTART.md) (5 min)
- 📖 **Detailed Guide:** [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) (10 min)
- 🔧 **Troubleshooting:** [`SUPABASE_TROUBLESHOOTING.md`](./SUPABASE_TROUBLESHOOTING.md)

Without Supabase, the app uses local mock data (resets on refresh). With Supabase, you get:
- ✅ Data persistence across sessions
- ✅ Real-time synchronization
- ✅ Scalable PostgreSQL database
- ✅ Production-ready architecture

**👉 See [`QUICK_START.md`](./QUICK_START.md) for complete instructions**

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - Get the app running in 30 seconds
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete database setup guide (10 min)
- **[SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)** - Quick checklist for experienced devs

### Architecture & Features
- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Complete backend architecture
- **[UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)** - What's new in V2.0  
- **[V2_IMPLEMENTATION.md](./V2_IMPLEMENTATION.md)** - Technical implementation details
- **[PRD.md](./PRD.md)** - Product requirements and design decisions

### Advanced
- **[API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)** - Configure real API integrations
- **[SECURITY.md](./SECURITY.md)** - Security best practices
- **[EMAIL_SCHEDULING.md](./EMAIL_SCHEDULING.md)** - Email report scheduling

## 🎯 Key Features

### 🤖 Conversational AI Search
Click the chat button and ask:
- "Show me peptides for muscle recovery"
- "What's trending in nootropics?"
- "Find supplements for better sleep"
- "Which supplements are rising?"

### 🔐 Secure Backend (Supabase)
- PostgreSQL database for scalable storage
- Row Level Security for data protection
- Real-time subscriptions
- Serverless Edge Functions ready
- **Works with or without** - Uses mock data if Supabase not configured

### 🎨 Premium Design
- Modern OKLCH color system
- Space Grotesk + Inter typography
- Framer Motion animations
- Glass effects and gradients
- Mobile-optimized layouts

### 💡 Smart Features
- Supplement tracking (saved across sessions)
- AI-generated insights
- Trend predictions
- Combination/stack discovery
- Advanced filtering and sorting

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
