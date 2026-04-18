import { SupplementCombination, Supplement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendSparkline } from './TrendSparkline'
import { TrendUp, TrendDown, Minus, Link as LinkIcon, ChatCircleDots, ArrowSquareOut } from '@phosphor-icons/react'
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
        return 'text-trend-rising'
      case 'declining':
        return 'text-trend-declining'
      case 'stable':
        return 'text-trend-stable'
    }
  }

  const getTrendBgColor = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return 'bg-trend-rising-bg'
      case 'declining':
        return 'bg-trend-declining-bg'
      case 'stable':
        return 'bg-trend-stable-bg'
    }
  }

  const getSparklineColor = () => {
    switch (combination.trendDirection) {
      case 'rising':
        return 'var(--trend-rising, oklch(0.65 0.18 145))'
      case 'declining':
        return 'var(--trend-declining, oklch(0.60 0.18 30))'
      case 'stable':
        return 'var(--trend-stable, oklch(0.68 0.14 85))'
    }
  }

  const combinationSupplements = supplements.filter(s => 
    combination.supplementIds.includes(s.id)
  )

  return (
    <Card 
      className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/30 bg-gradient-to-br from-card to-accent/10 group"
    >
      <div className="flex items-start justify-between mb-3" onClick={() => onViewInsight(combination)}>
        <h3 className="font-bold text-lg text-foreground cursor-pointer">{combination.name}</h3>
        <Badge 
          variant="secondary" 
          className={cn(
            'text-xs font-medium uppercase tracking-wide flex items-center gap-1.5 px-2.5 py-1 ml-2 cursor-pointer',
            getTrendColor(),
            getTrendBgColor()
          )}
        >
          {getTrendIcon()}
          {combination.trendDirection}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3 cursor-pointer" onClick={() => onViewInsight(combination)}>
        {combination.description}
      </p>

      <div className="mb-3" onClick={() => onViewInsight(combination)}>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5 cursor-pointer">
          Purpose
        </div>
        <p className="text-sm font-medium text-foreground cursor-pointer">
          {combination.purpose}
        </p>
      </div>

      <div className="mb-3" onClick={() => onViewInsight(combination)}>
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5 cursor-pointer">
          Components
        </div>
        <div className="flex flex-wrap gap-1.5">
          {combinationSupplements.map(supplement => (
            <Badge key={supplement.id} variant="outline" className="text-xs cursor-pointer">
              {supplement.name}
            </Badge>
          ))}
        </div>
      </div>

      {combination.discussionLinks && combination.discussionLinks.length > 0 && (
        <div className="mb-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-1 mb-2">
            <ChatCircleDots weight="duotone" className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Community Discussions
            </span>
          </div>
          <div className="space-y-1.5">
            {combination.discussionLinks.slice(0, 2).map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-foreground hover:underline group/link"
              >
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-medium">
                  {link.platform}
                </Badge>
                <span className="flex-1 line-clamp-1">{link.title}</span>
                <ArrowSquareOut className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}

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

      <div className="flex items-center justify-between cursor-pointer" onClick={() => onViewInsight(combination)}>
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
