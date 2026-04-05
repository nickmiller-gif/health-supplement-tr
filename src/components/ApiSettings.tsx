import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Gear, Check, X, Database, Trash, LinkSimple, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getCacheStats, clearExaCache } from '@/lib/cache-utils'
import { getSocialMediaCacheStats, clearSocialMediaCache, getSocialMediaAPIsInfo } from '@/lib/social-media-apis'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export function ApiSettings() {
  const [exaApiKey, setExaApiKey] = useKV<string>('exa-api-key', '')
  const [redditClientId, setRedditClientId] = useKV<string>('reddit-client-id', '')
  const [redditClientSecret, setRedditClientSecret] = useKV<string>('reddit-client-secret', '')
  const [rapidApiKey, setRapidApiKey] = useKV<string>('rapidapi-key', '')
  
  const [isOpen, setIsOpen] = useState(false)
  const [tempKeys, setTempKeys] = useState({
    exa: '',
    redditClientId: '',
    redditClientSecret: '',
    rapidApi: ''
  })
  const [showKeys, setShowKeys] = useState({
    exa: false,
    redditClientId: false,
    redditClientSecret: false,
    rapidApi: false
  })
  const [cacheStats, setCacheStats] = useState({
    totalCached: 0,
    oldestCache: null as number | null,
    newestCache: null as number | null,
    totalSize: 0
  })
  const [socialCacheStats, setSocialCacheStats] = useState({
    totalCached: 0,
    oldestCache: null as number | null,
    newestCache: null as number | null
  })

  const handleOpen = async () => {
    setTempKeys({
      exa: exaApiKey || '',
      redditClientId: redditClientId || '',
      redditClientSecret: redditClientSecret || '',
      rapidApi: rapidApiKey || ''
    })
    setIsOpen(true)
    setShowKeys({ exa: false, redditClientId: false, redditClientSecret: false, rapidApi: false })
    
    const stats = await getCacheStats()
    setCacheStats(stats)
    
    const socialStats = await getSocialMediaCacheStats()
    setSocialCacheStats(socialStats)
  }

  const handleSave = () => {
    setExaApiKey(tempKeys.exa.trim())
    setRedditClientId(tempKeys.redditClientId.trim())
    setRedditClientSecret(tempKeys.redditClientSecret.trim())
    setRapidApiKey(tempKeys.rapidApi.trim())
    
    toast.success('API settings saved!')
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClearExaCache = async () => {
    const cleared = await clearExaCache()
    toast.success(`Cleared ${cleared} cached EXA ${cleared === 1 ? 'result' : 'results'}`)
    const stats = await getCacheStats()
    setCacheStats(stats)
  }

  const handleClearSocialCache = async () => {
    const cleared = await clearSocialMediaCache()
    toast.success(`Cleared ${cleared} cached social media ${cleared === 1 ? 'result' : 'results'}`)
    const socialStats = await getSocialMediaCacheStats()
    setSocialCacheStats(socialStats)
  }

  const formatCacheAge = (timestamp: number | null) => {
    if (!timestamp) return 'N/A'
    const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const toggleShowKey = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateTempKey = (key: keyof typeof tempKeys, value: string) => {
    setTempKeys(prev => ({ ...prev, [key]: value }))
  }

  const apiInfo = getSocialMediaAPIsInfo()
  const activeAPIs = [
    exaApiKey && exaApiKey.trim() && 'EXA',
    redditClientId && redditClientId.trim() && redditClientSecret && redditClientSecret.trim() && 'Reddit',
    rapidApiKey && rapidApiKey.trim() && 'RapidAPI'
  ].filter(Boolean)

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Gear className="w-4 h-4" />
        API Settings
        {activeAPIs.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeAPIs.length} Active
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Social Media API Configuration</DialogTitle>
            <DialogDescription>
              Configure API keys to discover real supplement trends from social platforms
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <Tabs defaultValue="apis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="apis">API Keys</TabsTrigger>
                <TabsTrigger value="cache">Cache Management</TabsTrigger>
              </TabsList>

              <TabsContent value="apis" className="space-y-6 mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <Info className="w-5 h-5 text-accent mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Multiple Data Sources Available</p>
                        <p className="text-muted-foreground">
                          Configure one or more APIs below to aggregate supplement trends from Reddit, X/Twitter, TikTok, LinkedIn, and the broader web.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">EXA Search API</Label>
                        <a href={apiInfo.exa.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <LinkSimple className="w-3 h-3" />
                          Get API Key
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">{apiInfo.exa.description} • Cost: {apiInfo.exa.cost}</p>
                      <div className="relative">
                        <Input
                          type={showKeys.exa ? 'text' : 'password'}
                          value={tempKeys.exa}
                          onChange={(e) => updateTempKey('exa', e.target.value)}
                          placeholder="Enter EXA API key..."
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => toggleShowKey('exa')}
                        >
                          {showKeys.exa ? <X className="w-4 h-4" /> : '👁️'}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Reddit API</Label>
                        <a href={apiInfo.reddit.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <LinkSimple className="w-3 h-3" />
                          Get Credentials
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">{apiInfo.reddit.description} • Cost: {apiInfo.reddit.cost}</p>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Client ID</Label>
                        <div className="relative">
                          <Input
                            type={showKeys.redditClientId ? 'text' : 'password'}
                            value={tempKeys.redditClientId}
                            onChange={(e) => updateTempKey('redditClientId', e.target.value)}
                            placeholder="Enter Reddit Client ID..."
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => toggleShowKey('redditClientId')}
                          >
                            {showKeys.redditClientId ? <X className="w-4 h-4" /> : '👁️'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Client Secret</Label>
                        <div className="relative">
                          <Input
                            type={showKeys.redditClientSecret ? 'text' : 'password'}
                            value={tempKeys.redditClientSecret}
                            onChange={(e) => updateTempKey('redditClientSecret', e.target.value)}
                            placeholder="Enter Reddit Client Secret..."
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => toggleShowKey('redditClientSecret')}
                          >
                            {showKeys.redditClientSecret ? <X className="w-4 h-4" /> : '👁️'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">RapidAPI Key</Label>
                        <a href="https://rapidapi.com/hub" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <LinkSimple className="w-3 h-3" />
                          Get API Key
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Access Twitter/X, TikTok, and LinkedIn APIs (one key for all platforms)
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1 pl-4">
                        <li>• {apiInfo.twitter.description}</li>
                        <li>• {apiInfo.tiktok.description}</li>
                        <li>• {apiInfo.linkedin.description}</li>
                      </ul>
                      <div className="relative">
                        <Input
                          type={showKeys.rapidApi ? 'text' : 'password'}
                          value={tempKeys.rapidApi}
                          onChange={(e) => updateTempKey('rapidApi', e.target.value)}
                          placeholder="Enter RapidAPI key..."
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => toggleShowKey('rapidApi')}
                        >
                          {showKeys.rapidApi ? <X className="w-4 h-4" /> : '👁️'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {(tempKeys.exa || tempKeys.redditClientId || tempKeys.rapidApi) && (
                    <Alert>
                      <Check className="w-4 h-4" />
                      <AlertDescription className="text-sm">
                        <strong>Data Privacy:</strong> All API keys are stored locally in your browser and only sent to their respective services for trend discovery.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cache" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-muted-foreground" />
                        <h4 className="font-semibold">EXA API Cache</h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearExaCache}
                        disabled={cacheStats.totalCached === 0}
                        className="gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Clear Cache
                      </Button>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cached Results:</span>
                        <span className="font-medium">{cacheStats.totalCached}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Oldest Cache:</span>
                        <span className="font-medium">{formatCacheAge(cacheStats.oldestCache)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Newest Cache:</span>
                        <span className="font-medium">{formatCacheAge(cacheStats.newestCache)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      EXA results are cached for 24 hours to reduce API costs.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-muted-foreground" />
                        <h4 className="font-semibold">Social Media Cache</h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearSocialCache}
                        disabled={socialCacheStats.totalCached === 0}
                        className="gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Clear Cache
                      </Button>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cached Results:</span>
                        <span className="font-medium">{socialCacheStats.totalCached}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Oldest Cache:</span>
                        <span className="font-medium">{formatCacheAge(socialCacheStats.oldestCache)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Newest Cache:</span>
                        <span className="font-medium">{formatCacheAge(socialCacheStats.newestCache)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Social media results are cached for 24 hours (Reddit, Twitter, TikTok, LinkedIn).
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
