const CACHE_KEY_PREFIX = 'exa-cache-'

export async function getCacheStats(): Promise<{
  totalCached: number
  oldestCache: number | null
  newestCache: number | null
  totalSize: number
}> {
  try {
    const allKeys = await window.spark.kv.keys()
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    if (cacheKeys.length === 0) {
      return {
        totalCached: 0,
        oldestCache: null,
        newestCache: null,
        totalSize: 0
      }
    }
    
    let oldest = Infinity
    let newest = 0
    
    for (const key of cacheKeys) {
      const cached = await window.spark.kv.get<{ timestamp: number }>(key)
      if (cached?.timestamp) {
        oldest = Math.min(oldest, cached.timestamp)
        newest = Math.max(newest, cached.timestamp)
      }
    }
    
    return {
      totalCached: cacheKeys.length,
      oldestCache: oldest === Infinity ? null : oldest,
      newestCache: newest === 0 ? null : newest,
      totalSize: cacheKeys.length
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return {
      totalCached: 0,
      oldestCache: null,
      newestCache: null,
      totalSize: 0
    }
  }
}

export async function clearExaCache(): Promise<number> {
  try {
    const allKeys = await window.spark.kv.keys()
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    for (const key of cacheKeys) {
      await window.spark.kv.delete(key)
    }
    
    return cacheKeys.length
  } catch (error) {
    console.error('Error clearing cache:', error)
    return 0
  }
}

export async function clearOldCache(maxAge: number): Promise<number> {
  try {
    const allKeys = await window.spark.kv.keys()
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    let cleared = 0
    const now = Date.now()
    
    for (const key of cacheKeys) {
      const cached = await window.spark.kv.get<{ timestamp: number }>(key)
      if (cached?.timestamp) {
        const age = now - cached.timestamp
        if (age > maxAge) {
          await window.spark.kv.delete(key)
          cleared++
        }
      }
    }
    
    return cleared
  } catch (error) {
    console.error('Error clearing old cache:', error)
    return 0
  }
}
