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

### Instant Setup (No Configuration Required)
```bash
npm install
npm run dev
```

The app works immediately with sample data! Open `http://localhost:5173`

**👉 See [`QUICK_START.md`](./QUICK_START.md) for detailed instructions**

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 30 seconds
- **[UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)** - What's new in V2.0  
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Optional backend setup (15 minutes)
- **[V2_IMPLEMENTATION.md](./V2_IMPLEMENTATION.md)** - Technical implementation details
- **[PRD.md](./PRD.md)** - Product requirements and design decisions

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

## 📖 Optional: Add Supabase Backend

While the app works without it, Supabase adds:
- Persistent storage across devices
- User authentication
- Real-time updates
- Scalability for production

**Follow [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) when you're ready** (takes 15 minutes)

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
