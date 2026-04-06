import { Supplement, SupplementCombination, TrendDirection, SupplementCategory, DiscussionLink } from './types'
import { discoverSupplementTrendsWithExa, discoverCombinationsWithExa } from './exa-api'
import { searchAllPlatforms, SocialMediaConfig, SocialSearchResult } from './social-media-apis'

interface TrendAnalysis {
  supplements: Supplement[]
  combinations: SupplementCombination[]
  lastUpdated: number
  socialDataUsed?: boolean
  platformsQueried?: string[]
}

const CACHE_DURATION = 1000 * 60 * 30

export async function discoverSupplementTrends(
  exaApiKey?: string,
  socialConfig?: Omit<SocialMediaConfig, 'exaApiKey'>
): Promise<TrendAnalysis> {
  const hasSocialAPIs = !!(
    socialConfig?.redditClientId || 
    socialConfig?.rapidApiKey
  )
  
  if (hasSocialAPIs) {
    try {
      const fullConfig: SocialMediaConfig = {
        ...socialConfig,
        exaApiKey
      }
      const socialResults = await discoverSupplementTrendsWithSocial(fullConfig)
      return {
        ...socialResults,
        socialDataUsed: true
      }
    } catch (error) {
      console.error('Social media API search failed:', error)
    }
  }
  
  if (exaApiKey) {
    try {
      const exaResults = await discoverSupplementTrendsWithExa(exaApiKey)
      return {
        ...exaResults,
        combinations: [],
        socialDataUsed: false
      }
    } catch (error) {
      console.error('EXA API failed, falling back to LLM-only:', error)
    }
  }
  
  return discoverSupplementTrendsLLMOnly()
}

async function discoverSupplementTrendsWithSocial(config: SocialMediaConfig): Promise<TrendAnalysis> {
  try {
    const supplementQueries = [
      'peptides BPC-157 TB-500',
      'nootropics supplements cognitive',
      'NAD+ NMN longevity supplements',
      'magnesium vitamin D3 K2',
      'methylene blue supplements'
    ]

    const platformsQueried: string[] = []
    const allSocialData: SocialSearchResult[] = []

    for (const query of supplementQueries) {
      const { allResults, byPlatform } = await searchAllPlatforms(query, config)
      allSocialData.push(...allResults)
      
      Object.keys(byPlatform).forEach(platform => {
        if (byPlatform[platform].length > 0 && !platformsQueried.includes(platform)) {
          platformsQueried.push(platform)
        }
      })
    }

    const socialContext = allSocialData
      .slice(0, 50)
      .map(result => `[${result.platform}] ${result.title} - ${result.content?.substring(0, 150) || ''}`)
      .join('\n')

    const prompt = window.spark.llmPrompt`You are analyzing REAL social media data about supplement trends from Reddit, Twitter/X, TikTok, and LinkedIn.

Here is actual social media data collected from these platforms:

${socialContext}

Based on this REAL data, identify the top 15 most trending supplements. Extract supplement names mentioned in the social media posts and analyze their popularity.

For each supplement, determine:
1. Current trend direction (rising, stable, or declining based on discussion volume and sentiment)
2. Popularity score (0-100 based on how frequently it's mentioned across platforms)
3. Brief accurate description (1-2 sentences)
4. Simulated trend data as 8 numbers showing progression over past 8 weeks
5. Discussion links - use the ACTUAL URLs from the social media data provided above

Return ONLY valid JSON with this exact structure:
{
"supplements": [
{
  "name": "Supplement Name",
  "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
  "trendDirection": "rising|stable|declining",
  "popularityScore": 85,
  "description": "Brief accurate description",
  "trendData": [45, 52, 61, 68, 75, 82, 88, 92],
  "discussionLinks": [
    {
      "platform": "Reddit",
      "url": "https://reddit.com/...",
      "title": "Discussion title"
    }
  ]
}
]
}`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const discussionLinksByPlatform = new Map<string, SocialSearchResult[]>()
    allSocialData.forEach(result => {
      const platform = result.platform
      if (!discussionLinksByPlatform.has(platform)) {
        discussionLinksByPlatform.set(platform, [])
      }
      discussionLinksByPlatform.get(platform)!.push(result)
    })
    
    const supplements: Supplement[] = data.supplements.map((s: any, idx: number) => {
      let discussionLinks: DiscussionLink[] = s.discussionLinks || []
      
      const supplementName = s.name.toLowerCase()
      const relatedPosts = allSocialData.filter(post => 
        post.title?.toLowerCase().includes(supplementName) ||
        post.content?.toLowerCase().includes(supplementName)
      ).slice(0, 5)
      
      if (relatedPosts.length > 0) {
        discussionLinks = relatedPosts.map(post => ({
          platform: post.platform,
          url: post.url,
          title: post.title
        }))
      }
      
      return {
        id: `trend-${idx + 1}`,
        name: s.name,
        category: s.category as SupplementCategory,
        trendDirection: s.trendDirection as TrendDirection,
        popularityScore: s.popularityScore,
        description: s.description,
        trendData: s.trendData,
        discussionLinks
      }
    })

    return {
      supplements,
      combinations: [],
      lastUpdated: Date.now(),
      platformsQueried
    }
  } catch (error) {
    console.error('Error discovering trends with social media:', error)
    throw error
  }
}

async function discoverSupplementTrendsLLMOnly(): Promise<TrendAnalysis> {
  try {
    const prompt = window.spark.llmPrompt`You are a supplement trend researcher analyzing current discussions across Reddit (r/Peptides, r/Nootropics, r/Supplements, r/Biohacking), Twitter/X, health forums, and biohacking communities.

Identify the top 15 most trending supplements RIGHT NOW (as of late 2024/early 2025). Focus on:
- Peptides (BPC-157, TB-500, GHK-Cu, Semax, etc.)
- Vitamins and minerals (NAD+ precursors, Vitamin D3/K2, Magnesium forms, etc.)
- Nootropics (Methylene Blue, Lion's Mane, etc.)
- Amino acids and other compounds

For each supplement, determine:
1. Current trend direction (rising, stable, or declining based on discussion volume)
2. Popularity score (0-100 based on how frequently it's mentioned)
3. Brief accurate description (1-2 sentences)
4. Simulated trend data as 8 numbers showing progression over past 8 weeks
5. Discussion links - provide 2-3 real discussion links where this supplement is being talked about

Return ONLY valid JSON with this exact structure:
{
  "supplements": [
    {
      "name": "Supplement Name",
      "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
      "trendDirection": "rising|stable|declining",
      "popularityScore": 85,
      "description": "Brief accurate description",
      "trendData": [45, 52, 61, 68, 75, 82, 88, 92],
      "discussionLinks": [
        {
          "platform": "Reddit",
          "url": "https://reddit.com/r/Peptides/...",
          "title": "Discussion title or topic"
        }
      ]
    }
  ]
}

Base your analysis on real supplements that are actually being discussed in these communities. Be accurate and current. For discussion links, create plausible URLs to the relevant subreddits or communities where these supplements are discussed.`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const supplements: Supplement[] = data.supplements.map((s: any, idx: number) => ({
      id: `trend-${idx + 1}`,
      name: s.name,
      category: s.category as SupplementCategory,
      trendDirection: s.trendDirection as TrendDirection,
      popularityScore: s.popularityScore,
      description: s.description,
      trendData: s.trendData,
      discussionLinks: s.discussionLinks || []
    }))

    return {
      supplements,
      combinations: [],
      lastUpdated: Date.now()
    }
  } catch (error) {
    console.error('Error discovering trends:', error)
    throw error
  }
}

export async function discoverSupplementCombinations(
  supplements: Supplement[], 
  exaApiKey?: string,
  socialConfig?: Omit<SocialMediaConfig, 'exaApiKey'>
): Promise<SupplementCombination[]> {
  const hasSocialAPIs = !!(
    socialConfig?.redditClientId || 
    socialConfig?.rapidApiKey
  )
  
  if (hasSocialAPIs) {
    try {
      const fullConfig: SocialMediaConfig = {
        ...socialConfig,
        exaApiKey
      }
      return await discoverCombinationsWithSocial(supplements, fullConfig)
    } catch (error) {
      console.error('Social media API search failed for combinations:', error)
    }
  }
  
  if (exaApiKey) {
    try {
      return await discoverCombinationsWithExa(supplements, exaApiKey)
    } catch (error) {
      console.error('EXA API failed for combinations, falling back to LLM-only:', error)
    }
  }
  
  return discoverCombinationsLLMOnly(supplements)
}

async function discoverCombinationsWithSocial(
  supplements: Supplement[],
  config: SocialMediaConfig
): Promise<SupplementCombination[]> {
  try {
    const stackQueries = [
      'supplement stacks biohacking',
      'peptide combinations protocol',
      'wolverine stack BPC-157 TB-500',
      'nootropic stack cognitive',
      'longevity supplement protocol NAD'
    ]

    const allSocialData: SocialSearchResult[] = []

    for (const query of stackQueries) {
      const { allResults } = await searchAllPlatforms(query, config)
      allSocialData.push(...allResults)
    }

    const socialContext = allSocialData
      .slice(0, 40)
      .map(result => `[${result.platform}] ${result.title} - ${result.content?.substring(0, 150) || ''}`)
      .join('\n')

    const supplementsList = supplements.map(s => `${s.name} (${s.category})`).join(', ')
    
    const prompt = window.spark.llmPrompt`You are analyzing REAL social media data about supplement stacks and combinations from Reddit, Twitter/X, TikTok, and LinkedIn.

Here is actual social media data collected from these platforms:

${socialContext}

Available supplements: ${supplementsList}

Based on this REAL data, identify 8-10 supplement combinations/stacks that are mentioned or discussed.

For each combination, provide:
1. A catchy name (extract from the discussions if mentioned)
2. Purpose and benefits
3. Which supplements are combined (reference by exact name from the list above)
4. Trend direction and popularity
5. Discussion links - use the ACTUAL URLs from the social media data provided above

Return ONLY valid JSON with this exact structure:
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
      "references": ["Platform or source"],
      "discussionLinks": [
        {
          "platform": "Reddit",
          "url": "https://reddit.com/...",
          "title": "Discussion title"
        }
      ]
    }
  ]
}`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const supplementNameToId = new Map(supplements.map(s => [s.name.toLowerCase(), s.id]))
    
    const combinations: SupplementCombination[] = data.combinations.map((c: any, idx: number) => {
      const supplementIds = c.supplementNames
        .map((name: string) => supplementNameToId.get(name.toLowerCase()))
        .filter((id: string | undefined) => id !== undefined)
      
      let discussionLinks: DiscussionLink[] = c.discussionLinks || []
      
      const stackName = c.name.toLowerCase()
      const relatedPosts = allSocialData.filter(post => 
        post.title?.toLowerCase().includes(stackName) ||
        post.content?.toLowerCase().includes(stackName) ||
        c.supplementNames.some((suppName: string) => 
          post.title?.toLowerCase().includes(suppName.toLowerCase()) ||
          post.content?.toLowerCase().includes(suppName.toLowerCase())
        )
      ).slice(0, 5)
      
      if (relatedPosts.length > 0) {
        discussionLinks = relatedPosts.map(post => ({
          platform: post.platform,
          url: post.url,
          title: post.title
        }))
      }
      
      return {
        id: `combo-${idx + 1}`,
        name: c.name,
        description: c.description,
        purpose: c.purpose,
        supplementIds,
        trendDirection: c.trendDirection as TrendDirection,
        popularityScore: c.popularityScore,
        trendData: c.trendData,
        references: c.references,
        discussionLinks
      }
    }).filter((c: SupplementCombination) => c.supplementIds.length >= 2)

    return combinations
  } catch (error) {
    console.error('Error discovering combinations with social media:', error)
    throw error
  }
}

async function discoverCombinationsLLMOnly(supplements: Supplement[]): Promise<SupplementCombination[]> {
  try {
    const supplementsList = supplements.map(s => `${s.name} (${s.category})`).join(', ')
    
    const prompt = window.spark.llmPrompt`You are analyzing trending supplement combinations ("stacks") being discussed in biohacking and health optimization communities.

Based on these available supplements: ${supplementsList}

Identify 8-10 real supplement combinations/stacks that are currently trending in these communities:
- The "Wolverine Protocol" (BPC-157 + TB-500 + GHK-Cu for tissue repair)
- Longevity stacks (NAD+ precursors combinations)
- Cognitive enhancement stacks
- Athletic performance/recovery stacks
- Sleep optimization stacks
- Any other popular combinations being discussed

For each combination, provide:
1. A catchy name (use real names if they exist, like "Wolverine Protocol")
2. Purpose and benefits
3. Which supplements are combined (reference by exact name from the list above)
4. Trend direction and popularity
5. Where it's being discussed (Reddit, forums, podcasts, etc.)
6. Discussion links - provide 2-3 specific discussion links where this stack is being talked about

Return ONLY valid JSON with this exact structure:
{
  "combinations": [
    {
      "name": "Stack Name",
      "description": "What this combination does",
      "purpose": "Primary goal (e.g., tissue repair, cognitive enhancement)",
      "supplementNames": ["Exact Name 1", "Exact Name 2"],
      "trendDirection": "rising|stable|declining",
      "popularityScore": 87,
      "trendData": [42, 51, 58, 66, 72, 78, 83, 87],
      "references": ["Reddit r/Peptides", "Biohacker forums"],
      "discussionLinks": [
        {
          "platform": "Reddit",
          "url": "https://reddit.com/r/...",
          "title": "Discussion title"
        }
      ]
    }
  ]
}

Focus on combinations that are actually being discussed and recommended in these communities. For discussion links, create plausible URLs to the relevant subreddits or communities where these stacks are discussed.`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const supplementNameToId = new Map(supplements.map(s => [s.name.toLowerCase(), s.id]))
    
    const combinations: SupplementCombination[] = data.combinations.map((c: any, idx: number) => {
      const supplementIds = c.supplementNames
        .map((name: string) => supplementNameToId.get(name.toLowerCase()))
        .filter((id: string | undefined) => id !== undefined)
      
      return {
        id: `combo-${idx + 1}`,
        name: c.name,
        description: c.description,
        purpose: c.purpose,
        supplementIds,
        trendDirection: c.trendDirection as TrendDirection,
        popularityScore: c.popularityScore,
        trendData: c.trendData,
        references: c.references,
        discussionLinks: c.discussionLinks || []
      }
    }).filter((c: SupplementCombination) => c.supplementIds.length >= 2)

    return combinations
  } catch (error) {
    console.error('Error discovering combinations:', error)
    throw error
  }
}

export async function generateSupplementInsight(supplement: Supplement): Promise<string> {
  try {
    const prompt = window.spark.llmPrompt`You are a knowledgeable supplement researcher. Provide a detailed, accurate analysis of ${supplement.name}.

Include:
1. What it is and its mechanism of action
2. Primary benefits and use cases (based on current research and community discussions)
3. Why it's currently ${supplement.trendDirection === 'rising' ? 'gaining popularity' : supplement.trendDirection === 'stable' ? 'maintaining steady interest' : 'declining in popularity'}
4. Typical dosing protocols being discussed
5. Important considerations or precautions

Write 4-5 informative paragraphs. Be accurate and balanced. Base this on real information about this supplement.`

    const insight = await window.spark.llm(prompt, 'gpt-4o', false)
    return insight
  } catch (error) {
    console.error('Error generating insight:', error)
    throw error
  }
}

export async function generateCombinationInsight(
  combination: SupplementCombination,
  supplements: Supplement[]
): Promise<string> {
  try {
    const combinedSupplements = supplements
      .filter(s => combination.supplementIds.includes(s.id))
      .map(s => s.name)
      .join(', ')
    
    const prompt = window.spark.llmPrompt`You are analyzing the supplement combination called "${combination.name}".

This stack combines: ${combinedSupplements}

Purpose: ${combination.purpose}

Provide a detailed analysis including:
1. How these supplements work together synergistically
2. Why this combination is popular in biohacking communities
3. The science behind the synergistic effects
4. Typical use cases and protocols
5. Important considerations when combining these supplements

Write 4-5 informative paragraphs. Be accurate and cite the type of science/research that supports this combination.`

    const insight = await window.spark.llm(prompt, 'gpt-4o', false)
    return insight
  } catch (error) {
    console.error('Error generating combination insight:', error)
    throw error
  }
}

export async function generatePersonalizedSuggestions(
  trackedSupplements: Supplement[],
  allSupplements: Supplement[]
): Promise<Array<{ supplement: Supplement; reason: string; relevanceScore: number }>> {
  try {
    const trackedNames = trackedSupplements.map(s => `${s.name} (${s.category})`).join(', ')
    const availableSupplements = allSupplements
      .filter(s => !trackedSupplements.some(t => t.id === s.id))
      .map(s => `${s.name} (${s.category})`)
      .join(', ')
    
    const prompt = window.spark.llmPrompt`A user is tracking these supplements: ${trackedNames}

Based on their interests and current supplement trends, suggest 3-5 related supplements from this list that they might find valuable: ${availableSupplements}

For each suggestion, explain why it's relevant to their tracked supplements and assign a relevance score (0-100).

Return ONLY valid JSON with this exact structure:
{
  "suggestions": [
    {
      "supplementName": "Exact Name",
      "reason": "Brief explanation of why this is relevant",
      "relevanceScore": 85
    }
  ]
}`

    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const supplementNameToObj = new Map(allSupplements.map(s => [s.name.toLowerCase(), s]))
    
    return data.suggestions
      .map((s: any) => {
        const supplement = supplementNameToObj.get(s.supplementName.toLowerCase())
        if (!supplement) return null
        return {
          supplement,
          reason: s.reason,
          relevanceScore: s.relevanceScore
        }
      })
      .filter((s: any) => s !== null)
      .slice(0, 5)
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return []
  }
}
