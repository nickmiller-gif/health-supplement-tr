import { useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { seedDatabase, checkDatabaseEmpty } from '@/lib/seed-database'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, CheckCircle, XCircle, Link, Info, Upload } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export function SupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false)
  const [supplementCount, setSupplementCount] = useState<number>(0)
  const [combinationCount, setCombinationCount] = useState<number>(0)

  const checkConnection = async () => {
    if (!isSupabaseConfigured) {
      setIsConnected(false)
      return
    }

    setIsChecking(true)
    try {
      const { error: supplementError, count: suppCount } = await supabase
        .from('supplements')
        .select('*', { count: 'exact', head: true })

      const { error: comboError, count: comboCount } = await supabase
        .from('supplement_combinations')
        .select('*', { count: 'exact', head: true })

      if (supplementError || comboError) {
        setIsConnected(false)
      } else {
        setIsConnected(true)
        setSupplementCount(suppCount || 0)
        setCombinationCount(comboCount || 0)
        setIsDatabaseEmpty((suppCount || 0) === 0 && (comboCount || 0) === 0)
      }
    } catch (error) {
      console.error('Supabase connection check failed:', error)
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    try {
      const result = await seedDatabase()
      if (result.success) {
        toast.success(result.message)
        await checkConnection()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to seed database')
    } finally {
      setIsSeeding(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <Alert className="border-muted-foreground/20">
        <Info className="h-5 w-5 text-muted-foreground" />
        <AlertDescription className="ml-6">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-foreground mb-2">Supabase Database Not Configured</p>
              <p className="text-sm text-muted-foreground mb-3">
                Currently using local mock data. Set up Supabase to persist trends across sessions and enable multi-user access.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Quick Setup (5 minutes):</p>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                <li>Create free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></li>
                <li>Create a new project</li>
                <li>Copy your Project URL and anon key from Settings → API</li>
                <li>Add to <code className="px-1 py-0.5 bg-muted rounded text-xs">.env</code> file in project root</li>
                <li>Run the SQL setup script from SUPABASE_SETUP.md</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 mt-2"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                <Link className="w-4 h-4" />
                Open Supabase Dashboard
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className={isConnected ? 'border-green-500/50 bg-green-50/50' : 'border-destructive/50 bg-destructive/5'}>
      {isConnected ? (
        <CheckCircle className="h-5 w-5 text-green-600" weight="fill" />
      ) : (
        <XCircle className="h-5 w-5 text-destructive" weight="fill" />
      )}
      <AlertDescription className="ml-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-foreground">
                {isConnected ? 'Supabase Connected' : 'Supabase Connection Failed'}
              </p>
              <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                {isConnected ? 'Active' : 'Offline'}
              </Badge>
            </div>
            
            {isConnected ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Database is active and storing all trend data persistently.
                </p>
                <div className="flex gap-4 text-sm items-center">
                  <div>
                    <span className="text-muted-foreground">Supplements: </span>
                    <span className="font-semibold text-foreground">{supplementCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stacks: </span>
                    <span className="font-semibold text-foreground">{combinationCount}</span>
                  </div>
                  {isDatabaseEmpty && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSeedDatabase}
                      disabled={isSeeding}
                      className="gap-2 ml-auto"
                    >
                      <Upload className={`w-4 h-4 ${isSeeding ? 'animate-pulse' : ''}`} />
                      {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Unable to connect to Supabase. Check your configuration or network connection.
                </p>
                <p className="text-xs text-muted-foreground">
                  Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
                </p>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="gap-2"
          >
            <Database className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Recheck'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
