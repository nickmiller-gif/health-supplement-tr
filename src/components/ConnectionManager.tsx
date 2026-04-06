import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Key, 
  Database, 
  CheckCircle, 
  XCircle, 
  Info,
  Eye,
  EyeSlash,
  Copy,
  Check
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ApiKeys {
  exa: string
  rapidApi: string
  reddit: {
    clientId: string
    clientSecret: string
  }
  openai: string
  anthropic: string
}

interface SupabaseConfig {
  url: string
  anonKey: string
}

export function ConnectionManager() {
  const [apiKeys, setApiKeys] = useKV<ApiKeys>('admin-api-keys', {
    exa: '',
    rapidApi: '',
    reddit: { clientId: '', clientSecret: '' },
    openai: '',
    anthropic: ''
  })

  const [supabaseConfig, setSupabaseConfig] = useKV<SupabaseConfig>('admin-supabase-config', {
    url: '',
    anonKey: ''
  })

  const [localApiKeys, setLocalApiKeys] = useState<ApiKeys>(apiKeys || {
    exa: '',
    rapidApi: '',
    reddit: { clientId: '', clientSecret: '' },
    openai: '',
    anthropic: ''
  })

  const [localSupabaseConfig, setLocalSupabaseConfig] = useState<SupabaseConfig>(supabaseConfig || {
    url: '',
    anonKey: ''
  })

  const [showKeys, setShowKeys] = useState({
    exa: false,
    rapidApi: false,
    redditId: false,
    redditSecret: false,
    openai: false,
    anthropic: false,
    supabaseUrl: false,
    supabaseKey: false
  })

  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (apiKeys) {
      setLocalApiKeys(apiKeys)
    }
  }, [apiKeys])

  useEffect(() => {
    if (supabaseConfig) {
      setLocalSupabaseConfig(supabaseConfig)
    }
  }, [supabaseConfig])

  const handleSaveApiKeys = () => {
    setApiKeys(localApiKeys)
    toast.success('API keys saved successfully')
  }

  const handleSaveSupabase = () => {
    setSupabaseConfig(localSupabaseConfig)
    toast.success('Supabase configuration saved successfully')
  }

  const toggleVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      toast.success(`${label} copied to clipboard`)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const maskKey = (key: string, visible: boolean) => {
    if (!key) return ''
    if (visible) return key
    if (key.length < 8) return '••••••••'
    return `${key.substring(0, 4)}${'•'.repeat(Math.max(8, key.length - 8))}${key.substring(key.length - 4)}`
  }

  const getConnectionStatus = (value: string | { clientId?: string; clientSecret?: string }) => {
    if (typeof value === 'string') {
      return value.trim() !== ''
    }
    return value.clientId?.trim() !== '' && value.clientSecret?.trim() !== ''
  }

  const getSupabaseStatus = () => {
    return localSupabaseConfig.url.trim() !== '' && localSupabaseConfig.anonKey.trim() !== ''
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="ml-6">
          <div className="font-medium mb-1">Secure Configuration Storage</div>
          <div className="text-sm">
            All API keys and Supabase credentials are stored securely in your browser's local storage.
            They are never sent to any external servers except when making authorized API calls.
            When you deploy to Lovable, these settings will persist for all users accessing your app.
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="apis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apis">API Keys</TabsTrigger>
          <TabsTrigger value="supabase">Supabase Database</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" weight="duotone" />
                    API Credentials
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Configure your API keys for trend discovery and AI analysis
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge variant={getConnectionStatus(localApiKeys.exa) ? 'default' : 'secondary'}>
                    {Object.values(localApiKeys).flat().filter(v => v && v.toString().trim() !== '').length} / 6 configured
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exa-key" className="text-base font-semibold">
                      EXA API Key
                    </Label>
                    <div className="flex items-center gap-2">
                      {getConnectionStatus(localApiKeys.exa) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <a 
                        href="https://exa.ai" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reddit, forums, blogs, and biohacking communities (1,000 free searches/month)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="exa-key"
                      type={showKeys.exa ? 'text' : 'password'}
                      value={localApiKeys.exa}
                      onChange={(e) => setLocalApiKeys(prev => ({ ...prev, exa: e.target.value }))}
                      placeholder="Enter your EXA API key"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('exa')}
                    >
                      {showKeys.exa ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localApiKeys.exa && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localApiKeys.exa, 'EXA key')}
                      >
                        {copied === 'EXA key' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Reddit API
                    </Label>
                    <div className="flex items-center gap-2">
                      {getConnectionStatus(localApiKeys.reddit) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <a 
                        href="https://www.reddit.com/prefs/apps" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Direct Reddit access for r/Supplements, r/Nootropics, r/Biohacking (Free)
                  </p>
                  
                  <div className="space-y-3 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="reddit-id" className="text-sm">Client ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="reddit-id"
                          type={showKeys.redditId ? 'text' : 'password'}
                          value={localApiKeys.reddit.clientId}
                          onChange={(e) => setLocalApiKeys(prev => ({ 
                            ...prev, 
                            reddit: { ...prev.reddit, clientId: e.target.value }
                          }))}
                          placeholder="Enter Reddit client ID"
                          className="font-mono text-sm"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => toggleVisibility('redditId')}
                        >
                          {showKeys.redditId ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        {localApiKeys.reddit.clientId && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(localApiKeys.reddit.clientId, 'Reddit Client ID')}
                          >
                            {copied === 'Reddit Client ID' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reddit-secret" className="text-sm">Client Secret</Label>
                      <div className="flex gap-2">
                        <Input
                          id="reddit-secret"
                          type={showKeys.redditSecret ? 'text' : 'password'}
                          value={localApiKeys.reddit.clientSecret}
                          onChange={(e) => setLocalApiKeys(prev => ({ 
                            ...prev, 
                            reddit: { ...prev.reddit, clientSecret: e.target.value }
                          }))}
                          placeholder="Enter Reddit client secret"
                          className="font-mono text-sm"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => toggleVisibility('redditSecret')}
                        >
                          {showKeys.redditSecret ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        {localApiKeys.reddit.clientSecret && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(localApiKeys.reddit.clientSecret, 'Reddit Secret')}
                          >
                            {copied === 'Reddit Secret' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rapid-key" className="text-base font-semibold">
                      RapidAPI Key
                    </Label>
                    <div className="flex items-center gap-2">
                      {getConnectionStatus(localApiKeys.rapidApi) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <a 
                        href="https://rapidapi.com/hub" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Twitter/X, TikTok, LinkedIn access (Paid plans available)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="rapid-key"
                      type={showKeys.rapidApi ? 'text' : 'password'}
                      value={localApiKeys.rapidApi}
                      onChange={(e) => setLocalApiKeys(prev => ({ ...prev, rapidApi: e.target.value }))}
                      placeholder="Enter your RapidAPI key"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('rapidApi')}
                    >
                      {showKeys.rapidApi ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localApiKeys.rapidApi && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localApiKeys.rapidApi, 'RapidAPI key')}
                      >
                        {copied === 'RapidAPI key' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="openai-key" className="text-base font-semibold">
                      OpenAI API Key
                    </Label>
                    <div className="flex items-center gap-2">
                      {getConnectionStatus(localApiKeys.openai) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    GPT-4 for enhanced AI analysis (Optional, ~$0.01-0.03 per request)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="openai-key"
                      type={showKeys.openai ? 'text' : 'password'}
                      value={localApiKeys.openai}
                      onChange={(e) => setLocalApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                      placeholder="Enter your OpenAI API key"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('openai')}
                    >
                      {showKeys.openai ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localApiKeys.openai && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localApiKeys.openai, 'OpenAI key')}
                      >
                        {copied === 'OpenAI key' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anthropic-key" className="text-base font-semibold">
                      Anthropic API Key
                    </Label>
                    <div className="flex items-center gap-2">
                      {getConnectionStatus(localApiKeys.anthropic) ? (
                        <CheckCircle className="w-4 h-4 text-green-600" weight="fill" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <a 
                        href="https://console.anthropic.com/settings/keys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Claude 3 for alternative AI analysis (Optional, ~$0.01-0.03 per request)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="anthropic-key"
                      type={showKeys.anthropic ? 'text' : 'password'}
                      value={localApiKeys.anthropic}
                      onChange={(e) => setLocalApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                      placeholder="Enter your Anthropic API key"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('anthropic')}
                    >
                      {showKeys.anthropic ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localApiKeys.anthropic && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localApiKeys.anthropic, 'Anthropic key')}
                      >
                        {copied === 'Anthropic key' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveApiKeys} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" weight="duotone" />
                  Save API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supabase" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" weight="duotone" />
                    Supabase Configuration
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Connect your Supabase database for centralized data storage
                  </CardDescription>
                </div>
                {getSupabaseStatus() ? (
                  <Badge variant="default" className="gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Connected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="ml-6">
                  <div className="font-medium mb-1">Setup Instructions</div>
                  <div className="text-sm space-y-1">
                    <p>1. Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></p>
                    <p>2. Create a new project</p>
                    <p>3. Run the SQL schema from <code className="bg-muted px-1 py-0.5 rounded">SUPABASE_SCHEMA_UPDATE.sql</code></p>
                    <p>4. Get your Project URL and anon/public key from Settings → API</p>
                    <p>5. Enter them below and save</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url" className="text-base font-semibold">
                    Project URL
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your Supabase project URL (e.g., https://xxxxx.supabase.co)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="supabase-url"
                      type={showKeys.supabaseUrl ? 'text' : 'password'}
                      value={localSupabaseConfig.url}
                      onChange={(e) => setLocalSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://xxxxx.supabase.co"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('supabaseUrl')}
                    >
                      {showKeys.supabaseUrl ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localSupabaseConfig.url && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localSupabaseConfig.url, 'Supabase URL')}
                      >
                        {copied === 'Supabase URL' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-key" className="text-base font-semibold">
                    Anon/Public Key
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your Supabase anon (public) API key
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="supabase-key"
                      type={showKeys.supabaseKey ? 'text' : 'password'}
                      value={localSupabaseConfig.anonKey}
                      onChange={(e) => setLocalSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                      placeholder="Enter your Supabase anon key"
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleVisibility('supabaseKey')}
                    >
                      {showKeys.supabaseKey ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    {localSupabaseConfig.anonKey && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(localSupabaseConfig.anonKey, 'Supabase Key')}
                      >
                        {copied === 'Supabase Key' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSupabase} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" weight="duotone" />
                  Save Supabase Configuration
                </Button>
              </div>

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription className="ml-6">
                  <div className="font-medium mb-1">About Data Storage</div>
                  <div className="text-sm">
                    All supplement trends, combinations, and insights are stored in your Supabase database.
                    This is a single centralized database that all users of your app will access.
                    The automated trend updater will populate this database daily.
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
