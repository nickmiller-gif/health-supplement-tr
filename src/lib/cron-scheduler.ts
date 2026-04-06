export interface CronJob {
  id: string
  name: string
  schedule: string
  lastRun: number | null
  nextRun: number
  enabled: boolean
  checkInterval?: number
}

export type CronCallback = () => void | Promise<void>

const CRON_STORAGE_KEY = 'cron-jobs'
const MORNING_HOUR = 8

function parseTime(hour: number, minute: number = 0): Date {
  const now = new Date()
  const target = new Date(now)
  target.setHours(hour, minute, 0, 0)
  
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }
  
  return target
}

export function getNextMorningTime(): number {
  return parseTime(MORNING_HOUR).getTime()
}

export function getMsUntilNextMorning(): number {
  return getNextMorningTime() - Date.now()
}

export async function registerCronJob(
  id: string,
  name: string,
  callback: CronCallback,
  options?: { checkInterval?: number }
): Promise<void> {
  const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
  
  if (!jobs[id]) {
    jobs[id] = {
      id,
      name,
      schedule: 'daily-morning',
      lastRun: null,
      nextRun: getNextMorningTime(),
      enabled: true,
      checkInterval: options?.checkInterval || 60000
    }
    await window.spark.kv.set(CRON_STORAGE_KEY, jobs)
  }
  
  scheduleCronJob(id, callback)
}

function scheduleCronJob(id: string, callback: CronCallback): void {
  const checkAndRun = async () => {
    const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
    const job = jobs[id]
    
    if (!job || !job.enabled) {
      setTimeout(checkAndRun, 60000)
      return
    }
    
    const now = Date.now()
    
    if (now >= job.nextRun) {
      console.log(`Running scheduled cron job: ${job.name}`)
      
      try {
        await callback()
        
        job.lastRun = now
        job.nextRun = getNextMorningTime()
        
        jobs[id] = job
        await window.spark.kv.set(CRON_STORAGE_KEY, jobs)
        
        console.log(`Cron job completed: ${job.name}. Next run: ${new Date(job.nextRun).toLocaleString()}`)
      } catch (error) {
        console.error(`Cron job failed: ${job.name}`, error)
      }
    }
    
    const msUntilNext = job.nextRun - Date.now()
    const checkInterval = Math.min(Math.max(msUntilNext, 60000), job.checkInterval || 300000)
    
    setTimeout(checkAndRun, checkInterval)
  }
  
  checkAndRun()
}

export async function getCronJobs(): Promise<CronJob[]> {
  const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
  return Object.values(jobs)
}

export async function toggleCronJob(id: string): Promise<void> {
  const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
  
  if (jobs[id]) {
    jobs[id].enabled = !jobs[id].enabled
    await window.spark.kv.set(CRON_STORAGE_KEY, jobs)
  }
}

export async function runCronJobNow(id: string, callback: CronCallback): Promise<void> {
  const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
  const job = jobs[id]
  
  if (!job) {
    throw new Error(`Cron job not found: ${id}`)
  }
  
  try {
    await callback()
    
    job.lastRun = Date.now()
    job.nextRun = getNextMorningTime()
    
    jobs[id] = job
    await window.spark.kv.set(CRON_STORAGE_KEY, jobs)
  } catch (error) {
    console.error(`Cron job failed: ${job.name}`, error)
    throw error
  }
}

export async function resetCronJob(id: string): Promise<void> {
  const jobs = await window.spark.kv.get<Record<string, CronJob>>(CRON_STORAGE_KEY) || {}
  
  if (jobs[id]) {
    jobs[id].lastRun = null
    jobs[id].nextRun = getNextMorningTime()
    await window.spark.kv.set(CRON_STORAGE_KEY, jobs)
  }
}

export function formatNextRun(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = timestamp - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffHours < 24) {
    return `In ${diffHours}h ${diffMinutes}m`
  }
  
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
