# 🏗️ TrendPulse Architecture - Lovable + Supabase

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    🌐 LOVABLE DEPLOYMENT                        │
│                   (https://your-app.lovable.app)                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  TrendPulse React App                                     │ │
│  │  ├─ View supplements & stacks                             │ │
│  │  ├─ Filter by category                                    │ │
│  │  ├─ Sort by popularity/trend                              │ │
│  │  └─ AI Chatbot                                            │ │
│  │                                                            │ │
│  │  Environment Variables:                                   │ │
│  │  • VITE_SUPABASE_URL                                      │ │
│  │  • VITE_SUPABASE_ANON_KEY                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Supabase Client
                             │ (Read-Only Access via RLS)
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    📊 SUPABASE BACKEND                          │
│                  (https://xxx.supabase.co)                      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🗄️ PostgreSQL Database                                   │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────┐          │ │
│  │  │  📋 api_configuration                        │          │ │
│  │  │  • exa_api_key                               │          │ │
│  │  │  • reddit_client_id/secret                   │          │ │
│  │  │  • rapidapi_key                              │          │ │
│  │  │  • openai_api_key                            │          │ │
│  │  │  • anthropic_api_key                         │          │ │
│  │  │                                               │          │ │
│  │  │  🔒 RLS: Public READ access                  │          │ │
│  │  └─────────────────────────────────────────────┘          │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────┐          │ │
│  │  │  💊 supplements                              │          │ │
│  │  │  • id, name, category                        │          │ │
│  │  │  • trend_direction, popularity_score         │          │ │
│  │  │  • description, trend_data                   │          │ │
│  │  │  • discussion_links, ai_insight              │          │ │
│  │  │                                               │          │ │
│  │  │  🔒 RLS: Public READ access                  │          │ │
│  │  └─────────────────────────────────────────────┘          │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────┐          │ │
│  │  │  🔬 supplement_combinations                  │          │ │
│  │  │  • id, name, description, purpose            │          │ │
│  │  │  • supplement_ids[]                          │          │ │
│  │  │  • trend_direction, popularity_score         │          │ │
│  │  │  • references[], discussion_links            │          │ │
│  │  │                                               │          │ │
│  │  │  🔒 RLS: Public READ access                  │          │ │
│  │  └─────────────────────────────────────────────┘          │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────┐          │ │
│  │  │  🔍 emerging_signals                         │          │ │
│  │  │  • id, compound_name, category               │          │ │
│  │  │  • research_phase, confidence_score          │          │ │
│  │  │  • signal_strength, research_summary         │          │ │
│  │  │  • potential_benefits[], research_links[]    │          │ │
│  │  │                                               │          │ │
│  │  │  🔒 RLS: Public READ access                  │          │ │
│  │  └─────────────────────────────────────────────┘          │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Admin Access
                             │ (Manual or Automated Updates)
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    👤 YOU (Admin)                               │
│                                                                 │
│  How You Update Data:                                          │
│  ├─ 📝 Supabase Table Editor (Manual)                          │
│  ├─ 💻 SQL Editor (Batch updates)                              │
│  ├─ 🔧 Edge Functions (Automated)                              │
│  └─ 📅 Scheduled Jobs (Daily/Weekly)                           │
│                                                                 │
│  What You Control:                                             │
│  ✅ API keys configuration                                     │
│  ✅ Supplement trends data                                     │
│  ✅ Stack combinations                                         │
│  ✅ Research signals                                           │
│  ✅ When data refreshes                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Visits App (Read-Only)

```
User Browser
    ↓
Lovable App (React)
    ↓
Supabase Client
    ↓
[RLS Check: Allow READ]
    ↓
PostgreSQL Tables
    ↓
Return supplement data
    ↓
Display in UI
```

### 2. User Uses Chatbot

```
User asks question
    ↓
TrendPulse App
    ↓
Fetch API key from Supabase
    ↓
[api_configuration.openai_api_key]
    ↓
Call OpenAI API (server-side context)
    ↓
Return AI response
    ↓
Display to user
```

### 3. Admin Updates Data

```
You (Admin)
    ↓
Supabase Dashboard
    ↓
Table Editor / SQL Editor
    ↓
[RLS Check: Service Role = Allow WRITE]
    ↓
UPDATE supplements/combinations
    ↓
Data updated
    ↓
All users see new data immediately
```

---

## Security Model

### Row Level Security (RLS)

```
┌─────────────────────────────────────────┐
│  Table: supplements                     │
│                                         │
│  Policies:                              │
│  ✅ "Public supplements read"           │
│     → Anyone can SELECT                 │
│                                         │
│  ✅ "Service role supplements write"    │
│     → Admin can INSERT/UPDATE/DELETE    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Table: api_configuration               │
│                                         │
│  Policies:                              │
│  ✅ "Public API config read"            │
│     → App can read keys (for backend)   │
│                                         │
│  ✅ "Service role API config write"     │
│     → Admin can UPDATE keys             │
│                                         │
│  🔒 Keys never exposed to browser       │
│     → Used server-side only             │
└─────────────────────────────────────────┘
```

---

## Environment Variables Flow

### Local Development

```
.env file
    ↓
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
    ↓
Vite build process
    ↓
Available as import.meta.env.VITE_*
    ↓
Used by Supabase client
```

### Lovable Deployment

```
Lovable Project Settings
    ↓
Environment Variables:
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
    ↓
Lovable build process
    ↓
Available in deployed app
    ↓
Used by Supabase client
```

---

## API Key Storage

### ❌ Old Way (Insecure)

```
Frontend Code
const API_KEY = "sk-abc123..."  ← Visible in browser!
```

### ✅ New Way (Secure)

```
Supabase Database
  api_configuration table
    openai_api_key: "sk-abc123..."
    
Frontend Code
const keys = await BackendService.getAPIKeys()
// Keys retrieved securely, used server-side
```

---

## Key Benefits

| Benefit | Why It Matters |
|---------|---------------|
| **🔒 Secure** | API keys stored in database, not browser |
| **📊 Centralized** | Single source of truth for all users |
| **👥 Multi-user** | All users see same data instantly |
| **🚀 Scalable** | Supabase handles all database operations |
| **🔄 Real-time** | Updates propagate immediately |
| **💰 Cost-effective** | Free tier for most use cases |
| **🛡️ Protected** | Row Level Security enforces access control |

---

## User Permissions

```
┌────────────────────────────────────────┐
│  Regular Users (Everyone)              │
│  ✅ Can view supplements               │
│  ✅ Can filter/sort data               │
│  ✅ Can use chatbot                    │
│  ❌ Cannot see API keys                │
│  ❌ Cannot modify data                 │
│  ❌ Cannot delete trends               │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  You (Admin via Supabase)              │
│  ✅ Can view all data                  │
│  ✅ Can add/update/delete supplements  │
│  ✅ Can configure API keys             │
│  ✅ Can manage database                │
│  ✅ Can run SQL queries                │
│  ✅ Control update schedule            │
└────────────────────────────────────────┘
```

---

## Connection Summary

1. **Lovable hosts your app** → Fast, global deployment
2. **Supabase stores your data** → PostgreSQL database
3. **RLS protects everything** → Users read-only, you admin
4. **Environment variables connect them** → Secure configuration
5. **One update in Supabase** → All users see it instantly

---

## Next Steps

Now that you understand the architecture:

1. **Follow setup**: `QUICK_CONNECT_CHECKLIST.md`
2. **Configure Supabase**: `LOVABLE_SUPABASE_SETUP.md`
3. **Add data**: `BACKEND_ARCHITECTURE.md`
4. **Troubleshoot**: `SUPABASE_TROUBLESHOOTING.md`

---

**Questions?** The architecture is designed to be simple and secure. You control the data, users view it safely.
