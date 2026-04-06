import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Supplement } from '@/lib/types'
import { TrendPrediction, predictSupplementTrend } from '@/lib/trend-predictor'
import { Badge } from '@/components/ui/badge'
import { TrendUp, TrendDown, Minus, Sparkle, CalendarDots } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TrendPredictionDialogProps {
  supplement: Supplement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrendPredictionDialog({ supplement, open, onOpenChange }: TrendPredictionDialogProps) {
  const [prediction, setPrediction] = useState<TrendPrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (supplement && open) {
      setIsLoading(true)
      setPrediction(null)
      
      predictSupplementTrend(supplement)
        .then(pred => {
          setPrediction(pred)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error predicting trend:', error)
          setIsLoading(false)
        })
    }
  }, [supplement, open])

  if (!supplement) return null

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendUp weight="duotone" className="w-5 h-5 text-green-600" />
      case 'declining':
        return <TrendDown weight="duotone" className="w-5 h-5 text-red-600" />
      default:
        return <Minus weight="duotone" className="w-5 h-5 text-yellow-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600'
      case 'declining':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle weight="duotone" className="w-6 h-6 text-accent" />
            Future Trend Prediction: {supplement.name}
          </DialogTitle>
          <DialogDescription>
            AI-powered prediction based on current momentum, growth patterns, and market analysis
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : prediction ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDots weight="duotone" className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-sm">45 Days</span>
                      </div>
                      {getTrendIcon(prediction.predictions.days45.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{prediction.predictions.days45.score}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getConfidenceColor(prediction.predictions.days45.confidence)}`}
                            style={{ width: `${prediction.predictions.days45.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{prediction.predictions.days45.confidence}%</span>
                      </div>
                      
                      <Badge variant="outline" className={getTrendColor(prediction.predictions.days45.trend)}>
                        {prediction.predictions.days45.trend}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {prediction.predictions.days45.reasoning}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDots weight="duotone" className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-sm">90 Days</span>
                      </div>
                      {getTrendIcon(prediction.predictions.days90.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{prediction.predictions.days90.score}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getConfidenceColor(prediction.predictions.days90.confidence)}`}
                            style={{ width: `${prediction.predictions.days90.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{prediction.predictions.days90.confidence}%</span>
                      </div>
                      
                      <Badge variant="outline" className={getTrendColor(prediction.predictions.days90.trend)}>
                        {prediction.predictions.days90.trend}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {prediction.predictions.days90.reasoning}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3 bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDots weight="duotone" className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-sm">180 Days</span>
                      </div>
                      {getTrendIcon(prediction.predictions.days180.trend)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{prediction.predictions.days180.score}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getConfidenceColor(prediction.predictions.days180.confidence)}`}
                            style={{ width: `${prediction.predictions.days180.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{prediction.predictions.days180.confidence}%</span>
                      </div>
                      
                      <Badge variant="outline" className={getTrendColor(prediction.predictions.days180.trend)}>
                        {prediction.predictions.days180.trend}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {prediction.predictions.days180.reasoning}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkle weight="duotone" className="w-5 h-5 text-accent" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {prediction.insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-accent font-bold">•</span>
                        <span className="flex-1">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-muted rounded-lg p-4 text-xs text-muted-foreground">
                  <p>
                    <strong>Note:</strong> Predictions are based on current trend momentum, historical patterns, 
                    and AI analysis of market factors. Actual trends may vary based on research developments, 
                    regulatory changes, and community sentiment shifts.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load prediction. Please try again.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
