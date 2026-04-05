import { Supplement } from './types'

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
