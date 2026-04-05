import { useState, useEffect } from 'react'
import { Supplement, SuggestedSupplement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SupplementCard } from './SupplementCard'
import { Sparkle } from '@phosphor-icons/react'

interface SuggestedSupplementsProps {
  trackedSupplements: Supplement[]
  allSupplements: Supplement[]
  isTracked: (id: string) => boolean
  onToggleTrack: (id: string) => void
  onViewInsight: (supplement: Supplement) => void
}

export function SuggestedSupplements({
  trackedSupplements,
  allSupplements,
  isTracked,
  onToggleTrack,
  onViewInsight,
}: SuggestedSupplementsProps) {
  const [suggestions, setSuggestions] = useState<SuggestedSupplement[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (trackedSupplements.length < 2) {
      setSuggestions([])
      return
    }

    const generateSuggestions = async () => {
      setIsLoading(true)
      try {
        const trackedNames = trackedSupplements.map(s => s.name).join(', ')
        const trackedCategories = [...new Set(trackedSupplements.map(s => s.category))].join(', ')
        
        const untrackedSupplements = allSupplements.filter(s => 
          !trackedSupplements.some(ts => ts.id === s.id)
        )
        
        const supplementList = untrackedSupplements.map(s => 
          `${s.name} (${s.category}, popularity: ${s.popularityScore})`
        ).join('\n')

        const prompt = window.spark.llmPrompt`You are a health supplement research analyst. Based on a user's tracked supplements, suggest 3 complementary supplements they might be interested in.

**User is currently tracking:**
${trackedNames}

**Categories of interest:** ${trackedCategories}

**Available supplements to suggest from:**
${supplementList}

Please analyze the user's interests and suggest exactly 3 supplements that would complement their current stack. Return your response as a valid JSON object with a single property called "suggestions" containing an array of exactly 3 objects with this format:

{
  "suggestions": [
    {
      "name": "supplement name exactly as shown above",
      "reason": "1-2 sentence explanation of why this complements their tracked supplements",
      "relevanceScore": number from 1-100
    }
  ]
}

Focus on synergistic effects, complementary benefits, and popular combinations. Make sure each suggestion has a clear, specific reason tied to what they're already tracking.`

        const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
        const parsed = JSON.parse(result)
        
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          const suggestedSupplements: SuggestedSupplement[] = parsed.suggestions
            .map((sug: { name: string; reason: string; relevanceScore: number }) => {
              const supplement = untrackedSupplements.find(s => 
                s.name.toLowerCase() === sug.name.toLowerCase()
              )
              if (supplement) {
                return {
                  supplement,
                  reason: sug.reason,
                  relevanceScore: sug.relevanceScore
                }
              }
              return null
            })
            .filter((s): s is SuggestedSupplement => s !== null)
            .slice(0, 3)
          
          setSuggestions(suggestedSupplements)
        }
      } catch (error) {
        console.error('Failed to generate suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    generateSuggestions()
  }, [trackedSupplements, allSupplements])

  if (trackedSupplements.length < 2) {
    return null
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkle weight="duotone" className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold">Suggested for You</h2>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Based on your tracked supplements, here are some complementary options gaining traction:
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map(({ supplement, reason }) => (
            <div key={supplement.id} className="space-y-2">
              <SupplementCard
                supplement={supplement}
                isTracked={isTracked(supplement.id)}
                onToggleTrack={onToggleTrack}
                onViewInsight={onViewInsight}
              />
              <div className="px-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkle weight="fill" className="w-3 h-3 mr-1" />
                  Why suggested
                </Badge>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  {reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Unable to generate suggestions at this time.
        </p>
      )}
    </Card>
  )
}
