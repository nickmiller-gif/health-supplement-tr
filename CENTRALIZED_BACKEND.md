# TrendPulse - Centralized Backend Architecture

## Overview

TrendPulse has been restructured to use a single centralized Supabase backend where all API keys and trend data are stored server-side. Users now have a read-only experience where they can:

1. **View Daily Trends** - See the latest supplement and stack trends from the shared database
2. **Use the AI Chatbot** - Get personalized supplement recommendations and insights

## Architecture Changes

### Before (Multi-User API Model)
- Each user stored their own API keys locally
- Each user could run trend updates independently  
- Complex UI with API settings, exporters, schedulers, etc.
- User-specific tracked supplements

### After (Centralized Backend Model)
- **Single source of truth**: One Supabase database with centrally stored API keys
- **Read-only frontend**: Users consume pre-generated daily trends
- **Simplified UI**: Clean interface focused on viewing trends and chatbot interaction
- **Server-side updates**: Trends updated centrally (can be automated with cron or manually)

## Database Schema

### New Table: `api_configuration`

```sql
CREATE TABLE api_configuration (
  id SERIAL PRIMARY KEY,
  exa_api_key TEXT,
  reddit_client_id TEXT,
  reddit_client_secret TEXT,
  rapidapi_key TEXT,
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  last_trend_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Existing Tables (Unchanged)
- `supplements` - Individual supplement trends
- `supplement_combinations` - Supplement stacks
- `emerging_signals` - Research-based early signals

## Setup Instructions

### 1. Update Supabase Schema

Run the SQL migration to add the `api_configuration` table:

```bash
# In Supabase SQL Editor, run:
cat SUPABASE_SCHEMA_UPDATE.sql
```

Or manually execute the SQL in your Supabase dashboard → SQL Editor.

### 2. Configure API Keys (Server-Side)

Add your API keys to the `api_configuration` table in Supabase:

```sql
-- Insert or update API configuration
INSERT INTO api_configuration (id, exa_api_key, reddit_client_id, reddit_client_secret, rapidapi_key, openai_api_key, anthropic_api_key)
VALUES (
  1,
  'your-exa-api-key-here',
  'your-reddit-client-id',
  'your-reddit-client-secret',
  'your-rapidapi-key',
  'your-openai-api-key',
  'your-anthropic-api-key'
)
ON CONFLICT (id) DO UPDATE SET
  exa_api_key = EXCLUDED.exa_api_key,
  reddit_client_id = EXCLUDED.reddit_client_id,
  reddit_client_secret = EXCLUDED.reddit_client_secret,
  rapidapi_key = EXCLUDED.rapidapi_key,
  openai_api_key = EXCLUDED.openai_api_key,
  anthropic_api_key = EXCLUDED.anthropic_api_key,
  updated_at = timezone('utc'::text, now());
```

### 3. Populate Initial Trend Data

You'll need to run a one-time script to populate trends. Create a Node.js script:

```typescript
// scripts/update-trends.ts
import { discoverSupplementTrends, discoverSupplementCombinations } from './src/lib/trend-discovery'
import { SupplementService } from './src/lib/supplement-service'
import { createClient } from '@supabase/supabase-js'

async function updateTrends() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  )
  
  // Fetch API keys from database
  const { data: config } = await supabase
    .from('api_configuration')
    .select('*')
    .single()
  
  if (!config) {
    console.error('No API configuration found')
    return
  }
  
  // Discover trends using configured APIs
  const trendData = await discoverSupplementTrends(
    config.exa_api_key,
    {
      redditClientId: config.reddit_client_id,
      redditClientSecret: config.reddit_client_secret,
      rapidApiKey: config.rapidapi_key
    }
  )
  
  // Save to database
  await SupplementService.upsertSupplements(trendData.supplements)
  
  const combos = await discoverSupplementCombinations(
    trendData.supplements,
    config.exa_api_key,
    {
      redditClientId: config.reddit_client_id,
      redditClientSecret: config.reddit_client_secret,
      rapidApiKey: config.rapidapi_key
    }
  )
  
  await SupplementService.upsertCombinations(combos)
  
  // Update last_trend_update timestamp
  await supabase
    .from('api_configuration')
    .update({ last_trend_update: new Date().toISOString() })
    .eq('id', 1)
  
  console.log('✅ Trends updated successfully!')
}

updateTrends()
```

Run it manually:
```bash
tsx scripts/update-trends.ts
```

### 4. (Optional) Automate Trend Updates

Set up a cron job to run daily updates:

```bash
# Crontab - Run daily at 6 AM
0 6 * * * cd /path/to/trendpulse && tsx scripts/update-trends.ts
```

Or use a service like:
- **Vercel Cron** (for Next.js deployments)
- **AWS EventBridge** (for Lambda functions)
- **Supabase Edge Functions** with cron triggers
- **GitHub Actions** with scheduled workflows

## User Experience

### What Users Can Do

✅ **View Today's Trends**
- Browse all trending supplements
- Filter by category (peptides, vitamins, nootropics, etc.)
- Sort by popularity, trend direction, or name
- View detailed AI insights for each supplement

✅ **Explore Supplement Stacks**
- See popular supplement combinations
- Filter by trend direction (rising, stable, declining)
- Learn about synergistic effects

✅ **AI Chatbot**
- Ask questions about supplements
- Get personalized recommendations
- Search for specific categories or use cases
- Natural language queries powered by GPT-4

### What Users Cannot Do

❌ Configure API keys (centrally managed)
❌ Trigger trend updates (admin/automated only)
❌ Export data (simplified UX)
❌ Schedule reports (removed complexity)
❌ Track supplements personally (future: multi-user auth)

## Frontend Changes

### Removed Components
- `ApiSettings.tsx` - API key configuration
- `ApiTester.tsx` - API testing interface
- `EmailScheduler.tsx` - Email report scheduling
- `ExportDialog.tsx` - Data export functionality  
- `SupabaseStatus.tsx` - Database connection UI
- `TrendPredictionDialog.tsx` - Future predictions
- `EmergingResearchCard.tsx` - Research signals
- `ResearchInsightDialog.tsx` - Research details
- `SuggestedSupplements.tsx` - Personal recommendations

### New/Modified Components
- `BackendService.ts` - Centralized backend API
- `App.tsx` - Simplified read-only UI
- `Chatbot.tsx` - Uses backend service for queries

## API Reference

### BackendService

#### `getTodaysSupplements(): Promise<Supplement[]>`
Fetches all supplements from Supabase, sorted by update time.

#### `getTodaysCombinations(): Promise<SupplementCombination[]>`
Fetches all supplement combinations from Supabase.

#### `getLastUpdateTime(): Promise<number | null>`
Returns the timestamp of the last trend update.

#### `getAPIKeys(): Promise<APIKeys>`
Fetches API keys from the centralized configuration (for server-side use).

#### `chatQuery(messages, supplements, combinations): Promise<string>`
Processes chatbot queries using available supplement data and configured AI APIs.

## Security Considerations

### ⚠️ Important

The current implementation fetches API keys from Supabase in the frontend for chatbot queries. This is **NOT production-ready**. 

### Recommended Production Architecture

1. **Supabase Edge Functions** - Move all API calls to Edge Functions
2. **RLS Policies** - Restrict `api_configuration` table to service role only
3. **Backend Proxy** - Create a `/api/chat` endpoint that handles LLM calls server-side
4. **Rate Limiting** - Implement per-user rate limits for chatbot
5. **Authentication** - Add Supabase Auth for user accounts

Example Edge Function:

```typescript
// supabase/functions/chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  const { messages } = await req.json()
  
  // Fetch API keys securely (service role)
  const { data: config } = await supabaseClient
    .from('api_configuration')
    .select('openai_api_key')
    .single()
  
  // Call OpenAI API server-side
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openai_api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages
    })
  })
  
  const data = await response.json()
  
  return new Response(
    JSON.stringify({ message: data.choices[0].message.content }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## Migration Checklist

- [ ] Run `SUPABASE_SCHEMA_UPDATE.sql` to add `api_configuration` table
- [ ] Insert API keys into `api_configuration` table
- [ ] Create trend update script (`scripts/update-trends.ts`)
- [ ] Run initial trend update to populate database
- [ ] (Optional) Set up automated cron job for daily updates
- [ ] (Recommended) Move to Edge Functions for production security
- [ ] Update PRD.md to reflect new architecture
- [ ] Test chatbot functionality with populated data
- [ ] Deploy updated frontend

## Benefits of This Architecture

✅ **Simplified UX** - Users focus on consuming insights, not configuring APIs
✅ **Cost Efficiency** - One set of API keys shared across all users
✅ **Data Consistency** - Everyone sees the same daily trends
✅ **Easier Maintenance** - Central point to update configuration
✅ **Scalability** - Add features without user-side complexity
✅ **Better Performance** - Pre-computed trends load instantly

## Future Enhancements

1. **Multi-User Auth** - Supabase Auth for personal tracked supplements
2. **Real-time Updates** - WebSocket subscriptions for live trend changes
3. **Admin Dashboard** - Web UI for managing API keys and triggering updates
4. **Analytics** - Track which supplements/stacks are most viewed
5. **Notifications** - Alert users when tracked supplements change trends
6. **API Webhooks** - Trigger updates via external systems

## Support

For questions or issues:
- See `SUPABASE_SETUP.md` for database setup
- See `SUPABASE_TROUBLESHOOTING.md` for common issues
- Check existing documentation in project root

---

**Last Updated**: 2024
**Architecture Version**: 2.0 (Centralized Backend)
