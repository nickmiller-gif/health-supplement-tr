import { Supplement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendSparkline } from './TrendSparkline'
import { TrendUp, TrendDown, Minus, Heart, Flask, Pill, Brain, Atom, ChatCircleDots, ArrowSquareOut } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SupplementCardProps {
  supplement: Supplement
  isTracked: boolean
  onToggleTrack: (id: string) => void
  onViewInsight: (supplement: Supplement) => void
}

export function SupplementCard({ 
  supplement, 
  isTracked, 
  onToggleTrack, 
  onViewInsight 
}: SupplementCardProps) {
  const getTrendIcon = () => {
    switch (supplement.trendDirection) {
      case 'rising':
        return <TrendUp weight="bold" className="w-4 h-4" />
      case 'declining':
        return <TrendDown weight="bold" className="w-4 h-4" />
      case 'stable':
        return <Minus weight="bold" className="w-4 h-4" />
    }
  }

  const getTrendColor = () => {
    switch (supplement.trendDirection) {
      case 'rising':
        return 'text-[oklch(0.70_0.15_145)]'
      case 'declining':
        return 'text-[oklch(0.65_0.14_25)]'
      case 'stable':
        return 'text-[oklch(0.70_0.12_75)]'
    }
  }

  const getTrendBgColor = () => {
    switch (supplement.trendDirection) {
      case 'rising':
        return 'bg-[oklch(0.70_0.15_145)]/10'
      case 'declining':
        return 'bg-[oklch(0.65_0.14_25)]/10'
      case 'stable':
        return 'bg-[oklch(0.70_0.12_75)]/10'
    }
  }

  const getCategoryIcon = () => {
    switch (supplement.category) {
      case 'peptide':
        return <Flask weight="duotone" className="w-5 h-5" />
      case 'vitamin':
      case 'mineral':
        return <Pill weight="duotone" className="w-5 h-5" />
      case 'nootropic':
        return <Brain weight="duotone" className="w-5 h-5" />
      default:
        return <Atom weight="duotone" className="w-5 h-5" />
    }
  }

  const getSparklineColor = () => {
    switch (supplement.trendDirection) {
      case 'rising':
        return 'oklch(0.70 0.15 145)'
      case 'declining':
        return 'oklch(0.65 0.14 25)'
      case 'stable':
        return 'oklch(0.70 0.12 75)'
    }
  }

  return (
    <Card 
      className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/30 bg-gradient-to-br from-card to-secondary/30 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1" onClick={() => onViewInsight(supplement)}>
          <div className="text-muted-foreground cursor-pointer">
            {getCategoryIcon()}
          </div>
          <h3 className="font-semibold text-lg text-foreground cursor-pointer">{supplement.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mt-1 -mr-1"
          onClick={(e) => {
            e.stopPropagation()
            onToggleTrack(supplement.id)
          }}
        >
          <Heart 
            weight={isTracked ? 'fill' : 'regular'} 
            className={cn(
              'w-5 h-5 transition-colors',
              isTracked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            )}
          />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2" onClick={() => onViewInsight(supplement)}>
        {supplement.description}
      </p>

      {supplement.discussionLinks && supplement.discussionLinks.length > 0 && (
        <div className="mb-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-1 mb-2">
            <ChatCircleDots weight="duotone" className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Community Discussions
            </span>
          </div>
          <div className="space-y-1.5">
            {supplement.discussionLinks.slice(0, 2).map((link, idx) => (
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

      <div className="flex items-center justify-between mb-3" onClick={() => onViewInsight(supplement)}>
        <Badge 
          variant="secondary" 
          className={cn(
            'text-xs font-medium uppercase tracking-wide flex items-center gap-1.5 px-2.5 py-1 cursor-pointer',
            getTrendColor(),
            getTrendBgColor()
          )}
        >
          {getTrendIcon()}
          {supplement.trendDirection}
        </Badge>
        <div className="text-right cursor-pointer">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Popularity
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {supplement.popularityScore}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center cursor-pointer" onClick={() => onViewInsight(supplement)}>
        <TrendSparkline 
          data={supplement.trendData} 
          color={getSparklineColor()}
        />
      </div>
    </Card>
  )
}
