import { Supplement, SupplementCombination } from './types'

export interface ExportOptions {
  includeInsights?: boolean
  includeLinks?: boolean
  includeTrendData?: boolean
}

export function exportToCSV(
  supplements: Supplement[],
  combinations: SupplementCombination[],
  options: ExportOptions = {}
): string {
  const { includeInsights = true, includeLinks = true, includeTrendData = false } = options

  const supplementsSection = [
    '=== SUPPLEMENTS ===',
    generateSupplementsCSV(supplements, { includeInsights, includeLinks, includeTrendData }),
    '',
  ].join('\n')

  const combinationsSection = [
    '=== SUPPLEMENT STACKS ===',
    generateCombinationsCSV(combinations, { includeInsights, includeLinks, includeTrendData }),
  ].join('\n')

  return supplementsSection + '\n' + combinationsSection
}

function generateSupplementsCSV(
  supplements: Supplement[],
  options: ExportOptions
): string {
  const headers = [
    'Name',
    'Category',
    'Trend Direction',
    'Popularity Score',
    'Description',
  ]

  if (options.includeInsights) {
    headers.push('AI Insight')
  }

  if (options.includeTrendData) {
    headers.push('Trend Data (7 days)')
  }

  if (options.includeLinks) {
    headers.push('Discussion Links')
  }

  const rows = supplements.map(supplement => {
    const row = [
      escapeCSV(supplement.name),
      escapeCSV(supplement.category),
      escapeCSV(supplement.trendDirection),
      supplement.popularityScore.toString(),
      escapeCSV(supplement.description),
    ]

    if (options.includeInsights) {
      row.push(escapeCSV(supplement.aiInsight || 'N/A'))
    }

    if (options.includeTrendData) {
      row.push(escapeCSV(supplement.trendData.join(', ')))
    }

    if (options.includeLinks) {
      const links = supplement.discussionLinks
        ? supplement.discussionLinks.map(l => `${l.platform}: ${l.url}`).join('; ')
        : 'N/A'
      row.push(escapeCSV(links))
    }

    return row.join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

function generateCombinationsCSV(
  combinations: SupplementCombination[],
  options: ExportOptions
): string {
  const headers = [
    'Name',
    'Purpose',
    'Components',
    'Trend Direction',
    'Popularity Score',
    'Description',
  ]

  if (options.includeInsights) {
    headers.push('AI Insight')
  }

  if (options.includeTrendData) {
    headers.push('Trend Data (7 days)')
  }

  if (options.includeLinks) {
    headers.push('Discussion Links')
  }

  const rows = combinations.map(combination => {
    const row = [
      escapeCSV(combination.name),
      escapeCSV(combination.purpose),
      escapeCSV(combination.supplementIds.join(', ')),
      escapeCSV(combination.trendDirection),
      combination.popularityScore.toString(),
      escapeCSV(combination.description),
    ]

    if (options.includeInsights) {
      row.push(escapeCSV(combination.aiInsight || 'N/A'))
    }

    if (options.includeTrendData) {
      row.push(escapeCSV(combination.trendData.join(', ')))
    }

    if (options.includeLinks) {
      const links = combination.discussionLinks
        ? combination.discussionLinks.map(l => `${l.platform}: ${l.url}`).join('; ')
        : 'N/A'
      row.push(escapeCSV(links))
    }

    return row.join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function exportToPDF(
  supplements: Supplement[],
  combinations: SupplementCombination[],
  options: ExportOptions = {}
): Promise<Blob> {
  const { includeInsights = true, includeLinks = true } = options

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TrendPulse Report - ${currentDate}</title>
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 3px solid #3b82f6;
    }
    
    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #1e40af;
      font-weight: 700;
    }
    
    .header .subtitle {
      margin: 0.5rem 0 0;
      font-size: 1.1rem;
      color: #64748b;
    }
    
    .header .date {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      color: #94a3b8;
    }
    
    .section {
      margin-bottom: 3rem;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
    
    .supplement-card, .combination-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: #0f172a;
    }
    
    .card-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0.25rem 0 0;
      text-transform: capitalize;
    }
    
    .badge-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .badge-rising {
      background: #dcfce7;
      color: #166534;
    }
    
    .badge-stable {
      background: #fef3c7;
      color: #854d0e;
    }
    
    .badge-declining {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .badge-score {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .description {
      color: #475569;
      margin: 0.75rem 0;
      line-height: 1.6;
    }
    
    .purpose {
      background: #f8fafc;
      border-left: 3px solid #3b82f6;
      padding: 0.75rem 1rem;
      margin: 0.75rem 0;
      font-style: italic;
      color: #334155;
    }
    
    .components {
      margin: 0.75rem 0;
      color: #475569;
    }
    
    .components strong {
      color: #0f172a;
    }
    
    .insight {
      background: #f0f9ff;
      border-left: 3px solid #0ea5e9;
      padding: 1rem;
      margin-top: 0.75rem;
      border-radius: 4px;
    }
    
    .insight-title {
      font-weight: 600;
      color: #0c4a6e;
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .insight-text {
      color: #334155;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .links {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .links-title {
      font-weight: 600;
      color: #475569;
      margin: 0 0 0.5rem;
      font-size: 0.875rem;
    }
    
    .link-item {
      margin: 0.25rem 0;
      font-size: 0.85rem;
      color: #3b82f6;
      word-break: break-all;
    }
    
    .link-platform {
      font-weight: 600;
      color: #64748b;
      margin-right: 0.5rem;
    }
    
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
      page-break-inside: avoid;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.25rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }
    
    .stat-label {
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
      opacity: 0.9;
    }
    
    @media print {
      .supplement-card, .combination-card {
        page-break-inside: avoid;
      }
      
      .section {
        page-break-after: auto;
      }
      
      a {
        color: #3b82f6;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TrendPulse Report</h1>
    <p class="subtitle">AI-Powered Supplement Trend Discovery</p>
    <p class="date">Generated on ${currentDate}</p>
  </div>

  <div class="summary-stats">
    <div class="stat-card">
      <p class="stat-value">${supplements.length}</p>
      <p class="stat-label">Supplements Tracked</p>
    </div>
    <div class="stat-card">
      <p class="stat-value">${combinations.length}</p>
      <p class="stat-label">Supplement Stacks</p>
    </div>
    <div class="stat-card">
      <p class="stat-value">${supplements.filter(s => s.trendDirection === 'rising').length}</p>
      <p class="stat-label">Rising Trends</p>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📊 Supplement Trends</h2>
    ${supplements
      .map(
        supplement => `
      <div class="supplement-card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${supplement.name}</h3>
            <p class="card-subtitle">${supplement.category}</p>
          </div>
          <div class="badge-group">
            <span class="badge badge-${supplement.trendDirection}">${supplement.trendDirection}</span>
            <span class="badge badge-score">Score: ${supplement.popularityScore}</span>
          </div>
        </div>
        <p class="description">${supplement.description}</p>
        ${
          includeInsights && supplement.aiInsight
            ? `
        <div class="insight">
          <p class="insight-title">AI Insight</p>
          <p class="insight-text">${supplement.aiInsight}</p>
        </div>
        `
            : ''
        }
        ${
          includeLinks && supplement.discussionLinks && supplement.discussionLinks.length > 0
            ? `
        <div class="links">
          <p class="links-title">Discussion Sources:</p>
          ${supplement.discussionLinks
            .map(
              link => `
            <div class="link-item">
              <span class="link-platform">[${link.platform}]</span>
              <a href="${link.url}" target="_blank">${link.title}</a>
            </div>
          `
            )
            .join('')}
        </div>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>

  <div class="section">
    <h2 class="section-title">🔬 Supplement Stacks</h2>
    ${combinations
      .map(
        combination => `
      <div class="combination-card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${combination.name}</h3>
          </div>
          <div class="badge-group">
            <span class="badge badge-${combination.trendDirection}">${combination.trendDirection}</span>
            <span class="badge badge-score">Score: ${combination.popularityScore}</span>
          </div>
        </div>
        <div class="purpose">${combination.purpose}</div>
        <p class="description">${combination.description}</p>
        <div class="components">
          <strong>Components:</strong> ${combination.supplementIds.join(', ')}
        </div>
        ${
          includeInsights && combination.aiInsight
            ? `
        <div class="insight">
          <p class="insight-title">AI Insight</p>
          <p class="insight-text">${combination.aiInsight}</p>
        </div>
        `
            : ''
        }
        ${
          includeLinks && combination.discussionLinks && combination.discussionLinks.length > 0
            ? `
        <div class="links">
          <p class="links-title">Discussion Sources:</p>
          ${combination.discussionLinks
            .map(
              link => `
            <div class="link-item">
              <span class="link-platform">[${link.platform}]</span>
              <a href="${link.url}" target="_blank">${link.title}</a>
            </div>
          `
            )
            .join('')}
        </div>
        `
            : ''
        }
      </div>
    `
      )
      .join('')}
  </div>

  <div class="footer">
    <p>This report was generated by TrendPulse - AI-Powered Supplement Trend Discovery</p>
    <p>Data is for informational purposes only. Consult healthcare professionals before starting any supplement regimen.</p>
  </div>
</body>
</html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  return blob
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateFilename(type: 'csv' | 'pdf'): string {
  const date = new Date().toISOString().split('T')[0]
  return `trendpulse-report-${date}.${type}`
}
