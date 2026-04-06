# 🎯 TrendPulse Setup - Start Here

Welcome! This guide helps you connect TrendPulse to Lovable with Supabase backend.

---

## 🤔 What You're Building

**TrendPulse** is a centralized supplement intelligence platform where:
- 👥 **All users** see the same daily supplement trends (read-only)
- 🤖 **AI chatbot** answers questions about supplements
- 🔒 **API keys** are stored securely in Supabase (not in browsers)
- 👤 **You (admin)** control data updates from Supabase dashboard

**No per-user configuration needed!** Users just visit and browse.

---

## 🚀 Choose Your Path

### Path 1: Quick Start (Recommended for Lovable)
**Time: 15 minutes**  
**Best for: Deploying to Lovable.dev**

📋 Follow: **[QUICK_CONNECT_CHECKLIST.md](./QUICK_CONNECT_CHECKLIST.md)**

**Steps:**
1. Create Supabase project (5 min)
2. Run SQL setup script (2 min)
3. Connect to Lovable (5 min)
4. Add environment variables (2 min)
5. Test connection (1 min)

---

### Path 2: Detailed Guide
**Time: 30 minutes**  
**Best for: Understanding everything**

📖 Follow: **[CONNECT_TO_LOVABLE.md](./CONNECT_TO_LOVABLE.md)**

**What you get:**
- Step-by-step instructions with screenshots
- Explanation of each step
- How to add API keys
- Testing procedures
- Troubleshooting guide

---

### Path 3: Architecture First
**Time: 10 minutes reading + setup**  
**Best for: Technical users who want to understand the system**

🏗️ Read: **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)**

**Then choose Path 1 or 2 above.**

---

## 📦 What You Need

### Required
- [ ] **Supabase account** (free) → [Sign up](https://supabase.com/dashboard)
- [ ] **Lovable account** → [Sign up](https://lovable.dev)
- [ ] Your TrendPulse code on GitHub

### Optional (for real data)
- [ ] **OpenAI API key** (for chatbot) → [Get key](https://platform.openai.com/api-keys)
- [ ] **EXA API key** (for trend discovery) → [Get key](https://exa.ai/)
- [ ] **Reddit API** (for discussions) → [Get key](https://www.reddit.com/prefs/apps)

**Note:** App works without API keys, but uses mock data.

---

## 🎯 Quick Overview

```
┌──────────────────────────────────────────┐
│  Step 1: Create Supabase Project        │
│  → Get URL & API key                    │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│  Step 2: Run SQL Script                 │
│  → Creates 4 tables                     │
│  → Sets up security policies            │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│  Step 3: Add API Keys to Database       │
│  → Optional but recommended             │
│  → For real data & chatbot              │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│  Step 4: Connect to Lovable             │
│  → Import from GitHub                   │
│  → Add environment variables            │
└────────────────┬─────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────┐
│  ✅ Done! App is live                   │
│  → Users can browse trends              │
│  → You control data from Supabase       │
└──────────────────────────────────────────┘
```

---

## 📋 All Documentation Files

### 🌟 Essential (Start Here)
| File | Purpose | Time |
|------|---------|------|
| **[QUICK_CONNECT_CHECKLIST.md](./QUICK_CONNECT_CHECKLIST.md)** | Fastest setup path | 15 min |
| **[CONNECT_TO_LOVABLE.md](./CONNECT_TO_LOVABLE.md)** | Complete step-by-step | 30 min |
| **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** | Understand the system | 10 min |

### 🔧 Technical Details
| File | Purpose |
|------|---------|
| **[LOVABLE_SUPABASE_SETUP.md](./LOVABLE_SUPABASE_SETUP.md)** | Full Supabase configuration guide |
| **[SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)** | Fix common issues |
| **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** | Backend design & data flow |

### 📚 Reference
| File | Purpose |
|------|---------|
| **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Alternative Supabase setup |
| **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** | General deployment checklist |
| **[API_KEYS_SETUP.md](./API_KEYS_SETUP.md)** | API key sources & setup |

---

## 🆘 Need Help?

### Common Issues

**"Supabase not configured" banner showing**
→ See: [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)

**No data showing in app**
→ Add sample data: [CONNECT_TO_LOVABLE.md - Part 3](./CONNECT_TO_LOVABLE.md#part-3-add-sample-data-optional)

**Chatbot not responding**
→ Add OpenAI key to Supabase `api_configuration` table

**Environment variables not working in Lovable**
→ Check exact variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## 🎓 Learning Path

### If you're new to Supabase:
1. Read [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) first
2. Follow [LOVABLE_SUPABASE_SETUP.md](./LOVABLE_SUPABASE_SETUP.md)
3. Check [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md) if issues

### If you're new to Lovable:
1. Follow [QUICK_CONNECT_CHECKLIST.md](./QUICK_CONNECT_CHECKLIST.md)
2. Read [CONNECT_TO_LOVABLE.md](./CONNECT_TO_LOVABLE.md) for details

### If you want to understand everything:
1. Start with [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
2. Then [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
3. Finally [LOVABLE_SUPABASE_SETUP.md](./LOVABLE_SUPABASE_SETUP.md)

---

## ✅ Success Checklist

After setup, verify:
- [ ] App loads on Lovable without errors
- [ ] No "Supabase not configured" banner
- [ ] Can see supplement cards (if data added)
- [ ] Chatbot button appears
- [ ] No console errors in browser
- [ ] Supabase shows 4 tables
- [ ] API keys stored in database (optional)

---

## 🎉 What Happens After Setup

### For You (Admin)
✅ Control all data from Supabase dashboard  
✅ Update trends manually or automatically  
✅ Add/remove supplements anytime  
✅ Monitor usage in Supabase analytics  
✅ One place to manage everything  

### For Your Users
✅ Visit app and see trends instantly  
✅ No setup or configuration needed  
✅ Use chatbot for recommendations  
✅ Filter and sort supplements  
✅ Always see latest data  

---

## 🚀 Ready to Start?

### Fastest Path:
👉 **[QUICK_CONNECT_CHECKLIST.md](./QUICK_CONNECT_CHECKLIST.md)** ← Start here!

### Most Complete:
👉 **[CONNECT_TO_LOVABLE.md](./CONNECT_TO_LOVABLE.md)** ← Detailed guide

### Want to Understand First:
👉 **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** ← Learn the system

---

## 💡 Pro Tips

1. **Start with the Quick Checklist** - You can always read detailed docs later
2. **Save your Supabase credentials** - You'll need them multiple times
3. **Test with sample data first** - Before setting up real APIs
4. **Use Supabase Table Editor** - Easiest way to view/edit data
5. **Check environment variables twice** - Most common deployment issue

---

## 📞 Support

**Documentation:**
- All guides in this repository
- Links to official Supabase/Lovable docs
- Troubleshooting guides included

**Community:**
- Supabase Discord
- Lovable Community
- GitHub Issues (for this project)

---

**🎯 Bottom Line:**

1. Choose **Quick** (15 min) or **Detailed** (30 min)
2. Follow the guide step-by-step
3. Test your connection
4. You're live!

**Let's get started!** 🚀
