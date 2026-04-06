# Migration Guide: User-Based → Centralized Backend

## What Changed?

TrendPulse has been transformed from a multi-user configuration model to a centralized backend architecture. Here's what's different:

### Before (v1.x)
- ❌ Each user configured their own API keys
- ❌ Each user could trigger trend updates
- ❌ Complex UI with settings, exporters, schedulers
- ❌ API keys stored in browser (security risk)
- ❌ Inconsistent data across users

### After (v2.0)
- ✅ Single shared database with daily trends
- ✅ API keys stored securely server-side
- ✅ Simplified read-only user interface
- ✅ Everyone sees the same curated data
- ✅ AI chatbot for personalized queries

## Quick Start (New Users)

If you're setting up TrendPulse for the first time with the new architecture:

### 1. Run the New Schema Migration

```sql
-- In Supabase SQL Editor, execute:
-- See SUPABASE_SCHEMA_UPDATE.sql for full script

CREATE TABLE IF NOT EXISTS api_configuration (
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

-- Enable RLS
ALTER TABLE api_configuration ENABLE ROW LEVEL SECURITY;

-- Public read policy (for frontend to fetch config)
CREATE POLICY "Public API config read" 
  ON api_configuration FOR SELECT 
  USING (true);
```

### 2. Add Your API Keys

```sql
INSERT INTO api_configuration (
  id, 
  exa_api_key, 
  openai_api_key
)
VALUES (
  1,
  'your-exa-api-key-here',
  'your-openai-api-key-here'
)
ON CONFLICT (id) DO UPDATE SET
  exa_api_key = EXCLUDED.exa_api_key,
  openai_api_key = EXCLUDED.openai_api_key,
  updated_at = timezone('utc'::text, now());
```

### 3. Populate Initial Data

Option A: Use the existing app (if you have v1.x)
- Load the old version
- Click "Refresh Trends"
- Data will be saved to Supabase

Option B: Create a trend update script (see CENTRALIZED_BACKEND.md)

### 4. Deploy New Frontend

The new simplified frontend will automatically:
- Connect to Supabase
- Fetch daily trends
- Enable chatbot functionality

Done! Users can now access the app without any configuration.

## Migration for Existing Users

If you were using the previous user-based model:

### Data Migration

Your existing supplement data in Supabase is **fully compatible**! No data migration needed.

The only changes:
- ✅ `supplements` table - Unchanged
- ✅ `supplement_combinations` - Unchanged
- ✅ `emerging_signals` - Unchanged
- ✅ `user_tracked_supplements` - Still exists (not used in v2.0, but preserved for future auth)
- ✅ `chat_conversations` - Still exists (not used in v2.0, but preserved)
- ➕ `api_configuration` - New table (add via migration)

### Configuration Migration

1. **Extract your API keys from local storage** (if you want to reuse them):
   - Open browser DevTools → Application → IndexedDB → spark.kv
   - Find keys: `exa-api-key`, `openai-api-key`, etc.
   - Copy values

2. **Add them to the new `api_configuration` table** (see SQL above)

3. **Clear old local storage** (optional cleanup):
   ```javascript
   // In browser console:
   indexedDB.deleteDatabase('spark.kv')
   ```

### UI Changes

Features **removed** in v2.0 (simplified UX):
- API Settings dialog
- API Tester
- Email Scheduler
- Export functionality  
- Research Signals tab
- Predictions tab
- Tracked Supplements tab
- Supabase Status banner
- Suggested Supplements widget

Features **kept**:
- All Trends tab (supplements browsing)
- Stacks tab (combinations)
- Search and filtering
- Detailed insights dialogs
- AI Chatbot

### Code Changes

If you've customized the codebase:

**Removed files:**
- `src/components/ApiSettings.tsx`
- `src/components/ApiTester.tsx`
- `src/components/EmailScheduler.tsx`
- `src/components/ExportDialog.tsx`
- `src/components/SupabaseStatus.tsx`
- `src/components/TrendPredictionDialog.tsx`
- `src/components/EmergingResearchCard.tsx`
- `src/components/ResearchInsightDialog.tsx`
- `src/components/SuggestedSupplements.tsx`

**New files:**
- `src/lib/backend-service.ts` - Centralized backend API
- `SUPABASE_SCHEMA_UPDATE.sql` - Schema migration
- `CENTRALIZED_BACKEND.md` - Architecture docs
- `MIGRATION_GUIDE.md` - This file

**Modified files:**
- `src/App.tsx` - Simplified to read-only UI
- `src/components/Chatbot.tsx` - Uses BackendService
- `PRD.md` - Updated for new architecture

## Testing the Migration

### 1. Verify Database Connection

```javascript
// In browser console:
const { data, error } = await window.supabase
  .from('api_configuration')
  .select('*')
  .single()

console.log('API Config:', data)
// Should show your configured API keys
```

### 2. Verify Trends Loading

```javascript
const { data, error } = await window.supabase
  .from('supplements')
  .select('count')

console.log('Supplement count:', data)
// Should show your existing supplement data
```

### 3. Test Chatbot

- Click the chatbot button (bottom-right)
- Ask: "What's trending for sleep?"
- Should get a response with relevant supplements

## Rollback Plan

If you need to revert to the old version:

### 1. Keep the Database Tables

The new `api_configuration` table is **additive only**. It doesn't break the old version.

### 2. Checkout Previous Version

```bash
git checkout <previous-commit-hash>
npm install
npm run dev
```

### 3. Restore API Keys

The old version will look for API keys in local storage (IndexedDB). If you cleared them, re-add via the API Settings dialog.

## Benefits Summary

| Aspect | Before (v1.x) | After (v2.0) |
|--------|--------------|-------------|
| **Setup Complexity** | High (each user configures APIs) | Low (admin sets up once) |
| **API Costs** | Per user | Shared across all users |
| **Data Consistency** | Each user sees different data | Everyone sees same daily trends |
| **Security** | API keys in browser | API keys server-side |
| **UI Complexity** | 8+ components, multiple tabs | 2 tabs, focused experience |
| **Performance** | API calls on each refresh | Pre-computed data loads instantly |
| **Maintenance** | Each user manages own config | Central admin manages one config |

## Support

- **Architecture details**: See `CENTRALIZED_BACKEND.md`
- **Database setup**: See `SUPABASE_SETUP.md`
- **Troubleshooting**: See `SUPABASE_TROUBLESHOOTING.md`

## Feedback

This is a major architectural change. If you encounter issues or have suggestions:
1. Check the documentation files
2. Review your Supabase configuration  
3. Verify the schema migration ran successfully
4. Test with sample data first

---

**Migration Version**: 2.0  
**Last Updated**: 2024  
**Recommended**: This centralized architecture is the recommended approach for production deployments.
