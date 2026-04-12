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
      console.error('Error fetching API keys:', error)
      return {}
    }
  }

  static async getTodaysSupplements(): Promise<Supplement[]> {
    try {
      const supplements = await spark.kv.get<Supplement[]>('supplements')
      return supplements || []
    } catch (error) {
      console.error('Error fetching supplements:', error)
      return []
    }
  }

  static async getTodaysCombinations(): Promise<SupplementCombination[]> {
    try {
      const combinations = await spark.kv.get<SupplementCombination[]>('supplement-combinations')
      return combinations || []
    } catch (error) {
      console.error('Error fetching combinations:', error)
      return []
    }
  }

  static async getLastUpdateTime(): Promise<number | null> {
    try {
      const lastUpdate = await spark.kv.get<number>('last-update-time')
      return lastUpdate || null
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
