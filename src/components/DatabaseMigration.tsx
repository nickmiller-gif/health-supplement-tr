import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database
} from '@phosphor-icons/react'

export function DatabaseMigration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" weight="duotone" />
          <div>
            <CardTitle>Database Migration</CardTitle>
            <CardDescription>
              This feature is not available - data is stored locally using KV storage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            This application uses browser-based storage. Database migrations are not required.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
