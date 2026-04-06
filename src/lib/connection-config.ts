export interface ApiKeys {
  exa: string
  rapidApi: string
  reddit: {
    clientId: string
    clientSecret: string
  }
  openai: string
  anthropic: string
}

export interface SupabaseConfig {
  url: string
  anonKey: string
}

export async function getStoredApiKeys(): Promise<ApiKeys | null> {
  try {
    const keys = await spark.kv.get<ApiKeys>('admin-api-keys')
    return keys || null
  } catch (error) {
    console.error('Error retrieving API keys:', error)
    return null
  }
}

export async function getStoredSupabaseConfig(): Promise<SupabaseConfig | null> {
  try {
    const config = await spark.kv.get<SupabaseConfig>('admin-supabase-config')
    return config || null
  } catch (error) {
    console.error('Error retrieving Supabase config:', error)
    return null
  }
}

export async function hasApiKeysConfigured(): Promise<boolean> {
  const keys = await getStoredApiKeys()
  if (!keys) return false
  
  return !!(
    keys.exa ||
    keys.rapidApi ||
    (keys.reddit.clientId && keys.reddit.clientSecret) ||
    keys.openai ||
    keys.anthropic
  )
}

export async function hasSupabaseConfigured(): Promise<boolean> {
  const config = await getStoredSupabaseConfig()
  if (!config) return false
  
  return !!(config.url && config.anonKey && config.url.trim() !== '' && config.anonKey.trim() !== '')
}

export async function getConfigurationStatus(): Promise<{
  hasApis: boolean
  hasSupabase: boolean
  apiCount: number
}> {
  const [hasApis, hasSupabase, keys] = await Promise.all([
    hasApiKeysConfigured(),
    hasSupabaseConfigured(),
    getStoredApiKeys()
  ])
  
  let apiCount = 0
  if (keys) {
    if (keys.exa) apiCount++
    if (keys.rapidApi) apiCount++
    if (keys.reddit.clientId && keys.reddit.clientSecret) apiCount++
    if (keys.openai) apiCount++
    if (keys.anthropic) apiCount++
  }
  
  return {
    hasApis,
    hasSupabase,
    apiCount
  }
}
