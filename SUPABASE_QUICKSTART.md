# ⚡ Supabase Quick Start (5 Minutes)

A condensed checklist for experienced developers. For detailed instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Prerequisites
- [ ] Node.js installed
- [ ] TrendPulse project cloned
- [ ] Email address for Supabase account

---

## Setup Steps

### 1. Create Supabase Project (2 min)
- [ ] Visit [supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Sign up / Log in
- [ ] Click "New Project"
- [ ] Name: `trendpulse`
- [ ] Generate password (save it!)
- [ ] Select region
- [ ] Wait for initialization

### 2. Get Credentials (30 sec)
- [ ] Settings → API
- [ ] Copy **Project URL**
- [ ] Copy **anon/public** key

### 3. Configure App (1 min)
Create `.env` in project root:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Create Tables (2 min)
- [ ] Open SQL Editor in Supabase dashboard
- [ ] Copy [this SQL script](./SUPABASE_SETUP.md#4️⃣-create-database-tables)
- [ ] Paste and Run
- [ ] Verify 5 tables created in Table Editor

### 5. Test Connection (30 sec)
```bash
npm run dev
```
- [ ] See "Supabase Connected" ✅
- [ ] Click "Seed Sample Data" (optional)
- [ ] Click "Refresh Trends" to populate real data

---

## Verification

✅ Green "Supabase Connected" banner  
✅ Tables visible in Supabase dashboard  
✅ Data persists after page refresh  

---

## Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Connection Failed | Restart dev server: `npm run dev` |
| Tables missing | Re-run SQL script in Step 4 |
| No data showing | Hard refresh: `Ctrl/Cmd + Shift + R` |
| RLS blocking | Check policies in SQL script |

---

## What's Next?

1. **Add API Keys** → Click "API Settings" in app
2. **Get Real Trends** → Click "Refresh Trends"
3. **Explore Data** → Check Table Editor in Supabase

---

**Need Help?** See full guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
