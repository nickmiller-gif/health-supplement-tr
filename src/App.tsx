import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Supplement, TrackedSupplement, SupplementCategory, SupplementCombination } from '@/lib/types'
import { INITIAL_SUPPLEMENTS, SUPPLEMENT_COMBINATIONS } from '@/lib/data'
import { discoverSupplementTrends, discoverSupplementCombinations } from '@/lib/trend-discovery'
import { discoverEmergingSupplements, EmergingSupplementSignal } from '@/lib/research-discovery'
import { SupplementCard } from '@/components/SupplementCard'
import { InsightDialog } from '@/components/InsightDialog'
import { CombinationCard } from '@/components/CombinationCard'
import { CombinationInsightDialog } from '@/components/CombinationInsightDialog'
import { SuggestedSupplements } from '@/components/SuggestedSupplements'
import { TrendPredictionDialog } from '@/components/TrendPredictionDialog'
import { EmergingResearchCard } from '@/components/EmergingResearchCard'
import { ResearchInsightDialog } from '@/components/ResearchInsightDialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, Flask, Pill, Brain, Atom, Stack, SortAscending, ArrowsClockwise, Sparkle, Info, Rocket, TrendUp, Clock, Database } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API_KEYS } from '@/config/api-keys'
import { ApiSettings } from '@/components/ApiSettings'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { registerCronJob, getCronJobs, formatNextRun } from '@/lib/cron-scheduler'
import { ExportDialog } from '@/components/ExportDialog'
import { EmailScheduler } from '@/components/EmailScheduler'
import { checkAndSendScheduledEmails } from '@/lib/email-scheduler'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'trend' | 'name'>('popularity')
  const [combinationSearchQuery, setCombinationSearchQuery] = useState('')
  const [selectedCombinationTrend, setSelectedCombinationTrend] = useState<'all' | 'rising' | 'stable' | 'declining'>('all')
  const [combinationSortBy, setCombinationSortBy] = useState<'popularity' | 'trend' | 'name'>('popularity')
  const [trackedSupplements, setTrackedSupplements] = useKV<TrackedSupplement[]>('tracked-supplements', [])
  
  const [storedExaKey] = useKV<string>('exa-api-key', '')
  const [storedRedditId] = useKV<string>('reddit-client-id', '')
  const [storedRedditSecret] = useKV<string>('reddit-client-secret', '')
  const [storedRapidKey] = useKV<string>('rapidapi-key', '')
  
  const exaApiKey = API_KEYS.exa || storedExaKey || ''
  const redditClientId = API_KEYS.reddit.clientId || storedRedditId || ''
  const redditClientSecret = API_KEYS.reddit.clientSecret || storedRedditSecret || ''
  const rapidApiKey = API_KEYS.rapidApi || storedRapidKey || ''
  const [supplements, setSupplements] = useState<Supplement[]>(INITIAL_SUPPLEMENTS)
  const [combinations, setCombinations] = useState<SupplementCombination[]>(SUPPLEMENT_COMBINATIONS)
  const [emergingSignals, setEmergingSignals] = useState<EmergingSupplementSignal[]>([])
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)
  const [selectedCombination, setSelectedCombination] = useState<SupplementCombination | null>(null)
  const [selectedResearchSignal, setSelectedResearchSignal] = useState<EmergingSupplementSignal | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [combinationDialogOpen, setCombinationDialogOpen] = useState(false)
  const [researchDialogOpen, setResearchDialogOpen] = useState(false)
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false)
  const [predictionSupplement, setPredictionSupplement] = useState<Supplement | null>(null)
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [isLoadingResearch, setIsLoadingResearch] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [dismissedWelcome, setDismissedWelcome] = useKV<boolean>('dismissed-welcome', false)
  const [nextScheduledUpdate, setNextScheduledUpdate] = useState<string>('')

  const filteredSupplements = useMemo(() => {
    const filtered = supplements.filter(supplement => {
      const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplement.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || supplement.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularityScore - a.popularityScore
        case 'trend': {
          const trendOrder = { rising: 3, stable: 2, declining: 1 }
          const trendDiff = trendOrder[b.trendDirection] - trendOrder[a.trendDirection]
          if (trendDiff !== 0) return trendDiff
          return b.popularityScore - a.popularityScore
        }
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return sorted
  }, [supplements, searchQuery, selectedCategory, sortBy])

  const trackedSupplementsList = useMemo(() => {
    const trackedIds = new Set((trackedSupplements || []).map(t => t.supplementId))
    return supplements.filter(s => trackedIds.has(s.id))
  }, [supplements, trackedSupplements])

  const filteredCombinations = useMemo(() => {
    const filtered = combinations.filter(combination => {
      const matchesSearch = 
        combination.name.toLowerCase().includes(combinationSearchQuery.toLowerCase()) ||
        combination.description.toLowerCase().includes(combinationSearchQuery.toLowerCase()) ||
        combination.purpose.toLowerCase().includes(combinationSearchQuery.toLowerCase())
      const matchesTrend = selectedCombinationTrend === 'all' || combination.trendDirection === selectedCombinationTrend
      return matchesSearch && matchesTrend
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (combinationSortBy) {
        case 'popularity':
          return b.popularityScore - a.popularityScore
        case 'trend': {
          const trendOrder = { rising: 3, stable: 2, declining: 1 }
          const trendDiff = trendOrder[b.trendDirection] - trendOrder[a.trendDirection]
          if (trendDiff !== 0) return trendDiff
          return b.popularityScore - a.popularityScore
        }
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return sorted
  }, [combinations, combinationSearchQuery, selectedCombinationTrend, combinationSortBy])

  const handleToggleTrack = (id: string) => {
    setTrackedSupplements((current) => {
      const currentList = current || []
      const isTracked = currentList.some(t => t.supplementId === id)
      if (isTracked) {
        return currentList.filter(t => t.supplementId !== id)
      } else {
        return [...currentList, { supplementId: id, trackedAt: Date.now() }]
      }
    })
  }

  const isTracked = (id: string) => {
    return (trackedSupplements || []).some(t => t.supplementId === id)
  }

  const handleViewInsight = (supplement: Supplement) => {
    setSelectedSupplement(supplement)
    setDialogOpen(true)
  }

  const handleViewCombinationInsight = (combination: SupplementCombination) => {
    setSelectedCombination(combination)
    setCombinationDialogOpen(true)
  }

  const handleViewPrediction = (supplement: Supplement) => {
    setPredictionSupplement(supplement)
    setPredictionDialogOpen(true)
  }

  const handleViewResearchSignal = (signal: EmergingSupplementSignal) => {
    setSelectedResearchSignal(signal)
    setResearchDialogOpen(true)
  }

  const handleDiscoverResearch = async () => {
    setIsLoadingResearch(true)
    const apiKey = exaApiKey && exaApiKey.trim() ? exaApiKey.trim() : undefined
    
    toast.promise(
      async () => {
        const signals = await discoverEmergingSupplements(apiKey)
        setEmergingSignals(signals)
      },
      {
        loading: apiKey ? 'Scanning PubMed and research databases for emerging compounds...' : 'Analyzing emerging supplement research...',
        success: apiKey ? 'Research signals discovered from scientific literature!' : 'Emerging trends identified!',
        error: 'Failed to discover research signals.',
      }
    )
    setIsLoadingResearch(false)
  }

  const getCategoryIcon = (category: SupplementCategory | 'all') => {
    switch (category) {
      case 'peptide':
        return <Flask weight="duotone" className="w-4 h-4" />
      case 'vitamin':
      case 'mineral':
        return <Pill weight="duotone" className="w-4 h-4" />
      case 'nootropic':
        return <Brain weight="duotone" className="w-4 h-4" />
      default:
        return <Atom weight="duotone" className="w-4 h-4" />
    }
  }

  const categories: Array<{ value: SupplementCategory | 'all', label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'peptide', label: 'Peptides' },
    { value: 'vitamin', label: 'Vitamins' },
    { value: 'nootropic', label: 'Nootropics' },
    { value: 'mineral', label: 'Minerals' },
  ]

  const handleDiscoverTrends = async () => {
    setIsLoadingTrends(true)
    try {
      const apiKey = exaApiKey && exaApiKey.trim() ? exaApiKey.trim() : undefined
      const socialConfig = {
        redditClientId: redditClientId && redditClientId.trim() ? redditClientId.trim() : undefined,
        redditClientSecret: redditClientSecret && redditClientSecret.trim() ? redditClientSecret.trim() : undefined,
        rapidApiKey: rapidApiKey && rapidApiKey.trim() ? rapidApiKey.trim() : undefined
      }

      const hasSocialAPIs = !!(socialConfig.redditClientId || socialConfig.rapidApiKey)
      
      toast.promise(
        async () => {
          const trendData = await discoverSupplementTrends(apiKey, socialConfig)
          setSupplements(trendData.supplements)
          setLastUpdated(trendData.lastUpdated)

          const combosData = await discoverSupplementCombinations(trendData.supplements, apiKey, socialConfig)
          setCombinations(combosData)
        },
        {
          loading: hasSocialAPIs ? 'Scanning Reddit, Twitter, TikTok & LinkedIn for real trends...' : 
                   apiKey ? 'Using EXA to discover real web trends...' : 
                   'Discovering latest supplement trends...',
          success: hasSocialAPIs ? 'Real social media data from multiple platforms!' : 
                   apiKey ? 'Real web data from Reddit, forums & communities!' : 
                   'Trends updated with AI analysis!',
          error: 'Failed to fetch trends. Using cached data.',
        }
      )
    } catch (error) {
      console.error('Error discovering trends:', error)
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => {
    const checkAndRefreshTrends = async () => {
      const lastUpdate = await window.spark.kv.get<number>('last-trend-update')
      const now = Date.now()
      const CACHE_DURATION = 1000 * 60 * 30

      if (!lastUpdate || (now - lastUpdate) > CACHE_DURATION) {
        handleDiscoverTrends()
        await window.spark.kv.set('last-trend-update', now)
      } else {
        setLastUpdated(lastUpdate)
      }
    }

    checkAndRefreshTrends()
  }, [])

  useEffect(() => {
    const setupCronJobs = async () => {
      await registerCronJob(
        'daily-trend-update',
        'Daily Morning Trend Refresh',
        async () => {
          console.log('Running daily scheduled trend update...')
          await handleDiscoverTrends()
        }
      )

      await registerCronJob(
        'email-schedule-check',
        'Email Schedule Checker',
        async () => {
          console.log('Checking for scheduled email reports...')
          await checkAndSendScheduledEmails(supplements, combinations)
        },
        { checkInterval: 300000 }
      )

      const jobs = await getCronJobs()
      const dailyJob = jobs.find(j => j.id === 'daily-trend-update')
      if (dailyJob) {
        setNextScheduledUpdate(formatNextRun(dailyJob.nextRun))
      }
    }

    setupCronJobs()
  }, [])

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never'
    const minutes = Math.floor((Date.now() - lastUpdated) / 1000 / 60)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">TrendPulse</h1>
              <Sparkle weight="duotone" className="w-8 h-8" />
            </div>
            <p className="text-primary-foreground/80 text-lg">
              AI-Powered Supplement Trend Discovery
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <ApiSettings />
              <EmailScheduler supplements={supplements} combinations={combinations} />
              <ExportDialog supplements={supplements} combinations={combinations} />
              <Button
                onClick={handleDiscoverTrends}
                disabled={isLoadingTrends}
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                <ArrowsClockwise className={`w-5 h-5 ${isLoadingTrends ? 'animate-spin' : ''}`} />
                {isLoadingTrends ? 'Discovering...' : 'Refresh Trends'}
              </Button>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-primary-foreground/60">
                Last updated: {formatLastUpdated()}
              </p>
              {nextScheduledUpdate && (
                <p className="text-xs text-primary-foreground/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Next auto-update: {nextScheduledUpdate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!dismissedWelcome && !exaApiKey && !redditClientId && !rapidApiKey && (
          <Alert className="mb-6 border-accent/50 bg-gradient-to-r from-accent/10 to-primary/10">
            <Rocket className="h-5 w-5 text-accent" />
            <AlertDescription className="ml-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-2">🚀 Unlock Real Supplement Trends!</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Currently showing AI-generated trends. Add your <strong>FREE EXA API key</strong> to discover actual supplement discussions from Reddit, forums, and biohacking communities.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        const settingsButton = document.querySelector('[data-api-settings-button]') as HTMLButtonElement
                        settingsButton?.click()
                      }}
                      className="gap-2"
                    >
                      <Rocket className="w-4 h-4" />
                      Add API Key (2 min setup)
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDismissedWelcome(true)}
                    >
                      Maybe later
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setDismissedWelcome(true)}
                >
                  ×
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search supplements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <div className="flex items-center gap-2">
              <SortAscending className="w-5 h-5 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: 'popularity' | 'trend' | 'name') => setSortBy(value)}>
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="trend">Trend Direction</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'secondary'}
                className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {getCategoryIcon(cat.value)}
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="text-base px-6">
              All Trends
              <Badge variant="secondary" className="ml-2">
                {filteredSupplements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="combinations" className="text-base px-6 flex items-center gap-2">
              <Stack weight="duotone" className="w-4 h-4" />
              Stacks
              <Badge variant="secondary" className="ml-2">
                {filteredCombinations.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="research" className="text-base px-6 flex items-center gap-2">
              <Database weight="duotone" className="w-4 h-4" />
              Research Signals
              <Badge variant="secondary" className="ml-2">
                {emergingSignals.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-base px-6 flex items-center gap-2">
              <TrendUp weight="duotone" className="w-4 h-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="tracked" className="text-base px-6">
              Tracked
              <Badge variant="secondary" className="ml-2">
                {trackedSupplementsList.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6 pb-4">
                {trackedSupplementsList.length >= 2 && !isLoadingTrends && (
                  <div className="mb-6">
                    <SuggestedSupplements
                      trackedSupplements={trackedSupplementsList}
                      allSupplements={supplements}
                      isTracked={isTracked}
                      onToggleTrack={handleToggleTrack}
                      onViewInsight={handleViewInsight}
                    />
                  </div>
                )}

                {isLoadingTrends ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-3 border rounded-lg p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-9 flex-1" />
                          <Skeleton className="h-9 flex-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredSupplements.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No supplements found matching your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSupplements.map((supplement) => (
                      <SupplementCard
                        key={supplement.id}
                        supplement={supplement}
                        isTracked={isTracked(supplement.id)}
                        onToggleTrack={handleToggleTrack}
                        onViewInsight={handleViewInsight}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="combinations">
            <div className="space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search stacks by name, purpose, or description..."
                    value={combinationSearchQuery}
                    onChange={(e) => setCombinationSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <SortAscending className="w-5 h-5 text-muted-foreground" />
                  <Select value={combinationSortBy} onValueChange={(value: 'popularity' | 'trend' | 'name') => setCombinationSortBy(value)}>
                    <SelectTrigger className="w-[180px] h-12">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="trend">Trend Direction</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={selectedCombinationTrend === 'all' ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setSelectedCombinationTrend('all')}
                >
                  All Trends
                </Badge>
                <Badge
                  variant={selectedCombinationTrend === 'rising' ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setSelectedCombinationTrend('rising')}
                >
                  Rising
                </Badge>
                <Badge
                  variant={selectedCombinationTrend === 'stable' ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setSelectedCombinationTrend('stable')}
                >
                  Stable
                </Badge>
                <Badge
                  variant={selectedCombinationTrend === 'declining' ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setSelectedCombinationTrend('declining')}
                >
                  Declining
                </Badge>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-4 pb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">Trending Supplement Stacks</h2>
                  <p className="text-muted-foreground">
                    Discover popular supplement combinations and protocols being discussed across biohacking communities
                  </p>
                </div>
                
                {filteredCombinations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No supplement stacks found matching your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredCombinations.map((combination) => (
                      <CombinationCard
                        key={combination.id}
                        combination={combination}
                        supplements={supplements}
                        onViewInsight={handleViewCombinationInsight}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="predictions">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6 pb-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Sparkle weight="duotone" className="w-6 h-6 text-accent" />
                    Future Trend Predictions
                  </h2>
                  <p className="text-muted-foreground">
                    AI-powered predictions for supplement trends 45, 90, and 180 days from now
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSupplements.slice(0, 9).map((supplement) => (
                    <div key={supplement.id} className="border rounded-lg p-4 space-y-3 hover:border-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{supplement.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{supplement.category}</p>
                        </div>
                        <Badge variant={supplement.trendDirection === 'rising' ? 'default' : 'secondary'}>
                          {supplement.trendDirection}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {supplement.description}
                      </div>

                      <Button
                        onClick={() => handleViewPrediction(supplement)}
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        <Sparkle weight="duotone" className="w-4 h-4" />
                        View Prediction
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="research">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6 pb-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Database weight="duotone" className="w-6 h-6 text-accent" />
                      Early Research Signals
                    </h2>
                    <p className="text-muted-foreground">
                      Emerging supplements identified from recent research before they hit mainstream. Based on PubMed, clinical trials, and scientific literature.
                    </p>
                  </div>
                  <Button
                    onClick={handleDiscoverResearch}
                    disabled={isLoadingResearch}
                    variant="default"
                    className="gap-2"
                  >
                    <ArrowsClockwise className={`w-5 h-5 ${isLoadingResearch ? 'animate-spin' : ''}`} />
                    {isLoadingResearch ? 'Scanning...' : 'Scan Research'}
                  </Button>
                </div>

                {emergingSignals.length === 0 && !isLoadingResearch ? (
                  <div className="text-center py-12 space-y-4">
                    <Database weight="duotone" className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                    <div>
                      <p className="text-muted-foreground text-lg mb-2">
                        No research signals discovered yet.
                      </p>
                      <p className="text-muted-foreground text-sm mb-4">
                        Click "Scan Research" to discover emerging supplements from recent scientific publications.
                      </p>
                      <Button onClick={handleDiscoverResearch} variant="outline" className="gap-2">
                        <Database weight="duotone" className="w-5 h-5" />
                        Start Research Scan
                      </Button>
                    </div>
                  </div>
                ) : isLoadingResearch ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-3 border rounded-lg p-5">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-2 flex-1" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emergingSignals.map((signal) => (
                      <EmergingResearchCard
                        key={signal.id}
                        signal={signal}
                        onViewDetails={handleViewResearchSignal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tracked">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6 pb-4">
                {trackedSupplementsList.length >= 2 && (
                  <div className="mb-6">
                    <SuggestedSupplements
                      trackedSupplements={trackedSupplementsList}
                      allSupplements={supplements}
                      isTracked={isTracked}
                      onToggleTrack={handleToggleTrack}
                      onViewInsight={handleViewInsight}
                    />
                  </div>
                )}

                {trackedSupplementsList.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg mb-2">
                      No tracked supplements yet.
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Click the heart icon on any supplement to start tracking it.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackedSupplementsList.map((supplement) => (
                      <SupplementCard
                        key={supplement.id}
                        supplement={supplement}
                        isTracked={true}
                        onToggleTrack={handleToggleTrack}
                        onViewInsight={handleViewInsight}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <InsightDialog
        supplement={selectedSupplement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <CombinationInsightDialog
        combination={selectedCombination}
        supplements={supplements}
        open={combinationDialogOpen}
        onOpenChange={setCombinationDialogOpen}
      />

      <TrendPredictionDialog
        supplement={predictionSupplement}
        open={predictionDialogOpen}
        onOpenChange={setPredictionDialogOpen}
      />

      <ResearchInsightDialog
        signal={selectedResearchSignal}
        open={researchDialogOpen}
        onOpenChange={setResearchDialogOpen}
      />
      
      <Toaster />
    </div>
  )
}

export default App