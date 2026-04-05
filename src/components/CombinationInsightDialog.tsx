import { useState, useEffect } from 'react'
import { SupplementCombination, Supplement } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Sparkle } from '@phosphor-icons/react'

interface CombinationInsightDialogProps {
  combination: SupplementCombination | null
  supplements: Supplement[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CombinationInsightDialog({ 
  combination, 
  supplements, 
  open, 
  onOpenChange 
}: CombinationInsightDialogProps) {
  const [insight, setInsight] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!combination || !open) return

    if (combination.aiInsight) {
      setInsight(combination.aiInsight)
      setIsLoading(false)
      return
    }

    const generateInsight = async () => {
      setIsLoading(true)
      try {
        const combinationSupplements = supplements.filter(s => 
          combination.supplementIds.includes(s.id)
        )
        
        const supplementNames = combinationSupplements.map(s => s.name).join(', ')
        
        const prompt = window.spark.llmPrompt`You are a health and wellness research analyst specializing in supplement combinations and synergistic effects. Provide a detailed analysis of the "${combination.name}" stack.

**Stack Overview:**
- Name: ${combination.name}
- Components: ${supplementNames}
- Purpose: ${combination.purpose}
- Description: ${combination.description}
- Current trend: ${combination.trendDirection} with a popularity score of ${combination.popularityScore}/100
- Referenced by: ${combination.references.join(', ')}

Please provide:
1. Why this specific combination is gaining attention (2-3 sentences)
2. The scientific rationale for combining these supplements (explain synergies, 2-3 sentences)
3. Key potential benefits of this stack (bullet points, 4-5 items)
4. Important considerations, potential interactions, and caveats (2-3 sentences)
5. Why communities like ${combination.references[0]} are discussing this combination

Keep the tone authoritative but accessible. Focus on factual information, current research trends, and real-world usage patterns.`

        const result = await window.spark.llm(prompt, 'gpt-4o-mini')
        setInsight(result)
        
        if (combination.aiInsight === undefined) {
          combination.aiInsight = result
        }
      } catch (error) {
        setInsight('Unable to generate insight at this time. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    generateInsight()
  }, [combination, supplements, open])

  if (!combination) return null

  const combinationSupplements = supplements.filter(s => 
    combination.supplementIds.includes(s.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkle weight="duotone" className="w-6 h-6 text-accent" />
            <DialogTitle className="text-2xl">{combination.name}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            AI-Generated Stack Analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Components
            </div>
            <div className="flex flex-wrap gap-2">
              {combinationSupplements.map(supplement => (
                <Badge key={supplement.id} variant="secondary" className="text-sm px-3 py-1">
                  {supplement.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Referenced By Communities
            </div>
            <div className="flex flex-wrap gap-2">
              {combination.references.map((ref, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {ref}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {insight}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
