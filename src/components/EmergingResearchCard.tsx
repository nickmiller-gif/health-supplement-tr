import { EmergingSupplementSignal } from '@/lib/research-discovery'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flask, TrendUp, Calendar, Sparkle, FileText } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface EmergingResearchCardProps {
  signal: EmergingSupplementSignal
  onViewDetails: (signal: EmergingSupplementSignal) => void
}

export function EmergingResearchCard({ signal, onViewDetails }: EmergingResearchCardProps) {
  const getSignalColor = () => {
    switch (signal.signalStrength) {
      case 'very-strong':
        return 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
      case 'strong':
        return 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50'
      case 'moderate':
        return 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50'
      case 'weak':
        return 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/50'
    }
  }

  const getSignalBadgeVariant = () => {
    if (signal.signalStrength === 'very-strong' || signal.signalStrength === 'strong') {
      return 'default'
    }
    return 'secondary'
  }

  const getResearchPhaseIcon = () => {
    switch (signal.researchPhase) {
      case 'meta-analysis':
        return <FileText weight="duotone" className="w-4 h-4" />
      case 'recent-clinical':
        return <Flask weight="duotone" className="w-4 h-4" />
      case 'clinical-trials':
        return <Flask weight="duotone" className="w-4 h-4" />
      case 'pre-clinical':
        return <Flask weight="duotone" className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-5 space-y-4 hover:shadow-lg transition-all duration-300 ${getSignalColor()}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <Sparkle weight="duotone" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg leading-tight">{signal.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{signal.category}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getSignalBadgeVariant()} className="text-xs">
              {signal.signalStrength.replace('-', ' ')}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getResearchPhaseIcon()}
              <span className="capitalize">{signal.researchPhase.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/80 line-clamp-2">
          {signal.description}
        </p>

        <div className="flex items-center gap-2 text-xs">
          <Calendar weight="duotone" className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Expected to trend: <span className="font-medium text-foreground">{signal.timeToTrend}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TrendUp weight="duotone" className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                style={{ width: `${signal.emergenceScore}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {signal.emergenceScore}%
          </span>
        </div>

        {signal.researchArticles.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              {signal.researchArticles.length} research article{signal.researchArticles.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onViewDetails(signal)}
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
          >
            <FileText className="w-4 h-4" />
            View Research
          </Button>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-start gap-2">
            <div className="text-xs bg-muted/50 px-2 py-1 rounded">
              <span className="font-medium">Confidence:</span> {signal.confidenceScore}%
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
