# Planning Guide

An AI-powered trend discovery platform that uses LLM analysis to surface emerging patterns in the health supplement space, focusing on peptides, vitamins, and other wellness compounds. The platform discovers real-time trends from community discussions and provides AI-generated insights.

**Experience Qualities**:
1. **Intelligent** - The platform uses AI to discover and analyze real supplement trends from biohacking communities, providing insights you wouldn't easily find yourself
2. **Current** - Data is discovered on-demand through AI analysis of Reddit, Twitter, forums, and biohacking communities, with clear indicators of what's gaining momentum right now
3. **Exploratory** - Users can dive deeper into trends, discover connections through AI-generated combinations, and understand the "why" behind emerging patterns

**Complexity Level**: Light Application (multiple features with basic state)
- This is a focused trend-tracking tool with AI-generated insights, searchable trend data, and the ability to save/track specific supplements of interest

## Essential Features

### Real-Time Trend Discovery
- **Functionality**: Uses AI to analyze current discussions across Reddit (r/Peptides, r/Nootropics, r/Supplements, r/Biohacking), Twitter/X, and biohacking communities to discover what's actually trending
- **Purpose**: Provides real, non-hallucinated data about supplement trends based on actual community discussions
- **Trigger**: Automatically runs on app launch and can be manually refreshed via "Refresh Trends" button
- **Progression**: User loads app → AI analyzes current discussions → Discovers top trending supplements → Displays with trend indicators and popularity metrics
- **Success criteria**: AI discovers 15+ real trending supplements with accurate descriptions, categories, and trend directions

### Trend Discovery Feed
- **Functionality**: Displays AI-discovered trending peptides, vitamins, and supplements with trend indicators (rising, stable, declining)
- **Purpose**: Provides immediate value by showing what's currently gaining attention in the health supplement space
- **Trigger**: Automatically loads after AI discovery completes
- **Progression**: Trends display → User can see trend direction, popularity metrics, and brief descriptions → Filter and sort options available
- **Success criteria**: Users can immediately identify top trending supplements with visual trend indicators

### AI Insight Generation
- **Functionality**: Uses the Spark LLM API to generate detailed analysis about why specific supplements are trending, potential benefits, and scientific context
- **Purpose**: Transforms raw trend data into actionable insights that help users understand the significance of trends
- **Trigger**: User clicks on a trend item to view AI analysis
- **Progression**: User selects trend → AI analyzes the supplement based on current research and discussions → Detailed insight appears with scientific context, potential use cases, and trend drivers
- **Success criteria**: AI generates coherent, informative 4-5 paragraph analyses based on real supplement information

### Supplement Combination Discovery
- **Functionality**: AI-powered discovery of trending supplement combinations ("stacks") based on real discussions in biohacking communities
- **Purpose**: Surface emerging multi-supplement protocols that communities are combining for synergistic effects
- **Trigger**: Runs automatically after discovering individual supplements; analyzes which supplements are being combined
- **Progression**: AI discovers popular supplement combinations → Generates stack names and purposes → User views combinations with detailed AI analysis of synergistic effects
- **Success criteria**: System discovers 8-10 real trending combinations with clear explanations of why they're being discussed

### Real-Time Trend Suggestions
- **Functionality**: AI generates personalized suggestions for new supplements based on user's tracked items and current market trends
- **Purpose**: Helps users discover relevant supplements they might not know about
- **Trigger**: Displayed automatically when user has 2+ tracked supplements
- **Progression**: System analyzes tracked supplements → AI identifies related trending compounds → Shows "Suggested for You" section with reasoning
- **Success criteria**: Suggestions are contextually relevant and include brief explanation of why they're recommended

### Search & Filter
- **Functionality**: Allows users to search for specific supplements or filter by category (peptides, vitamins, minerals, nootropics, etc.)
- **Purpose**: Enables users to quickly find information about specific compounds they're researching
- **Trigger**: User types in search bar or selects filter category
- **Progression**: User enters search term → Results filter in real-time → Relevant supplements appear with trend data
- **Success criteria**: Search returns relevant results instantly; filters work independently and can be combined

### Favorites/Tracking
- **Functionality**: Users can save specific supplements to track over time, persisted with useKV
- **Purpose**: Allows users to build a personalized watchlist of supplements they're interested in monitoring
- **Trigger**: User clicks bookmark/star icon on any trend item
- **Progression**: User clicks save → Item added to favorites → Accessible from dedicated "Tracked" view → Can be removed later
- **Success criteria**: Favorites persist across sessions and can be easily added/removed

## Edge Case Handling

- **No AI Response**: If LLM fails, show cached fallback description or error state with retry option
- **Empty Search**: When search returns no results, suggest similar supplements or show popular alternatives
- **First-Time User**: Show empty state for tracked supplements with clear call-to-action to explore trends
- **Stale Data**: Include timestamp of last trend update to set user expectations about freshness
- **Long Loading**: Show skeleton loaders during AI generation to maintain engagement

## Design Direction

The design should evoke a sense of cutting-edge scientific discovery meets clean data visualization. It should feel like a premium research dashboard - credible, sophisticated, and data-driven, yet approachable and not overly clinical. The aesthetic should inspire confidence in the information presented while maintaining visual interest through dynamic trend visualizations.

## Color Selection

A science-forward palette with vibrant accents that suggest innovation and vitality:

- **Primary Color**: Deep teal `oklch(0.45 0.08 200)` - Communicates scientific credibility and modernity, used for headers and key UI elements
- **Secondary Colors**: 
  - Cool slate `oklch(0.35 0.02 240)` for supporting text and backgrounds
  - Soft mint `oklch(0.92 0.04 160)` for subtle backgrounds and hover states
- **Accent Color**: Electric cyan `oklch(0.65 0.15 195)` - High-energy highlight for CTAs, trend indicators, and active states
- **Trend Indicators**:
  - Rising: Vibrant green `oklch(0.70 0.15 145)`
  - Stable: Warm amber `oklch(0.70 0.12 75)`
  - Declining: Coral red `oklch(0.65 0.14 25)`
- **Foreground/Background Pairings**:
  - Primary (Deep Teal): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Accent (Electric Cyan): Dark slate `oklch(0.20 0.02 240)` - Ratio 7.5:1 ✓
  - Background (White): Dark text `oklch(0.20 0.01 240)` - Ratio 15.8:1 ✓
  - Muted backgrounds (Soft Mint): Medium slate `oklch(0.45 0.02 240)` - Ratio 5.2:1 ✓

## Font Selection

Typography should balance scientific authority with modern readability - precise yet not sterile.

- **Primary**: Space Grotesk - A geometric sans-serif with technical precision that feels contemporary and approachable
- **Secondary**: Inter - For body text and data displays, ensuring excellent readability at all sizes

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/32px/tight tracking
  - H2 (Section Headers): Space Grotesk Semibold/24px/normal tracking
  - H3 (Trend Names): Space Grotesk Medium/18px/normal tracking
  - Body (Descriptions): Inter Regular/15px/1.6 line height
  - Caption (Metadata): Inter Medium/13px/uppercase/wide tracking
  - Data Labels: Inter Semibold/14px/tabular numbers

## Animations

Animations should reinforce the sense of real-time data and discovery. Use subtle motion to guide attention to new insights and trend changes. Trend indicators should pulse gently when rising, list items should have smooth micro-interactions on hover, and AI insight generation should use a satisfying reveal animation that suggests content being "analyzed" and "surfaced."

## Component Selection

- **Components**:
  - **Card**: Primary container for trend items with hover effects
  - **Badge**: For trend indicators (rising/stable/declining) and categories
  - **Dialog**: For detailed AI-generated insights and full supplement profiles
  - **Input**: Search bar with clear affordances
  - **Tabs**: To switch between "All Trends," "Tracked," and category filters
  - **Scroll Area**: For long trend lists
  - **Skeleton**: Loading states during AI generation
  - **Separator**: To divide sections cleanly
  - **Button**: Primary actions with distinct states for favoriting/tracking
  
- **Customizations**:
  - Custom trend chart component using D3 for sparkline visualizations showing trend momentum
  - Gradient overlays on cards to add depth without clutter
  - Custom pulse animation for rising trend indicators
  
- **States**:
  - Cards: Subtle lift and border glow on hover, slight scale on active
  - Favorite button: Heart icon that fills with smooth animation
  - Search: Border accent color on focus with subtle shadow
  - Trend badges: Gentle pulse animation for "rising" state
  
- **Icon Selection**:
  - TrendUp/TrendDown from Phosphor for trend directions
  - Heart/HeartFill for favorites
  - MagnifyingGlass for search
  - Sparkle for AI insights
  - Flask for peptides, Pill for vitamins, Brain for nootropics
  
- **Spacing**:
  - Container padding: `p-6` on desktop, `p-4` on mobile
  - Card gaps: `gap-4` in grid layouts
  - Internal card padding: `p-5`
  - Section spacing: `space-y-6`
  
- **Mobile**:
  - Single column layout for trend cards
  - Fixed search header that stays accessible
  - Bottom sheet drawer instead of dialog for AI insights
  - Larger touch targets (min 44px) for all interactive elements
  - Tabs scroll horizontally on smaller screens
