import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, CheckCircle, XCircle, ArrowRight } from '@phosphor-icons/react'
import { checkSupabaseConnection } from '@/lib/supabase'

interface SupabaseStatusProps {
  onNavigateToSetup?: () => void
}

export function SupabaseStatus({ onNavigateToSetup }: SupabaseStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const connected = await checkSupabaseConnection()
      setIsConnected(connected)
    } catch (error) {
      console.error('Error checking Supabase connection:', error)
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return null
  }

  if (isConnected === true) {
    return null
  }

  return (
    <Alert className="mb-6 border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <Database className="h-5 w-5 text-amber-600" weight="duotone" />
      <AlertDescription className="ml-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Supabase Database Not Connected
              </p>
              <Badge variant="secondary" className="gap-1.5">
                <XCircle className="w-3 h-3" weight="fill" />
                Offline Mode
              </Badge>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
              TrendPulse is currently using demo data. Connect your Supabase database to enable:
            </p>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mb-3 list-disc list-inside ml-2">
              <li>Real-time supplement trend data</li>
              <li>Daily automated updates</li>
              <li>Persistent data storage</li>
              <li>AI-powered insights</li>
            </ul>
            <div className="flex items-center gap-2">
              {onNavigateToSetup && (
                <Button
                  onClick={onNavigateToSetup}
                  size="sm"
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Database className="w-4 h-4" weight="duotone" />
                  Connect Supabase
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={checkConnection}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Recheck Connection
              </Button>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
