# Research-Based Trend Prediction

## Overview

TrendPulse now includes **Research Signal Detection** - a powerful feature that predicts supplement trends **before they happen** by analyzing recent scientific research publications.

## How It Works

### Data Sources

1. **PubMed API** (Free, No API key needed)
   - Access to 35+ million biomedical literature citations
   - Automatically searches publications from the last 12-24 months
   - Filters by publication date to find the newest research
   - Provides article metadata, abstracts, and direct links

2. **EXA API** (Optional, enhances results)
   - Searches premium research sites: nature.com, thelancet.com, nih.gov
   - Finds research articles that may not be indexed in PubMed yet
   - Provides full-text snippets and highlights
   - Combines with PubMed for comprehensive coverage

### The Prediction Model

The system identifies emerging supplements using a multi-factor analysis:

1. **Research Timing**
   - Recent publications (last 12-24 months) indicate emerging interest
   - Research phase (pre-clinical → clinical trials → meta-analysis) shows maturity
   - Publication momentum suggests growing scientific attention

2. **Signal Strength** (Weak → Moderate → Strong → Very Strong)
   - Based on number of publications
   - Quality of journals
   - Research phase completion
   - Citation patterns

3. **Time-to-Trend Prediction**
   - **1-3 months**: Clinical trials completed, meta-analysis published
   - **3-6 months**: Recent positive clinical results, awaiting validation
   - **6-12 months**: Early clinical trials showing promise
   - **12+ months**: Pre-clinical or early-stage research

4. **Confidence Score** (30-95%)
   - Higher for compounds with multiple high-quality studies
   - Lower for single studies or pre-clinical only
   - Adjusted based on research phase and publication venues

## Key Features

### Early Detection
Unlike social media trend discovery (which shows what's trending NOW), research signals predict what WILL trend in the future. By the time a supplement hits Reddit and TikTok, early adopters have already been using it for months.

### Real Research Links
Every emerging supplement includes links to actual research articles:
- Direct PubMed URLs to view abstracts and full studies
- Journal names and publication dates
- Author information
- Research abstracts

### Filtering by Research Phase
- **Pre-clinical**: Animal studies, in vitro research
- **Clinical Trials**: Human trials in progress
- **Recent Clinical**: Completed human studies with results
- **Meta-Analysis**: Comprehensive review of multiple studies

### AI-Powered Analysis
The system uses AI to:
- Analyze research abstracts to understand compound benefits
- Identify potential use cases from study objectives
- Predict adoption timeline based on research maturity
- Explain WHY each compound will likely trend

## Use Cases

### For Biohackers
Discover promising compounds before they become expensive or hard to source due to mainstream popularity.

### For Supplement Companies
Identify emerging ingredients for product development 6-12 months before competitors.

### For Researchers
Track which compounds are gaining scientific attention and might merit further investigation.

### For Health Enthusiasts
Stay informed about cutting-edge supplement research before it reaches popular media.

## Example Research Signals

**Example 1: Urolithin A**
- Signal Strength: Very Strong
- Time to Trend: 1-3 months
- Research Phase: Recent Clinical
- Why: Multiple 2024 clinical trials showing mitochondrial benefits, appearing in Nature and Cell Metabolism

**Example 2: GDF11 Peptide**
- Signal Strength: Moderate
- Time to Trend: 6-12 months
- Research Phase: Clinical Trials
- Why: Early human trials for aging, following successful animal studies published in Science

**Example 3: Ergothioneine**
- Signal Strength: Strong
- Time to Trend: 3-6 months
- Research Phase: Meta-Analysis
- Why: 2024 meta-analysis consolidating cognitive benefits, multiple mechanisms identified

## Advantages Over Social Trends

| Social Media Trends | Research Signals |
|---------------------|------------------|
| Shows current popularity | Predicts future trends |
| 0-3 month time horizon | 3-12 month time horizon |
| Based on discussion volume | Based on scientific evidence |
| Can be hype-driven | Evidence-based |
| Late to discover | Early warning system |

## Data Privacy & Cost

- **PubMed**: Completely free, no API key required, unlimited searches
- **EXA** (Optional): Requires API key, $10/month for 1000 searches
- **No Data Collection**: All searches are stateless, no personal data stored
- **Cached Results**: 3-day cache to minimize API calls and improve performance

## How to Use

1. Navigate to the "Research Signals" tab
2. Click "Scan Research" to discover emerging supplements
3. Review the emergence scores and time-to-trend predictions
4. Click "View Research" on any supplement to see:
   - Full research analysis
   - Linked PubMed articles
   - Predicted timeline and reasoning
   - Potential benefits identified from studies

## Technical Implementation

- **PubMed E-utilities API**: Official NIH API for literature searches
- **XML Parsing**: Extracts article metadata from PubMed XML responses
- **Date Filtering**: Automatically limits to publications from current year and previous year
- **3-Day Caching**: Reduces redundant API calls and improves response time
- **AI Analysis**: GPT-4 analyzes research abstracts to identify emerging compounds
- **Link Matching**: Automatically associates research articles with discovered supplements

## Future Enhancements

Potential additions for future iterations:

- [ ] Clinical trial phase tracking (Phase 1, 2, 3, 4)
- [ ] Citation count integration
- [ ] Research trend charts over time
- [ ] Email alerts for new research on tracked compounds
- [ ] Export research reports with citations
- [ ] Filter by specific research areas (cognitive, longevity, performance)
- [ ] Integration with more databases (Google Scholar, bioRxiv)
