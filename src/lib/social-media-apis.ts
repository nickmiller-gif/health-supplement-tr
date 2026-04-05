import { DiscussionLink } from './types'

export interface SocialMediaConfig {
  exaApiKey?: string
  redditClientId?: string
  redditClientSecret?: string
  twitterBearerToken?: string
  rapidApiKey?: string
}

export interface SocialSearchResult {
  platform: string
  url: string
  title: string
  content?: string
  author?: string
  timestamp?: string
  engagement?: {
    likes?: number
    shares?: number
    comments?: number
  }
}

const CACHE_DURATION = 1000 * 60 * 60 * 24
const CACHE_KEY_PREFIX = 'social-cache-'

function getCacheKey(platform: string, query: string): string {
  return `${CACHE_KEY_PREFIX}${platform}-${query}`
}

async function getCachedResult(platform: string, query: string): Promise<SocialSearchResult[] | null> {
  try {
    const cacheKey = getCacheKey(platform, query)
    const cached = await window.spark.kv.get<{ data: SocialSearchResult[]; timestamp: number }>(cacheKey)
    
    if (!cached) return null
    
    const age = Date.now() - cached.timestamp
    if (age > CACHE_DURATION) {
      await window.spark.kv.delete(cacheKey)
      return null
    }
    
    return cached.data
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

async function setCachedResult(platform: string, query: string, data: SocialSearchResult[]): Promise<void> {
  try {
    const cacheKey = getCacheKey(platform, query)
    await window.spark.kv.set(cacheKey, { data, timestamp: Date.now() })
  } catch (error) {
    console.error('Error writing cache:', error)
  }
}

export async function searchRedditAPI(
  query: string,
  config: SocialMediaConfig
): Promise<SocialSearchResult[]> {
  const cached = await getCachedResult('reddit', query)
  if (cached) {
    console.log(`Using cached Reddit results for: ${query}`)
    return cached
  }

  if (!config.redditClientId || !config.redditClientSecret) {
    return []
  }

  try {
    const auth = btoa(`${config.redditClientId}:${config.redditClientSecret}`)
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    const searchResponse = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&limit=25&sort=relevance&t=month`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'TrendPulse/1.0'
        }
      }
    )

    const searchData = await searchResponse.json()
    const results: SocialSearchResult[] = searchData.data?.children?.map((post: any) => ({
      platform: 'Reddit',
      url: `https://reddit.com${post.data.permalink}`,
      title: post.data.title,
      content: post.data.selftext?.substring(0, 500),
      author: post.data.author,
      timestamp: new Date(post.data.created_utc * 1000).toISOString(),
      engagement: {
        likes: post.data.ups,
        comments: post.data.num_comments
      }
    })) || []

    await setCachedResult('reddit', query, results)
    return results
  } catch (error) {
    console.error('Reddit API error:', error)
    return []
  }
}

export async function searchTwitterViaRapidAPI(
  query: string,
  config: SocialMediaConfig
): Promise<SocialSearchResult[]> {
  const cached = await getCachedResult('twitter', query)
  if (cached) {
    console.log(`Using cached Twitter results for: ${query}`)
    return cached
  }

  if (!config.rapidApiKey) {
    return []
  }

  try {
    const response = await fetch(
      `https://twitter-api45.p.rapidapi.com/search.php?query=${encodeURIComponent(query)}&search_type=Latest`,
      {
        headers: {
          'x-rapidapi-key': config.rapidApiKey,
          'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
        }
      }
    )

    const data = await response.json()
    const results: SocialSearchResult[] = (data.timeline || []).slice(0, 20).map((tweet: any) => ({
      platform: 'X/Twitter',
      url: tweet.url || `https://twitter.com/i/status/${tweet.tweet_id}`,
      title: tweet.text?.substring(0, 100) || 'Tweet',
      content: tweet.text,
      author: tweet.screen_name,
      timestamp: tweet.created_at,
      engagement: {
        likes: tweet.favorites,
        shares: tweet.retweets,
        comments: tweet.replies
      }
    }))

    await setCachedResult('twitter', query, results)
    return results
  } catch (error) {
    console.error('Twitter API error:', error)
    return []
  }
}

export async function searchTikTokViaRapidAPI(
  query: string,
  config: SocialMediaConfig
): Promise<SocialSearchResult[]> {
  const cached = await getCachedResult('tiktok', query)
  if (cached) {
    console.log(`Using cached TikTok results for: ${query}`)
    return cached
  }

  if (!config.rapidApiKey) {
    return []
  }

  try {
    const response = await fetch(
      `https://tiktok-scraper7.p.rapidapi.com/search/keyword?keywords=${encodeURIComponent(query)}&count=20`,
      {
        headers: {
          'x-rapidapi-key': config.rapidApiKey,
          'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
        }
      }
    )

    const data = await response.json()
    const results: SocialSearchResult[] = (data.data || []).map((video: any) => ({
      platform: 'TikTok',
      url: video.video_url || `https://www.tiktok.com/@${video.author?.unique_id}/video/${video.aweme_id}`,
      title: video.title || video.desc?.substring(0, 100) || 'TikTok Video',
      content: video.desc,
      author: video.author?.unique_id,
      timestamp: video.create_time,
      engagement: {
        likes: video.statistics?.digg_count,
        shares: video.statistics?.share_count,
        comments: video.statistics?.comment_count
      }
    }))

    await setCachedResult('tiktok', query, results)
    return results
  } catch (error) {
    console.error('TikTok API error:', error)
    return []
  }
}

export async function searchLinkedInViaRapidAPI(
  query: string,
  config: SocialMediaConfig
): Promise<SocialSearchResult[]> {
  const cached = await getCachedResult('linkedin', query)
  if (cached) {
    console.log(`Using cached LinkedIn results for: ${query}`)
    return cached
  }

  if (!config.rapidApiKey) {
    return []
  }

  try {
    const response = await fetch(
      `https://linkedin-data-api.p.rapidapi.com/search-posts?keywords=${encodeURIComponent(query)}`,
      {
        headers: {
          'x-rapidapi-key': config.rapidApiKey,
          'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
      }
    )

    const data = await response.json()
    const results: SocialSearchResult[] = (data.data || []).slice(0, 15).map((post: any) => ({
      platform: 'LinkedIn',
      url: post.url || post.postUrl,
      title: post.text?.substring(0, 100) || 'LinkedIn Post',
      content: post.text,
      author: post.author?.name,
      timestamp: post.postedAt,
      engagement: {
        likes: post.numLikes,
        comments: post.numComments,
        shares: post.numShares
      }
    }))

    await setCachedResult('linkedin', query, results)
    return results
  } catch (error) {
    console.error('LinkedIn API error:', error)
    return []
  }
}

export async function searchAllPlatforms(
  query: string,
  config: SocialMediaConfig
): Promise<{
  allResults: SocialSearchResult[]
  byPlatform: Record<string, SocialSearchResult[]>
}> {
  const results = await Promise.allSettled([
    searchRedditAPI(query, config),
    searchTwitterViaRapidAPI(query, config),
    searchTikTokViaRapidAPI(query, config),
    searchLinkedInViaRapidAPI(query, config)
  ])

  const byPlatform: Record<string, SocialSearchResult[]> = {
    'Reddit': [],
    'X/Twitter': [],
    'TikTok': [],
    'LinkedIn': []
  }

  const platformKeys = ['Reddit', 'X/Twitter', 'TikTok', 'LinkedIn']
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      byPlatform[platformKeys[index]] = result.value
    }
  })

  const allResults = Object.values(byPlatform).flat()

  return { allResults, byPlatform }
}

export async function getSocialMediaCacheStats() {
  try {
    const allKeys = await window.spark.kv.keys()
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    let oldestTimestamp: number | null = null
    let newestTimestamp: number | null = null
    
    for (const key of cacheKeys) {
      const cached = await window.spark.kv.get<{ timestamp: number }>(key)
      if (cached?.timestamp) {
        if (!oldestTimestamp || cached.timestamp < oldestTimestamp) {
          oldestTimestamp = cached.timestamp
        }
        if (!newestTimestamp || cached.timestamp > newestTimestamp) {
          newestTimestamp = cached.timestamp
        }
      }
    }
    
    return {
      totalCached: cacheKeys.length,
      oldestCache: oldestTimestamp,
      newestCache: newestTimestamp
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return {
      totalCached: 0,
      oldestCache: null,
      newestCache: null
    }
  }
}

export async function clearSocialMediaCache(): Promise<number> {
  try {
    const allKeys = await window.spark.kv.keys()
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    await Promise.all(cacheKeys.map(key => window.spark.kv.delete(key)))
    
    return cacheKeys.length
  } catch (error) {
    console.error('Error clearing cache:', error)
    return 0
  }
}

export function getSocialMediaAPIsInfo() {
  return {
    reddit: {
      name: 'Reddit API',
      cost: 'Free',
      url: 'https://www.reddit.com/prefs/apps',
      description: 'Access Reddit discussions from supplement and biohacking communities',
      fields: ['Client ID', 'Client Secret']
    },
    twitter: {
      name: 'Twitter/X via RapidAPI',
      cost: 'Freemium (500 requests/month free)',
      url: 'https://rapidapi.com/omarmhaimdat/api/twitter-api45',
      description: 'Search recent tweets and discussions about supplements',
      fields: ['RapidAPI Key']
    },
    tiktok: {
      name: 'TikTok via RapidAPI',
      cost: 'Freemium (100 requests/month free)',
      url: 'https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7',
      description: 'Discover trending supplement content on TikTok',
      fields: ['RapidAPI Key']
    },
    linkedin: {
      name: 'LinkedIn via RapidAPI',
      cost: 'Freemium (100 requests/month free)',
      url: 'https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api',
      description: 'Professional discussions about supplements and health',
      fields: ['RapidAPI Key']
    },
    exa: {
      name: 'EXA Search API',
      cost: 'Paid ($20/month for 1000 searches)',
      url: 'https://exa.ai',
      description: 'Neural search across the entire web for supplement trends',
      fields: ['API Key']
    }
  }
}
