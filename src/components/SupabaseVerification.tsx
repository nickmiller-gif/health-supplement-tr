import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Warning,
  ClockCounterClockwise,
  Table as TableIcon,
  Sparkle
} from '@phosphor-icons/react'
import { getSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'

interface VerificationResult {
  status: 'success' | 'error' | 'warning'
  message: string
  details?: string
}

interface VerificationResults {
  connection: VerificationResult | null
  tables: {
    supplements: VerificationResult | null
    supplement_combinations: VerificationResult | null
    emerging_signals: VerificationResult | null
    user_tracked_supplements: VerificationResult | null
    chat_conversations: VerificationResult | null
  }
  dataCount: {
    supplements: number | null
    combinations: number | null
  }
  lastUpdate: VerificationResult | null
}

export function SupabaseVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [results, setResults] = useState<VerificationResults>({
    connection: null,
    tables: {
      supplements: null,
      supplement_combinations: null,
      emerging_signals: null,
      user_tracked_supplements: null,
      chat_conversations: null
    },
    dataCount: {
      supplements: null,
      combinations: null
    },
    lastUpdate: null
  })

  const verifyConnection = async () => {
    setIsVerifying(true)
    const newResults: VerificationResults = {
      connection: null,
      tables: {
        supplements: null,
        supplement_combinations: null,
        emerging_signals: null,
        user_tracked_supplements: null,
        chat_conversations: null
      },
      dataCount: {
        supplements: null,
        combinations: null
      },
      lastUpdate: null
    }

    try {
      const client = await getSupabaseClient()

      const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      const hasEnvVars = !!(envUrl && envKey && envUrl !== 'your_supabase_project_url_here')

      let kvConfig: { url?: string; anonKey?: string } | null | undefined = null
      try {
        kvConfig = await spark.kv.get<{ url: string; anonKey: string }>('admin-supabase-config')
      } catch (error) {
        console.warn('Could not load KV config:', error)
      }
      
      if (kvConfig === undefined) {
        kvConfig = null
      }

      const hasKvConfig = !!(kvConfig?.url && kvConfig?.anonKey && kvConfig.url.trim() !== '')

      if (!hasEnvVars && !hasKvConfig) {
        newResults.connection = {
          status: 'error',
          message: 'No Supabase credentials configured',
          details: 'Please configure your Supabase URL and anon key in the Admin Dashboard'
        }
        setResults(newResults)
        setIsVerifying(false)
        toast.error('No Supabase credentials found')
        return
      }

      const source = hasEnvVars ? 'Environment Variables' : 'KV Storage'
      const url = hasEnvVars ? envUrl : kvConfig?.url || ''

      newResults.connection = {
        status: 'success',
        message: `Connected to ${url}`,
        details: `Credentials source: ${source}`
      }

      const tableNames: Array<keyof typeof newResults.tables> = [
        'supplements',
        'supplement_combinations',
        'emerging_signals',
        'user_tracked_supplements',
        'chat_conversations'
      ]

      for (const tableName of tableNames) {
        try {
          const { data, error } = await client.from(tableName).select('id').limit(1)
          
          if (error) {
            if (error.code === '42P01') {
              newResults.tables[tableName] = {
                status: 'error',
                message: 'Table does not exist',
                details: `Run the SQL schema from SUPABASE_SCHEMA_UPDATE.sql to create this table`
              }
            } else if (error.code === '42501') {
              newResults.tables[tableName] = {
                status: 'error',
                message: 'Permission denied',
                details: 'Check RLS policies or use the correct API key'
              }
            } else {
              newResults.tables[tableName] = {
                status: 'error',
                message: `Error: ${error.message}`,
                details: `Code: ${error.code || 'unknown'}`
              }
            }
          } else {
            newResults.tables[tableName] = {
              status: 'success',
              message: 'Table accessible',
              details: `Found ${data ? 1 : 0} record(s) in test query`
            }
          }
        } catch (error: any) {
          newResults.tables[tableName] = {
            status: 'error',
            message: 'Connection error',
            details: error.message || 'Unknown error'
          }
        }
      }

      try {
        const { count: suppCount, error: suppError } = await client
          .from('supplements')
          .select('*', { count: 'exact', head: true })

        if (!suppError && suppCount !== null) {
          newResults.dataCount.supplements = suppCount
        }
      } catch (error) {
        console.warn('Could not count supplements:', error)
      }

      try {
        const { count: combCount, error: combError } = await client
          .from('supplement_combinations')
          .select('*', { count: 'exact', head: true })

        if (!combError && combCount !== null) {
          newResults.dataCount.combinations = combCount
        }
      } catch (error) {
        console.warn('Could not count combinations:', error)
      }

      try {
        const { data: updateData, error: updateError } = await client
          .from('supplements')
          .select('updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (!updateError && updateData?.updated_at) {
          const lastUpdate = new Date(updateData.updated_at)
          const now = new Date()
          const diffHours = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60))

          if (diffHours < 24) {
            newResults.lastUpdate = {
              status: 'success',
              message: `Last updated ${diffHours}h ago`,
              details: lastUpdate.toLocaleString()
            }
          } else if (diffHours < 48) {
            newResults.lastUpdate = {
              status: 'warning',
              message: `Last updated ${diffHours}h ago`,
              details: 'Consider running a manual update'
            }
          } else {
            newResults.lastUpdate = {
              status: 'warning',
              message: `Last updated ${Math.floor(diffHours / 24)}d ago`,
              details: 'Data may be outdated'
            }
          }
        } else if (newResults.dataCount.supplements === 0) {
          newResults.lastUpdate = {
            status: 'warning',
            message: 'No data in database',
            details: 'Run the daily trend updater to populate data'
          }
        }
      } catch (error) {
        console.warn('Could not check last update:', error)
      }

      setResults(newResults)

      const hasErrors = Object.values(newResults.tables).some(r => r?.status === 'error')
      if (hasErrors) {
        toast.error('Some tables are not configured correctly')
      } else {
        toast.success('All Supabase checks passed!')
      }

    } catch (error: any) {
      console.error('Verification error:', error)
      newResults.connection = {
        status: 'error',
        message: 'Connection failed',
        details: error.message || 'Unknown error occurred'
      }
      setResults(newResults)
      toast.error('Connection verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: 'success' | 'error' | 'warning' | undefined) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
      case 'warning':
        return <Warning className="w-4 h-4 text-amber-600" weight="fill" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" weight="fill" />
      default:
        return <XCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: 'success' | 'error' | 'warning' | undefined) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-600">Success</Badge>
      case 'warning':
        return <Badge variant="default" className="bg-amber-600">Warning</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Not Tested</Badge>
    }
  }

  const allTablesOk = Object.values(results.tables).every(r => r?.status === 'success')
  const someTablesOk = Object.values(results.tables).some(r => r?.status === 'success')
  const anyResult = results.connection !== null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" weight="duotone" />
              Supabase Connection Verification
            </CardTitle>
            <CardDescription className="mt-1.5">
              Test your Supabase database configuration and schema
            </CardDescription>
          </div>
          <Button 
            onClick={verifyConnection} 
            disabled={isVerifying}
            className="gap-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Sparkle className="w-4 h-4" weight="duotone" />
                Run Verification
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!anyResult && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription className="ml-6">
              <div className="font-medium mb-1">Ready to Verify</div>
              <div className="text-sm">
                Click "Run Verification" to test your Supabase connection, schema, and data integrity.
                This will check all required tables and configurations.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {results.connection && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(results.connection.status)}
                  <h4 className="font-semibold">Database Connection</h4>
                  {getStatusBadge(results.connection.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {results.connection.message}
                </p>
                {results.connection.details && (
                  <p className="text-xs text-muted-foreground">
                    {results.connection.details}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <TableIcon className="w-5 h-5" weight="duotone" />
                <h4 className="font-semibold">Database Tables</h4>
                {allTablesOk && <Badge variant="default" className="bg-green-600">All Tables OK</Badge>}
                {!allTablesOk && someTablesOk && <Badge variant="default" className="bg-amber-600">Some Issues</Badge>}
              </div>
              
              <div className="space-y-3">
                {Object.entries(results.tables).map(([tableName, result]) => (
                  <div key={tableName} className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(result?.status)}
                        <code className="text-sm font-mono font-medium">{tableName}</code>
                      </div>
                      {result && (
                        <>
                          <p className="text-sm text-muted-foreground mb-0.5">
                            {result.message}
                          </p>
                          {result.details && (
                            <p className="text-xs text-muted-foreground">
                              {result.details}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    {result && getStatusBadge(result.status)}
                  </div>
                ))}
              </div>
            </div>

            {(results.dataCount.supplements !== null || results.dataCount.combinations !== null) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ClockCounterClockwise className="w-5 h-5" weight="duotone" />
                    <h4 className="font-semibold">Data Status</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {results.dataCount.supplements !== null && (
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">Supplements</p>
                          <p className="text-xs text-muted-foreground">Total records in database</p>
                        </div>
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {results.dataCount.supplements}
                        </Badge>
                      </div>
                    )}
                    
                    {results.dataCount.combinations !== null && (
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">Supplement Combinations</p>
                          <p className="text-xs text-muted-foreground">Total records in database</p>
                        </div>
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {results.dataCount.combinations}
                        </Badge>
                      </div>
                    )}
                    
                    {results.lastUpdate && (
                      <div className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-muted/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(results.lastUpdate.status)}
                            <p className="font-medium text-sm">Last Data Update</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-0.5">
                            {results.lastUpdate.message}
                          </p>
                          {results.lastUpdate.details && (
                            <p className="text-xs text-muted-foreground">
                              {results.lastUpdate.details}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(results.lastUpdate.status)}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
