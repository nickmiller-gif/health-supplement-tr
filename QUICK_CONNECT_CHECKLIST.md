# ⚡ Quick Connect Checklist - TrendPulse to Lovable

Use this checklist to connect your TrendPulse app to Lovable with Supabase in **15 minutes**.

---

## 📋 Before You Start

**You need:**
- [ ] Supabase account (free) → [Sign up](https://supabase.com/dashboard)
- [ ] Lovable account → [Sign up](https://lovable.dev)
- [ ] Your code on GitHub

---

## ⚙️ Step 1: Supabase Setup (5 mins)

### Create Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Name: `trendpulse-backend`
- [ ] Generate & save password
- [ ] Region: (choose closest)
- [ ] Create project & wait 2 mins

### Get Credentials
- [ ] Go to Settings → API
- [ ] **Copy & save:**
  - Project URL: `https://xxx.supabase.co`
  - anon public key: `eyJ...`

### Create Tables
- [ ] Go to SQL Editor
- [ ] Click "+ New query"
- [ ] Paste SQL from `LOVABLE_SUPABASE_SETUP.md` (lines 86-253)
- [ ] Click "Run"
- [ ] Verify: Table Editor shows 4 tables:
  - `api_configuration`
  - `supplements`
  - `supplement_combinations`
  - `emerging_signals`

### Add API Keys (Optional)
- [ ] Get OpenAI key → https://platform.openai.com/api-keys
- [ ] Table Editor → `api_configuration` → Edit row
- [ ] Add your `openai_api_key`
- [ ] Save

---

## 🚀 Step 2: Lovable Setup (5 mins)

### Import Project
- [ ] Go to https://lovable.dev
- [ ] Sign in with GitHub
- [ ] Click "Import from GitHub"
- [ ] Select TrendPulse repo
- [ ] Wait for import

### Add Environment Variables
- [ ] In Lovable: Settings → Environment Variables
- [ ] Add these **exactly**:
  ```
  VITE_SUPABASE_URL
  Value: https://xxx.supabase.co (from Step 1)
  
  VITE_SUPABASE_ANON_KEY
  Value: eyJ... (from Step 1)
  ```
- [ ] Save
- [ ] Redeploy if needed

---

## ✅ Step 3: Test (2 mins)

### Verify Connection
- [ ] Open your Lovable app URL
- [ ] Check: No "Supabase not configured" banner
- [ ] Check: App loads without errors
- [ ] Check: Browser console has no errors

### Add Test Data (Optional)
- [ ] Supabase → Table Editor → `supplements`
- [ ] Click "Insert row"
- [ ] Fill in:
  ```
  id: test-supplement
  name: Test Supplement
  category: vitamin
  trend_direction: rising
  popularity_score: 85
  description: Test description
  trend_data: [70, 75, 80, 85]
  ```
- [ ] Save
- [ ] Refresh Lovable app
- [ ] Check: Supplement appears

---

## 🎉 You're Done!

**What you have now:**
- ✅ TrendPulse deployed on Lovable
- ✅ Connected to Supabase backend
- ✅ Secure API key storage
- ✅ Ready for production

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase not configured" banner | Double-check env vars in Lovable → Redeploy |
| No data showing | Add test data in Supabase Table Editor |
| Chatbot not working | Add OpenAI key to `api_configuration` table |
| Console errors | Check Supabase URL & key are correct |

**Need more help?** See `CONNECT_TO_LOVABLE.md` for detailed guide.

---

## 📱 What Your Users See

Users visiting your Lovable app will:
- ✅ See daily supplement trends
- ✅ Filter by category
- ✅ Sort by popularity/trend
- ✅ View supplement stacks
- ✅ Chat with AI for recommendations
- ❌ **Cannot** see or change API keys
- ❌ **Cannot** modify data

**You control everything from Supabase!**

---

## 🔄 Next: Add Real Data

**Option 1: Manual**
- Use Supabase Table Editor to add supplements

**Option 2: Import**
- Run SQL INSERT statements in SQL Editor

**Option 3: Automated**
- Set up Supabase Edge Functions (see `BACKEND_ARCHITECTURE.md`)

---

## 📚 More Resources

- **Detailed Setup**: `CONNECT_TO_LOVABLE.md`
- **Full Supabase Guide**: `LOVABLE_SUPABASE_SETUP.md`
- **Troubleshooting**: `SUPABASE_TROUBLESHOOTING.md`
- **API Keys**: `API_KEYS_SETUP.md`

---

**Total Time: ~15 minutes** ⏱️

Good luck! 🚀
