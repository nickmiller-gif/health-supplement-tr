import { Supplement, SupplementCombination } from './types'

export const INITIAL_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'BPC-157',
    category: 'peptide',
    trendDirection: 'rising',
    popularityScore: 92,
    description: 'A peptide derived from a protective stomach protein, studied for tissue repair and gut health.',
    trendData: [45, 52, 61, 68, 75, 82, 88, 92]
  },
  {
    id: '2',
    name: 'NAD+ Precursors',
    category: 'vitamin',
    trendDirection: 'rising',
    popularityScore: 88,
    description: 'Compounds like NMN and NR that boost cellular NAD+ levels for energy and longevity.',
    trendData: [55, 60, 65, 70, 76, 81, 85, 88]
  },
  {
    id: '3',
    name: 'Methylene Blue',
    category: 'nootropic',
    trendDirection: 'rising',
    popularityScore: 85,
    description: 'A mitochondrial enhancer gaining attention for cognitive performance and neuroprotection.',
    trendData: [30, 38, 48, 58, 68, 75, 81, 85]
  },
  {
    id: '4',
    name: 'Thymosin Beta-4',
    category: 'peptide',
    trendDirection: 'rising',
    popularityScore: 79,
    description: 'A regenerative peptide known for wound healing and tissue repair applications.',
    trendData: [40, 47, 54, 60, 67, 72, 76, 79]
  },
  {
    id: '5',
    name: 'Vitamin D3 + K2',
    category: 'vitamin',
    trendDirection: 'stable',
    popularityScore: 76,
    description: 'Synergistic combination for bone health, calcium regulation, and immune function.',
    trendData: [72, 74, 75, 76, 77, 76, 76, 76]
  },
  {
    id: '6',
    name: 'Magnesium Threonate',
    category: 'mineral',
    trendDirection: 'rising',
    popularityScore: 74,
    description: 'A highly bioavailable form of magnesium that crosses the blood-brain barrier for cognitive support.',
    trendData: [42, 49, 55, 60, 65, 69, 72, 74]
  },
  {
    id: '7',
    name: 'L-Theanine',
    category: 'amino-acid',
    trendDirection: 'stable',
    popularityScore: 71,
    description: 'An amino acid from tea that promotes calm focus and reduces stress without sedation.',
    trendData: [68, 69, 70, 71, 72, 71, 71, 71]
  },
  {
    id: '8',
    name: 'Semax',
    category: 'nootropic',
    trendDirection: 'rising',
    popularityScore: 68,
    description: 'A synthetic peptide used for cognitive enhancement, focus, and neuroplasticity.',
    trendData: [35, 42, 48, 53, 58, 62, 65, 68]
  },
  {
    id: '9',
    name: 'Quercetin',
    category: 'other',
    trendDirection: 'stable',
    popularityScore: 65,
    description: 'A plant flavonoid with antioxidant and anti-inflammatory properties.',
    trendData: [62, 63, 64, 65, 66, 65, 65, 65]
  },
  {
    id: '10',
    name: 'Berberine',
    category: 'other',
    trendDirection: 'declining',
    popularityScore: 62,
    description: 'A plant compound studied for blood sugar regulation and metabolic health.',
    trendData: [75, 73, 70, 68, 66, 64, 63, 62]
  },
  {
    id: '11',
    name: 'GHK-Cu',
    category: 'peptide',
    trendDirection: 'rising',
    popularityScore: 61,
    description: 'A copper peptide recognized for skin rejuvenation and tissue remodeling properties.',
    trendData: [28, 34, 41, 47, 52, 56, 59, 61]
  },
  {
    id: '12',
    name: 'Methylfolate',
    category: 'vitamin',
    trendDirection: 'stable',
    popularityScore: 58,
    description: 'The bioactive form of folate, crucial for methylation and genetic expression.',
    trendData: [56, 57, 58, 58, 59, 58, 58, 58]
  }
]

export const SUPPLEMENT_COMBINATIONS: SupplementCombination[] = [
  {
    id: 'combo-1',
    name: 'Wolverine Protocol',
    description: 'A powerful regenerative stack combining three peptides for enhanced tissue repair and recovery.',
    purpose: 'Accelerated healing, injury recovery, anti-aging',
    supplementIds: ['1', '4', '11'],
    trendDirection: 'rising',
    popularityScore: 87,
    trendData: [42, 51, 58, 66, 72, 78, 83, 87],
    references: [
      'Reddit r/Peptides',
      'Biohacker forums',
      'Athletic recovery communities'
    ]
  },
  {
    id: 'combo-2',
    name: 'Cognitive Enhancement Stack',
    description: 'Combines mitochondrial support with nootropic peptides for peak mental performance.',
    purpose: 'Focus, memory, neuroprotection',
    supplementIds: ['3', '8', '6'],
    trendDirection: 'rising',
    popularityScore: 79,
    trendData: [35, 44, 52, 59, 65, 71, 76, 79],
    references: [
      'Nootropics subreddit',
      'Biohacking podcasts',
      'Quantified self blogs'
    ]
  },
  {
    id: 'combo-3',
    name: 'Longevity Foundation',
    description: 'Core vitamins and NAD+ boosters for cellular health and aging optimization.',
    purpose: 'Anti-aging, cellular energy, healthspan',
    supplementIds: ['2', '5', '9'],
    trendDirection: 'rising',
    popularityScore: 82,
    trendData: [58, 62, 67, 71, 75, 78, 80, 82],
    references: [
      'Longevity research forums',
      'Peter Attia podcast',
      'David Sinclair discussions'
    ]
  },
  {
    id: 'combo-4',
    name: 'Calm Focus Protocol',
    description: 'Natural nootropics for relaxed concentration without jitters or crashes.',
    purpose: 'Sustained focus, stress reduction, mood balance',
    supplementIds: ['7', '6', '3'],
    trendDirection: 'stable',
    popularityScore: 73,
    trendData: [68, 70, 71, 73, 74, 73, 73, 73],
    references: [
      'Productivity forums',
      'ADHD support groups',
      'Student study communities'
    ]
  },
  {
    id: 'combo-5',
    name: 'Metabolic Optimizer',
    description: 'Compounds targeting blood sugar, mitochondrial function, and metabolic health.',
    purpose: 'Glucose control, energy metabolism, weight management',
    supplementIds: ['10', '2', '9'],
    trendDirection: 'declining',
    popularityScore: 68,
    trendData: [78, 76, 74, 72, 70, 69, 68, 68],
    references: [
      'Fitness communities',
      'Type 2 diabetes forums',
      'Keto diet groups'
    ]
  }
]
