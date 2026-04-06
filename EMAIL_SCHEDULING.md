# Email Report Scheduling

TrendPulse includes automated email report scheduling to keep you informed of supplement trends without requiring manual dashboard checks.

## Features

### Create Email Schedules
- Set up automatic email reports with customizable frequency
- Choose from daily, weekly, or monthly delivery schedules
- Configure what data to include in each report

### Frequency Options
- **Daily**: Reports sent every morning at 9:00 AM
- **Weekly**: Reports sent every Monday at 9:00 AM
- **Monthly**: Reports sent on the 1st of each month at 9:00 AM

### Customization Options
- **Include AI Insights**: Add AI-generated analysis for each supplement
- **Include Discussion Links**: Add source links from Reddit, forums, and communities
- **Include Trend Data**: Add raw 7-day trend numbers for each supplement

## How It Works

### Setting Up a Schedule

1. Click the "Email Reports" button in the header
2. Enter your email address
3. Select delivery frequency (daily, weekly, or monthly)
4. Toggle report options:
   - AI Insights (recommended)
   - Discussion Links
   - Trend Data (for data analysis)
5. Click "Create Schedule"

### Managing Schedules

Each schedule shows:
- **Email address**: Where reports are sent
- **Status**: Active (enabled) or Paused (disabled)
- **Frequency**: How often reports are sent
- **Next Send**: When the next report will be sent
- **Last Sent**: Timestamp of most recent report

### Schedule Actions

- **Send Now**: Test your schedule immediately
- **Pause/Resume**: Temporarily disable or re-enable a schedule
- **Delete**: Permanently remove a schedule

## Email Report Format

Reports are formatted as plain text emails with the following sections:

### Summary Statistics
- Total supplements tracked
- Number of rising trends
- Total supplement stacks
- Number of rising stacks

### Top 10 Supplements
Ranked by popularity score, includes:
- Name and trend direction (RISING/STABLE/DECLINING)
- Category (peptide, vitamin, nootropic, etc.)
- Popularity score
- Description
- AI insights (if enabled)
- Discussion source links (if enabled)

### Rising Supplements
Top 5 supplements with rising trend direction, including:
- Name and category
- Popularity score
- Description

### Top Supplement Stacks
Top 5 trending supplement combinations, includes:
- Name and trend direction
- Purpose and description
- Component supplements
- Popularity score
- AI insights (if enabled)

## Technical Details

### Automatic Scheduling
- A background cron job checks for due reports every 5 minutes
- When a report is due, it opens in your default email client
- The email is pre-populated with:
  - Subject line with current date
  - Formatted report body
  - Your configured email address

### Data Persistence
- All schedules are stored locally using the Spark KV storage
- Schedules persist across browser sessions
- No data is sent to external servers

### Multiple Schedules
- Create multiple schedules with different:
  - Email addresses
  - Frequencies
  - Report options
- Each schedule runs independently
- No limit on number of schedules

## Use Cases

### Personal Monitoring
Create a weekly schedule to stay informed about emerging supplements without daily checking.

### Research Tracking
Set up a monthly schedule with full AI insights and links for comprehensive research review.

### Quick Updates
Use daily schedules for active research periods when you need frequent updates.

### Team Sharing
Create multiple schedules for different team members with tailored report options.

## Privacy & Security

- All email addresses are stored locally on your device
- No emails are sent automatically to external servers
- Reports open in your default email client for you to review and send
- You maintain full control over when and what is sent

## Troubleshooting

### Email Doesn't Open
- Ensure your system has a default email client configured
- Check that popup blockers aren't preventing the email client from opening
- Try using "Send Now" to test immediately

### Schedule Not Running
- Verify the schedule is Active (not Paused)
- Check the "Next Send" time to confirm when it should run
- The cron job checks every 5 minutes, so reports may arrive slightly after scheduled time

### Missing Report Content
- Ensure supplements have been discovered (click "Refresh Trends")
- Check that your selected report options match what you expect
- Try creating a test schedule with "Send Now" to preview

## Best Practices

1. **Start with Weekly**: Weekly schedules provide good balance between staying informed and avoiding inbox clutter
2. **Enable AI Insights**: These provide the most value in understanding why supplements are trending
3. **Test First**: Use "Send Now" to preview your report before relying on the schedule
4. **Multiple Addresses**: Create separate schedules for work and personal emails if needed
5. **Pause During Breaks**: Pause schedules during vacations or research breaks instead of deleting them
