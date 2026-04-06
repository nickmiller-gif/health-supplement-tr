# TrendPulse Backend Architecture

## Overview

TrendPulse uses **Supabase** as its backend database to store all supplement trend data persistently. This architecture ensures:

- ✅ **Data Persistence**: All trends survive page refreshes and are accessible across devices
- ✅ **Multi-User Support**: Multiple users can access the same trend database
- ✅ **Scalability**: Handles thousands of supplement records efficiently
- ✅ **Security**: API keys managed server-side (not in frontend code)
- ✅ **Real-time Updates**: Optional real-time subscriptions for live data

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     TrendPulse Frontend                      │
│  (React + TypeScript running in browser)                    │
│                                                              │
│  ┌────────────────┐    ┌──────────────────┐                │
│  │   App.tsx      │───▶│ SupplementService│                │
│  │  (UI Layer)    │    │  (Data Layer)    │                │
│  └────────────────┘    └──────────────────┘                │
│                               │                              │
└───────────────────────────────┼──────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Cloud                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                      │  │
│  │                                                        │  │
│  │  • supplements                                        │  │
│  │  • supplement_combinations                           │  │
│  │  • emerging_signals                                   │  │
│  │  • user_tracked_supplements                          │  │
│  │  • chat_conversations                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Row Level Security (RLS)                    │  │
│  │  • Public read access to supplements                 │  │
│  │  • User-specific access to tracked items             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Auto-generated REST API                      │  │
│  │  GET /supplements, POST /supplements, etc.           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Page Load
```
User opens app
  ↓
App.tsx loads
  ↓
SupplementService.getAllSupplements()
  ↓
Supabase query: SELECT * FROM supplements
  ↓
Data rendered in UI
```

### 2. Discovering New Trends
```
User clicks "Refresh Trends"
  ↓
discoverSupplementTrends() called
  ↓
External APIs fetched (EXA, Reddit, etc.)
  ↓
AI processes data
  ↓
SupplementService.upsertSupplements()
  ↓
Supabase: UPSERT into supplements table
  ↓
Local state updated
  ↓
UI re-renders with new data
```

### 3. Tracking a Supplement
```
User clicks heart icon
  ↓
App updates local state
  ↓
useKV saves to browser storage
  ↓
(Future: Sync to Supabase user_tracked_supplements)
```

## Database Schema

### Table: `supplements`
Stores all discovered supplement trends.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Unique supplement identifier |
| `name` | TEXT | Supplement display name |
| `category` | TEXT | peptide, vitamin, nootropic, etc. |
| `trend_direction` | TEXT | rising, stable, or declining |
| `popularity_score` | INTEGER | 0-100 trend score |
| `description` | TEXT | Brief description |
| `trend_data` | INTEGER[] | Historical popularity scores |
| `discussion_links` | JSONB | Links to discussions |
| `ai_insight` | TEXT | AI-generated analysis |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Table: `supplement_combinations`
Stores popular supplement stacks.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Unique combination ID |
| `name` | TEXT | Stack name |
| `description` | TEXT | What the stack does |
| `purpose` | TEXT | Why people use it |
| `supplement_ids` | TEXT[] | Array of supplement IDs |
| `trend_direction` | TEXT | rising, stable, or declining |
| `popularity_score` | INTEGER | 0-100 trend score |
| `trend_data` | INTEGER[] | Historical data |
| `references` | TEXT[] | Source references |
| `discussion_links` | JSONB | Discussion sources |
| `ai_insight` | TEXT | AI analysis |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update |

### Table: `emerging_signals`
Early research signals from scientific literature.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Signal ID |
| `compound_name` | TEXT | Compound name |
| `category` | TEXT | Supplement category |
| `research_phase` | TEXT | preclinical, clinical, etc. |
| `confidence_score` | DECIMAL | 0-1 confidence |
| `time_to_trend` | TEXT | Estimated time to mainstream |
| `signal_strength` | DECIMAL | How strong the signal is |
| `research_summary` | TEXT | Summary of findings |
| `potential_benefits` | TEXT[] | Claimed benefits |
| `research_links` | TEXT[] | PubMed links |
| `emergence_score` | DECIMAL | Overall emergence score |

### Table: `user_tracked_supplements`
User-specific tracked supplements (future feature).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Record ID |
| `user_id` | TEXT | User identifier |
| `supplement_id` | TEXT | Reference to supplement |
| `tracked_at` | TIMESTAMP | When user started tracking |

### Table: `chat_conversations`
Chat history for personalized recommendations (future feature).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Conversation ID |
| `user_id` | TEXT | User identifier |
| `messages` | JSONB | Array of messages |
| `created_at` | TIMESTAMP | Started at |
| `updated_at` | TIMESTAMP | Last message |

## Security

### Row Level Security (RLS)

Supabase RLS policies ensure data access control:

```sql
-- Public read access to supplements
CREATE POLICY "Public supplements read" 
  ON supplements FOR SELECT 
  USING (true);

-- Users can only see their own tracked supplements
CREATE POLICY "Users can view their own tracked supplements" 
  ON user_tracked_supplements FOR SELECT 
  USING (auth.uid()::text = user_id);
```

### API Key Management

**Current (Development):**
- API keys stored in browser using `useKV` hook
- Keys never committed to code
- Users add keys via Settings dialog

**Recommended (Production):**
- Move API calls to Supabase Edge Functions
- Store API keys as Supabase secrets
- Frontend calls Edge Functions, which call external APIs
- API keys never exposed to browser

Example Edge Function structure:
```typescript
// supabase/functions/discover-trends/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const EXA_KEY = Deno.env.get('EXA_API_KEY')
  
  // Call EXA API server-side
  const response = await fetch('https://api.exa.ai/search', {
    headers: { 'x-api-key': EXA_KEY }
  })
  
  return new Response(JSON.stringify(data))
})
```

## Setup Instructions

### Quick Start (5 minutes)

1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Click "New Project"
   # Note your Project URL and anon key
   ```

2. **Configure Environment Variables**
   ```bash
   # Create .env file in project root
   echo "VITE_SUPABASE_URL=your_project_url" >> .env
   echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env
   ```

3. **Run Database Setup**
   - Open Supabase SQL Editor
   - Copy SQL from `SUPABASE_SETUP.md`
   - Execute to create tables and policies

4. **Verify Connection**
   - Restart dev server
   - Open app
   - Check green "Supabase Connected" banner

### Development Workflow

```bash
# 1. Start local development
npm run dev

# 2. Make changes to code

# 3. Test with Supabase
# Data automatically syncs to cloud

# 4. View data in Supabase dashboard
# https://supabase.com/dashboard/project/YOUR_PROJECT/editor
```

## Monitoring & Debugging

### Check Connection Status
The app displays Supabase connection status on the main page:
- 🟢 Green: Connected and operational
- 🔴 Red: Connection failed

### View Logs
```bash
# Supabase Dashboard → Logs → API Logs
# See all database queries in real-time
```

### Common Issues

**Issue:** "Supabase Connection Failed"  
**Solution:** Verify `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Issue:** "Row Level Security policy violation"  
**Solution:** Check RLS policies in Supabase dashboard allow public read access

**Issue:** "Table does not exist"  
**Solution:** Run the SQL setup script from `SUPABASE_SETUP.md`

## Future Enhancements

### Phase 1: User Authentication
- Add Supabase Auth
- User-specific tracked supplements
- Personalized dashboards

### Phase 2: Edge Functions
- Move external API calls server-side
- Secure API key management
- Rate limiting and caching

### Phase 3: Real-time Features
- Live trend updates via Supabase Realtime
- Collaborative features
- Push notifications for trend changes

### Phase 4: Analytics
- Track user engagement
- Popular supplement queries
- Trend prediction accuracy metrics

## Performance Optimization

### Caching Strategy
```
Browser (useKV)
  ↓ 30 min cache
Supabase Database
  ↓ Daily refresh
External APIs (EXA, Reddit, etc.)
```

### Query Optimization
- Indexed columns: `category`, `trend_direction`, `popularity_score`
- Pagination for large result sets
- Selective field queries (only fetch needed columns)

### CDN Distribution
- Supabase auto-deploys to global CDN
- Low latency worldwide
- Automatic scaling

## Cost Estimation

### Free Tier (Supabase)
- 500 MB database
- 2 GB file storage
- 50,000 monthly active users
- Unlimited API requests

**TrendPulse Estimate:**
- ~100 supplements × 2 KB = 200 KB
- ~50 combinations × 3 KB = 150 KB
- **Total: ~350 KB (well within free tier)**

### Paid Tier ($25/month)
- 8 GB database
- 100 GB file storage
- 100,000 monthly active users
- Daily backups

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Discord:** https://discord.supabase.com
- **GitHub Issues:** Report bugs in TrendPulse repo
