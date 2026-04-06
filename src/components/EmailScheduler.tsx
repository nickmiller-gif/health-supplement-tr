import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  EmailSchedule,
  createEmailSchedule,
  getEmailSchedules,
  deleteEmailSchedule,
  toggleEmailSchedule,
  updateEmailSchedule,
  formatNextSendTime,
  sendEmailReport,
} from '@/lib/email-scheduler'
import { Supplement, SupplementCombination } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  EnvelopeSimple,
  Trash,
  PaperPlaneTilt,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EmailSchedulerProps {
  supplements: Supplement[]
  combinations: SupplementCombination[]
}

export function EmailScheduler({ supplements, combinations }: EmailSchedulerProps) {
  const [schedules, setSchedules] = useState<EmailSchedule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [includeInsights, setIncludeInsights] = useState(true)
  const [includeLinks, setIncludeLinks] = useState(true)
  const [includeTrendData, setIncludeTrendData] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    const allSchedules = await getEmailSchedules()
    setSchedules(allSchedules)
  }

  const handleCreateSchedule = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsCreating(true)
    try {
      await createEmailSchedule(email, frequency, {
        includeInsights,
        includeLinks,
        includeTrendData,
      })

      toast.success(`Email schedule created! Reports will be sent ${frequency}.`)
      setEmail('')
      setIsDialogOpen(false)
      loadSchedules()
    } catch (error) {
      console.error('Error creating schedule:', error)
      toast.error('Failed to create email schedule')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleEmailSchedule(id)
      loadSchedules()
      toast.success('Schedule updated')
    } catch (error) {
      console.error('Error toggling schedule:', error)
      toast.error('Failed to update schedule')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEmailSchedule(id)
      loadSchedules()
      toast.success('Schedule deleted')
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast.error('Failed to delete schedule')
    }
  }

  const handleSendNow = async (schedule: EmailSchedule) => {
    try {
      await sendEmailReport(schedule, supplements, combinations)
      toast.success('Email report opened in your default email client')
      loadSchedules()
    } catch (error) {
      console.error('Error sending report:', error)
      toast.error('Failed to send report')
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2" data-email-scheduler-button>
          <EnvelopeSimple className="w-5 h-5" />
          Email Reports
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <EnvelopeSimple className="w-6 h-6" />
            Email Report Scheduler
          </DialogTitle>
          <DialogDescription>
            Automatically receive trend reports via email on a schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Schedule</CardTitle>
              <CardDescription>
                Set up automatic email reports for supplement trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (9:00 AM)</SelectItem>
                    <SelectItem value="weekly">Weekly (Mondays at 9:00 AM)</SelectItem>
                    <SelectItem value="monthly">Monthly (1st day at 9:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Report Options</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-insights" className="text-sm font-normal">
                      Include AI Insights
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add AI-generated insights for each supplement
                    </p>
                  </div>
                  <Switch
                    id="include-insights"
                    checked={includeInsights}
                    onCheckedChange={setIncludeInsights}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-links" className="text-sm font-normal">
                      Include Discussion Links
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add source links from Reddit, forums, etc.
                    </p>
                  </div>
                  <Switch
                    id="include-links"
                    checked={includeLinks}
                    onCheckedChange={setIncludeLinks}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-trend-data" className="text-sm font-normal">
                      Include Trend Data
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Add raw trend numbers (7-day data)
                    </p>
                  </div>
                  <Switch
                    id="include-trend-data"
                    checked={includeTrendData}
                    onCheckedChange={setIncludeTrendData}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateSchedule}
                disabled={isCreating}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                {isCreating ? 'Creating...' : 'Create Schedule'}
              </Button>
            </CardContent>
          </Card>

          {schedules.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Schedules</h3>
                <Badge variant="secondary">{schedules.length}</Badge>
              </div>

              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <Card key={schedule.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <EnvelopeSimple className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">{schedule.email}</span>
                            {schedule.enabled ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="w-3 h-3" />
                                Paused
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                            </div>
                            <span>•</span>
                            <span>
                              Next: {formatNextSendTime(schedule.nextSend)}
                            </span>
                            {schedule.lastSent && (
                              <>
                                <span>•</span>
                                <span>
                                  Last sent: {new Date(schedule.lastSent).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2 text-xs">
                            {schedule.includeInsights && (
                              <Badge variant="outline">AI Insights</Badge>
                            )}
                            {schedule.includeLinks && (
                              <Badge variant="outline">Links</Badge>
                            )}
                            {schedule.includeTrendData && (
                              <Badge variant="outline">Trend Data</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNow(schedule)}
                            className="gap-2"
                          >
                            <PaperPlaneTilt className="w-4 h-4" />
                            Send Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggle(schedule.id)}
                          >
                            {schedule.enabled ? 'Pause' : 'Resume'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {schedules.length === 0 && (
            <div className="text-center py-8">
              <EnvelopeSimple className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No email schedules yet. Create one above to get started!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
