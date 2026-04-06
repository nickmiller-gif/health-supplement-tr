import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Clock, 
  Play, 
  ArrowsClockwise, 
  CheckCircle, 
  XCircle, 
  Info,
  Timer,
  Calendar,
  Database,
  CloudArrowUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { registerCronJob, getCronJobs, toggleCronJob, runCronJobNow, formatNextRun, type CronJob } from '@/lib/cron-scheduler'
import { runDailyTrendUpdate, type UpdateProgress } from '@/lib/daily-trend-updater'

export function TrendUpdateScheduler() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<UpdateProgress | null>(null)
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    loadCronJobs()
    initializeCronJob()
  }, [])

  const loadCronJobs = async () => {
    const jobs = await getCronJobs()
    setCronJobs(jobs)
  }

  const initializeCronJob = async () => {
    await registerCronJob(
      'daily-trend-update',
      'Daily Supplement Trend Update',
      async () => {
        await handleRunUpdate()
      }
    )
    await loadCronJobs()
  }

  const handleRunUpdate = async () => {
    setIsRunning(true)
    setProgress({ phase: 'starting', current: 0, total: 100 })
    setLastResult(null)

    try {
      const result = await runDailyTrendUpdate((update) => {
        setProgress(update)
      })

      setLastResult({
        success: true,
        message: `Successfully updated ${result.supplementCount} supplements and ${result.combinationCount} stacks`
      })

      toast.success('Trend Update Complete', {
        description: `${result.supplementCount} supplements and ${result.combinationCount} stacks updated`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setLastResult({
        success: false,
        message: errorMessage
      })

      toast.error('Trend Update Failed', {
        description: errorMessage
      })
    } finally {
      setIsRunning(false)
      setProgress(null)
      await loadCronJobs()
    }
  }

  const handleRunNow = async () => {
    try {
      await runCronJobNow('daily-trend-update', handleRunUpdate)
    } catch (error) {
      console.error('Error running update:', error)
    }
  }

  const handleToggle = async (jobId: string) => {
    await toggleCronJob(jobId)
    await loadCronJobs()
    toast.success('Scheduler Updated')
  }

  const trendUpdateJob = cronJobs.find(job => job.id === 'daily-trend-update')

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'starting': return 'Initializing update...'
      case 'fetching-api-keys': return 'Loading API configuration...'
      case 'discovering-supplements': return 'Discovering supplement trends...'
      case 'discovering-combinations': return 'Discovering supplement stacks...'
      case 'saving-supplements': return 'Saving supplements to database...'
      case 'saving-combinations': return 'Saving combinations to database...'
      case 'complete': return 'Update complete!'
      default: return phase
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ArrowsClockwise className="w-6 h-6" weight="duotone" />
              Automated Trend Updates
            </CardTitle>
            <CardDescription>
              Schedule and manage daily supplement trend updates from social media sources
            </CardDescription>
          </div>
          {trendUpdateJob && (
            <Badge variant={trendUpdateJob.enabled ? 'default' : 'secondary'}>
              {trendUpdateJob.enabled ? 'Active' : 'Paused'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {trendUpdateJob && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Timer className="w-5 h-5 text-primary" weight="duotone" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{trendUpdateJob.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Updates daily at 8:00 AM
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium">
                    Next run: {formatNextRun(trendUpdateJob.nextRun)}
                  </div>
                  {trendUpdateJob.lastRun && (
                    <div className="text-xs text-muted-foreground">
                      Last: {new Date(trendUpdateJob.lastRun).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={trendUpdateJob.enabled}
                    onCheckedChange={() => handleToggle(trendUpdateJob.id)}
                    disabled={isRunning}
                  />
                  <Label className="text-sm cursor-pointer">
                    {trendUpdateJob.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" weight="duotone" />
                  Manual Update
                </h3>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Run an immediate trend update to fetch the latest supplement data from configured social media APIs.
                  This will update the database for all users.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleRunNow}
                disabled={isRunning || !trendUpdateJob.enabled}
                size="lg"
                className="w-full gap-2"
              >
                {isRunning ? (
                  <>
                    <ArrowsClockwise className="w-5 h-5 animate-spin" />
                    Running Update...
                  </>
                ) : (
                  <>
                    <CloudArrowUp className="w-5 h-5" weight="duotone" />
                    Run Update Now
                  </>
                )}
              </Button>
            </div>

            {isRunning && progress && (
              <div className="space-y-3 p-4 border rounded-lg bg-accent/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getPhaseLabel(progress.phase)}</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((progress.current / progress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(progress.current / progress.total) * 100} className="h-2" />
              </div>
            )}

            {lastResult && (
              <Alert variant={lastResult.success ? 'default' : 'destructive'}>
                {lastResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" weight="duotone" />
                ) : (
                  <XCircle className="h-5 w-5" weight="duotone" />
                )}
                <AlertDescription className="ml-6">
                  <div className="font-medium mb-1">
                    {lastResult.success ? 'Update Successful' : 'Update Failed'}
                  </div>
                  <div className="text-sm">{lastResult.message}</div>
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Database className="w-4 h-4" weight="duotone" />
                Update Process
              </h3>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Step 1:</strong> Fetch API keys from Supabase configuration
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Step 2:</strong> Discover trending supplements from Reddit, Twitter/X, TikTok, LinkedIn
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Step 3:</strong> Discover popular supplement stack combinations
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Step 4:</strong> Save all data to Supabase database
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Step 5:</strong> Update completed - all users see fresh trends
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
