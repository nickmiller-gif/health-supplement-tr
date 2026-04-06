import { SupplementCategory, TrendDirection } from './types'

export interface ResearchArticle {
  title: string
  authors: string[]
  journal: string
  publicationDate: string
  pmid?: string
  doi?: string
  abstract: string
  url: string
  relevanceScore: number
  citationCount?: number
}

export interface EmergingSupplementSignal {
  id: string
  name: string
  category: SupplementCategory
  emergenceScore: number
  timeToTrend: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months'
  researchArticles: ResearchArticle[]
  signalStrength: 'weak' | 'moderate' | 'strong' | 'very-strong'
  description: string
  potentialBenefits: string[]
  researchPhase: 'pre-clinical' | 'clinical-trials' | 'recent-clinical' | 'meta-analysis'
  confidenceScore: number
  reasoning: string
}

interface CachedResearchResult {
  data: any
  timestamp: number
}

const PUBMED_API_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 3
const CACHE_KEY_PREFIX = 'research-cache-'

function getCacheKey(query: string): string {
  return `${CACHE_KEY_PREFIX}${query.toLowerCase().replace(/\s+/g, '-')}`
}

async function getCachedResult(query: string): Promise<any | null> {
  try {
    const cacheKey = getCacheKey(query)
    const cached = await window.spark.kv.get<CachedResearchResult>(cacheKey)
    
    if (!cached) {
      return null
    }
    
    const age = Date.now() - cached.timestamp
    if (age > CACHE_DURATION) {
      await window.spark.kv.delete(cacheKey)
      return null
    }
    
    console.log(`Using cached research result for: ${query}`)
    return cached.data
  } catch (error) {
    console.error('Error reading research cache:', error)
    return null
  }
}

async function setCachedResult(query: string, data: any): Promise<void> {
  try {
    const cacheKey = getCacheKey(query)
    const cached: CachedResearchResult = {
      data,
      timestamp: Date.now()
    }
    await window.spark.kv.set(cacheKey, cached)
  } catch (error) {
    console.error('Error writing research cache:', error)
  }
}

async function searchPubMed(query: string, maxResults: number = 20): Promise<string[]> {
  const cachedIds = await getCachedResult(`pubmed-ids-${query}`)
  if (cachedIds) {
    return cachedIds
  }

  const currentYear = new Date().getFullYear()
  const lastYear = currentYear - 1
  
  const searchUrl = `${PUBMED_API_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}+AND+${lastYear}:${currentYear}[pdat]&retmax=${maxResults}&retmode=json&sort=date`
  
  try {
    const response = await fetch(searchUrl)
    if (!response.ok) {
      throw new Error(`PubMed search failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    const ids = data.esearchresult?.idlist || []
    
    await setCachedResult(`pubmed-ids-${query}`, ids)
    return ids
  } catch (error) {
    console.error('PubMed search error:', error)
    return []
  }
}

async function fetchPubMedDetails(ids: string[]): Promise<ResearchArticle[]> {
  if (ids.length === 0) return []
  
  const cachedDetails = await getCachedResult(`pubmed-details-${ids.join(',')}`)
  if (cachedDetails) {
    return cachedDetails
  }

  const fetchUrl = `${PUBMED_API_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
  
  try {
    const response = await fetch(fetchUrl)
    if (!response.ok) {
      throw new Error(`PubMed fetch failed: ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    const articles = parsePubMedXML(xmlText)
    
    await setCachedResult(`pubmed-details-${ids.join(',')}`, articles)
    return articles
  } catch (error) {
    console.error('PubMed fetch error:', error)
    return []
  }
}

function parsePubMedXML(xmlText: string): ResearchArticle[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  const articles: ResearchArticle[] = []
  
  const articleElements = xmlDoc.getElementsByTagName('PubmedArticle')
  
  for (let i = 0; i < articleElements.length; i++) {
    const articleEl = articleElements[i]
    
    try {
      const pmid = articleEl.getElementsByTagName('PMID')[0]?.textContent || ''
      const articleTitle = articleEl.getElementsByTagName('ArticleTitle')[0]?.textContent || 'Unknown Title'
      const abstractText = articleEl.getElementsByTagName('AbstractText')[0]?.textContent || 'No abstract available'
      
      const authorList = articleEl.getElementsByTagName('Author')
      const authors: string[] = []
      for (let j = 0; j < Math.min(authorList.length, 3); j++) {
        const lastName = authorList[j].getElementsByTagName('LastName')[0]?.textContent || ''
        const initials = authorList[j].getElementsByTagName('Initials')[0]?.textContent || ''
        if (lastName) {
          authors.push(`${lastName} ${initials}`.trim())
        }
      }
      
      const journalTitle = articleEl.getElementsByTagName('Title')[0]?.textContent || 'Unknown Journal'
      
      const pubDateEl = articleEl.getElementsByTagName('PubDate')[0]
      let pubDate = ''
      if (pubDateEl) {
        const year = pubDateEl.getElementsByTagName('Year')[0]?.textContent || ''
        const month = pubDateEl.getElementsByTagName('Month')[0]?.textContent || ''
        pubDate = `${month} ${year}`.trim() || year
      }
      
      const articleIdList = articleEl.getElementsByTagName('ArticleId')
      let doi = ''
      for (let j = 0; j < articleIdList.length; j++) {
        if (articleIdList[j].getAttribute('IdType') === 'doi') {
          doi = articleIdList[j].textContent || ''
          break
        }
      }
      
      articles.push({
        title: articleTitle,
        authors,
        journal: journalTitle,
        publicationDate: pubDate,
        pmid,
        doi,
        abstract: abstractText,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        relevanceScore: 85,
      })
    } catch (err) {
      console.error('Error parsing article:', err)
    }
  }
  
  return articles
}

async function searchWithExa(query: string, exaApiKey?: string): Promise<ResearchArticle[]> {
  if (!exaApiKey) return []
  
  const cachedResults = await getCachedResult(`exa-research-${query}`)
  if (cachedResults) {
    return cachedResults
  }

  try {
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': exaApiKey,
      },
      body: JSON.stringify({
        query: `${query} research study clinical trial site:nih.gov OR site:nature.com OR site:thelancet.com OR site:jamanetwork.com`,
        numResults: 15,
        type: 'auto',
        useAutoprompt: true,
        contents: {
          text: { maxCharacters: 2000 },
          highlights: { numSentences: 5 }
        }
      })
    })

    if (!response.ok) {
      throw new Error(`EXA research search failed: ${response.statusText}`)
    }

    const data = await response.json()
    const articles: ResearchArticle[] = data.results.map((result: any) => ({
      title: result.title,
      authors: [],
      journal: new URL(result.url).hostname,
      publicationDate: result.publishedDate || 'Recent',
      abstract: result.text || result.highlights?.join(' ') || '',
      url: result.url,
      relevanceScore: 80,
    }))
    
    await setCachedResult(`exa-research-${query}`, articles)
    return articles
  } catch (error) {
    console.error('EXA research search error:', error)
    return []
  }
}

export async function discoverEmergingSupplements(
  exaApiKey?: string
): Promise<EmergingSupplementSignal[]> {
  const researchQueries = [
    'novel peptide therapeutic benefits',
    'NAD+ precursor longevity clinical trial',
    'nootropic cognitive enhancement study',
    'senolytic supplement research',
    'mitochondrial function supplement',
    'autophagy inducing compound',
    'neuroprotective peptide',
    'muscle growth peptide study',
    'anti-aging supplement clinical',
    'cognitive decline prevention supplement'
  ]

  console.log('Searching PubMed and research databases for emerging supplements...')
  
  const allArticles: Map<string, ResearchArticle[]> = new Map()

  for (const query of researchQueries.slice(0, 5)) {
    const pubmedIds = await searchPubMed(query, 10)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const pubmedArticles = await fetchPubMedDetails(pubmedIds.slice(0, 5))
    
    const exaArticles = exaApiKey ? await searchWithExa(query, exaApiKey) : []
    
    const combinedArticles = [...pubmedArticles, ...exaArticles]
    allArticles.set(query, combinedArticles)
  }

  const allResearchArticles = Array.from(allArticles.values()).flat()
  
  if (allResearchArticles.length === 0) {
    console.log('No research articles found, using AI to generate emerging trends')
    return generateAIEmergingSupplements()
  }

  const researchContext = allResearchArticles.slice(0, 30).map(article => ({
    title: article.title,
    journal: article.journal,
    date: article.publicationDate,
    abstract: article.abstract.substring(0, 500),
    url: article.url
  }))

  const prompt = window.spark.llmPrompt`You are analyzing recent scientific research to identify EMERGING supplements that haven't hit mainstream yet but show strong potential based on new studies.

Recent research articles from PubMed, Nature, Lancet, and other journals:

${JSON.stringify(researchContext, null, 2)}

Based on these REAL research articles, identify 8-12 emerging supplements, peptides, or compounds that:
1. Have recent clinical or pre-clinical research (published in last 12-24 months)
2. Show promising results but aren't yet mainstream in biohacking communities
3. Could become trending in the next 3-12 months

For each emerging supplement:
- Name the specific compound mentioned in research
- Estimate when it might trend based on research phase and current awareness
- Rate the signal strength based on quality/quantity of research
- Assign confidence based on evidence quality

Return ONLY valid JSON:
{
  "emergingSupplements": [
    {
      "name": "Compound Name",
      "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
      "emergenceScore": 75,
      "timeToTrend": "1-3 months|3-6 months|6-12 months|12+ months",
      "signalStrength": "weak|moderate|strong|very-strong",
      "description": "What this compound is and does",
      "potentialBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "researchPhase": "pre-clinical|clinical-trials|recent-clinical|meta-analysis",
      "confidenceScore": 78,
      "reasoning": "Why this will trend soon based on research timing and results"
    }
  ]
}`

  try {
    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const emergingSupplements: EmergingSupplementSignal[] = data.emergingSupplements.map((supp: any, idx: number) => {
      const suppName = supp.name.toLowerCase()
      const relatedArticles = allResearchArticles.filter(article => {
        const searchText = (article.title + ' ' + article.abstract).toLowerCase()
        return searchText.includes(suppName) || 
               supp.potentialBenefits.some((benefit: string) => 
                 searchText.includes(benefit.toLowerCase().substring(0, 15))
               )
      }).slice(0, 5)

      return {
        id: `emerging-${idx + 1}`,
        name: supp.name,
        category: supp.category as SupplementCategory,
        emergenceScore: supp.emergenceScore,
        timeToTrend: supp.timeToTrend,
        researchArticles: relatedArticles.length > 0 ? relatedArticles : [],
        signalStrength: supp.signalStrength,
        description: supp.description,
        potentialBenefits: supp.potentialBenefits,
        researchPhase: supp.researchPhase,
        confidenceScore: supp.confidenceScore,
        reasoning: supp.reasoning
      }
    })

    return emergingSupplements
  } catch (error) {
    console.error('Error analyzing research for emerging supplements:', error)
    return generateAIEmergingSupplements()
  }
}

async function generateAIEmergingSupplements(): Promise<EmergingSupplementSignal[]> {
  const prompt = window.spark.llmPrompt`You are a supplement research analyst identifying emerging compounds that have recent research but haven't yet gone mainstream.

Based on your knowledge of recent supplement research (2023-2025), identify 8-12 emerging supplements that:
1. Have promising recent research
2. Aren't yet widely discussed in biohacking communities
3. Could trend in the next 3-12 months based on research momentum

Focus on compounds with actual research backing, not speculative trends.

Return ONLY valid JSON:
{
  "emergingSupplements": [
    {
      "name": "Compound Name",
      "category": "peptide|vitamin|mineral|nootropic|amino-acid|other",
      "emergenceScore": 75,
      "timeToTrend": "1-3 months|3-6 months|6-12 months|12+ months",
      "signalStrength": "weak|moderate|strong|very-strong",
      "description": "What this compound is and does",
      "potentialBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "researchPhase": "pre-clinical|clinical-trials|recent-clinical|meta-analysis",
      "confidenceScore": 78,
      "reasoning": "Why this will trend soon based on research timing and results"
    }
  ]
}`

  try {
    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    const emergingSupplements: EmergingSupplementSignal[] = data.emergingSupplements.map((supp: any, idx: number) => ({
      id: `emerging-ai-${idx + 1}`,
      name: supp.name,
      category: supp.category as SupplementCategory,
      emergenceScore: supp.emergenceScore,
      timeToTrend: supp.timeToTrend,
      researchArticles: [],
      signalStrength: supp.signalStrength,
      description: supp.description,
      potentialBenefits: supp.potentialBenefits,
      researchPhase: supp.researchPhase,
      confidenceScore: supp.confidenceScore,
      reasoning: supp.reasoning
    }))

    return emergingSupplements
  } catch (error) {
    console.error('Error generating AI emerging supplements:', error)
    return []
  }
}

export async function getResearchInsight(supplement: EmergingSupplementSignal): Promise<string> {
  const researchSummary = supplement.researchArticles.length > 0
    ? supplement.researchArticles.map(a => `"${a.title}" (${a.journal}, ${a.publicationDate})`).join('\n')
    : 'Research articles not yet indexed in this analysis'

  const prompt = window.spark.llmPrompt`You are analyzing the emerging supplement: ${supplement.name}

Research Phase: ${supplement.researchPhase}
Signal Strength: ${supplement.signalStrength}
Estimated Time to Trend: ${supplement.timeToTrend}

Related Research:
${researchSummary}

Potential Benefits:
${supplement.potentialBenefits.join(', ')}

Provide a detailed analysis including:
1. Why this compound is emerging now based on recent research
2. The scientific mechanisms and evidence for its benefits
3. What research phase it's in and what that means
4. When and why it's likely to become mainstream
5. Important considerations for early adopters

Write 4-5 informative paragraphs. Focus on the research signals and timing.`

  try {
    const insight = await window.spark.llm(prompt, 'gpt-4o', false)
    return insight
  } catch (error) {
    console.error('Error generating research insight:', error)
    return 'Unable to generate insight at this time.'
  }
}

export async function clearResearchCache(): Promise<number> {
  try {
    const allKeys = await window.spark.kv.keys()
    const researchKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    for (const key of researchKeys) {
      await window.spark.kv.delete(key)
    }
    
    return researchKeys.length
  } catch (error) {
    console.error('Error clearing research cache:', error)
    return 0
  }
}

export async function getResearchCacheStats(): Promise<{
  totalCached: number
  oldestCache: number | null
  newestCache: number | null
}> {
  try {
    const allKeys = await window.spark.kv.keys()
    const researchKeys = allKeys.filter(key => key.startsWith(CACHE_KEY_PREFIX))
    
    let oldest: number | null = null
    let newest: number | null = null
    
    for (const key of researchKeys) {
      const cached = await window.spark.kv.get<CachedResearchResult>(key)
      if (cached?.timestamp) {
        if (!oldest || cached.timestamp < oldest) oldest = cached.timestamp
        if (!newest || cached.timestamp > newest) newest = cached.timestamp
      }
    }
    
    return {
      totalCached: researchKeys.length,
      oldestCache: oldest,
      newestCache: newest
    }
  } catch (error) {
    console.error('Error getting research cache stats:', error)
    return { totalCached: 0, oldestCache: null, newestCache: null }
  }
}
