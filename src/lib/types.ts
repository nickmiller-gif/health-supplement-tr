export type TrendDirection = 'rising' | 'stable' | 'declining'

export type SupplementCategory = 'peptide' | 'vitamin' | 'mineral' | 'nootropic' | 'amino-acid' | 'other'

export interface Supplement {
  id: string
  name: string
  category: SupplementCategory
  trendDirection: TrendDirection
  popularityScore: number
  description: string
  trendData: number[]
  aiInsight?: string
}

export interface TrackedSupplement {
  supplementId: string
  trackedAt: number
}
