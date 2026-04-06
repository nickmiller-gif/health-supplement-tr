import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Flask, ArrowsClockwise } from '@phosphor-icons/react'
import { API_KEYS } from '@/config/api-keys'
import { useKV } from '@github/spark/hooks'

type TestStatus = 'idle' | 'running' | 'success' | 'failed'

interface TestResult {
  status: TestStatus
  message: string
  details?: string
  latency?: number
}

interface ApiTestResults {
  exa: TestResult
  rapidApi: TestResult
  openai: TestResult
  anthropic: TestResult
}

export function ApiTester() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [storedExaKey] = useKV<string>('exa-api-key', '')
  const [storedRapidKey] = useKV<string>('rapidapi-key', '')
  const [storedOpenaiKey] = useKV<string>('openai-api-key', '')
  const [storedAnthropicKey] = useKV<string>('anthropic-api-key', '')

  const [results, setResults] = useState<ApiTestResults>({
    exa: { status: 'idle', message: 'Not tested yet' },
    rapidApi: { status: 'idle', message: 'Not tested yet' },
    openai: { status: 'idle', message: 'Not tested yet' },
    anthropic: { status: 'idle', message: 'Not tested yet' }
  })

  const exaApiKey = API_KEYS.exa || storedExaKey || ''
  const rapidApiKey = API_KEYS.rapidApi || storedRapidKey || ''
  const openaiApiKey = API_KEYS.openai || storedOpenaiKey || ''
  const anthropicApiKey = API_KEYS.anthropic || storedAnthropicKey || ''

  const testExaApi = async (): Promise<TestResult> => {
    if (!exaApiKey || !exaApiKey.trim()) {
      return { status: 'failed', message: 'No API key configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': exaApiKey
        },
        body: JSON.stringify({
          query: 'test',
          numResults: 1
        })
      })
      const latency = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          status: 'success',
          message: 'API key is valid and working',
          details: `Found ${data.results?.length || 0} result(s)`,
          latency
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          status: 'failed',
          message: 'API request failed',
          details: errorData.error || `Status: ${response.status}`
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Connection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testRapidApi = async (): Promise<TestResult> => {
    if (!rapidApiKey || !rapidApiKey.trim()) {
      return { status: 'failed', message: 'No API key configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://twitter-api45.p.rapidapi.com/timeline.php?screenname=elonmusk', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
        }
      })
      const latency = Date.now() - startTime

      if (response.ok) {
        return {
          status: 'success',
          message: 'API key is valid and working',
          details: 'Successfully accessed Twitter API endpoint',
          latency
        }
      } else if (response.status === 403) {
        return {
          status: 'failed',
          message: 'Invalid API key or subscription',
          details: 'Check your RapidAPI subscription status'
        }
      } else {
        return {
          status: 'failed',
          message: 'API request failed',
          details: `Status: ${response.status}`
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Connection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testOpenAiApi = async (): Promise<TestResult> => {
    if (!openaiApiKey || !openaiApiKey.trim()) {
      return { status: 'failed', message: 'No API key configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`
        }
      })
      const latency = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          status: 'success',
          message: 'API key is valid and working',
          details: `Access to ${data.data?.length || 0} model(s)`,
          latency
        }
      } else if (response.status === 401) {
        return {
          status: 'failed',
          message: 'Invalid API key',
          details: 'The provided OpenAI API key is not valid'
        }
      } else {
        return {
          status: 'failed',
          message: 'API request failed',
          details: `Status: ${response.status}`
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Connection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const testAnthropicApi = async (): Promise<TestResult> => {
    if (!anthropicApiKey || !anthropicApiKey.trim()) {
      return { status: 'failed', message: 'No API key configured' }
    }

    try {
      const startTime = Date.now()
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [
            { role: 'user', content: 'Hello' }
          ]
        })
      })
      const latency = Date.now() - startTime

      if (response.ok) {
        return {
          status: 'success',
          message: 'API key is valid and working',
          details: 'Successfully connected to Claude API',
          latency
        }
      } else if (response.status === 401) {
        return {
          status: 'failed',
          message: 'Invalid API key',
          details: 'The provided Anthropic API key is not valid'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          status: 'failed',
          message: 'API request failed',
          details: errorData.error?.message || `Status: ${response.status}`
        }
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Connection error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const runAllTests = async () => {
    setIsTesting(true)
    
    setResults({
      exa: { status: 'running', message: 'Testing...' },
      rapidApi: { status: 'running', message: 'Testing...' },
      openai: { status: 'running', message: 'Testing...' },
      anthropic: { status: 'running', message: 'Testing...' }
    })

    const [exaResult, rapidResult, openaiResult, anthropicResult] = await Promise.all([
      testExaApi(),
      testRapidApi(),
      testOpenAiApi(),
      testAnthropicApi()
    ])

    setResults({
      exa: exaResult,
      rapidApi: rapidResult,
      openai: openaiResult,
      anthropic: anthropicResult
    })

    setIsTesting(false)
  }

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" weight="fill" />
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Valid</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'running':
        return <Badge variant="secondary">Testing...</Badge>
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    runAllTests()
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="default"
        size="sm"
        className="gap-2"
      >
        <Flask className="w-4 h-4" />
        Test APIs
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>API Key Validation</DialogTitle>
            <DialogDescription>
              Testing all configured API keys to verify they're working correctly
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              <Alert>
                <Flask className="w-4 h-4" />
                <AlertDescription>
                  Running connection tests to each API endpoint. This may take a few seconds.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(results.exa.status)}
                      <div>
                        <h4 className="font-semibold">EXA Search API</h4>
                        <p className="text-xs text-muted-foreground">
                          {exaApiKey ? `Key: ${exaApiKey.substring(0, 8)}...` : 'No key configured'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(results.exa.status)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{results.exa.message}</p>
                    {results.exa.details && (
                      <p className="text-muted-foreground text-xs mt-1">{results.exa.details}</p>
                    )}
                    {results.exa.latency && (
                      <p className="text-muted-foreground text-xs mt-1">Response time: {results.exa.latency}ms</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(results.rapidApi.status)}
                      <div>
                        <h4 className="font-semibold">RapidAPI (Twitter/TikTok/LinkedIn)</h4>
                        <p className="text-xs text-muted-foreground">
                          {rapidApiKey ? `Key: ${rapidApiKey.substring(0, 8)}...` : 'No key configured'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(results.rapidApi.status)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{results.rapidApi.message}</p>
                    {results.rapidApi.details && (
                      <p className="text-muted-foreground text-xs mt-1">{results.rapidApi.details}</p>
                    )}
                    {results.rapidApi.latency && (
                      <p className="text-muted-foreground text-xs mt-1">Response time: {results.rapidApi.latency}ms</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(results.openai.status)}
                      <div>
                        <h4 className="font-semibold">OpenAI API</h4>
                        <p className="text-xs text-muted-foreground">
                          {openaiApiKey ? `Key: ${openaiApiKey.substring(0, 12)}...` : 'No key configured'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(results.openai.status)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{results.openai.message}</p>
                    {results.openai.details && (
                      <p className="text-muted-foreground text-xs mt-1">{results.openai.details}</p>
                    )}
                    {results.openai.latency && (
                      <p className="text-muted-foreground text-xs mt-1">Response time: {results.openai.latency}ms</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(results.anthropic.status)}
                      <div>
                        <h4 className="font-semibold">Anthropic API (Claude)</h4>
                        <p className="text-xs text-muted-foreground">
                          {anthropicApiKey ? `Key: ${anthropicApiKey.substring(0, 12)}...` : 'No key configured'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(results.anthropic.status)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{results.anthropic.message}</p>
                    {results.anthropic.details && (
                      <p className="text-muted-foreground text-xs mt-1">{results.anthropic.details}</p>
                    )}
                    {results.anthropic.latency && (
                      <p className="text-muted-foreground text-xs mt-1">Response time: {results.anthropic.latency}ms</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={runAllTests}
                  disabled={isTesting}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowsClockwise className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  Retest All
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
