import { useState, useMemo, useEffect } from 'react'
import { Supplement, SupplementCategory, SupplementCombination } from '@/lib/types'
import { BackendService } from '@/lib/backend-service'
import { SupplementCard } from '@/components/SupplementCard'
import { InsightDialog } from '@/components/InsightDialog'
import { CombinationCard } from '@/components/CombinationCard'
import { CombinationInsightDialog } from '@/components/CombinationInsightDialog'
import { Chatbot } from '@/components/Chatbot'
import { AdminDashboard } from '@/components/AdminDashboard'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Flask, Pill, Brain, Atom, Stack, SortAscending, Sparkle, Clock, ArrowsClockwise, Info, ShieldCheck } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main')

  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard onBack={() => setCurrentView('main')} />
        <Toaster />
      </>
    )
  }

  return <MainApp onNavigateToAdmin={() => setCurrentView('admin')} />
}

function MainApp({ onNavigateToAdmin }: { onNavigateToAdmin: () => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'trend' | 'name'>('popularity')
  const [combinationSearchQuery, setCombinationSearchQuery] = useState('')
  const [selectedCombinationTrend, setSelectedCombinationTrend] = useState<'all' | 'rising' | 'stable' | 'declining'>('all')
  const [combinationSortBy, setCombinationSortBy] = useState<'popularity' | 'trend' | 'name'>('popularity')
  
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [combinations, setCombinations] = useState<SupplementCombination[]>([])
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)
  const [selectedCombination, setSelectedCombination] = useState<SupplementCombination | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [combinationDialogOpen, setCombinationDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

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

  const handleViewInsight = (supplement: Supplement) => {
    setSelectedSupplement(supplement)
    setDialogOpen(true)
  }

  const handleViewCombinationInsight = (combination: SupplementCombination) => {
    setSelectedCombination(combination)
    setCombinationDialogOpen(true)
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

  const loadTrends = async () => {
    setIsLoading(true)
    try {
      const [supplementsData, combinationsData, lastUpdate] = await Promise.all([
        BackendService.getTodaysSupplements(),
        BackendService.getTodaysCombinations(),
        BackendService.getLastUpdateTime()
      ])

      setSupplements(supplementsData)
      setCombinations(combinationsData)
      setLastUpdated(lastUpdate)
    } catch (error) {
      console.error('Error loading trends:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTrends()
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-mesh border-b"
      >
        <div className="backdrop-blur-sm bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Sparkle weight="duotone" className="w-10 h-10 animate-float" />
                  <h1 className="text-5xl font-bold tracking-tight">TrendPulse</h1>
                </div>
                <p className="text-primary-foreground/90 text-lg font-medium max-w-2xl">
                  Daily Supplement Intelligence & AI Insights
                </p>
                <p className="text-primary-foreground/70 text-sm max-w-2xl">
                  View today's trending supplements and get AI-powered recommendations through our chatbot
                </p>
              </motion.div>
              
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex gap-2">
                  <Button
                    onClick={onNavigateToAdmin}
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <ShieldCheck className="w-5 h-5" weight="duotone" />
                    Admin
                  </Button>
                  <Button
                    onClick={loadTrends}
                    disabled={isLoading}
                    variant="secondary"
                    size="lg"
                    className="gap-2 shadow-lg"
                  >
                    <ArrowsClockwise className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                  <p className="text-xs text-primary-foreground/70 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Last updated: {formatLastUpdated()}
                  </p>
                  <p className="text-xs text-primary-foreground/70">
                    {supplements.length} supplements • {combinations.length} stacks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isSupabaseConfigured && (
          <Alert className="mb-6 border-accent/50 bg-gradient-to-r from-accent/10 to-primary/10">
            <Info className="h-5 w-5 text-accent" />
            <AlertDescription className="ml-6">
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-2">⚙️ Supabase Not Configured</p>
                <p className="text-sm text-muted-foreground">
                  Please configure your Supabase connection in the <code>.env</code> file to enable data persistence. See <code>SUPABASE_SETUP.md</code> for instructions.
                </p>
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
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-6 pb-4">
                {isLoading ? (
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
                        isTracked={false}
                        onToggleTrack={() => {}}
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
      
      <Chatbot supplements={supplements} combinations={combinations} onSupplementSelect={handleViewInsight} />
      <Toaster />
    </div>
  )
}

export default App
