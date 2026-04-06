# 🚀 Quick Start Guide

## Instant Setup (No Backend Required)

The app works immediately with sample data:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and you're done! 🎉

## Try the AI Chatbot

Click the **chat icon** in the bottom-right corner and ask:
- "Show me peptides for muscle recovery"
- "What's trending in nootropics?"
- "Find supplements for better sleep"

## Want to Add Supabase Backend?

Follow these steps when you're ready:

### 1. Create Supabase Project (5 min)
- Go to [supabase.com](https://supabase.com)
- Sign up and create a new project
- Wait for initialization (~2 minutes)

### 2. Get Credentials (1 min)
- Go to Settings → API in your Supabase dashboard
- Copy your **Project URL** and **anon key**

### 3. Configure Environment (1 min)
```bash
cp .env.example .env
```

Edit `.env` and paste your credentials:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Set Up Database (5 min)
- Open Supabase SQL Editor
- Copy the SQL from `SUPABASE_SETUP.md`
- Run it
- Done!

### 5. Restart Dev Server
```bash
npm run dev
```

Your app now has a production-ready backend! 🎉

## Features to Explore

### 🤖 AI Chatbot
- Click chat icon (bottom-right)
- Ask natural language questions
- Get intelligent supplement recommendations

### 💙 Track Supplements
- Click heart icon on any card
- View tracked items in "Tracked" tab
- Persists across sessions (with Supabase)

### 🔍 Search & Filter
- Use the search bar
- Click category badges
- Sort by popularity, trend, or name

### 📊 View Insights
- Click "View AI Insights" on any card
- See detailed analysis
- Explore trending stacks

## Mobile Experience

The app is fully responsive! Try:
- Resizing your browser
- Opening on your phone
- Using the chat on mobile

## Keyboard Shortcuts

- **Enter** in chat - Send message
- **Tab** - Navigate between inputs
- **Escape** (when chat open) - Close chat

## Need Help?

- **Full docs:** `README_V2.md`
- **Supabase setup:** `SUPABASE_SETUP.md`
- **Technical details:** `V2_IMPLEMENTATION.md`
- **What changed:** `UPGRADE_SUMMARY.md`

## Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env`
4. Deploy!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables
4. Deploy!

---

**Enjoy your AI-powered supplement intelligence platform! 🚀**
