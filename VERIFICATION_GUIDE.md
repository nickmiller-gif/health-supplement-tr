# Quick Verification Checklist

Use this checklist to verify TrendPulse is working correctly and not making things up.

## ✅ Core Features Working

### 1. Trend Discovery
- [ ] Click "Refresh Trends" button
- [ ] Should see loading state
- [ ] Should get list of 15+ supplements
- [ ] Each supplement has: name, category, trend direction, popularity score
- [ ] **Verify:** Names should be real supplements (BPC-157, NAD+, etc.)

### 2. Supplement Details
- [ ] Click "View Details" on any supplement
- [ ] Should open dialog with description
- [ ] Click "Generate AI Insight"
- [ ] Should see detailed analysis
- [ ] **Verify:** Information should be scientifically accurate

### 3. Stacks Tab
- [ ] Switch to "Stacks" tab
- [ ] Should see 8-10 supplement combinations
- [ ] Each shows purpose, components, trend
- [ ] **Verify:** Combinations make sense (e.g., "Wolverine Protocol" = BPC-157 + TB-500)

### 4. Research Signals Tab
- [ ] Switch to "Research Signals" tab
- [ ] Click "Scan Research" button
- [ ] Should see loading state "Scanning PubMed..."
- [ ] Should get 8-12 emerging supplements
- [ ] **Verify Real Data:** Click a research article link → Should go to real PubMed article (pubmed.ncbi.nlm.nih.gov/XXXXX/)

### 5. Predictions Tab
- [ ] Switch to "Predictions" tab
- [ ] Click "View Prediction" on any supplement
- [ ] Should see 45, 90, and 180-day forecasts
- [ ] Each has: predicted score, trend direction, confidence %, reasoning
- [ ] **Verify:** Confidence should decrease over time (45 days = highest, 180 days = lowest)

### 6. Tracking
- [ ] Click heart icon to track a supplement
- [ ] Heart should fill in
- [ ] Switch to "Tracked" tab
- [ ] Should see your tracked supplements
- [ ] Reload page → Tracked supplements should persist
- [ ] **Verify:** Data persists across sessions

### 7. Export
- [ ] Click export icon in header
- [ ] Choose "Export as CSV"
- [ ] Should download a .csv file
- [ ] Open in Excel/Sheets
- [ ] **Verify:** Should see all supplements in proper CSV format

### 8. Scheduling
- [ ] Look at header → Should see "Next auto-update: In Xh Ym"
- [ ] **Verify:** Time should be calculating next 8:00 AM
- [ ] Click email icon
- [ ] Create email schedule
- [ ] **Verify:** Should track next send time

## ✅ API Verification (Optional)

### With EXA API Key
1. Go to Settings (gear icon)
2. Add EXA API key
3. Save
4. Click "Refresh Trends"
5. **Verify:** Toast should say "Using EXA to discover real web trends"
6. Check discussion links → Should have real URLs

### With Reddit API
1. Get credentials from https://www.reddit.com/prefs/apps
2. Add Client ID and Secret to settings
3. Click "Refresh Trends"
4. **Verify:** Toast should say "Scanning Reddit..."
5. Check discussion links → Should all be reddit.com URLs

### With RapidAPI Key
1. Get key from https://rapidapi.com
2. Add to settings
3. Click "Refresh Trends"
4. **Verify:** Toast should say "Scanning Reddit, Twitter, TikTok & LinkedIn"
5. Check discussion links → Should see mix of platforms

## ✅ Data Accuracy Tests

### Research Articles (PubMed)
1. Go to "Research Signals" tab
2. Click "Scan Research"
3. Pick any emerging supplement
4. Click "View Details"
5. Look at "Research Articles" section
6. **CRITICAL TEST:** Click any article URL
7. **Should open:** Real PubMed article (format: pubmed.ncbi.nlm.nih.gov/12345678/)
8. **Verify:** Article title matches what's shown in app
9. **Verify:** Article is actually about that supplement

### Discussion Links
**Without APIs (LLM-only mode):**
- Links will be plausible (e.g., reddit.com/r/Peptides/...)
- They may not actually exist (LLM generated)
- **This is OK** - the app warns you to add API keys for real data

**With EXA API:**
- Links should all be real, working URLs
- Click a few → Should load actual pages

**With Social Media APIs:**
- Links should be actual Reddit posts, tweets, etc.
- Click to verify they're real discussions

### Trend Predictions
1. Go to any supplement prediction
2. Look at the math:
   - Current score: X
   - 45-day score: Should be within ±30 of current
   - 90-day score: Should be within ±50 of current
   - 180-day score: Should be within ±80 of current
3. **Verify:** Predictions shouldn't jump from 50 to 500 (unrealistic)
4. **Verify:** Confidence decreases: 45d > 90d > 180d

## ❌ Red Flags (Things That Would Mean It's Fake)

Watch out for these signs of hallucination:

1. **Research Articles:**
   - ❌ PMID links that don't work
   - ❌ Articles about unrelated topics
   - ❌ Made-up journal names

2. **Supplements:**
   - ❌ Completely fictional supplement names
   - ❌ Descriptions that contradict known science
   - ❌ All scores exactly the same

3. **Predictions:**
   - ❌ All predictions showing massive growth (unrealistic)
   - ❌ Confidence staying at 95% for 180-day forecasts
   - ❌ Same reasoning for every supplement

4. **Discussion Links:**
   - ❌ Links that 404 (with APIs enabled)
   - ❌ Reddit posts from non-existent subreddits
   - ❌ All links pointing to same page

## ✅ Expected Behavior (This is GOOD)

These are normal and expected:

1. **With LLM-Only Mode:**
   - ✅ Discussion links may be plausible but not verified
   - ✅ App warns you to add API keys for real data
   - ✅ Trends are AI-generated based on knowledge cutoff

2. **With APIs Enabled:**
   - ✅ May see "cached" results (saves API calls)
   - ✅ Results update every 30 minutes max (by design)
   - ✅ Some queries return no results (that's honest!)

3. **Predictions:**
   - ✅ Confidence decreases over time (realistic)
   - ✅ Some supplements predict to decline (honest analysis)
   - ✅ Math is conservative, not overly optimistic

## 🧪 Ultimate Test: PubMed Verification

**This is the PROOF the app uses real data:**

1. Go to "Research Signals"
2. Click "Scan Research"  
3. Wait for results
4. Click any emerging supplement → "View Details"
5. Scroll to "Research Articles" section
6. **Copy any PMID number** (e.g., "PMID: 38234567")
7. **Go to:** https://pubmed.ncbi.nlm.nih.gov/
8. **Paste the PMID** in the search box
9. **Press Enter**

**EXPECTED RESULT:**
- ✅ Should find the exact article
- ✅ Title should match what app showed
- ✅ Authors should match
- ✅ Abstract should be relevant to the supplement

**IF THIS WORKS:** The app is using real PubMed data, not hallucinating.

## 📊 What Each Mode Does

| Mode | Data Source | Accuracy | Discussion Links |
|------|-------------|----------|------------------|
| **No APIs** | GPT-4o knowledge | High for known supplements | Plausible, not verified |
| **+ EXA** | Real web search | Very High | Real, verified URLs |
| **+ Reddit** | Reddit API | Very High | Real Reddit posts |
| **+ RapidAPI** | Twitter/TikTok/LinkedIn | Very High | Real social media posts |
| **+ All APIs** | Multi-platform | Highest | Mix of verified sources |

## ✅ Final Verification

Run these commands in browser console to verify data:

```javascript
// Check if KV storage is working
await window.spark.kv.keys()
// Should return array of keys

// Check if LLM is working
const prompt = window.spark.llmPrompt`Say "Hello from TrendPulse"`
const result = await window.spark.llm(prompt)
console.log(result)
// Should see response

// Check cached research (if you've scanned)
const keys = await window.spark.kv.keys()
const researchKeys = keys.filter(k => k.includes('research-cache'))
console.log(`Research cache entries: ${researchKeys.length}`)
// Should see cache count if you've used Research Signals
```

---

## Summary

✅ **The app is NOT hallucinating if:**
- PubMed links go to real articles
- Research signals include actual PMIDs
- Predictions are mathematically sound
- Data persists across reloads
- Export generates real CSV/PDF files
- With APIs, discussion links work

⚠️ **The app TELLS YOU when it's using AI-generated content:**
- Shows warning banner when no API keys
- Prompts you to add keys for "real data"
- Distinguishes between "AI analysis" and "real sources"

🎯 **Bottom Line:**
This app uses real APIs and real data when available, uses AI for analysis and insights, and clearly communicates which is which. It's honest about its data sources and limitations.
