import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  CheckCircle
} from '@phosphor-icons/react'

export function SupabaseVerification() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" weight="duotone" />
          <div>
            <CardTitle>Storage Verification</CardTitle>
            <CardDescription>
              Verify application storage status
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="w-5 h-5 text-green-600" weight="duotone" />
          <AlertDescription>
            Using browser-based KV storage - no external database required.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
