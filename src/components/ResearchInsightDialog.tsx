import { useState, useEffect } from 'react'
import { EmergingSupplementSignal, getResearchInsight } from '@/lib/research-discovery'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Flask, TrendUp, Calendar, FileText, CheckCircle, Link as LinkIcon } from '@phosphor-icons/react'

interface ResearchInsightDialogProps {
  signal: EmergingSupplementSignal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResearchInsightDialog({ signal, open, onOpenChange }: ResearchInsightDialogProps) {
  const [insight, setInsight] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (signal && open) {
      setIsLoading(true)
      getResearchInsight(signal)
        .then(result => {
          setInsight(result)
        })
        .catch(error => {
          console.error('Error loading insight:', error)
          setInsight('Unable to generate insight at this time.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [signal, open])

  if (!signal) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Flask weight="duotone" className="w-7 h-7 text-accent mt-1" />
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{signal.name}</DialogTitle>
              <DialogDescription className="text-base">
                {signal.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-200px)] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Signal Strength</p>
                <p className="font-semibold capitalize">{signal.signalStrength.replace('-', ' ')}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Time to Trend</p>
                <p className="font-semibold">{signal.timeToTrend}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Research Phase</p>
                <p className="font-semibold capitalize">{signal.researchPhase.replace('-', ' ')}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                <p className="font-semibold">{signal.confidenceScore}%</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendUp weight="duotone" className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Emergence Score</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                    style={{ width: `${signal.emergenceScore}%` }}
                  />
                </div>
                <span className="font-semibold text-lg">{signal.emergenceScore}%</span>
              </div>
            </div>

            {signal.potentialBenefits.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle weight="duotone" className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">Potential Benefits</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {signal.potentialBenefits.map((benefit, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar weight="duotone" className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Why This Will Trend</h3>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
                {signal.reasoning}
              </p>
            </div>

            {signal.researchArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText weight="duotone" className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">Research Articles ({signal.researchArticles.length})</h3>
                </div>
                <div className="space-y-3">
                  {signal.researchArticles.map((article, idx) => (
                    <div key={idx} className="border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-medium text-sm flex-1">{article.title}</h4>
                        <a 
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-colors flex-shrink-0"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </a>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                        {article.journal && (
                          <span className="bg-muted px-2 py-1 rounded">{article.journal}</span>
                        )}
                        {article.publicationDate && (
                          <span className="bg-muted px-2 py-1 rounded">{article.publicationDate}</span>
                        )}
                        {article.authors.length > 0 && (
                          <span className="bg-muted px-2 py-1 rounded">{article.authors.join(', ')}</span>
                        )}
                      </div>
                      {article.abstract && (
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {article.abstract}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Flask weight="duotone" className="w-5 h-5 text-accent" />
                Research Analysis
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {insight.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-sm text-foreground/90 mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
