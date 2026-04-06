import { supabase, isSupabaseConfigured } from './supabase'
import { BackendService } from './backend-service'
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
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }

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
      message: `Saving ${supplements.length} supplements to database...`
    })

    await saveSupplementsToDatabase(supplements)

    onProgress?.({ 
      phase: 'saving-combinations', 
      current: 85, 
      total: 100,
      message: `Saving ${combinations.length} combinations to database...`
    })

    await saveCombinationsToDatabase(combinations)

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

async function saveSupplementsToDatabase(supplements: Supplement[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  for (const supplement of supplements) {
    const supplementData = {
      id: supplement.id,
      name: supplement.name,
      category: supplement.category,
      trend_direction: supplement.trendDirection,
      popularity_score: supplement.popularityScore,
      description: supplement.description,
      trend_data: supplement.trendData,
      discussion_links: supplement.discussionLinks || [],
      ai_insight: supplement.aiInsight || null,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('supplements')
      .upsert(supplementData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error(`Error saving supplement ${supplement.name}:`, error)
      throw new Error(`Failed to save supplement ${supplement.name}: ${error.message}`)
    }
  }

  console.log(`Successfully saved ${supplements.length} supplements to database`)
}

async function saveCombinationsToDatabase(combinations: SupplementCombination[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  for (const combination of combinations) {
    const combinationData = {
      id: combination.id,
      name: combination.name,
      description: combination.description,
      purpose: combination.purpose,
      supplement_ids: combination.supplementIds,
      trend_direction: combination.trendDirection,
      popularity_score: combination.popularityScore,
      trend_data: combination.trendData,
      references: combination.references || [],
      discussion_links: combination.discussionLinks || [],
      ai_insight: combination.aiInsight || null,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('supplement_combinations')
      .upsert(combinationData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error(`Error saving combination ${combination.name}:`, error)
      throw new Error(`Failed to save combination ${combination.name}: ${error.message}`)
    }
  }

  console.log(`Successfully saved ${combinations.length} combinations to database`)
}

export async function getLastUpdateStatus(): Promise<{
  lastUpdate: number | null
  supplementCount: number
  combinationCount: number
} | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null
  }

  try {
    const [supplementsResult, combinationsResult] = await Promise.all([
      supabase
        .from('supplements')
        .select('updated_at', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .limit(1)
        .single(),
      
      supabase
        .from('supplement_combinations')
        .select('*', { count: 'exact' })
    ])

    return {
      lastUpdate: supplementsResult.data?.updated_at 
        ? new Date(supplementsResult.data.updated_at).getTime() 
        : null,
      supplementCount: supplementsResult.count || 0,
      combinationCount: combinationsResult.count || 0
    }
  } catch (error) {
    console.error('Error getting last update status:', error)
    return null
  }
}
