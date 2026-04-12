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
    try {
      const apiKeys = await spark.kv.get<{
        exaApiKey?: string
        redditClientId?: string
        redditClientSecret?: string
        rapidApiKey?: string
        openaiApiKey?: string
        anthropicApiKey?: string
      }>('api-keys')
      return apiKeys || {}
    } catch (error) {
      console.error('Error loading API keys:', error)
      return {}
    }
  }

  static async getTodaysSupplements(): Promise<Supplement[]> {
    try {
      const supplements = await spark.kv.get<Supplement[]>('supplements')
      return supplements || []
    } catch (error) {
      console.error('Error loading supplements:', error)
      return []
    }
  }

  static async getTodaysCombinations(): Promise<SupplementCombination[]> {
    try {
      const combinations = await spark.kv.get<SupplementCombination[]>('supplement-combinations')
      return combinations || []
    } catch (error) {
      console.error('Error loading combinations:', error)
      return []
    }
  }

  static async getLastUpdateTime(): Promise<number | null> {
    try {
      const lastUpdate = await spark.kv.get<number>('last-update-time')
      return lastUpdate || null
    } catch (error) {
      console.error('Error loading last update time:', error)
      return null
    }
  }
}
