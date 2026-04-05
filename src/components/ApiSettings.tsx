import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Gear, Check, X, Database, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getCacheStats, clearExaCache } from '@/lib/cache-utils'
import { Separator } from '@/components/ui/separator'

export function ApiSettings() {
  const [exaApiKey, setExaApiKey] = useKV<string>('exa-api-key', '')
  const [isOpen, setIsOpen] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [cacheStats, setCacheStats] = useState({
    totalCached: 0,
    oldestCache: null as number | null,
    newestCache: null as number | null,
    totalSize: 0
  })

  const handleOpen = async () => {
    setTempKey(exaApiKey || '')
    setIsOpen(true)
    setShowKey(false)
    const stats = await getCacheStats()
    setCacheStats(stats)
  }

  const handleSave = () => {
    setExaApiKey(tempKey.trim())
    toast.success(tempKey.trim() ? 'EXA API key saved!' : 'EXA API key removed')
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempKey('')
    setIsOpen(false)
  }

  const handleClearCache = async () => {
    const cleared = await clearExaCache()
    toast.success(`Cleared ${cleared} cached EXA ${cleared === 1 ? 'result' : 'results'}`)
    const stats = await getCacheStats()
    setCacheStats(stats)
  }

  useEffect(() => {
    if (isOpen) {
      getCacheStats().then(setCacheStats)
    }
  }, [isOpen])

  const formatCacheAge = (timestamp: number | null) => {
    if (!timestamp) return 'N/A'
    const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const isConfigured = !!(exaApiKey && exaApiKey.trim())

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Gear className="w-4 h-4" />
        {isConfigured ? 'EXA Enabled' : 'Configure EXA'}
        {isConfigured && <Check className="w-4 h-4 text-green-600" />}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure EXA API</DialogTitle>
            <DialogDescription>
              Add your EXA API key to enable real-time web search for supplement trends
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Get your EXA API key:</strong>
                <br />
                1. Visit <a href="https://exa.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline">exa.ai</a>
                <br />
                2. Sign up for an account
                <br />
                3. Generate an API key from your dashboard
                <br />
                4. Paste it below
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="exa-key">EXA API Key</Label>
              <div className="relative">
                <Input
                  id="exa-key"
                  type={showKey ? 'text' : 'password'}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Enter your EXA API key..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <X className="w-4 h-4" /> : '👁️'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to external servers except EXA
              </p>
            </div>

            {isConfigured && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <Check className="w-4 h-4" weight="bold" />
                  <strong>EXA Integration Active</strong>
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Real-time web search will be used to discover actual supplement trends from Reddit, forums, and communities
                </p>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Cache Statistics</h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  disabled={cacheStats.totalCached === 0}
                  className="gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Clear Cache
                </Button>
              </div>
              
              <div className="bg-muted rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cached Results:</span>
                  <span className="font-medium">{cacheStats.totalCached}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Oldest Cache:</span>
                  <span className="font-medium">{formatCacheAge(cacheStats.oldestCache)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Newest Cache:</span>
                  <span className="font-medium">{formatCacheAge(cacheStats.newestCache)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Cached EXA results are valid for 24 hours. Clearing cache will force fresh API calls on next trend discovery.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
