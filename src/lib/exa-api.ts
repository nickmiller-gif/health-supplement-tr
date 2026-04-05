import { Supplement, SupplementCombination, TrendDirection, SupplementCategory, DiscussionLink } from './types'

interface ExaSearchResult {
  title: string
  url: string
  publishedDate?: string
  author?: string
  text?: string
  highlights?: string[]
  highlightScores?: number[]
}

interface ExaResponse {
  results: ExaSearchResult[]
}

const EXA_API_BASE = 'https://api.exa.ai/search'

async function exaSearch(query: string, numResults: number = 10, apiKey?: string): Promise<ExaResponse> {
  if (!apiKey) {
    throw new Error('EXA API key not configured')
  }

  const response = await fetch(EXA_API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      query,
      numResults,
      type: 'auto',
      useAutoprompt: true,
      contents: {
        text: { maxCharacters: 1000 },
        highlights: { numSentences: 3 }
      }
    })
  })

  if (!response.ok) {
    throw new Error(`EXA API error: ${response.statusText}`)
  }

  return response.json()
}

export async function discoverSupplementTrendsWithExa(apiKey: string): Promise<{
  supplements: Supplement[]
  lastUpdated: number
}> {
  try {
    const queries = [
      'trending peptides biohacking reddit 2024 2025',
      'popular nootropics supplements cognitive enhancement',
      'NAD+ precursors longevity supplements trending',
      'BPC-157 TB-500 peptide stack discussion',
      'methylene blue cognitive enhancement reddit',
      'new supplement trends biohacking forums'
    ]

    const searchPromises = queries.map(q => exaSearch(q, 15, apiKey))
    const searchResults = await Promise.all(searchPromises)

    const allResults = searchResults.flatMap(r => r.results)
    
    const analysisPrompt = window.spark.llmPrompt`You are analyzing real web search results about supplement trends from Reddit, biohacking forums, and health communities.

Here are the search results:
${JSON.stringify(allResults.slice(0, 50).map(r => ({
  title: r.title,
  url: r.url,
  text: r.text?.substring(0, 500),
  highlights: r.highlights
})), null, 2)}

Based on these REAL search results, identify the top 15 most trending supplements. Extract actual supplements being discussed in these results.

For each supplement, determine:
1. Current trend direction (rising, stable, or declining based on discussion volume and sentiment)
2. Popularity score (0-100 based on how frequently it appears in results)
3. Brief accurate description (1-2 sentences based on the content)
4. Simulated trend data as 8 numbers showing progression
5. Category (peptide, vitamin, mineral, nootropic, amino-acid, or other)

Return ONLY valid JSON with this exact structure:
{
  "supplements": [
    {
      "name": "Supplement Name",
      "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
      "trendDirection": "rising|stable|declining",
      "popularityScore": 85,
      "description": "Brief description based on search results",
      "trendData": [45, 52, 61, 68, 75, 82, 88, 92]
    }
  ]
}`

    const llmResponse = await window.spark.llm(analysisPrompt, 'gpt-4o', true)
    const analysisData = JSON.parse(llmResponse)

    const discussionLinksMap = new Map<string, DiscussionLink[]>()
    
    for (const result of allResults) {
      const resultText = (result.title + ' ' + (result.text || '')).toLowerCase()
      
      for (const supplement of analysisData.supplements) {
        const suppName = supplement.name.toLowerCase()
        if (resultText.includes(suppName) || suppName.includes(resultText.split(' ')[0])) {
          if (!discussionLinksMap.has(supplement.name)) {
            discussionLinksMap.set(supplement.name, [])
          }
          
          const links = discussionLinksMap.get(supplement.name)!
          if (links.length < 3) {
            let platform = 'Web'
            if (result.url.includes('reddit.com')) platform = 'Reddit'
            else if (result.url.includes('twitter.com') || result.url.includes('x.com')) platform = 'Twitter'
            else if (result.url.includes('youtube.com')) platform = 'YouTube'
            
            links.push({
              platform,
              url: result.url,
              title: result.title
            })
          }
        }
      }
    }

    const supplements: Supplement[] = analysisData.supplements.map((s: any, idx: number) => ({
      id: `exa-${idx + 1}`,
      name: s.name,
      category: s.category as SupplementCategory,
      trendDirection: s.trendDirection as TrendDirection,
      popularityScore: s.popularityScore,
      description: s.description,
      trendData: s.trendData,
      discussionLinks: discussionLinksMap.get(s.name) || []
    }))

    return {
      supplements,
      lastUpdated: Date.now()
    }
  } catch (error) {
    console.error('Error discovering trends with EXA:', error)
    throw error
  }
}

export async function discoverCombinationsWithExa(
  supplements: Supplement[],
  apiKey: string
): Promise<SupplementCombination[]> {
  try {
    const queries = [
      'wolverine protocol peptide stack BPC-157 TB-500',
      'longevity supplement stack NAD+ NMN resveratrol',
      'nootropic stack cognitive enhancement',
      'sleep optimization supplement protocol',
      'biohacking supplement combinations reddit'
    ]

    const searchPromises = queries.map(q => exaSearch(q, 10, apiKey))
    const searchResults = await Promise.all(searchPromises)
    const allResults = searchResults.flatMap(r => r.results)

    const supplementsList = supplements.map(s => `${s.name} (${s.category})`).join(', ')
    
    const analysisPrompt = window.spark.llmPrompt`You are analyzing real web search results about supplement combinations and stacks.

Available supplements: ${supplementsList}

Search results about supplement stacks:
${JSON.stringify(allResults.map(r => ({
  title: r.title,
  url: r.url,
  text: r.text?.substring(0, 500),
  highlights: r.highlights
})), null, 2)}

Based on these REAL search results, identify 8-10 supplement combinations/stacks that are actually being discussed.

For each combination:
1. Use real names from the results (like "Wolverine Protocol" if mentioned)
2. List which supplements are combined (use exact names from available supplements list)
3. Describe the purpose based on what's in the results
4. Determine trend direction and popularity
5. List where it's being discussed

Return ONLY valid JSON:
{
  "combinations": [
    {
      "name": "Stack Name",
      "description": "What this combination does",
      "purpose": "Primary goal",
      "supplementNames": ["Exact Name 1", "Exact Name 2"],
      "trendDirection": "rising|stable|declining",
      "popularityScore": 87,
      "trendData": [42, 51, 58, 66, 72, 78, 83, 87],
      "references": ["Platform/source names"]
    }
  ]
}`

    const llmResponse = await window.spark.llm(analysisPrompt, 'gpt-4o', true)
    const analysisData = JSON.parse(llmResponse)

    const discussionLinksMap = new Map<string, DiscussionLink[]>()
    
    for (const result of allResults) {
      const resultText = (result.title + ' ' + (result.text || '')).toLowerCase()
      
      for (const combo of analysisData.combinations) {
        const comboName = combo.name.toLowerCase()
        const comboTerms = [...combo.supplementNames.map((s: string) => s.toLowerCase()), comboName]
        
        if (comboTerms.some(term => resultText.includes(term))) {
          if (!discussionLinksMap.has(combo.name)) {
            discussionLinksMap.set(combo.name, [])
          }
          
          const links = discussionLinksMap.get(combo.name)!
          if (links.length < 3) {
            let platform = 'Web'
            if (result.url.includes('reddit.com')) platform = 'Reddit'
            else if (result.url.includes('twitter.com') || result.url.includes('x.com')) platform = 'Twitter'
            else if (result.url.includes('youtube.com')) platform = 'YouTube'
            
            links.push({
              platform,
              url: result.url,
              title: result.title
            })
          }
        }
      }
    }

    const supplementNameToId = new Map(supplements.map(s => [s.name.toLowerCase(), s.id]))
    
    const combinations: SupplementCombination[] = analysisData.combinations.map((c: any, idx: number) => {
      const supplementIds = c.supplementNames
        .map((name: string) => supplementNameToId.get(name.toLowerCase()))
        .filter((id: string | undefined) => id !== undefined)
      
      return {
        id: `exa-combo-${idx + 1}`,
        name: c.name,
        description: c.description,
        purpose: c.purpose,
        supplementIds,
        trendDirection: c.trendDirection as TrendDirection,
        popularityScore: c.popularityScore,
        trendData: c.trendData,
        references: c.references,
        discussionLinks: discussionLinksMap.get(c.name) || []
      }
    }).filter((c: SupplementCombination) => c.supplementIds.length >= 2)

    return combinations
  } catch (error) {
    console.error('Error discovering combinations with EXA:', error)
    throw error
  }
}
