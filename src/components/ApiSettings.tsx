import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Gear, Check, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ApiSettings() {
  const [exaApiKey, setExaApiKey] = useKV<string>('exa-api-key', '')
  const [isOpen, setIsOpen] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  const handleOpen = () => {
    setTempKey(exaApiKey || '')
    setIsOpen(true)
    setShowKey(false)
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
