import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Supplement, TrackedSupplement, SupplementCategory } from '@/lib/types'
import { INITIAL_SUPPLEMENTS } from '@/lib/data'
import { SupplementCard } from '@/components/SupplementCard'
import { InsightDialog } from '@/components/InsightDialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Flask, Pill, Brain, Atom } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupplementCategory | 'all'>('all')
  const [trackedSupplements, setTrackedSupplements] = useKV<TrackedSupplement[]>('tracked-supplements', [])
  const [supplements] = useState<Supplement[]>(INITIAL_SUPPLEMENTS)
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredSupplements = useMemo(() => {
    return supplements.filter(supplement => {
      const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplement.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || supplement.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [supplements, searchQuery, selectedCategory])

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

  const handleViewInsight = (supplement: Supplement) => {
    setSelectedSupplement(supplement)
    setDialogOpen(true)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/80 text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-2">TrendPulse</h1>
          <p className="text-primary-foreground/80 text-lg">
            AI-Powered Supplement Trend Discovery
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
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
            <TabsTrigger value="tracked" className="text-base px-6">
              Tracked
              <Badge variant="secondary" className="ml-2">
                {trackedSupplementsList.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {filteredSupplements.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No supplements found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
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
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tracked">
            <ScrollArea className="h-[calc(100vh-400px)]">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
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
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <InsightDialog
        supplement={selectedSupplement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      
      <Toaster />
    </div>
  )
}

export default App