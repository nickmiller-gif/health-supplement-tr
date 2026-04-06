import { createClient } from '@supabase/supabase-js'

const getSupabaseCredentials = async () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  
  if (envUrl && envKey && envUrl !== 'your_supabase_project_url_here') {
    return { url: envUrl, key: envKey }
  }

  try {
    const kvConfig = await spark.kv.get<{ url: string; anonKey: string }>('admin-supabase-config')
    if (kvConfig?.url && kvConfig?.anonKey) {
      return { url: kvConfig.url, key: kvConfig.anonKey }
    }
  } catch (error) {
    console.warn('Failed to load Supabase config from KV:', error)
  }

  return { url: '', key: '' }
}

let supabaseClient: ReturnType<typeof createClient> | null = null
let isConfigured = false

const initializeSupabase = async () => {
  const { url, key } = await getSupabaseCredentials()
  isConfigured = !!(url && key && url !== 'your_supabase_project_url_here')
  
  supabaseClient = isConfigured 
    ? createClient(url, key)
    : createClient('https://placeholder.supabase.co', 'placeholder-key')
  
  return supabaseClient
}

const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const hasEnvVars = !!(envUrl && envKey && envUrl !== 'your_supabase_project_url_here')

export const isSupabaseConfigured = hasEnvVars

export const supabase = hasEnvVars
  ? createClient(envUrl, envKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export const getSupabaseClient = async () => {
  if (hasEnvVars) {
    return supabase
  }
  
  if (!supabaseClient) {
    await initializeSupabase()
  }
  return supabaseClient!
}

export const checkSupabaseConnection = async () => {
  const client = await getSupabaseClient()
  try {
    const { error } = await client.from('supplements').select('count').limit(1)
    return !error
  } catch {
    return false
  }
}

export type Database = {
  public: {
    Tables: {
      supplements: {
        Row: {
          id: string
          name: string
          category: string
          trend_direction: string
          popularity_score: number
          description: string
          trend_data: number[]
          discussion_links: any
          ai_insight: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['supplements']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['supplements']['Insert']>
      }
      supplement_combinations: {
        Row: {
          id: string
          name: string
          description: string
          purpose: string
          supplement_ids: string[]
          trend_direction: string
          popularity_score: number
          trend_data: number[]
          references: string[]
          discussion_links: any
          ai_insight: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['supplement_combinations']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['supplement_combinations']['Insert']>
      }
      emerging_signals: {
        Row: {
          id: string
          compound_name: string
          category: string
          research_phase: string
          confidence_score: number
          time_to_trend: string
          signal_strength: number
          research_summary: string
          potential_benefits: string[]
          research_links: string[]
          emergence_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['emerging_signals']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['emerging_signals']['Insert']>
      }
      user_tracked_supplements: {
        Row: {
          id: string
          user_id: string
          supplement_id: string
          tracked_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_tracked_supplements']['Row'], 'id' | 'tracked_at'>
        Update: Partial<Database['public']['Tables']['user_tracked_supplements']['Insert']>
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          messages: any[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_conversations']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['chat_conversations']['Insert']>
      }
    }
  }
}
