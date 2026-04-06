import { Supplement, SupplementCombination, TrendDirection } from './types'

export interface TrendPrediction {
  supplementId: string
  supplementName: string
  currentScore: number
  currentTrend: TrendDirection
  predictions: {
    days45: {
      score: number
      trend: TrendDirection
      confidence: number
      reasoning: string
    }
    days90: {
      score: number
      trend: TrendDirection
      confidence: number
      reasoning: string
    }
    days180: {
      score: number
      trend: TrendDirection
      confidence: number
      reasoning: string
    }
  }
  insights: string[]
}

export interface CombinationPrediction {
  combinationId: string
  combinationName: string
  currentScore: number
  currentTrend: TrendDirection
  predictions: {
    days45: {
      score: number
      trend: TrendDirection
      confidence: number
    }
    days90: {
      score: number
      trend: TrendDirection
      confidence: number
    }
    days180: {
      score: number
      trend: TrendDirection
      confidence: number
    }
  }
  reasoning: string
}

function calculateTrendMomentum(trendData: number[]): number {
  if (trendData.length < 2) return 0
  
  const recent = trendData.slice(-4)
  const older = trendData.slice(0, 4)
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
  
  return ((recentAvg - olderAvg) / olderAvg) * 100
}

function calculateGrowthRate(trendData: number[]): number {
  if (trendData.length < 2) return 0
  
  const first = trendData[0]
  const last = trendData[trendData.length - 1]
  
  return ((last - first) / first) * 100
}

function predictScore(
  currentScore: number,
  momentum: number,
  growthRate: number,
  weeks: number
): number {
  const weeklyChange = (momentum * 0.6 + growthRate * 0.4) / 8
  const predictedScore = currentScore + (weeklyChange * weeks)
  
  return Math.max(0, Math.min(100, predictedScore))
}

function determineTrend(score: number, currentScore: number): TrendDirection {
  const change = score - currentScore
  const changePercent = (change / currentScore) * 100
  
  if (changePercent > 5) return 'rising'
  if (changePercent < -5) return 'declining'
  return 'stable'
}

function calculateConfidence(
  supplement: Supplement,
  momentum: number,
  weeks: number
): number {
  let confidence = 70
  
  if (supplement.discussionLinks && supplement.discussionLinks.length > 0) {
    confidence += 15
  }
  
  if (Math.abs(momentum) > 20) {
    confidence += 10
  }
  
  const volatility = calculateVolatility(supplement.trendData)
  confidence -= volatility * 10
  
  const timeFactor = weeks / 26
  confidence -= timeFactor * 20
  
  return Math.max(30, Math.min(95, confidence))
}

function calculateVolatility(trendData: number[]): number {
  if (trendData.length < 2) return 0
  
  const changes = []
  for (let i = 1; i < trendData.length; i++) {
    changes.push(Math.abs(trendData[i] - trendData[i - 1]))
  }
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length
  const maxChange = Math.max(...changes)
  
  return avgChange / maxChange
}

export async function predictSupplementTrend(
  supplement: Supplement
): Promise<TrendPrediction> {
  const momentum = calculateTrendMomentum(supplement.trendData)
  const growthRate = calculateGrowthRate(supplement.trendData)
  
  const score45 = predictScore(supplement.popularityScore, momentum, growthRate, 6.4)
  const score90 = predictScore(supplement.popularityScore, momentum, growthRate, 12.8)
  const score180 = predictScore(supplement.popularityScore, momentum, growthRate, 25.7)
  
  const trend45 = determineTrend(score45, supplement.popularityScore)
  const trend90 = determineTrend(score90, supplement.popularityScore)
  const trend180 = determineTrend(score180, supplement.popularityScore)
  
  const confidence45 = calculateConfidence(supplement, momentum, 6.4)
  const confidence90 = calculateConfidence(supplement, momentum, 12.8)
  const confidence180 = calculateConfidence(supplement, momentum, 25.7)
  
  const prompt = window.spark.llmPrompt`You are analyzing future trend predictions for the supplement "${supplement.name}".

Current Status:
- Category: ${supplement.category}
- Current Popularity Score: ${supplement.popularityScore}/100
- Current Trend: ${supplement.trendDirection}
- Recent trend data (last 8 weeks): ${supplement.trendData.join(', ')}
- Calculated momentum: ${momentum.toFixed(1)}%
- Growth rate: ${growthRate.toFixed(1)}%

Predicted Scores:
- 45 days: ${score45.toFixed(1)} (${trend45})
- 90 days: ${score90.toFixed(1)} (${trend90})
- 180 days: ${score180.toFixed(1)} (${trend180})

Based on this data and your knowledge of supplement trends, biohacking communities, and health optimization:

1. Provide specific reasoning for the 45-day prediction
2. Provide specific reasoning for the 90-day prediction
3. Provide specific reasoning for the 180-day prediction
4. List 3-5 key insights about factors that will influence this supplement's popularity

Consider:
- Current research developments
- Social media discussion patterns
- Regulatory changes
- Competition from similar supplements
- Seasonal factors
- Community sentiment shifts

Return ONLY valid JSON:
{
  "reasoning45": "Brief explanation for 45-day prediction",
  "reasoning90": "Brief explanation for 90-day prediction",
  "reasoning180": "Brief explanation for 180-day prediction",
  "insights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ]
}`

  const response = await window.spark.llm(prompt, 'gpt-4o', true)
  const analysis = JSON.parse(response)
  
  return {
    supplementId: supplement.id,
    supplementName: supplement.name,
    currentScore: supplement.popularityScore,
    currentTrend: supplement.trendDirection,
    predictions: {
      days45: {
        score: Math.round(score45),
        trend: trend45,
        confidence: Math.round(confidence45),
        reasoning: analysis.reasoning45
      },
      days90: {
        score: Math.round(score90),
        trend: trend90,
        confidence: Math.round(confidence90),
        reasoning: analysis.reasoning90
      },
      days180: {
        score: Math.round(score180),
        trend: trend180,
        confidence: Math.round(confidence180),
        reasoning: analysis.reasoning180
      }
    },
    insights: analysis.insights
  }
}

export async function predictCombinationTrend(
  combination: SupplementCombination,
  supplements: Supplement[]
): Promise<CombinationPrediction> {
  const momentum = calculateTrendMomentum(combination.trendData)
  const growthRate = calculateGrowthRate(combination.trendData)
  
  const score45 = predictScore(combination.popularityScore, momentum, growthRate, 6.4)
  const score90 = predictScore(combination.popularityScore, momentum, growthRate, 12.8)
  const score180 = predictScore(combination.popularityScore, momentum, growthRate, 25.7)
  
  const trend45 = determineTrend(score45, combination.popularityScore)
  const trend90 = determineTrend(score90, combination.popularityScore)
  const trend180 = determineTrend(score180, combination.popularityScore)
  
  const baseConfidence = 65
  const confidence45 = Math.round(baseConfidence)
  const confidence90 = Math.round(baseConfidence - 10)
  const confidence180 = Math.round(baseConfidence - 20)
  
  const componentSupps = supplements
    .filter(s => combination.supplementIds.includes(s.id))
    .map(s => s.name)
    .join(', ')
  
  const prompt = window.spark.llmPrompt`Analyze the future trend for the supplement combination "${combination.name}".

Components: ${componentSupps}
Purpose: ${combination.purpose}
Current Score: ${combination.popularityScore}/100
Current Trend: ${combination.trendDirection}

Predicted future trends:
- 45 days: ${score45.toFixed(1)} (${trend45}, ${confidence45}% confidence)
- 90 days: ${score90.toFixed(1)} (${trend90}, ${confidence90}% confidence)
- 180 days: ${score180.toFixed(1)} (${trend180}, ${confidence180}% confidence)

Provide a detailed analysis of why this combination will follow these trend predictions. Consider synergistic effects, community adoption patterns, and emerging research.

Return ONLY valid JSON:
{
  "reasoning": "2-3 sentence explanation of the predicted trend trajectory"
}`

  const response = await window.spark.llm(prompt, 'gpt-4o', true)
  const analysis = JSON.parse(response)
  
  return {
    combinationId: combination.id,
    combinationName: combination.name,
    currentScore: combination.popularityScore,
    currentTrend: combination.trendDirection,
    predictions: {
      days45: {
        score: Math.round(score45),
        trend: trend45,
        confidence: confidence45
      },
      days90: {
        score: Math.round(score90),
        trend: trend90,
        confidence: confidence90
      },
      days180: {
        score: Math.round(score180),
        trend: trend180,
        confidence: confidence180
      }
    },
    reasoning: analysis.reasoning
  }
}

export async function predictTopEmergingSupplements(
  supplements: Supplement[]
): Promise<Supplement[]> {
  const risingSupplements = supplements
    .filter(s => s.trendDirection === 'rising')
    .map(s => ({
      supplement: s,
      momentum: calculateTrendMomentum(s.trendData),
      growthRate: calculateGrowthRate(s.trendData)
    }))
    .sort((a, b) => {
      const scoreA = a.momentum * 0.6 + a.growthRate * 0.4
      const scoreB = b.momentum * 0.6 + b.growthRate * 0.4
      return scoreB - scoreA
    })
    .slice(0, 5)
    .map(item => item.supplement)
  
  return risingSupplements
}
