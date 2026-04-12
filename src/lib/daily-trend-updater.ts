import { BackendService } from './backend-service'
import { SupplementService } from './supplement-service'
import { discoverSupplementTrends, discoverSupplementCombinations } from './trend-discovery'
import { Supplement, SupplementCombination } from './types'

export interface UpdateProgress {
  phase: 'starting' | 'fetching-api-keys' | 'discovering-supplements' | 'discovering-combinations' | 'saving-supplements' | 'saving-combinations' | 'complete'
  current: number
  total: number
  message?: string
}

export interface UpdateResult {
  success: boolean
  supplementCount: number
  combinationCount: number
  timestamp: number
  error?: string
}

export type ProgressCallback = (progress: UpdateProgress) => void

export async function runDailyTrendUpdate(
  onProgress?: ProgressCallback
): Promise<UpdateResult> {
  const startTime = Date.now()
  
  try {
    onProgress?.({ phase: 'starting', current: 0, total: 100 })

    onProgress?.({ phase: 'fetching-api-keys', current: 10, total: 100 })
    const apiKeys = await BackendService.getAPIKeys()

    onProgress?.({ 
      phase: 'discovering-supplements', 
      current: 20, 
      total: 100,
      message: 'Searching social media for trending supplements...'
    })

    const trendAnalysis = await discoverSupplementTrends(
      apiKeys.exaApiKey,
      {
        redditClientId: apiKeys.redditClientId,
        redditClientSecret: apiKeys.redditClientSecret,
        rapidApiKey: apiKeys.rapidApiKey
      }
    )

    const supplements = trendAnalysis.supplements

    onProgress?.({ 
      phase: 'discovering-combinations', 
      current: 50, 
      total: 100,
      message: 'Discovering supplement stack combinations...'
    })

    const combinations = await discoverSupplementCombinations(
      supplements,
      apiKeys.exaApiKey,
      {
        redditClientId: apiKeys.redditClientId,
        redditClientSecret: apiKeys.redditClientSecret,
        rapidApiKey: apiKeys.rapidApiKey
      }
    )

    onProgress?.({ 
      phase: 'saving-supplements', 
      current: 70, 
      total: 100,
      message: `Saving ${supplements.length} supplements to storage...`
    })

    await SupplementService.upsertSupplements(supplements)

    onProgress?.({ 
      phase: 'saving-combinations', 
      current: 85, 
      total: 100,
      message: `Saving ${combinations.length} combinations to storage...`
    })

    await SupplementService.upsertCombinations(combinations)

    onProgress?.({ 
      phase: 'complete', 
      current: 100, 
      total: 100,
      message: 'Update completed successfully!'
    })

    return {
      success: true,
      supplementCount: supplements.length,
      combinationCount: combinations.length,
      timestamp: Date.now()
    }

  } catch (error) {
    console.error('Daily trend update failed:', error)
    
    return {
      success: false,
      supplementCount: 0,
      combinationCount: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function getLastUpdateStatus(): Promise<{
  lastUpdate: number | null
  supplementCount: number
  combinationCount: number
} | null> {
  try {
    const [supplements, combinations, lastUpdate] = await Promise.all([
      SupplementService.getAllSupplements(),
      SupplementService.getAllCombinations(),
      spark.kv.get<number>('last-update-time')
    ])

    return {
      lastUpdate: lastUpdate || null,
      supplementCount: supplements.length,
      combinationCount: combinations.length
    }
  } catch (error) {
    console.error('Error getting last update status:', error)
    return null
  }
}
