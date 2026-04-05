export type TrendDirection = 'rising' | 'stable' | 'declining'

export type SupplementCategory = 'peptide' | 'vitamin' | 'mineral' | 'nootropic' | 'amino-acid' | 'other'

export interface DiscussionLink {
  platform: string
  url: string
  title: string
}

export interface Supplement {
  id: string
  name: string
  category: SupplementCategory
  trendDirection: TrendDirection
  popularityScore: number
  description: string
  trendData: number[]
  discussionLinks?: DiscussionLink[]
  aiInsight?: string
}

export interface TrackedSupplement {
  supplementId: string
  trackedAt: number
}

export interface SupplementCombination {
  id: string
  name: string
  description: string
  purpose: string
  supplementIds: string[]
  trendDirection: TrendDirection
  popularityScore: number
  trendData: number[]
  references: string[]
  discussionLinks?: DiscussionLink[]
  aiInsight?: string
}

export interface SuggestedSupplement {
  supplement: Supplement
  reason: string
  relevanceScore: number
}
