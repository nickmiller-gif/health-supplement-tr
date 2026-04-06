# Planning Guide

A centralized AI-powered supplement intelligence platform with a single source of truth backend. Users access daily trend data from a shared Supabase database and interact with an AI chatbot for personalized supplement insights. All API keys and data management handled server-side for security and simplicity.

**Experience Qualities**:
1. **Centralized & Secure** - Single backend with server-side API management; all trends stored in shared Supabase database; users consume pre-generated daily data
2. **Conversational & Intuitive** - AI chatbot for natural language queries about supplements, stacks, and trends; simplified read-only interface
3. **Modern & Performant** - Clean, responsive design optimized for viewing trends; fast load times with pre-computed data

**Complexity Level**: Complex Application (backend-driven architecture with centralized data management)
- Full-stack application with centralized Supabase backend, server-side API key management, shared daily trend updates, AI chatbot, and responsive read-only frontend

## Essential Features

### Centralized Backend with Supabase
- **Functionality**: Single shared Supabase database stores all supplement trends, stacks, and API configuration. API keys managed server-side in `api_configuration` table. Trend updates run centrally (manually or via cron) and all users see the same daily data.
- **Purpose**: Eliminate per-user API costs, ensure data consistency, simplify UX by removing configuration complexity, and improve security by keeping secrets server-side
- **Trigger**: App loads and automatically fetches latest trends from shared database
- **Progression**: App initializes → Connects to Supabase → Fetches daily supplements and combinations → Displays read-only trend data → User can browse/filter/sort
- **Success criteria**: All users see identical daily trends; API keys never exposed in frontend code; data loads instantly from database cache; single admin can update trends for all users

### Read-Only Trend Viewing
- **Functionality**: Users browse pre-computed daily supplement trends and stacks. Can filter by category (peptides, vitamins, nootropics), sort by popularity/trend/name, and view detailed AI insights for each supplement or combination.
- **Purpose**: Provide immediate value without requiring user configuration or API setup
- **Trigger**: App loads with latest trends from database
- **Progression**: User lands on app → Sees categorized trends → Applies filters → Views detailed insights → Explores related stacks
- **Success criteria**: Trends load in <2 seconds; filters/sorting work instantly; detailed insights available for all items; responsive on mobile and desktop

### AI Chatbot for Supplement Search
- **Functionality**: Conversational AI interface using Spark LLM or configured OpenAI/Anthropic APIs. Users ask natural language questions about supplements ("show me peptides for muscle recovery", "what's trending for sleep?"), get personalized recommendations based on available data, and can drill down with follow-up questions.
- **Purpose**: Provide intuitive, conversational access to supplement insights without manual browsing
- **Trigger**: User clicks floating chatbot button or types in chat interface
- **Progression**: User opens chat → Types query → AI analyzes against supplement database → Returns relevant recommendations with explanations → User asks follow-ups → Maintains conversation context
- **Success criteria**: Understands category queries, benefit searches, and trend questions; provides supplement recommendations with reasoning; handles typos and colloquial language; responds in <3 seconds

### Simplified User Interface
- **Functionality**: Clean, focused interface showing only essential features: trend browsing (All Trends tab), stack combinations (Stacks tab), filtering/sorting controls, and chatbot access. No API settings, export options, or complex configuration.
- **Purpose**: Reduce cognitive load and focus on core value: viewing trends and getting AI insights
- **Trigger**: Automatically on app load
- **Progression**: User sees header with app branding → Two main tabs (All Trends, Stacks) → Search and filter controls → Grid of supplement cards → Floating chatbot button
- **Success criteria**: <5 clicks to any piece of information; mobile-optimized with bottom navigation; no configuration UI visible; chatbot easily accessible

### Multi-Platform Social Media API Integration
- **Functionality**: Integrated support for multiple social media APIs to aggregate real supplement trends from diverse platforms:
  - **EXA Search**: Neural web search across the entire internet
  - **Reddit API**: Direct access to r/Peptides, r/Nootropics, r/Supplements, r/Biohacking
  - **Twitter/X (via RapidAPI)**: Recent tweets and discussions about supplements
  - **TikTok (via RapidAPI)**: Trending supplement content and videos
  - **LinkedIn (via RapidAPI)**: Professional health and wellness discussions
- **Purpose**: Eliminates LLM hallucination by aggregating real data from multiple social platforms. Users can configure one or all APIs based on their budget and preferred data sources.
- **Trigger**: User opens API Settings dialog, selects "API Keys" tab, configures desired platforms
- **Progression**: User clicks "API Settings" → Switches to "API Keys" tab → Enters credentials for desired platforms → Saves → Refresh Trends uses all configured APIs → Results show aggregated data with platform attribution
- **Success criteria**: Each configured API successfully searches its platform and returns genuine discussions with source links. Multiple APIs work together to provide comprehensive trend coverage.

### Intelligent Multi-Source Caching
- **Functionality**: Automatic caching of all API responses (EXA, Reddit, Twitter, TikTok, LinkedIn) with 24-hour expiration. Separate cache management for web search and social media APIs.
- **Purpose**: Drastically reduce API costs and improve performance by reusing search results. Critical for RapidAPI which has limited free tier requests.
- **Trigger**: Automatically caches all API responses; users can view separate cache statistics and clear caches independently via API Settings → Cache Management tab
- **Progression**: API query → Check platform-specific cache → If found and fresh (<24hrs), use cached data → Otherwise fetch from API and cache → Display cache stats split by source
- **Success criteria**: Cache hit rate above 80% for typical usage. Users can see exactly how many cached results exist for EXA vs social media platforms and clear them independently.

### Real-Time Trend Discovery
- **Functionality**: Uses EXA API (if configured) or AI to analyze current discussions across Reddit (r/Peptides, r/Nootropics, r/Supplements, r/Biohacking), Twitter/X, and biohacking communities to discover what's actually trending
- **Purpose**: Provides real, non-hallucinated data about supplement trends based on actual community discussions
- **Trigger**: Automatically runs on app launch and can be manually refreshed via "Refresh Trends" button
- **Progression**: User loads app → System checks for EXA API key → If available, searches real web sources → Discovers top trending supplements → LLM analyzes search results → Displays with trend indicators and popularity metrics
- **Success criteria**: System discovers 15+ real trending supplements with accurate descriptions, categories, trend directions, and authentic source links

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

### Research-Based Early Signal Detection
- **Functionality**: Scans PubMed, scientific journals, and research databases to identify supplements with recent research publications before they become mainstream trends
- **Purpose**: Predict future supplement trends 3-12 months ahead by identifying compounds with promising new research but low current awareness
- **Trigger**: User clicks "Scan Research" button in Research Signals tab
- **Progression**: User clicks Scan Research → System queries PubMed API for recent publications (past 12-24 months) → Optional: EXA API searches research sites (nature.com, thelancet.com, nih.gov) → AI analyzes research abstracts and titles → Identifies emerging compounds mentioned in recent studies → Calculates emergence scores, signal strength, and time-to-trend estimates → Displays emerging supplements with research article links
- **Success criteria**: 
  - Successfully queries PubMed API and retrieves recent research articles
  - Identifies 8-12 emerging supplements with recent clinical or pre-clinical research
  - Each emerging supplement includes research phase, confidence score, and timing prediction
  - Links to actual research articles (PubMed URLs) for verification
  - Accurately predicts which compounds will trend in 1-3, 3-6, 6-12, or 12+ months
  - Distinguishes between pre-clinical, clinical trials, recent clinical, and meta-analysis research phases
  - Provides reasoning for why each compound will trend based on research momentum

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

### Export Trend Reports
- **Functionality**: Export comprehensive trend reports in CSV or PDF format with customizable content options
- **Purpose**: Enables users to save, share, and analyze trend data offline or integrate with other tools
- **Trigger**: User clicks "Export Report" button in header
- **Progression**: User clicks Export → Dialog shows export options (include AI insights, discussion links, trend data) and statistics → User selects CSV or PDF format → File downloads with formatted report
- **Success criteria**: 
  - CSV exports contain all supplements and combinations in spreadsheet-compatible format
  - PDF exports generate professional, print-ready reports with proper formatting
  - Users can customize what data to include (insights, links, raw trend data)
  - Reports include summary statistics and generation timestamp
  - Files are named with current date for easy organization

### Automated Email Report Scheduling
- **Functionality**: Schedule automatic trend reports to be sent via email on a daily, weekly, or monthly basis with customizable content options
- **Purpose**: Keeps users informed of trends without requiring them to manually check the dashboard; enables passive monitoring of supplement trends
- **Trigger**: User clicks "Email Reports" button in header
- **Progression**: User clicks Email Reports → Dialog opens with schedule creation form → User enters email address → Selects frequency (daily/weekly/monthly) → Configures report options (insights, links, trend data) → Creates schedule → Scheduler runs automatically via cron job → Email opens in default client at scheduled time
- **Success criteria**:
  - Users can create multiple email schedules with different frequencies and options
  - Schedules persist across sessions using useKV storage
  - Cron job checks for due reports every 5 minutes and opens email client with pre-populated report
  - Users can pause/resume, edit, or delete schedules
  - "Send Now" button allows testing schedule before activation
  - Email body includes top 10 supplements, rising trends, and top stacks with formatted text
  - Next scheduled send time is clearly displayed for each schedule
  - Users can see when each schedule was last sent

## Edge Case Handling

- **No AI Response**: If LLM fails, show cached fallback description or error state with retry option
- **Empty Search**: When search returns no results, suggest similar supplements or show popular alternatives
- **First-Time User**: Show empty state for tracked supplements with clear call-to-action to explore trends
- **Stale Data**: Include timestamp of last trend update to set user expectations about freshness
- **Long Loading**: Show skeleton loaders during AI generation to maintain engagement
- **Empty Export**: If no trends available, disable export button with tooltip explaining minimum data required
- **Large Reports**: PDF export handles pagination automatically for reports with many supplements
- **Invalid Email**: Email scheduler validates email format before allowing schedule creation
- **No Email Schedules**: Show empty state with helpful message and icon when no schedules exist
- **Overlapping Schedules**: Multiple schedules can exist for same/different emails without conflict
- **Email Client Not Available**: Email opens in system default client; if none configured, shows error with helpful message

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
  - **Dialog**: For detailed AI-generated insights, full supplement profiles, and export options
  - **Input**: Search bar with clear affordances
  - **Tabs**: To switch between "All Trends," "Tracked," and category filters
  - **Scroll Area**: For long trend lists
  - **Skeleton**: Loading states during AI generation
  - **Separator**: To divide sections cleanly
  - **Button**: Primary actions with distinct states for favoriting/tracking
  - **Checkbox**: For toggling export options (insights, links, trend data)
  
- **Customizations**:
  - Custom trend chart component using D3 for sparkline visualizations showing trend momentum
  - Gradient overlays on cards to add depth without clutter
  - Custom pulse animation for rising trend indicators
  - Professional PDF report layout with branded header and formatted sections
  
- **States**:
  - Cards: Subtle lift and border glow on hover, slight scale on active
  - Favorite button: Heart icon that fills with smooth animation
  - Search: Border accent color on focus with subtle shadow
  - Trend badges: Gentle pulse animation for "rising" state
  - Export buttons: Show loading state during PDF/CSV generation
  
- **Icon Selection**:
  - TrendUp/TrendDown from Phosphor for trend directions
  - Heart/HeartFill for favorites
  - MagnifyingGlass for search
  - Sparkle for AI insights
  - Flask for peptides, Pill for vitamins, Brain for nootropics
  - FileArrowDown for export trigger
  - FileCsv/FilePdf for format selection
  - EnvelopeSimple for email scheduler
  - PaperPlaneTilt for send actions
  - Clock for schedule timing
  - CheckCircle/XCircle for active/paused status
  
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
