import { supabase } from './supabase'
import { Supplement, SupplementCombination } from './types'
import { INITIAL_SUPPLEMENTS, SUPPLEMENT_COMBINATIONS } from './data'

const USE_MOCK_DATA = !import.meta.env.VITE_SUPABASE_URL

export class SupplementService {
  static async getAllSupplements(): Promise<Supplement[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(INITIAL_SUPPLEMENTS)
    }

    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .order('popularity_score', { ascending: false })

    if (error) {
      console.error('Error fetching supplements:', error)
      return INITIAL_SUPPLEMENTS
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category as any,
      trendDirection: row.trend_direction as any,
      popularityScore: row.popularity_score,
      description: row.description,
      trendData: row.trend_data,
      discussionLinks: row.discussion_links,
      aiInsight: row.ai_insight || undefined
    }))
  }

  static async getSupplementById(id: string): Promise<Supplement | null> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(INITIAL_SUPPLEMENTS.find(s => s.id === id) || null)
    }

    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      category: data.category as any,
      trendDirection: data.trend_direction as any,
      popularityScore: data.popularity_score,
      description: data.description,
      trendData: data.trend_data,
      discussionLinks: data.discussion_links,
      aiInsight: data.ai_insight || undefined
    }
  }

  static async searchSupplements(query: string): Promise<Supplement[]> {
    if (USE_MOCK_DATA) {
      const lowerQuery = query.toLowerCase()
      return Promise.resolve(
        INITIAL_SUPPLEMENTS.filter(s => 
          s.name.toLowerCase().includes(lowerQuery) || 
          s.description.toLowerCase().includes(lowerQuery)
        )
      )
    }

    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('popularity_score', { ascending: false })

    if (error) {
      console.error('Error searching supplements:', error)
      return []
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category as any,
      trendDirection: row.trend_direction as any,
      popularityScore: row.popularity_score,
      description: row.description,
      trendData: row.trend_data,
      discussionLinks: row.discussion_links,
      aiInsight: row.ai_insight || undefined
    }))
  }

  static async upsertSupplement(supplement: Supplement): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('Mock mode: Would upsert supplement:', supplement.name)
      return Promise.resolve()
    }

    const { error } = await supabase
      .from('supplements')
      .upsert({
        id: supplement.id,
        name: supplement.name,
        category: supplement.category,
        trend_direction: supplement.trendDirection,
        popularity_score: supplement.popularityScore,
        description: supplement.description,
        trend_data: supplement.trendData,
        discussion_links: supplement.discussionLinks || null,
        ai_insight: supplement.aiInsight || null,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error upserting supplement:', error)
      throw error
    }
  }

  static async upsertSupplements(supplements: Supplement[]): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('Mock mode: Would upsert', supplements.length, 'supplements')
      return Promise.resolve()
    }

    const rows = supplements.map(supplement => ({
      id: supplement.id,
      name: supplement.name,
      category: supplement.category,
      trend_direction: supplement.trendDirection,
      popularity_score: supplement.popularityScore,
      description: supplement.description,
      trend_data: supplement.trendData,
      discussion_links: supplement.discussionLinks || null,
      ai_insight: supplement.aiInsight || null,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('supplements')
      .upsert(rows)

    if (error) {
      console.error('Error upserting supplements:', error)
      throw error
    }
  }

  static async getAllCombinations(): Promise<SupplementCombination[]> {
    if (USE_MOCK_DATA) {
      return Promise.resolve(SUPPLEMENT_COMBINATIONS)
    }

    const { data, error } = await supabase
      .from('supplement_combinations')
      .select('*')
      .order('popularity_score', { ascending: false })

    if (error) {
      console.error('Error fetching combinations:', error)
      return SUPPLEMENT_COMBINATIONS
    }

    return data.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      purpose: row.purpose,
      supplementIds: row.supplement_ids,
      trendDirection: row.trend_direction as any,
      popularityScore: row.popularity_score,
      trendData: row.trend_data,
      references: row.references,
      discussionLinks: row.discussion_links,
      aiInsight: row.ai_insight || undefined
    }))
  }

  static async upsertCombinations(combinations: SupplementCombination[]): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('Mock mode: Would upsert', combinations.length, 'combinations')
      return Promise.resolve()
    }

    const rows = combinations.map(combo => ({
      id: combo.id,
      name: combo.name,
      description: combo.description,
      purpose: combo.purpose,
      supplement_ids: combo.supplementIds,
      trend_direction: combo.trendDirection,
      popularity_score: combo.popularityScore,
      trend_data: combo.trendData,
      references: combo.references,
      discussion_links: combo.discussionLinks || null,
      ai_insight: combo.aiInsight || null,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('supplement_combinations')
      .upsert(rows)

    if (error) {
      console.error('Error upserting combinations:', error)
      throw error
    }
  }
}
