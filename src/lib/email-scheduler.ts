import { Supplement, SupplementCombination } from './types'
import { exportToCSV, ExportOptions } from './export-utils'

export interface EmailSchedule {
  id: string
  email: string
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  lastSent: number | null
  nextSend: number
  includeInsights: boolean
  includeLinks: boolean
  includeTrendData: boolean
}

const EMAIL_STORAGE_KEY = 'email-schedules'

function getNextScheduleTime(frequency: 'daily' | 'weekly' | 'monthly', baseTime: Date = new Date()): number {
  const next = new Date(baseTime)
  next.setHours(9, 0, 0, 0)
  
  switch (frequency) {
    case 'daily':
      if (next <= new Date()) {
        next.setDate(next.getDate() + 1)
      }
      break
    case 'weekly':
      next.setDate(next.getDate() + ((7 - next.getDay() + 1) % 7 || 7))
      if (next <= new Date()) {
        next.setDate(next.getDate() + 7)
      }
      break
    case 'monthly':
      next.setDate(1)
      next.setMonth(next.getMonth() + 1)
      if (next <= new Date()) {
        next.setMonth(next.getMonth() + 1)
      }
      break
  }
  
  return next.getTime()
}

export async function createEmailSchedule(
  email: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  options: ExportOptions = {}
): Promise<EmailSchedule> {
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  
  const id = `email-${Date.now()}`
  const schedule: EmailSchedule = {
    id,
    email,
    frequency,
    enabled: true,
    lastSent: null,
    nextSend: getNextScheduleTime(frequency),
    includeInsights: options.includeInsights ?? true,
    includeLinks: options.includeLinks ?? true,
    includeTrendData: options.includeTrendData ?? false,
  }
  
  schedules[id] = schedule
  await window.spark.kv.set(EMAIL_STORAGE_KEY, schedules)
  
  return schedule
}

export async function getEmailSchedules(): Promise<EmailSchedule[]> {
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  return Object.values(schedules)
}

export async function updateEmailSchedule(id: string, updates: Partial<EmailSchedule>): Promise<void> {
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  
  if (schedules[id]) {
    schedules[id] = { ...schedules[id], ...updates }
    
    if (updates.frequency && updates.frequency !== schedules[id].frequency) {
      schedules[id].nextSend = getNextScheduleTime(updates.frequency)
    }
    
    await window.spark.kv.set(EMAIL_STORAGE_KEY, schedules)
  }
}

export async function deleteEmailSchedule(id: string): Promise<void> {
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  
  delete schedules[id]
  await window.spark.kv.set(EMAIL_STORAGE_KEY, schedules)
}

export async function toggleEmailSchedule(id: string): Promise<void> {
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  
  if (schedules[id]) {
    schedules[id].enabled = !schedules[id].enabled
    await window.spark.kv.set(EMAIL_STORAGE_KEY, schedules)
  }
}

export function generateEmailReport(
  supplements: Supplement[],
  combinations: SupplementCombination[],
  schedule: EmailSchedule
): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  const risingSupplements = supplements.filter(s => s.trendDirection === 'rising')
  const topSupplements = [...supplements]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10)
  
  const risingCombinations = combinations.filter(c => c.trendDirection === 'rising')
  const topCombinations = [...combinations]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 5)
  
  let emailBody = `
TrendPulse - Supplement Trends Report
Generated: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY

Total Supplements Tracked: ${supplements.length}
Rising Trends: ${risingSupplements.length}
Supplement Stacks: ${combinations.length}
Rising Stacks: ${risingCombinations.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 TOP 10 SUPPLEMENTS

${topSupplements.map((s, i) => `
${i + 1}. ${s.name} [${s.trendDirection.toUpperCase()}]
   Category: ${s.category}
   Popularity Score: ${s.popularityScore}
   ${s.description}
   ${schedule.includeInsights && s.aiInsight ? `\n   💡 Insight: ${s.aiInsight}\n` : ''}
   ${schedule.includeLinks && s.discussionLinks && s.discussionLinks.length > 0 ? 
     `\n   🔗 Sources:\n${s.discussionLinks.map(l => `      - [${l.platform}] ${l.title}: ${l.url}`).join('\n')}\n` : ''}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 RISING SUPPLEMENTS

${risingSupplements.length > 0 ? risingSupplements.slice(0, 5).map((s, i) => `
${i + 1}. ${s.name}
   Category: ${s.category}
   Popularity Score: ${s.popularityScore}
   ${s.description}
`).join('\n') : 'No rising supplements at this time.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔬 TOP SUPPLEMENT STACKS

${topCombinations.length > 0 ? topCombinations.map((c, i) => `
${i + 1}. ${c.name} [${c.trendDirection.toUpperCase()}]
   Purpose: ${c.purpose}
   Popularity Score: ${c.popularityScore}
   ${c.description}
   Components: ${c.supplementIds.join(', ')}
   ${schedule.includeInsights && c.aiInsight ? `\n   💡 Insight: ${c.aiInsight}\n` : ''}
`).join('\n') : 'No supplement stacks available.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report was automatically generated by TrendPulse.
Data is for informational purposes only. Consult healthcare professionals before starting any supplement regimen.

To manage your email preferences, visit your TrendPulse dashboard.
`
  
  return emailBody
}

export async function sendEmailReport(
  schedule: EmailSchedule,
  supplements: Supplement[],
  combinations: SupplementCombination[]
): Promise<void> {
  const emailBody = generateEmailReport(supplements, combinations, schedule)
  
  const csvData = exportToCSV(supplements, combinations, {
    includeInsights: schedule.includeInsights,
    includeLinks: schedule.includeLinks,
    includeTrendData: schedule.includeTrendData,
  })
  
  const subject = `TrendPulse Report - ${new Date().toLocaleDateString()}`
  
  const mailto = `mailto:${schedule.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
  
  window.open(mailto, '_blank')
  
  const schedules = await window.spark.kv.get<Record<string, EmailSchedule>>(EMAIL_STORAGE_KEY) || {}
  if (schedules[schedule.id]) {
    schedules[schedule.id].lastSent = Date.now()
    schedules[schedule.id].nextSend = getNextScheduleTime(schedule.frequency)
    await window.spark.kv.set(EMAIL_STORAGE_KEY, schedules)
  }
}

export function formatNextSendTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = timestamp - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffDays === 0) {
    return `In ${diffHours}h`
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else if (diffDays < 7) {
    return `In ${diffDays} days`
  }
  
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export async function checkAndSendScheduledEmails(
  supplements: Supplement[],
  combinations: SupplementCombination[]
): Promise<void> {
  const schedules = await getEmailSchedules()
  const now = Date.now()
  
  for (const schedule of schedules) {
    if (schedule.enabled && now >= schedule.nextSend) {
      try {
        await sendEmailReport(schedule, supplements, combinations)
        console.log(`Sent email report to ${schedule.email}`)
      } catch (error) {
        console.error(`Failed to send email to ${schedule.email}:`, error)
      }
    }
  }
}
