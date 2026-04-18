import { Supplement } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendSparkline } from './TrendSparkline'
import { TrendUp, TrendDown, Minus, Heart, Flask, Pill, Brain, Atom, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
        return 'text-trend-rising'
      case 'declining':
        return 'text-trend-declining'
      case 'stable':
        return 'text-trend-stable'
    }
  }

  const getTrendBgColor = () => {
    switch (supplement.trendDirection) {
      case 'rising':
        return 'bg-trend-rising-bg'
      case 'declining':
        return 'bg-trend-declining-bg'
      case 'stable':
        return 'bg-trend-stable-bg'
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
    // Sparkline is a d3-rendered SVG — Tailwind arbitrary values don't apply
    // here, so resolve the CSS custom property at call time. Trend tokens live
    // at :root (see src/index.css), so documentElement is the correct scope.
    const cssVar = (name: string) =>
      typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ''
    switch (supplement.trendDirection) {
      case 'rising':
        return cssVar('--trend-rising') || 'oklch(0.65 0.18 145)'
      case 'declining':
        return cssVar('--trend-declining') || 'oklch(0.60 0.18 30)'
      case 'stable':
        return cssVar('--trend-stable') || 'oklch(0.68 0.14 85)'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 border-2 hover:shadow-2xl transition-all duration-300 hover:border-accent/50 bg-card relative overflow-hidden group cursor-pointer"
        onClick={() => onViewInsight(supplement)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {getCategoryIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {supplement.name}
                </h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {supplement.category}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 -mt-1 -mr-1 hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation()
                onToggleTrack(supplement.id)
              }}
            >
              <motion.div
                animate={isTracked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  weight={isTracked ? 'fill' : 'regular'} 
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isTracked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                  )}
                />
              </motion.div>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {supplement.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="secondary" 
              className={cn(
                'text-xs font-semibold uppercase tracking-wider flex items-center gap-2 px-3 py-1.5',
                getTrendColor(),
                getTrendBgColor()
              )}
            >
              {getTrendIcon()}
              {supplement.trendDirection}
            </Badge>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Score
              </div>
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {supplement.popularityScore}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <TrendSparkline 
              data={supplement.trendData} 
              color={getSparklineColor()}
            />
          </div>

          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-4 gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onViewInsight(supplement)
            }}
          >
            <Sparkle weight="duotone" className="w-4 h-4" />
            View AI Insights
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
