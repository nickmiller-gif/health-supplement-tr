# 🚀 Deploy TrendPulse with Custom Domain - Quick Guide

## What You Want
Deploy your TrendPulse app to **Lovable.dev** with a **custom domain** (like `trendpulse.com` or `yourdomain.com`).

---

## Overview in 3 Steps

```
1. Deploy to Lovable
   ↓
2. Connect Supabase Backend
   ↓
3. Add Custom Domain
```

---

## Step 1: Deploy to Lovable (15 minutes)

### A. Prerequisites
- GitHub account
- Lovable account (sign up at https://lovable.dev)
- Your TrendPulse code on GitHub

### B. Import to Lovable
1. Go to https://lovable.dev
2. Sign in with GitHub
3. Click **"New Project"** or **"Import from GitHub"**
4. Select your TrendPulse repository
5. Wait for import to complete

✅ **Result**: Your app is now live at `https://your-project-name.lovable.app`

---

## Step 2: Connect Supabase (20 minutes)

### A. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `trendpulse-backend`
   - Password: Generate and save it
   - Region: Choose closest to you
4. Wait ~2 minutes for setup

### B. Get Supabase Credentials
1. In Supabase, click **Settings** → **API**
2. Copy and save:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long token)

### C. Add to Lovable Environment Variables
1. In Lovable, go to your project **Settings** → **Environment Variables**
2. Add these two variables:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
   ```
3. Save and redeploy

### D. Create Database Tables
1. In Supabase, go to **SQL Editor**
2. Click **"+ New query"**
3. Copy the SQL script from `CONNECT_TO_LOVABLE.md` (lines 64-232)
4. Click **"Run"**
5. Verify 4 tables created in **Table Editor**

✅ **Result**: Your app is connected to Supabase backend

**Detailed guide**: See `CONNECT_TO_LOVABLE.md`

---

## Step 3: Add Custom Domain (30-60 minutes)

### A. Purchase Domain (if you don't have one)
Buy from:
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

**Cost**: ~$10-15/year

### B. Upgrade to Lovable Pro
- Custom domains require a paid Lovable plan
- **Cost**: ~$20-30/month
- Upgrade in Lovable settings

### C. Add Domain in Lovable
1. In Lovable, go to **Settings** → **Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `trendpulse.com`)
4. Lovable will give you DNS records like:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (example)
   ```
   **Copy these values!**

### D. Configure DNS at Your Registrar

**Example for Namecheap**:
1. Log into Namecheap
2. Go to **Domain List** → **Manage** → **Advanced DNS**
3. Add A Record:
   - Type: `A Record`
   - Host: `@`
   - Value: `[IP from Lovable]`
4. Add CNAME Record:
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.lovable.app`
5. Save

**For other registrars**: See detailed instructions in `CUSTOM_DOMAIN_SETUP.md`

### E. Wait for DNS Propagation
- **Time**: 30 minutes to 2 hours (usually)
- **Check progress**: https://dnschecker.org

### F. Verify Domain Works
1. Visit `https://yourdomain.com`
2. Check for 🔒 SSL lock icon
3. Verify TrendPulse loads correctly

✅ **Result**: Your app is live at your custom domain!

**Detailed guide**: See `CUSTOM_DOMAIN_SETUP.md`

---

## Quick Reference: Costs

| Item | Cost | Required |
|------|------|----------|
| Domain registration | $10-15/year | Yes (for custom domain) |
| Lovable Free | $0/month | Yes (for deployment) |
| Lovable Pro | $20-30/month | Yes (for custom domain) |
| Supabase Free | $0/month | Yes (for backend) |
| Supabase Pro | $25/month | Optional |
| **Total** | **~$21-31/month + $12/year** | - |

**Without custom domain**: Just $0/month (using `*.lovable.app` subdomain)

---

## Architecture Diagram

```
┌──────────────────────────────────────┐
│  🌐 Your Custom Domain               │
│  https://trendpulse.com              │
└──────────────┬───────────────────────┘
               │ (DNS points to)
               ↓
┌──────────────────────────────────────┐
│  🚀 Lovable Deployment               │
│  - TrendPulse React app              │
│  - Auto-deployments from GitHub      │
│  - Free SSL certificate              │
│  - Global CDN                        │
└──────────────┬───────────────────────┘
               │ (reads from)
               ↓
┌──────────────────────────────────────┐
│  📊 Supabase Backend                 │
│  - Supplement trends data            │
│  - API keys (secure)                 │
│  - Supplement combinations           │
│  - Emerging research signals         │
└──────────────────────────────────────┘
```

---

## Troubleshooting

### ❌ "Supabase not configured" showing
**Fix**: Verify environment variables in Lovable settings match your Supabase credentials exactly

### ❌ Domain not working after 24 hours
**Fix**: 
1. Check DNS records match Lovable values
2. Use https://dnschecker.org to verify propagation
3. Contact your domain registrar support

### ❌ SSL certificate not issuing
**Fix**:
1. Wait 1-2 hours for DNS propagation
2. If using Cloudflare, disable proxy (gray cloud)
3. Check Lovable domain status

### ❌ App works on lovable.app but not custom domain
**Fix**:
1. Verify DNS records are correct
2. Check domain status in Lovable is "Active"
3. Clear browser cache and retry

---

## Complete Documentation

### For Deployment
- **[CONNECT_TO_LOVABLE.md](./CONNECT_TO_LOVABLE.md)** - Complete Lovable + Supabase setup
- **[LOVABLE_SUPABASE_SETUP.md](./LOVABLE_SUPABASE_SETUP.md)** - Detailed Supabase guide

### For Custom Domain
- **[CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md)** - Complete domain setup guide
  - DNS configuration for all major registrars
  - SSL certificate setup
  - Multiple domain configurations
  - Email setup (optional)
  - Troubleshooting

### For App Features
- **[QUICK_START_UPDATES.md](./QUICK_START_UPDATES.md)** - Automated trend updates
- **[README.md](./README.md)** - Main project overview
- **[PRD.md](./PRD.md)** - Product requirements

---

## Next Steps After Deployment

### 1. Add API Keys (Optional but Recommended)
Enable real trend discovery:
1. Get API keys from:
   - **EXA**: https://exa.ai
   - **OpenAI**: https://platform.openai.com
   - **Reddit**: https://www.reddit.com/prefs/apps
2. Add to Supabase `api_configuration` table
3. See `API_KEYS_SETUP.md` for details

### 2. Enable Automated Updates
Set up daily trend updates:
1. Go to Admin Dashboard in your app
2. Configure update schedule
3. Test manual update
4. See `QUICK_START_UPDATES.md` for details

### 3. Add Sample Data
Test with sample supplements:
1. Use Supabase Table Editor
2. Add sample supplements manually
3. Or run SQL insert script
4. See `CONNECT_TO_LOVABLE.md` Part 3

### 4. Set Up Analytics (Optional)
Track usage:
- Google Analytics
- Plausible
- Mixpanel

### 5. Share Your App
- Share `https://yourdomain.com` with users
- Users can view trends and use chatbot
- No configuration needed by users

---

## Support

### Documentation
- `CUSTOM_DOMAIN_SETUP.md` - Domain setup
- `CONNECT_TO_LOVABLE.md` - Lovable deployment
- `DOCS_INDEX.md` - All documentation

### External Help
- **Lovable**: https://docs.lovable.dev
- **Supabase**: https://supabase.com/docs
- **DNS Checker**: https://dnschecker.org

### Common Issues
All troubleshooting covered in:
- `CUSTOM_DOMAIN_SETUP.md` - Domain issues
- `CONNECT_TO_LOVABLE.md` - Deployment issues
- `SUPABASE_TROUBLESHOOTING.md` - Database issues

---

## Summary Checklist

### Deployment ✅
- [ ] Code on GitHub
- [ ] Imported to Lovable
- [ ] App loads at `*.lovable.app`

### Backend ✅
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Environment variables added to Lovable
- [ ] App connects to Supabase

### Custom Domain ✅
- [ ] Domain purchased
- [ ] Lovable Pro active
- [ ] Domain added in Lovable
- [ ] DNS records configured
- [ ] Domain status "Active"
- [ ] SSL certificate issued
- [ ] App loads at custom domain

### Optional ✅
- [ ] API keys added
- [ ] Sample data added
- [ ] Automated updates enabled
- [ ] Analytics configured

---

## 🎉 You're Done!

Once completed, you'll have:
- ✅ TrendPulse live at your custom domain
- ✅ Secure Supabase backend
- ✅ Automatic SSL/HTTPS
- ✅ Ready for users

**Your app**: `https://yourdomain.com`

**Next**: Share with users and start tracking supplement trends!
