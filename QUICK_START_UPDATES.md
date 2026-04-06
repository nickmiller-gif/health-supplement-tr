# Quick Start: Automated Trend Updates

Get your automated daily trend update system running in 5 minutes.

## Prerequisites

- ✅ Supabase database configured
- ✅ Database tables created (supplements, supplement_combinations, api_configuration)
- ✅ App owner access

## Step 1: Access Admin Dashboard

1. Open your TrendPulse application
2. Click the **"Admin"** button in the top right corner of the header
3. You'll see the Admin Dashboard (owner-only access)

## Step 2: Configure API Keys (Optional but Recommended)

For best results, configure your API keys in Supabase:

```sql
-- Insert your API keys into the database
INSERT INTO api_configuration (
  exa_api_key,
  reddit_client_id,
  reddit_client_secret,
  rapidapi_key,
  openai_api_key
) VALUES (
  'your_exa_key_here',
  'your_reddit_client_id',
  'your_reddit_secret',
  'your_rapidapi_key',
  'your_openai_key'
);
```

**Note**: The system works without API keys by using the Spark LLM fallback, but real API data provides better accuracy.

## Step 3: Run Your First Update

1. In the Admin Dashboard, click the **"Trend Scheduler"** tab
2. Click the **"Run Update Now"** button
3. Watch the real-time progress indicator:
   - ⏳ Fetching API keys...
   - 🔍 Discovering supplements...
   - 🧪 Discovering combinations...
   - 💾 Saving to database...
   - ✅ Complete!
4. You should see a success message with counts (e.g., "15 supplements and 10 stacks updated")

## Step 4: Enable Automatic Updates

1. In the Trend Scheduler, find the toggle switch labeled **"Enabled/Disabled"**
2. Toggle it to **"Enabled"**
3. The system will now run automatically every day at 8:00 AM
4. Check the **"Next run"** time to confirm scheduling

## Step 5: Verify Data

1. Click the **"Back to Trends"** button
2. You should now see fresh supplement data in the main app
3. Browse through the supplements and stacks
4. Try the AI chatbot to query the new data

## That's It! 🎉

Your automated trend update system is now running. The app will automatically fetch fresh supplement data every morning at 8:00 AM.

## What Happens During Updates?

The system:
1. Fetches your API keys from Supabase
2. Queries multiple data sources (Reddit, Twitter/X, TikTok, LinkedIn)
3. Uses AI to analyze and identify trending supplements
4. Discovers popular supplement stack combinations
5. Saves everything to your Supabase database
6. All users immediately see the updated data

## Monitoring Your Updates

### Check Update Status
- **Last Update**: See when data was last refreshed
- **Supplement Count**: Total supplements in database
- **Stack Count**: Total combinations discovered
- **System Status**: Database connection and scheduler status

### Manual Controls
- **Run Now**: Force an immediate update
- **Enable/Disable**: Turn automatic scheduling on/off
- **Progress Tracking**: Real-time progress during updates

## Troubleshooting

### ❌ Update Failed?

**Check these:**
1. Is Supabase connected? (check System Status)
2. Are API keys configured correctly?
3. Check the error message in the dashboard
4. Try running the update again

### ⚠️ No New Data?

**Try this:**
1. Click "Refresh" in the main app
2. Check the "Last Update" time in Admin Dashboard
3. Verify the update completed successfully
4. Clear browser cache and reload

### 🔒 Can't Access Admin?

**Verify:**
- You must be the app owner
- Only `spark.user().isOwner` returns true for owner
- Other users cannot access admin features

## Next Steps

Now that your automated updates are running:

1. **Customize Schedule**: Modify the cron scheduler for different update times
2. **Add Monitoring**: Set up notifications for update success/failure
3. **Review Data**: Check supplement trends regularly for insights
4. **Share**: All users now see centralized, fresh data automatically

## Support

For detailed documentation, see:
- [AUTOMATED_UPDATES.md](./AUTOMATED_UPDATES.md) - Full technical documentation
- [PRD.md](./PRD.md) - Product requirements and features
- Supabase setup guides in the project root

## Common Questions

**Q: How often do updates run?**
A: Daily at 8:00 AM by default. You can modify the schedule in the cron scheduler code.

**Q: Can I run updates more frequently?**
A: Yes! Modify the `MORNING_HOUR` constant in `src/lib/cron-scheduler.ts` or implement custom schedules.

**Q: Do updates cost money?**
A: Only if using external APIs. The Spark LLM fallback is included. External API costs depend on your providers.

**Q: What if an update fails?**
A: The system will retry the next day. Use "Run Now" to retry immediately. Check error messages for debugging.

**Q: Can users trigger updates?**
A: No, only app owners can access the admin dashboard and control updates.

**Q: Where is the data stored?**
A: All trend data is stored in your Supabase database tables: `supplements` and `supplement_combinations`.

---

**Ready to go deeper?** Check out [AUTOMATED_UPDATES.md](./AUTOMATED_UPDATES.md) for architecture details, API integration, and advanced configuration.
