# 🌐 Custom Domain Setup for TrendPulse on Lovable

## Overview
This guide walks you through adding a custom domain to your TrendPulse application deployed on Lovable.dev.

---

## Prerequisites

Before setting up a custom domain, you need:
- [ ] TrendPulse deployed on Lovable (see `CONNECT_TO_LOVABLE.md`)
- [ ] A custom domain you own (e.g., `trendpulse.com`)
- [ ] Access to your domain's DNS settings
- [ ] A Lovable Pro account (custom domains require a paid plan)

---

## Part 1: Understanding Lovable Domains

### Default Lovable Domain
When you deploy to Lovable, you automatically get a free subdomain:
```
https://your-project-name.lovable.app
```

### Custom Domain Benefits
- Professional appearance (e.g., `trendpulse.com`)
- Better branding and trust
- SEO advantages
- Custom SSL certificate (automatic)

---

## Part 2: Purchase/Prepare Your Domain

### Where to Buy Domains

Popular domain registrars:
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google
- **GoDaddy**: https://www.godaddy.com
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

### Domain Options

You can use:
1. **Root domain**: `trendpulse.com`
2. **Subdomain**: `app.trendpulse.com` or `trends.trendpulse.com`
3. **www subdomain**: `www.trendpulse.com`

**Recommendation**: Set up both root and www to redirect to the same site.

---

## Part 3: Add Domain to Lovable

### Step 1: Access Lovable Project Settings

1. **Log into Lovable**: https://lovable.dev
2. **Open your TrendPulse project**
3. **Navigate to Settings** → **Domains**

### Step 2: Add Custom Domain

1. **Click "Add Custom Domain"**
2. **Enter your domain**:
   ```
   trendpulse.com
   ```
   Or subdomain:
   ```
   app.trendpulse.com
   ```
3. **Click "Add Domain"**

### Step 3: Get DNS Records

Lovable will provide you with DNS records to configure. These typically look like:

**For Root Domain (trendpulse.com):**
```
Type: A
Name: @
Value: 76.76.21.21 (example IP)
TTL: Auto
```

**For Subdomain (app.trendpulse.com):**
```
Type: CNAME
Name: app
Value: cname.lovable.app
TTL: Auto
```

**Important**: Copy these exact values - you'll need them in the next step.

---

## Part 4: Configure DNS Records

### Option A: Namecheap

1. **Log into Namecheap**
2. **Go to Domain List** → Click **Manage** next to your domain
3. **Click "Advanced DNS" tab**
4. **Add A Record** (for root domain):
   - Type: `A Record`
   - Host: `@`
   - Value: `[IP from Lovable]`
   - TTL: `Automatic`
5. **Add CNAME Record** (for www):
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.lovable.app`
   - TTL: `Automatic`
6. **Save Changes**

### Option B: Google Domains

1. **Log into Google Domains**
2. **Select your domain**
3. **Go to DNS** → **Manage custom records**
4. **Add A Record**:
   - Host name: `@`
   - Type: `A`
   - TTL: `3600`
   - Data: `[IP from Lovable]`
5. **Add CNAME Record**:
   - Host name: `www`
   - Type: `CNAME`
   - TTL: `3600`
   - Data: `cname.lovable.app`
6. **Save**

### Option C: Cloudflare

1. **Log into Cloudflare**
2. **Select your domain**
3. **Go to DNS** → **Records**
4. **Add A Record**:
   - Type: `A`
   - Name: `@`
   - IPv4 address: `[IP from Lovable]`
   - Proxy status: **DNS only** (gray cloud)
5. **Add CNAME Record**:
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.lovable.app`
   - Proxy status: **DNS only** (gray cloud)
6. **Save**

**Important**: For Cloudflare, keep proxy status as "DNS only" during initial setup.

### Option D: GoDaddy

1. **Log into GoDaddy**
2. **Go to My Products** → **DNS**
3. **Find your domain** → Click **DNS**
4. **Add A Record**:
   - Type: `A`
   - Name: `@`
   - Value: `[IP from Lovable]`
   - TTL: `1 Hour`
5. **Add CNAME Record**:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.lovable.app`
   - TTL: `1 Hour`
6. **Save**

---

## Part 5: Verify Domain Connection

### DNS Propagation

After configuring DNS:
- **Wait time**: 5 minutes to 48 hours (usually 1-2 hours)
- **Average**: 30 minutes to 1 hour

### Check DNS Propagation

Use these tools to verify DNS changes:

1. **DNS Checker**: https://dnschecker.org
   - Enter your domain
   - Check if A/CNAME records show globally

2. **Command Line**:
   ```bash
   # Check A record
   dig trendpulse.com
   
   # Check CNAME record
   dig www.trendpulse.com
   ```

3. **What's My DNS**: https://www.whatsmydns.net
   - Enter your domain
   - Verify records across different locations

### Verify in Lovable

1. **Return to Lovable** → **Settings** → **Domains**
2. **Check domain status**:
   - 🟡 Pending = DNS not propagated yet
   - 🟢 Active = Domain connected successfully
   - 🔴 Error = DNS configuration issue

---

## Part 6: SSL Certificate Setup

### Automatic SSL

Lovable automatically provisions SSL certificates via Let's Encrypt:
- **No action needed** on your part
- **Automatic renewal** every 90 days
- **Free** SSL certificate

### SSL Status

1. **Initial**: May show "Pending" for 5-10 minutes
2. **Active**: Certificate issued and domain secured
3. **Your site**: Will be accessible via `https://`

---

## Part 7: Testing Your Custom Domain

### Checklist

Test all these URLs to ensure they work:

- [ ] `https://trendpulse.com` - Root domain
- [ ] `https://www.trendpulse.com` - WWW subdomain
- [ ] `http://trendpulse.com` - Redirects to HTTPS
- [ ] `http://www.trendpulse.com` - Redirects to HTTPS

### What to Test

1. **Load the app**:
   - Navigate to your custom domain
   - Verify TrendPulse loads correctly
   - Check that all features work

2. **Check SSL**:
   - Look for 🔒 lock icon in browser
   - Click lock → View certificate
   - Verify it's issued for your domain

3. **Test functionality**:
   - Supplement cards display
   - Search and filters work
   - Chatbot responds
   - No console errors

---

## Common Domain Configurations

### Configuration 1: Root Domain Only
```
trendpulse.com → Your TrendPulse app
www.trendpulse.com → Redirects to trendpulse.com
```

**DNS Records**:
```
A     @     76.76.21.21
CNAME www   trendpulse.com
```

### Configuration 2: WWW Primary
```
www.trendpulse.com → Your TrendPulse app
trendpulse.com → Redirects to www.trendpulse.com
```

**DNS Records**:
```
A     @     76.76.21.21
CNAME www   cname.lovable.app
```

### Configuration 3: Subdomain
```
app.trendpulse.com → Your TrendPulse app
trendpulse.com → Different site or redirects
```

**DNS Records**:
```
CNAME app   cname.lovable.app
```

---

## Troubleshooting

### ❌ Domain Not Working After 24 Hours

**Possible causes**:
1. DNS records not configured correctly
2. Incorrect values from Lovable
3. DNS propagation issues

**Fix**:
1. Verify DNS records match Lovable exactly
2. Use `dig` or DNS checker tools
3. Check for typos in domain name
4. Contact Lovable support

### ❌ SSL Certificate Not Issuing

**Possible causes**:
1. DNS not fully propagated
2. CAA records blocking Let's Encrypt
3. Cloudflare proxy enabled

**Fix**:
1. Wait 1-2 hours for DNS propagation
2. Check CAA records allow Let's Encrypt:
   ```
   CAA 0 issue "letsencrypt.org"
   ```
3. Disable Cloudflare proxy (gray cloud)

### ❌ "This site can't be reached"

**Possible causes**:
1. DNS records not added yet
2. Wrong IP/CNAME value
3. Domain not propagated

**Fix**:
1. Double-check DNS configuration
2. Verify with DNS checker tools
3. Wait for propagation (up to 48 hours)

### ❌ Mixed Content Warnings

**Possible causes**:
1. Loading HTTP resources on HTTPS page
2. Hardcoded HTTP URLs in code

**Fix**:
1. Ensure all resources use HTTPS
2. Use relative URLs when possible
3. Update any hardcoded URLs

---

## Multiple Domains

You can add multiple domains to point to the same app:

**Example**:
```
trendpulse.com        → Main app
supplementtrends.com  → Points to same app
trends.health         → Points to same app
```

**To add multiple domains**:
1. Repeat the "Add Custom Domain" process in Lovable
2. Configure DNS for each domain
3. Lovable will issue SSL for each

---

## Domain Email Setup (Optional)

If you want email addresses like `contact@trendpulse.com`:

### Option 1: Google Workspace
- **Cost**: ~$6/user/month
- **Setup**: https://workspace.google.com
- **Add MX records** to your domain DNS

### Option 2: Zoho Mail
- **Cost**: Free for 5 users
- **Setup**: https://www.zoho.com/mail/
- **Add MX records** to your domain DNS

### Option 3: Cloudflare Email Routing
- **Cost**: Free
- **Setup**: https://www.cloudflare.com/products/email-routing/
- **Forwards emails** to existing address

**Note**: Email setup is independent of your web app - it just uses the same domain.

---

## Best Practices

### SEO-Friendly Setup

1. **Choose one primary domain**:
   - Either `trendpulse.com` or `www.trendpulse.com`
   - Redirect the other to your primary

2. **Use HTTPS everywhere**:
   - Always redirect HTTP to HTTPS
   - Lovable handles this automatically

3. **Set up Google Search Console**:
   - Verify your domain
   - Submit sitemap
   - Monitor search performance

### Security

1. **Enable DNSSEC** (if your registrar supports it):
   - Protects against DNS spoofing
   - Available in Cloudflare, Google Domains

2. **Monitor SSL certificate**:
   - Lovable auto-renews
   - Check expiration periodically

3. **Keep registrar account secure**:
   - Use strong password
   - Enable 2FA
   - Lock domain transfers

---

## Cost Overview

### Domain Costs
- **Domain registration**: $10-15/year (varies by TLD)
- **Domain renewal**: Same as registration
- **Privacy protection**: Usually free or $2-5/year

### Lovable Hosting Costs
- **Free tier**: `*.lovable.app` subdomain
- **Pro tier**: ~$20-30/month (required for custom domains)
- **SSL certificate**: Free (included)

### Total Estimated Monthly Cost
```
Domain: ~$1/month ($12/year)
Lovable Pro: ~$20-30/month
Supabase: Free (or $25/month for Pro)
API costs: Variable based on usage
─────────────────────────────
Total: ~$21-31/month
```

---

## Example Complete Setup

### Scenario: Setting up `trendpulse.com`

1. **Purchase domain**: Buy `trendpulse.com` from Namecheap ($12/year)

2. **Deploy to Lovable**: 
   - Follow `CONNECT_TO_LOVABLE.md`
   - App is live at `trendpulse-app.lovable.app`

3. **Upgrade to Lovable Pro**: Required for custom domain

4. **Add domain in Lovable**:
   - Add `trendpulse.com`
   - Get DNS records

5. **Configure Namecheap DNS**:
   ```
   A     @     76.76.21.21
   CNAME www   cname.lovable.app
   ```

6. **Wait 30 minutes**: DNS propagates

7. **Verify**: 
   - `https://trendpulse.com` ✅ Works!
   - `https://www.trendpulse.com` ✅ Works!
   - SSL active ✅

8. **Done**: Share your app!

---

## Quick Reference

### Common DNS Record Types
- **A**: Points domain to IP address (IPv4)
- **AAAA**: Points domain to IP address (IPv6)
- **CNAME**: Points domain to another domain
- **MX**: Mail server records
- **TXT**: Text records (for verification)

### DNS Symbols
- **@**: Represents your root domain
- **www**: Subdomain for World Wide Web
- **\***: Wildcard (all subdomains)

### TTL (Time To Live)
- **300**: 5 minutes (good for testing)
- **3600**: 1 hour (common default)
- **86400**: 24 hours (long cache)
- **Auto**: Let DNS provider decide

---

## Getting Help

### Lovable Support
- **Documentation**: https://docs.lovable.dev
- **Support email**: support@lovable.dev
- **Community**: Lovable Discord

### Domain Registrar Support
- Check your registrar's help docs
- Most have 24/7 chat support
- Many have setup guides

### DNS Tools
- **DNS Checker**: https://dnschecker.org
- **What's My DNS**: https://www.whatsmydns.net
- **MX Toolbox**: https://mxtoolbox.com

---

## Summary Checklist

### Pre-Setup
- [ ] TrendPulse deployed on Lovable
- [ ] Lovable Pro account active
- [ ] Domain purchased and accessible

### DNS Configuration
- [ ] Logged into domain registrar
- [ ] Added A record for root domain
- [ ] Added CNAME for www subdomain
- [ ] Saved DNS changes

### Lovable Configuration
- [ ] Added custom domain in Lovable
- [ ] Verified DNS records match
- [ ] Waited for DNS propagation
- [ ] Domain shows as "Active"

### Verification
- [ ] Root domain loads (https://)
- [ ] WWW subdomain loads (https://)
- [ ] SSL certificate active
- [ ] All app features work
- [ ] No browser warnings

### Optional
- [ ] Set up email forwarding
- [ ] Added to Google Search Console
- [ ] Configured analytics
- [ ] Shared with users

---

## 🎉 Success!

Once you complete these steps, your TrendPulse app will be live at your custom domain with:
- ✅ Professional custom domain
- ✅ Automatic HTTPS/SSL
- ✅ Fast global CDN
- ✅ Automatic deployments from Lovable

**Your users can now visit**: `https://yourdomain.com`

**Questions?** Check the troubleshooting section or contact Lovable support.
