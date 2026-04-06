import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url_here')

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

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
