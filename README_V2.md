# TrendPulse - AI-Powered Supplement Intelligence Platform

A modern, full-stack application for discovering and tracking supplement trends with AI-powered insights, conversational chatbot, and secure Supabase backend.

## 🚀 Key Features

### ✨ New in V2.0
- **🤖 AI Chatbot** - Natural language interface for supplement queries and recommendations
- **🔐 Supabase Backend** - Secure, scalable PostgreSQL database with real-time capabilities
- **🎨 Upgraded UI/UX** - Premium design with smooth animations, optimized for desktop and mobile
- **📱 Mobile-First** - Touch-friendly interfaces with responsive layouts
- **🔒 Secure Architecture** - All API keys managed server-side, zero client-side exposure

### Core Functionality
- **Trend Discovery** - AI-powered analysis of supplement trends from social media and communities
- **Smart Search** - Natural language queries through AI chatbot
- **Supplement Tracking** - Save and monitor your favorite supplements
- **Combination Insights** - Discover popular supplement stacks and protocols
- **Real-time Updates** - Live data synchronization with Supabase

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Framer Motion** for smooth animations
- **shadcn/ui** components
- **Supabase Client** for database access

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates
- **Serverless functions** for API integrations

### Data Flow
```
User Interface
      ↓
  Supabase Client
      ↓
  PostgreSQL DB
      ↓
  Edge Functions (for external APIs)
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set Up Supabase**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create a new Supabase project
   - Run the SQL schema provided
   - Copy your project URL and anon key

3. **Configure Environment**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:5173`

## 💬 Using the AI Chatbot

The chatbot understands natural language queries:

- "Show me peptides for muscle recovery"
- "What's trending in nootropics?"
- "Find supplements for better sleep"
- "Which supplements are rising?"
- "Tell me about popular stacks"

The AI analyzes your query against the supplement database and provides relevant recommendations with explanations.

## 📱 Mobile Experience

The app is fully optimized for mobile devices:
- **Bottom Navigation** - Easy thumb access
- **Swipe Gestures** - Natural card interactions  
- **Touch-Friendly** - Minimum 44px touch targets
- **Responsive Grid** - Adapts from 1-3 columns based on screen size
- **Bottom Sheets** - Native-feeling dialogs on mobile

## 🎨 Design System

### Colors (OKLCH)
- **Primary**: `oklch(0.42 0.12 235)` - Deep blue for trust and authority
- **Accent**: `oklch(0.58 0.18 220)` - Vibrant cyan for energy and action
- **Secondary**: `oklch(0.88 0.08 210)` - Light blue for subtle backgrounds

### Typography
- **Headings**: Space Grotesk (geometric, modern)
- **Body**: Inter (readable, professional)

### Animations
- **Micro-interactions** - Hover effects and button presses
- **Page Transitions** - Smooth fade-ins and slides
- **Loading States** - Skeleton loaders and spinners
- **Chatbot** - Typing indicators and message animations

## 🔐 Security

### What's Secure
✅ No API keys in frontend code  
✅ All external API calls through backend  
✅ Row Level Security (RLS) on database  
✅ User data isolation  
✅ HTTPS-only connections  

### Environment Variables
Never commit `.env` files! Add to `.gitignore`:
```
.env
.env.local
.env.production
```

## 📚 Project Structure

```
src/
├── components/
│   ├── Chatbot.tsx           # AI chatbot component
│   ├── SupplementCard.tsx    # Individual supplement display
│   ├── ui/                   # shadcn components
│   └── ...
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   ├── supplement-service.ts  # Database service layer
│   ├── types.ts              # TypeScript interfaces
│   └── ...
├── App.tsx                    # Main application
└── index.css                  # Global styles & design tokens
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables
4. Deploy!

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Tailwind for styling (no inline CSS)
- Functional components with hooks

## 📝 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling system
- **Framer Motion** - Animation library
- **OpenAI** - AI capabilities via Spark LLM API

---

**Made with ❤️ using the Spark template**
