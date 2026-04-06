import { useState, useMemo, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Supplement, TrackedSupplement, SupplementCategory, SupplementCombination } from '@/lib/types'
import { SupplementService } from '@/lib/supplement-service'
import { SupplementCard } from '@/components/SupplementCard'
import { Chatbot } from '@/components/Chatbot'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, Flask, Pill, Brain, Atom, Stack, SortAscending, ArrowsClockwise, Sparkle, TrendUp, Clock, Database, Gear } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'trend' | 'name'>('popularity')
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [combinations, setCombinations] = useState<SupplementCombination[]>([])
  const [trackedSupplements, setTrackedSupplements] = useKV<TrackedSupplement[]>('tracked-supplements', [])
  const [isLoadingTrends, setIsLoadingTrends] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  useEffect(() => {
    loadSupplements()
  }, [])

  const loadSupplements = async () => {
    setIsLoadingTrends(true)
    try {
      const [supps, combos] = await Promise.all([
        SupplementService.getAllSupplements(),
        SupplementService.getAllCombinations()
      ])
      
      setSupplements(supps)
      setCombinations(combos)
      setLastUpdated(Date.now())
    } catch (error) {
      console.error('Error loading supplements:', error)
      toast.error('Failed to load supplement data')
    } finally {
      setIsLoadingTrends(false)
    }
  }

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
        <div className="backdrop-blur-sm bg-primary/90 text-primary-foreground py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkle weight="duotone" className="w-10 h-10 animate-float" />
                  <h1 className="text-5xl font-bold tracking-tight">TrendPulse</h1>
                </div>
                <p className="text-primary-foreground/90 text-lg font-medium max-w-2xl">
                  AI-Powered Supplement Intelligence Platform
                </p>
                <p className="text-primary-foreground/70 text-sm max-w-2xl">
                  Discover emerging trends, analyze combinations, and get personalized recommendations with our AI chatbot
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={loadSupplements}
                    disabled={isLoadingTrends}
                    variant="secondary"
                    size="lg"
                    className="gap-2 shadow-lg"
                  >
                    <ArrowsClockwise className={cn("w-5 h-5", isLoadingTrends && "animate-spin")} />
                    {isLoadingTrends ? 'Loading...' : 'Refresh Data'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2"
                  >
                    <Gear weight="duotone" className="w-5 h-5" />
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
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search supplements, peptides, nootropics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base shadow-sm border-2 focus:border-accent transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <SortAscending className="w-5 h-5 text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={(value: 'popularity' | 'trend' | 'name') => setSortBy(value)}>
                <SelectTrigger className="w-[180px] h-14 shadow-sm border-2">
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

          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'secondary'}
                  className={cn(
                    "cursor-pointer px-5 py-2.5 text-sm flex items-center gap-2 transition-all whitespace-nowrap",
                    "hover:scale-105 active:scale-95",
                    selectedCategory === cat.value && "shadow-lg"
                  )}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {getCategoryIcon(cat.value)}
                  {cat.label}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        <Separator className="my-8" />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="text-base px-6 data-[state=active]:shadow-lg">
              All Trends
              <Badge variant="secondary" className="ml-2 min-w-[2rem]">
                {filteredSupplements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="stacks" className="text-base px-6 data-[state=active]:shadow-lg">
              <Stack weight="duotone" className="w-4 h-4 mr-2" />
              Stacks
              <Badge variant="secondary" className="ml-2 min-w-[2rem]">
                {combinations.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="tracked" className="text-base px-6 data-[state=active]:shadow-lg">
              Tracked
              <Badge variant="secondary" className="ml-2 min-w-[2rem]">
                {trackedSupplementsList.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-6 pb-4">
                {isLoadingTrends ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-4 border-2 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <Skeleton className="h-7 w-3/4 rounded-lg" />
                            <Skeleton className="h-5 w-1/3 rounded-full" />
                          </div>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <div className="flex gap-3">
                          <Skeleton className="h-10 flex-1 rounded-lg" />
                          <Skeleton className="h-10 flex-1 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredSupplements.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <MagnifyingGlass weight="duotone" className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      No supplements found matching your criteria
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-2">
                      Try adjusting your search or filters
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredSupplements.map((supplement, index) => (
                      <motion.div
                        key={supplement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SupplementCard
                          supplement={supplement}
                          isTracked={isTracked(supplement.id)}
                          onToggleTrack={handleToggleTrack}
                          onViewInsight={() => {}}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stacks" className="mt-0">
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-6 pb-4">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                    <Stack weight="duotone" className="w-8 h-8 text-accent" />
                    Trending Supplement Stacks
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Popular supplement combinations and protocols from biohacking communities
                  </p>
                </div>
                
                {combinations.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <Stack weight="duotone" className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      No supplement stacks available yet
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {combinations.map((combo, index) => (
                      <motion.div
                        key={combo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-2 rounded-2xl p-6 hover:shadow-xl hover:border-accent/50 transition-all bg-card"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{combo.name}</h3>
                            <Badge variant={combo.trendDirection === 'rising' ? 'default' : 'secondary'}>
                              {combo.trendDirection}
                            </Badge>
                          </div>
                          <div className="text-3xl font-bold text-accent">
                            {combo.popularityScore}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{combo.description}</p>
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-foreground">{combo.purpose}</p>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tracked" className="mt-0">
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-6 pb-4">
                {trackedSupplementsList.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <TrendUp weight="duotone" className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg font-medium mb-2">
                      No tracked supplements yet
                    </p>
                    <p className="text-muted-foreground/70 text-sm">
                      Click the heart icon on any supplement to start tracking
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trackedSupplementsList.map((supplement) => (
                      <SupplementCard
                        key={supplement.id}
                        supplement={supplement}
                        isTracked={true}
                        onToggleTrack={handleToggleTrack}
                        onViewInsight={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <Chatbot supplements={supplements} combinations={combinations} />
      <Toaster />
    </div>
  )
}

export default App
