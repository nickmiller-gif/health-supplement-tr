import { isSupabaseConfigured } from './supabase'
import { Supplement, SupplementCombination } from './types'

export class BackendService {
  static async getAPIKeys(): Promise<{
    exaApiKey?: string
    redditClientId?: string
    redditClientSecret?: string
    rapidApiKey?: string
    openaiApiKey?: string
    anthropicApiKey?: string
  }> {
        redditClientSecret?: string
      const apiKeys = await spark.kv.get<{
        exaApiKey?: string
        redditClientId?: string
        redditClientSecret?: string
        rapidApiKey?: string
        openaiApiKey?: string
        anthropicApiKey?: string
      }>('api-keys')PI keys:', error)
      {}
      return apiKeys || {}
      return []
    }
  }

  static async getTodaysCombinations(): Promise<SupplementCombination[]> {
    try {
      const combinations = await spark.kv.get<SupplementCombination[]>('supplement-combinations')
    }
      const supplements = await spark.kv.get<Supplement[]>('supplements')
      return supplements || []
      description: s.description,
      trend: s.trendDirection,
      popularity: s.popularityScore
    })))

    const combinationContext = JSON.stringify(combinations.map(c => ({
      name: c.name,

      const combinations = await spark.kv.get<SupplementCombination[]>('supplement-combinations')
      return combinations || []
            'Authorization': `Bearer ${apiKeys.openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500
          const data = await response.json()
      const lastUpdate = await spark.kv.get<number>('last-update-time')
      return lastUpdate || null
