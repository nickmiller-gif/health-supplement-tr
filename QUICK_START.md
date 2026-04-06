# 🚀 Quick Start Guide

## Step 1: Install & Run (30 seconds)

The app works immediately with sample data:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and you're done! 🎉

## Step 2: Connect Database (10 minutes) - Optional but Recommended

### Why Connect Supabase?

**Without Supabase** (current state):
- ✅ Works immediately
- ❌ Data resets on page refresh
- ❌ No cross-device sync

**With Supabase**:
- ✅ Data persists forever
- ✅ Real-time updates
- ✅ Production-ready
- ✅ 100% free tier

### Quick Setup

Choose your guide:

1. **📖 Complete Guide** (with explanations)  
   Follow [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - 10 minutes

2. **⚡ Quick Checklist** (for experienced devs)  
   Follow [`SUPABASE_QUICKSTART.md`](./SUPABASE_QUICKSTART.md) - 5 minutes

### TL;DR Version

```bash
# 1. Create Supabase account at supabase.com
# 2. Create new project, wait 2 minutes
# 3. Copy URL and anon key from Settings → API
# 4. Create .env file:
echo "VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key" > .env

# 5. Run SQL script from SUPABASE_SETUP.md in Supabase SQL Editor
# 6. Restart dev server
npm run dev
```

You should see "✅ Supabase Connected" in the app!

---

## Features to Explore

### 🤖 AI Chatbot
Click the **chat icon** in the bottom-right corner and ask:
- "Show me peptides for muscle recovery"
- "What's trending in nootropics?"
- "Find supplements for better sleep"
- "Which supplements are rising?"

### 💙 Track Supplements
- Click heart icon on any card
- View tracked items in "Tracked" tab
- Get personalized recommendations (needs 2+ tracked)
- **Persists across sessions with Supabase!**

### 🔍 Search & Filter
- Use the search bar for instant filtering
- Click category badges (Peptides, Vitamins, etc.)
- Sort by popularity, trend direction, or name
- Filter combinations by trend status

### 📊 View Insights
- Click "View AI Insights" on any supplement
- See detailed AI-generated analysis
- Explore trending supplement stacks
- View future trend predictions

### 📈 Research Signals
- Click "Research Signals" tab
- Discover emerging supplements from scientific literature
- View research phase and confidence scores
- Click "Scan Research" for latest discoveries

### 📧 Export & Schedule
- **Export Data** - Download trends as JSON or CSV
- **Email Scheduler** - Set up automated trend reports
- **API Settings** - Configure real trend sources

---

## Try the AI Chatbot

Click the **chat icon** (💬) in the bottom-right and try:

**Search queries:**
- "Show me all peptides"
- "What nootropics are trending?"
- "Find vitamins"

**Specific questions:**
- "Tell me about BPC-157"
- "What's NAD+ used for?"
- "Show rising supplements"

**Recommendations:**
- "What should I take for recovery?"
- "Best supplements for sleep?"
- "Cognitive enhancement stack?"

The chatbot understands natural language and provides smart filtering!

---

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
