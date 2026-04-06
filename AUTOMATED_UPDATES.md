# Automated Daily Trend Update System

## Overview

The TrendPulse application now includes a fully automated daily trend update system that fetches fresh supplement data from various social media sources and updates the Supabase database automatically. This ensures all users see up-to-date supplement trends without manual intervention.

## Features

### 🤖 Automated Scheduling
- **Daily Updates**: Automatically runs every day at 8:00 AM
- **Customizable Schedule**: Built on a flexible cron scheduler that can be adjusted
- **Persistent State**: Update schedules and status stored in Spark KV storage
- **Background Execution**: Runs silently in the background without interrupting users

### 📊 Multi-Source Data Collection
The updater fetches data from multiple sources:
- **EXA Search API**: Neural web search across the internet
- **Reddit API**: Direct access to r/Peptides, r/Nootropics, r/Supplements, r/Biohacking
- **Twitter/X (RapidAPI)**: Recent tweets about supplements
- **TikTok (RapidAPI)**: Trending supplement content
- **LinkedIn (RapidAPI)**: Professional health discussions
- **LLM Fallback**: Uses GPT-4o when APIs are unavailable

### 🎯 Intelligent Discovery
- **Supplement Trends**: Discovers 15+ trending supplements with real-time data
- **Stack Combinations**: Identifies 8-10 popular supplement stacks
- **AI Insights**: Generates detailed insights for each supplement and combination
- **Trend Analysis**: Calculates popularity scores and trend directions (rising/stable/declining)

### 🔐 Admin Dashboard
- **Owner-Only Access**: Secured with `spark.user().isOwner` check
- **System Overview**: View update status, data counts, and system health
- **Manual Control**: Run updates on-demand or disable automatic scheduling
- **Progress Tracking**: Real-time progress indicators during updates
- **Update History**: View last update time and success/failure status

## Architecture

### Core Components

#### 1. **Daily Trend Updater** (`src/lib/daily-trend-updater.ts`)
The main update orchestrator that:
- Fetches API keys from Supabase configuration
- Discovers supplement trends using multiple data sources
- Discovers supplement combinations
- Saves all data to Supabase database
- Reports progress via callbacks

```typescript
import { runDailyTrendUpdate } from '@/lib/daily-trend-updater'

// Run manual update with progress tracking
const result = await runDailyTrendUpdate((progress) => {
  console.log(`${progress.phase}: ${progress.current}/${progress.total}`)
})
```

#### 2. **Cron Scheduler** (`src/lib/cron-scheduler.ts`)
Manages scheduled tasks:
- Registers cron jobs with unique IDs
- Calculates next run times (8:00 AM daily)
- Persists job state in Spark KV
- Enables/disables jobs dynamically
- Supports manual job execution

```typescript
import { registerCronJob, runCronJobNow } from '@/lib/cron-scheduler'

// Register a daily job
await registerCronJob(
  'daily-trend-update',
  'Daily Supplement Trend Update',
  async () => {
    // Your update logic here
  }
)

// Run immediately
await runCronJobNow('daily-trend-update', updateCallback)
```

#### 3. **Trend Update Scheduler** (`src/components/TrendUpdateScheduler.tsx`)
UI component for managing updates:
- Displays cron job status and next run time
- Shows real-time progress during updates
- Provides manual "Run Now" button
- Enables/disables automatic scheduling
- Displays success/error messages

#### 4. **Admin Dashboard** (`src/components/AdminDashboard.tsx`)
Central admin interface:
- System status overview
- Database connection status
- Update statistics (last update, counts)
- Trend scheduler access
- Owner-only access control

## Setup Instructions

### 1. Database Configuration

Ensure your Supabase database has the required tables:

```sql
-- Supplements table
CREATE TABLE supplements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  description TEXT NOT NULL,
  trend_data INTEGER[] NOT NULL,
  discussion_links JSONB,
  ai_insight TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplement combinations table
CREATE TABLE supplement_combinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  supplement_ids TEXT[] NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  trend_data INTEGER[] NOT NULL,
  references TEXT[],
  discussion_links JSONB,
  ai_insight TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API configuration table (optional)
CREATE TABLE api_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exa_api_key TEXT,
  reddit_client_id TEXT,
  reddit_client_secret TEXT,
  rapidapi_key TEXT,
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. API Keys Configuration

Store your API keys in the Supabase `api_configuration` table:

```sql
INSERT INTO api_configuration (
  exa_api_key,
  reddit_client_id,
  reddit_client_secret,
  rapidapi_key,
  openai_api_key
) VALUES (
  'your_exa_key',
  'your_reddit_client_id',
  'your_reddit_secret',
  'your_rapidapi_key',
  'your_openai_key'
);
```

Or configure via the admin interface (if available).

### 3. Environment Variables

Set your Supabase connection in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Access Admin Dashboard

1. Open the application
2. Click the "Admin" button in the top right header
3. You must be the app owner to access the dashboard
4. Navigate to the "Trend Scheduler" tab
5. Enable automatic updates or run manual updates

## Usage

### Running Manual Updates

From the Admin Dashboard:
1. Click the "Trend Scheduler" tab
2. Click "Run Update Now" button
3. Watch the progress indicator
4. View success/failure status

### Enabling Automatic Updates

From the Admin Dashboard:
1. Click the "Trend Scheduler" tab
2. Toggle the "Enabled/Disabled" switch
3. Updates will run automatically at 8:00 AM daily
4. Check "Next run" time to verify schedule

### Monitoring Updates

The system provides real-time feedback:
- **Progress Phases**:
  - Starting: Initializing the update process
  - Fetching API Keys: Loading configuration
  - Discovering Supplements: Querying data sources
  - Discovering Combinations: Finding supplement stacks
  - Saving Supplements: Writing to database
  - Saving Combinations: Writing stacks to database
  - Complete: Update finished

- **Status Indicators**:
  - ✅ Success: Green badge with data counts
  - ❌ Failure: Red badge with error message
  - ⏰ Next Run: Time until next scheduled update

## Update Process Flow

```
1. Check if scheduler is enabled
   ↓
2. Fetch API keys from Supabase
   ↓
3. Discover supplements (15+ trending items)
   - Query EXA API
   - Query Reddit API
   - Query Twitter/X API
   - Query TikTok API
   - Query LinkedIn API
   - Analyze with LLM
   ↓
4. Discover combinations (8-10 stacks)
   - Analyze supplement relationships
   - Find popular stacks
   - Generate insights
   ↓
5. Save supplements to database
   - Upsert each supplement
   - Update trend data
   - Store discussion links
   ↓
6. Save combinations to database
   - Upsert each combination
   - Link to supplements
   - Store references
   ↓
7. Mark update as complete
   - Update last run timestamp
   - Schedule next run (24 hours)
```

## Troubleshooting

### Updates Not Running

**Problem**: Automatic updates aren't executing
**Solutions**:
- Check if scheduler is enabled in Admin Dashboard
- Verify Supabase connection is active
- Check browser console for errors
- Ensure API keys are configured

### Update Failures

**Problem**: Updates complete with errors
**Solutions**:
- Verify API keys are valid and active
- Check API rate limits
- Review error messages in Admin Dashboard
- Test with manual update first

### Missing Data

**Problem**: Supplements or stacks not appearing
**Solutions**:
- Check database tables exist
- Verify data was saved (check update success message)
- Refresh the main app page
- Run manual update from Admin Dashboard

### Permission Denied

**Problem**: Cannot access Admin Dashboard
**Solutions**:
- Verify you are the app owner (`spark.user().isOwner`)
- Only app owners can access admin features
- Check authentication status

## API Rate Limits

Be aware of API rate limits:
- **EXA API**: Varies by plan
- **Reddit API**: 60 requests/minute
- **RapidAPI**: Depends on subscription
- **OpenAI/Anthropic**: Varies by tier

The system includes built-in error handling for rate limits and will fallback to LLM-only mode if APIs are unavailable.

## Data Persistence

All update data is stored in:
- **Supabase Database**: Supplements, combinations, and API config
- **Spark KV Storage**: Cron job state and schedules

This ensures:
- Data persists across sessions
- All users see the same centralized data
- Update schedules survive page refreshes
- No data loss during updates

## Security Considerations

✅ **Secure Design**:
- API keys stored server-side in Supabase
- Admin dashboard restricted to app owner
- No API keys exposed in frontend code
- Supabase Row Level Security can be applied

❌ **Avoid**:
- Storing API keys in frontend environment variables
- Sharing admin credentials
- Exposing database credentials in client code

## Future Enhancements

Potential improvements:
- [ ] Multiple schedule options (hourly, weekly)
- [ ] Email notifications on update completion
- [ ] Update history logs with timestamps
- [ ] Rollback to previous data versions
- [ ] A/B testing different data sources
- [ ] Custom trend discovery queries
- [ ] Export/import update configurations

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Supabase setup documentation
3. Check API provider documentation
4. Review application logs in browser console

## License

This automated trend update system is part of the TrendPulse application.
