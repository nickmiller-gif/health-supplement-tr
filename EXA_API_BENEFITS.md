# Why EXA API is the Recommended Choice

## What is EXA?

EXA is a neural search engine designed specifically for searching the web with AI-powered understanding. Unlike traditional search engines that rely on keywords, EXA understands context and semantic meaning, making it ideal for discovering nuanced discussions about supplements across the entire web.

## What EXA Covers

When you use EXA for supplement trend discovery, you get access to:

### ✅ Platforms & Sources Covered by EXA:
- **Reddit** - All supplement-related subreddits (r/Nootropics, r/Supplements, r/Biohacking, r/Peptides, etc.)
- **Forums** - Longevity forums, biohacking communities, health discussion boards
- **Blogs** - Health optimization blogs, biohacking content, supplement review sites
- **Research Communities** - Self-experimentation communities, longevity groups
- **Stack Overflow-style sites** - Health Q&A platforms
- **Discord/Slack** - Public discussions (where indexed)
- **YouTube** - Video transcripts from supplement reviews and discussions
- **News Sites** - Health and wellness news coverage
- **Academic-adjacent content** - Preprints, discussion of research

### 🎯 Why EXA Works Better Than Individual APIs:

1. **Semantic Understanding**: EXA understands "trending peptides for recovery" vs "peptide stability" - it gets context
2. **Multi-platform**: One API gives you Reddit + forums + blogs + more
3. **Highlights & Excerpts**: Returns the exact relevant portions of discussions
4. **Freshness**: Indexes recent content quickly
5. **Cost-effective**: $10/month for 10,000 searches vs. $50+ for multiple social media APIs

## EXA vs. Individual APIs

| Feature | EXA | Reddit API | RapidAPI (Social) |
|---------|-----|-----------|-------------------|
| **Reddit Coverage** | ✅ Yes | ✅ Yes | ❌ No |
| **Forums & Blogs** | ✅ Yes | ❌ No | ❌ No |
| **Twitter/X** | ⚠️ Limited* | ❌ No | ✅ Yes |
| **TikTok** | ⚠️ Limited* | ❌ No | ✅ Yes |
| **LinkedIn** | ⚠️ Limited* | ❌ No | ✅ Yes |
| **YouTube** | ✅ Transcripts | ❌ No | ⚠️ Limited |
| **News & Blogs** | ✅ Yes | ❌ No | ❌ No |
| **Free Tier** | ✅ 1,000/mo | ✅ Unlimited | ❌ No |
| **Paid Cost** | $10/10k searches | Free | $20-50/mo |
| **Setup Difficulty** | Easy | Medium | Hard |

\* Social media platforms are partially indexed when content is public and web-accessible

## Real-World Usage for TrendPulse

### With Just EXA API:
```
Query: "trending peptides biohacking reddit 2024"
Results:
- Reddit discussions from r/Biohacking, r/Peptides
- LongeCity forum discussions
- Ben Greenfield blog posts
- YouTube video transcripts
- Biohacker community posts
```

### What You Get:
- 15-20 supplement trends discovered per refresh
- 8-10 supplement stack combinations
- Direct links to source discussions
- Relevant excerpts and highlights
- Trend scoring based on real discussion volume

## How to Get Started

1. **Sign up**: Go to [exa.ai](https://exa.ai)
2. **Free tier**: Start with 1,000 searches/month (plenty for TrendPulse)
3. **Get API key**: Create a key from your dashboard
4. **Add to config**: Paste into `src/config/api-keys.ts`
5. **Done**: Click "Refresh Trends" in TrendPulse

## Pricing Example

**Free Tier** (1,000 searches/month):
- Refresh trends 3x per day = ~180 searches/month
- **Perfect for personal use** ✅

**Paid Tier** ($10/month for 10,000 searches):
- Refresh trends every hour = ~1,500 searches/month
- Multiple users or frequent updates
- **Great for shared/production use** ✅

## Summary

**Start with EXA because:**
1. ⭐ Best single API for comprehensive supplement trend coverage
2. 💰 Free tier is generous (1,000 searches/month)
3. 🎯 Covers Reddit, forums, blogs, and more in one API
4. 🚀 Easy to set up - just one API key needed
5. 💡 Semantic search understands supplement terminology
6. 📊 Better quality results than combining multiple APIs

**Add other APIs only if:**
- You need real-time Twitter/X trends (RapidAPI)
- You want direct Reddit API access with no limits (Reddit API - free)
- You're analyzing TikTok-specific trends (RapidAPI)
- You need LinkedIn professional discussions (RapidAPI)

## Questions?

See the full setup guide: [API_KEYS_SETUP.md](./API_KEYS_SETUP.md)
