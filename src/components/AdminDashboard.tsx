import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendUpdateScheduler } from './TrendUpdateScheduler'
import { ConnectionManager } from './ConnectionManager'
import { SupabaseVerification } from './SupabaseVerification'
import { DatabaseMigration } from './DatabaseMigration'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLastUpdateStatus } from '@/lib/daily-trend-updater'
import { 
  ShieldCheck, 
  Database, 
  Clock,
  TrendUp,
  Stack,
  ArrowLeft,
  Plugs,
  CheckCircle,
  GitBranch
} from '@phosphor-icons/react'

export function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [updateStatus, setUpdateStatus] = useState<{
    lastUpdate: number | null
    supplementCount: number
    combinationCount: number
  } | null>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkOwnership()
    loadUpdateStatus()
  }, [])

  const checkOwnership = async () => {
    try {
      const user = await spark.user()
      setIsOwner(user?.isOwner || false)
    } catch (error) {
      console.error('Error checking ownership:', error)
      setIsOwner(false)
    } finally {
      setLoading(false)
    }
  }

  const loadUpdateStatus = async () => {
    const status = await getLastUpdateStatus()
    setUpdateStatus(status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <ShieldCheck className="h-5 w-5" weight="duotone" />
          <AlertDescription className="ml-6">
            <div className="font-medium mb-1">Access Denied</div>
            <div className="text-sm">
              You must be the app owner to access the admin dashboard.
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const formatLastUpdate = () => {
    if (!updateStatus?.lastUpdate) return 'Never'
    const date = new Date(updateStatus.lastUpdate)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Less than 1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh border-b">
        <div className="backdrop-blur-sm bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="mb-4 gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Trends
              </Button>
            )}
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck weight="duotone" className="w-10 h-10" />
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-primary-foreground/80 text-lg">
              Manage automated trend updates and system configuration
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connections" className="gap-2">
              <Plugs className="w-4 h-4" weight="duotone" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="migration" className="gap-2">
              <GitBranch className="w-4 h-4" weight="duotone" />
              Migration
            </TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scheduler">Trend Scheduler</TabsTrigger>
          </TabsList>

          <TabsContent value="connections">
            <ConnectionManager />
          </TabsContent>

          <TabsContent value="migration">
            <DatabaseMigration />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" weight="duotone" />
                    Last Update
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatLastUpdate()}</div>
                  {updateStatus?.lastUpdate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(updateStatus.lastUpdate).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <TrendUp className="w-4 h-4" weight="duotone" />
                    Supplements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {updateStatus?.supplementCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trending supplements tracked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Stack className="w-4 h-4" weight="duotone" />
                    Stacks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {updateStatus?.combinationCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supplement combinations discovered
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" weight="duotone" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Current system configuration and data status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Database Connection</span>
                  <Badge variant="default" className="gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Trend Discovery</span>
                  <Badge variant="secondary">
                    LLM + Social APIs
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Auto-Update Scheduler</span>
                  <Badge variant="default" className="gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription className="ml-6">
                <div className="font-medium mb-1">About Automated Updates</div>
                <div className="text-sm">
                  The trend update system runs daily at 8:00 AM to fetch fresh supplement data
                  from configured social media sources. All users see the same centralized data
                  stored in the Supabase database. You can run manual updates anytime from the
                  Trend Scheduler tab.
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="scheduler">
            <div className="flex justify-center">
              <TrendUpdateScheduler />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
