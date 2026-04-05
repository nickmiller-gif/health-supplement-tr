import { Supplement, SupplementCombination, TrendDirection, SupplementCategory } from './types'

interface TrendAnalysis {
  supplements: Supplement[]
  combinations: SupplementCombination[]
  lastUpdated: number
}

const CACHE_DURATION = 1000 * 60 * 30

export async function discoverSupplementTrends(): Promise<TrendAnalysis> {
  try {
    const prompt = spark.llmPrompt`You are a supplement trend researcher analyzing current discussions across Reddit (r/Peptides, r/Nootropics, r/Supplements, r/Biohacking), Twitter/X, health forums, and biohacking communities.

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

Return ONLY valid JSON with this exact structure:
{
  "supplements": [
    {
      "name": "Supplement Name",
      "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
      "trendDirection": "rising|stable|declining",
      "popularityScore": 85,
      "description": "Brief accurate description",
      "trendData": [45, 52, 61, 68, 75, 82, 88, 92]
    }
  ]
}

Base your analysis on real supplements that are actually being discussed in these communities. Be accurate and current.`

    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const supplements: Supplement[] = data.supplements.map((s: any, idx: number) => ({
      id: `trend-${idx + 1}`,
      name: s.name,
      category: s.category as SupplementCategory,
      trendDirection: s.trendDirection as TrendDirection,
      popularityScore: s.popularityScore,
      description: s.description,
      trendData: s.trendData
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

export async function discoverSupplementCombinations(supplements: Supplement[]): Promise<SupplementCombination[]> {
  try {
    const supplementsList = supplements.map(s => `${s.name} (${s.category})`).join(', ')
    
    const prompt = spark.llmPrompt`You are analyzing trending supplement combinations ("stacks") being discussed in biohacking and health optimization communities.

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
      "references": ["Reddit r/Peptides", "Biohacker forums"]
    }
  ]
}

Focus on combinations that are actually being discussed and recommended in these communities.`

    const response = await spark.llm(prompt, 'gpt-4o', true)
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
        references: c.references
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
    const prompt = spark.llmPrompt`You are a knowledgeable supplement researcher. Provide a detailed, accurate analysis of ${supplement.name}.

Include:
1. What it is and its mechanism of action
2. Primary benefits and use cases (based on current research and community discussions)
3. Why it's currently ${supplement.trendDirection === 'rising' ? 'gaining popularity' : supplement.trendDirection === 'stable' ? 'maintaining steady interest' : 'declining in popularity'}
4. Typical dosing protocols being discussed
5. Important considerations or precautions

Write 4-5 informative paragraphs. Be accurate and balanced. Base this on real information about this supplement.`

    const insight = await spark.llm(prompt, 'gpt-4o', false)
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
    
    const prompt = spark.llmPrompt`You are analyzing the supplement combination called "${combination.name}".

This stack combines: ${combinedSupplements}

Purpose: ${combination.purpose}

Provide a detailed analysis including:
1. How these supplements work together synergistically
2. Why this combination is popular in biohacking communities
3. The science behind the synergistic effects
4. Typical use cases and protocols
5. Important considerations when combining these supplements

Write 4-5 informative paragraphs. Be accurate and cite the type of science/research that supports this combination.`

    const insight = await spark.llm(prompt, 'gpt-4o', false)
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
    
    const prompt = spark.llmPrompt`A user is tracking these supplements: ${trackedNames}

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

    const response = await spark.llm(prompt, 'gpt-4o', true)
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
