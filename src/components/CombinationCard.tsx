import { SupplementCombination, Supplement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendSparkline } from './TrendSparkline'
import { TrendUp, TrendDown, Minus, Link as LinkIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CombinationCardProps {
  combination: SupplementCombination
  supplements: Supplement[]
  onViewInsight: (combination: SupplementCombination) => void
}

export function CombinationCard({ combination, supplements, onViewInsight }: CombinationCardProps) {
  const getTrendIcon = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return <TrendUp weight="bold" className="w-4 h-4" />
      case 'declining':
        return <TrendDown weight="bold" className="w-4 h-4" />
      case 'stable':
        return <Minus weight="bold" className="w-4 h-4" />
    }
  }

  const getTrendColor = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return 'text-[oklch(0.70_0.15_145)]'
      case 'declining':
        return 'text-[oklch(0.65_0.14_25)]'
      case 'stable':
        return 'text-[oklch(0.70_0.12_75)]'
    }
  }

  const getTrendBgColor = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return 'bg-[oklch(0.70_0.15_145)]/10'
      case 'declining':
        return 'bg-[oklch(0.65_0.14_25)]/10'
      case 'stable':
        return 'bg-[oklch(0.70_0.12_75)]/10'
    }
  }

  const getSparklineColor = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return 'oklch(0.70 0.15 145)'
      case 'declining':
        return 'oklch(0.65 0.14 25)'
      case 'stable':
        return 'oklch(0.70 0.12 75)'
    }
  }

  const combinationSupplements = supplements.filter(s => 
    combination.supplementIds.includes(s.id)
  )

  return (
    <Card 
      className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/30 bg-gradient-to-br from-card to-accent/10 cursor-pointer group"
      onClick={() => onViewInsight(combination)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-foreground">{combination.name}</h3>
        <Badge 
          variant="secondary" 
          className={cn(
            'text-xs font-medium uppercase tracking-wide flex items-center gap-1.5 px-2.5 py-1 ml-2',
            getTrendColor(),
            getTrendBgColor()
          )}
        >
          {getTrendIcon()}
          {combination.trendDirection}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {combination.description}
      </p>

      <div className="mb-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
          Purpose
        </div>
        <p className="text-sm font-medium text-foreground">
          {combination.purpose}
        </p>
      </div>

      <div className="mb-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
          Components
        </div>
        <div className="flex flex-wrap gap-1.5">
          {combinationSupplements.map(supplement => (
            <Badge key={supplement.id} variant="outline" className="text-xs">
              {supplement.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
          <LinkIcon weight="bold" className="w-3 h-3" />
          Referenced By
        </div>
        <div className="flex flex-wrap gap-1.5">
          {combination.references.map((ref, idx) => (
            <span key={idx} className="text-xs text-muted-foreground">
              {ref}{idx < combination.references.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <TrendSparkline 
            data={combination.trendData} 
            color={getSparklineColor()}
            width={160}
          />
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Popularity
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {combination.popularityScore}
          </div>
        </div>
      </div>
    </Card>
  )
}
