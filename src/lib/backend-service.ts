import { supabase, isSupabaseConfigured } from './supabase'
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
    if (!isSupabaseConfigured) {
      return {}
    }

    try {
      const { data, error } = await supabase
        .from('api_configuration')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching API keys:', error)
        return {}
      }

      return {
        exaApiKey: data?.exa_api_key,
        redditClientId: data?.reddit_client_id,
        redditClientSecret: data?.reddit_client_secret,
        rapidApiKey: data?.rapidapi_key,
        openaiApiKey: data?.openai_api_key,
        anthropicApiKey: data?.anthropic_api_key,
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      return {}
    }
  }

  static async getTodaysSupplements(): Promise<Supplement[]> {
    if (!isSupabaseConfigured) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching supplements:', error)
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
        discussionLinks: row.discussion_links || {},
        aiInsight: row.ai_insight || undefined,
      }))
    } catch (error) {
      console.error('Error fetching supplements:', error)
      return []
    }
  }

  static async getTodaysCombinations(): Promise<SupplementCombination[]> {
    if (!isSupabaseConfigured) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('supplement_combinations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching combinations:', error)
        return []
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
        references: row.references || [],
        discussionLinks: row.discussion_links || {},
        aiInsight: row.ai_insight || undefined,
      }))
    } catch (error) {
      console.error('Error fetching combinations:', error)
      return []
    }
  }

  static async getLastUpdateTime(): Promise<number | null> {
    if (!isSupabaseConfigured) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return null
      }

      return new Date(data.updated_at).getTime()
    } catch (error) {
      return null
    }
  }

  static async chatQuery(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    supplements: Supplement[],
    combinations: SupplementCombination[]
  ): Promise<string> {
    const apiKeys = await this.getAPIKeys()
    
    const supplementContext = JSON.stringify(supplements.map(s => ({
      name: s.name,
      category: s.category,
      description: s.description,
      trend: s.trendDirection,
      popularity: s.popularityScore
    })))

    const combinationContext = JSON.stringify(combinations.map(c => ({
      name: c.name,
      description: c.description,
      purpose: c.purpose,
      supplements: c.supplementIds
    })))

    const lastMessage = messages[messages.length - 1]?.content || ''

    const prompt = spark.llmPrompt`You are TrendPulse AI, an expert supplement advisor with access to real-time supplement trend data.

Available supplements:
${supplementContext}

Available combinations:
${combinationContext}

Previous conversation:
${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}

User question: ${lastMessage}

Provide a helpful, accurate response based on the available supplement data. Be conversational and reference specific supplements and trends when relevant. If asked about something not in the data, politely explain what data is available.`

    try {
      if (apiKeys.openaiApiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeys.openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500
          })
        })

        if (response.ok) {
          const data = await response.json()
          return data.choices[0].message.content
        }
      }

      return await spark.llm(prompt, 'gpt-4o-mini')
    } catch (error) {
      console.error('Chat query error:', error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again."
    }
  }
}
