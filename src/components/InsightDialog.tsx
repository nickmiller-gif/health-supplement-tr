import { useState, useEffect } from 'react'
import { Supplement } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkle } from '@phosphor-icons/react'

interface InsightDialogProps {
  supplement: Supplement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InsightDialog({ supplement, open, onOpenChange }: InsightDialogProps) {
  const [insight, setInsight] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!supplement || !open) return

    if (supplement.aiInsight) {
      setInsight(supplement.aiInsight)
      setIsLoading(false)
      return
    }

    const generateInsight = async () => {
      setIsLoading(true)
      try {
        const prompt = window.spark.llmPrompt`You are a health and wellness research analyst. Provide a detailed, scientifically-informed analysis of ${supplement.name}, a ${supplement.category}.

Context: ${supplement.description}

Current trend: ${supplement.trendDirection} with a popularity score of ${supplement.popularityScore}/100.

Please provide:
1. A brief scientific background (2-3 sentences)
2. Why this supplement is currently ${supplement.trendDirection === 'rising' ? 'gaining popularity' : supplement.trendDirection === 'declining' ? 'declining in interest' : 'maintaining steady interest'} (2-3 sentences)
3. Key potential benefits being discussed (bullet points)
4. Important considerations or caveats (1-2 sentences)

Keep the tone authoritative but accessible. Focus on factual information and current research trends.`

        const result = await window.spark.llm(prompt, 'gpt-4o-mini')
        setInsight(result)
        
        if (supplement.aiInsight === undefined) {
          supplement.aiInsight = result
        }
      } catch (error) {
        setInsight('Unable to generate insight at this time. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    generateInsight()
  }, [supplement, open])

  if (!supplement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkle weight="duotone" className="w-6 h-6 text-accent" />
            <DialogTitle className="text-2xl">{supplement.name}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            AI-Generated Trend Analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
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
      </DialogContent>
    </Dialog>
  )
}
