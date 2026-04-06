# 🎯 TrendPulse - Quick Start

**Welcome to TrendPulse!** Your AI-powered supplement trend tracking platform.

---

## 🚦 Choose Your Path

### 🏃 I Want to Get Started Right Now
**Time: 25 minutes**

Follow this guide: **[`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)**

This covers everything:
- ✅ Supabase database setup
- ✅ API keys configuration
- ✅ Lovable deployment

### 📊 I Just Want to Connect Supabase
**Time: 10 minutes**

Follow this guide: **[`SUPABASE_CONNECTION_GUIDE.md`](./SUPABASE_CONNECTION_GUIDE.md)**

Perfect if you:
- Already have API keys
- Just need database connection
- Want to test locally first

### 🔌 I Want to Add All Connections
**Time: 15 minutes**

Follow this guide: **[`ALL_CONNECTIONS_SETUP.md`](./ALL_CONNECTIONS_SETUP.md)**

Detailed walkthrough for:
- API keys (EXA, Reddit, OpenAI, etc.)
- Supabase database
- Understanding what each API does

### 🌐 I Want to Deploy to Lovable
**Time: 10 minutes**

Follow these guides in order:
1. **[`SUPABASE_CONNECTION_GUIDE.md`](./SUPABASE_CONNECTION_GUIDE.md)** - Set up database
2. **[`CONNECT_TO_LOVABLE.md`](./CONNECT_TO_LOVABLE.md)** - Deploy to web

### 📋 I Want a Quick Checklist
**Time: 15 minutes**

Follow this guide: **[`QUICK_CONNECT_CHECKLIST.md`](./QUICK_CONNECT_CHECKLIST.md)**

Step-by-step checklist with no extra explanation.

---

## 🎯 What You Need (Minimum)

To run TrendPulse, you need:

### Required (Free)
1. **Supabase Account** → [Sign up](https://supabase.com)
   - Free tier: 500MB storage
   - Takes 10 minutes to set up

### Recommended (Free)
2. **At least ONE API key** (pick one):
   - **EXA API** (recommended) → [Sign up](https://exa.ai) - 1,000 free searches/month
   - **Reddit API** (free unlimited) → [Get key](https://www.reddit.com/prefs/apps)

### Optional (Enhances Features)
3. **OpenAI API** → [Get key](https://platform.openai.com/api-keys) - Better AI insights (~$5/month)
4. **RapidAPI** → [Get key](https://rapidapi.com/hub) - Twitter/TikTok/LinkedIn access ($10-30/month)
5. **Anthropic API** → [Get key](https://console.anthropic.com/settings/keys) - Claude AI alternative

---

## ⚡ Super Quick Setup (15 min)

If you just want to get it running ASAP:

### 1. Supabase (5 min)
```
1. Go to https://supabase.com → Create project
2. Settings → API → Copy URL & Anon Key
3. SQL Editor → Paste SUPABASE_SCHEMA_UPDATE.sql → Run
```

### 2. API Keys (5 min)
```
Pick ONE:
- EXA: https://exa.ai → Get API key (recommended)
- Reddit: https://www.reddit.com/prefs/apps → Create app → Copy client ID & secret
```

### 3. Configure App (5 min)
```
1. Run TrendPulse locally
2. Click "Admin" → "Connections"
3. Paste Supabase URL & Key
4. Paste API key(s)
5. Click "Save"
6. Go to "Trend Scheduler" → "Run Manual Update Now"
7. Wait 30 seconds → See results!
```

✅ **Done!** You now have a working TrendPulse installation.

---

## 🌐 Deploy to Lovable (Optional)

Want to share your app with others?

### Quick Deploy
```
1. Push code to GitHub
2. Go to https://lovable.dev → Import from GitHub
3. Settings → Environment Variables → Add:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Open your Lovable URL → Admin → Add API keys
5. Share your URL with anyone!
```

**Detailed guide:** [`CONNECT_TO_LOVABLE.md`](./CONNECT_TO_LOVABLE.md)

---

## 📖 All Available Guides

### Setup Guides
- **[`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)** - Full walkthrough (25 min)
- **[`SUPABASE_CONNECTION_GUIDE.md`](./SUPABASE_CONNECTION_GUIDE.md)** - Database only (10 min)
- **[`ALL_CONNECTIONS_SETUP.md`](./ALL_CONNECTIONS_SETUP.md)** - APIs + Database (15 min)
- **[`QUICK_CONNECT_CHECKLIST.md`](./QUICK_CONNECT_CHECKLIST.md)** - Checklist format (15 min)

### Deployment Guides
- **[`CONNECT_TO_LOVABLE.md`](./CONNECT_TO_LOVABLE.md)** - Full Lovable deployment
- **[`CUSTOM_DOMAIN_SETUP.md`](./CUSTOM_DOMAIN_SETUP.md)** - Add your own domain

### Reference Guides
- **[`API_KEYS_SETUP.md`](./API_KEYS_SETUP.md)** - Detailed API instructions
- **[`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md)** - How it works
- **[`SUPABASE_TROUBLESHOOTING.md`](./SUPABASE_TROUBLESHOOTING.md)** - Fix common issues

### Database Reference
- **`SUPABASE_SCHEMA_UPDATE.sql`** - Database schema (run in Supabase SQL Editor)

---

## 🆘 Having Issues?

### Common Problems

**"Supabase not configured" warning**
- Check environment variables are set correctly
- Verify URL starts with `https://` and ends with `.supabase.co`
- See: `SUPABASE_TROUBLESHOOTING.md`

**"No supplements showing"**
- Configure at least one API key (EXA or Reddit)
- Run manual update from Admin → Trend Scheduler
- Check browser console for errors

**"Admin dashboard shows Access Denied"**
- Sign in with the GitHub account that owns the app
- Check you're the owner in Lovable settings

**Detailed troubleshooting:** [`SUPABASE_TROUBLESHOOTING.md`](./SUPABASE_TROUBLESHOOTING.md)

---

## 💡 Quick Tips

### For Local Development
1. Use the Admin panel in-app to configure everything
2. API keys and Supabase config are stored in browser KV
3. No need for environment variables locally

### For Lovable Deployment
1. Use environment variables for Supabase (required)
2. Use Admin panel for API keys (recommended)
3. Only the app owner can access Admin panel
4. All users see the same data (single centralized backend)

### For Best Results
1. Configure at least 2 APIs for better trend coverage
2. Enable daily automated updates (Admin → Trend Scheduler)
3. Check API usage in provider dashboards periodically
4. Free tiers are generous - you likely won't exceed them

---

## 🎨 What You Can Do

### As App Owner (You)
- ✅ Configure API keys and Supabase
- ✅ Trigger manual trend updates
- ✅ Schedule automated daily updates
- ✅ Export trend reports (PDF/CSV)
- ✅ View system status and statistics
- ✅ Access Admin dashboard

### As Regular User (Others)
- ✅ View all trending supplements
- ✅ Filter by category (Peptides, Vitamins, etc.)
- ✅ View supplement stacks/combinations
- ✅ Use AI chatbot for recommendations
- ✅ Search and sort supplements
- ❌ Cannot modify data
- ❌ Cannot access Admin panel
- ❌ Cannot see API keys

---

## 📊 Understanding the App

### How It Works
1. **Daily Updates**: TrendPulse automatically fetches new supplement trends every day
2. **API Discovery**: Uses your configured APIs to search Reddit, forums, social media
3. **AI Analysis**: OpenAI/Anthropic analyze discussions and generate insights
4. **Supabase Storage**: All data is stored in your Supabase database
5. **User Access**: Anyone with the URL can view trends and use chatbot

### Data Flow
```
APIs (Reddit, EXA, etc.) 
  → TrendPulse fetches discussions
    → AI analyzes trends
      → Data stored in Supabase
        → Users view data in app
```

### Architecture
```
Frontend (React/TypeScript)
  ↕
Spark KV (Browser Storage)
  ↕
Supabase (Database)
  ↕
External APIs (Trend Sources)
```

**Full architecture:** [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md)

---

## 🎯 Next Steps

1. **Choose a setup guide** from the list above
2. **Follow the steps** (15-25 minutes)
3. **Run your first update** in Admin → Trend Scheduler
4. **Share your app** with friends, family, or the public
5. **Enjoy tracking supplement trends!** 🚀

---

## 📱 App Features

### Main App (Public Access)
- 📊 Browse trending supplements
- 🏷️ Filter by category
- 🔍 Search by name/description
- 📈 Sort by popularity or trend direction
- 💊 View supplement stacks/combinations
- 🤖 AI chatbot for personalized recommendations
- 📱 Mobile-responsive design

### Admin Dashboard (Owner Only)
- ⚙️ Configure API keys
- 🔗 Set up Supabase connection
- 🔄 Manual and scheduled trend updates
- 📊 System status and statistics
- 📧 Email report scheduling
- 📥 Export data (PDF/CSV)
- 🔮 View emerging research signals

---

**Ready to get started?** Pick a guide above and follow along! 🎉

**Questions?** Check the troubleshooting guides or review the detailed documentation.

**Happy trend tracking!** 🚀
