# TrendPulse - Supabase Setup Guide

## Overview
TrendPulse now uses Supabase as a secure backend for storing supplement data, user tracking, and chat conversations. All API keys are now managed server-side through Supabase Edge Functions (or can be stored as environment variables).

## Quick Setup

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `trendpulse` (or your choice)
   - Database Password: Generate a secure password
   - Region: Choose closest to your users
5. Wait for the project to initialize (~2 minutes)

### 2. Get Your Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Configure Environment Variables
Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Add `.env` to your `.gitignore` to keep credentials secure!

### 4. Set Up Database Tables
Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supplements table
CREATE TABLE supplements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  description TEXT NOT NULL,
  trend_data INTEGER[] NOT NULL,
  discussion_links JSONB,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Supplement combinations table
CREATE TABLE supplement_combinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  supplement_ids TEXT[] NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score INTEGER NOT NULL,
  trend_data INTEGER[] NOT NULL,
  references TEXT[] NOT NULL,
  discussion_links JSONB,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Emerging research signals table
CREATE TABLE emerging_signals (
  id TEXT PRIMARY KEY,
  compound_name TEXT NOT NULL,
  category TEXT NOT NULL,
  research_phase TEXT NOT NULL,
  confidence_score DECIMAL NOT NULL,
  time_to_trend TEXT NOT NULL,
  signal_strength DECIMAL NOT NULL,
  research_summary TEXT NOT NULL,
  potential_benefits TEXT[] NOT NULL,
  research_links TEXT[] NOT NULL,
  emergence_score DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User tracked supplements table
CREATE TABLE user_tracked_supplements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  supplement_id TEXT NOT NULL,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, supplement_id)
);

-- Chat conversations table
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_supplements_category ON supplements(category);
CREATE INDEX idx_supplements_trend ON supplements(trend_direction);
CREATE INDEX idx_supplements_popularity ON supplements(popularity_score DESC);
CREATE INDEX idx_combinations_popularity ON supplement_combinations(popularity_score DESC);
CREATE INDEX idx_user_tracked_user_id ON user_tracked_supplements(user_id);
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emerging_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracked_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public supplements read" ON supplements FOR SELECT USING (true);
CREATE POLICY "Public combinations read" ON supplement_combinations FOR SELECT USING (true);
CREATE POLICY "Public signals read" ON emerging_signals FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can view their own tracked supplements" 
  ON user_tracked_supplements FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own tracked supplements" 
  ON user_tracked_supplements FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own tracked supplements" 
  ON user_tracked_supplements FOR DELETE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own chat conversations" 
  ON chat_conversations FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own chat conversations" 
  ON chat_conversations FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own chat conversations" 
  ON chat_conversations FOR UPDATE 
  USING (auth.uid()::text = user_id);
```

### 5. Seed Initial Data (Optional)
To populate with sample data:

```sql
-- Insert sample supplements
INSERT INTO supplements (id, name, category, trend_direction, popularity_score, description, trend_data) VALUES
('bpc-157', 'BPC-157', 'peptide', 'rising', 95, 'A regenerative peptide known for healing properties and tissue repair', ARRAY[65, 68, 72, 75, 80, 85, 90, 95]),
('nad+', 'NAD+', 'nootropic', 'rising', 92, 'Nicotinamide adenine dinucleotide for cellular energy and longevity', ARRAY[70, 73, 76, 80, 84, 88, 90, 92]),
('vitamin-d3', 'Vitamin D3', 'vitamin', 'stable', 88, 'Essential vitamin for immune function and bone health', ARRAY[85, 86, 87, 88, 88, 88, 88, 88]);

-- Insert sample combinations
INSERT INTO supplement_combinations (id, name, description, purpose, supplement_ids, trend_direction, popularity_score, trend_data, references) VALUES
('recovery-stack', 'Recovery Stack', 'Comprehensive recovery and healing protocol', 'Accelerate recovery from training and injuries', ARRAY['bpc-157', 'tb-500'], 'rising', 90, ARRAY[75, 78, 82, 85, 87, 89, 90, 90], ARRAY['Reddit r/Peptides', 'Biohacking forums']);
```

## Architecture Benefits

### Security
✅ **No API keys in frontend code** - All external API calls happen server-side  
✅ **Row Level Security** - Users can only access their own data  
✅ **Secure authentication** - Built-in auth with Supabase  

### Scalability
✅ **PostgreSQL database** - Handles millions of records efficiently  
✅ **Real-time subscriptions** - Get instant updates when data changes  
✅ **CDN-backed** - Fast global access to your data  

### Developer Experience
✅ **Type-safe** - Full TypeScript support with generated types  
✅ **Auto-generated APIs** - REST and GraphQL endpoints automatically created  
✅ **Easy backups** - One-click database backups and point-in-time recovery  

## Next Steps

### Optional: Enable Authentication
If you want user accounts:
1. Go to **Authentication** → **Providers** in Supabase
2. Enable desired providers (Email, Google, GitHub, etc.)
3. Update your app to use Supabase Auth

### Optional: Set Up Edge Functions
For server-side API key management:
1. Install Supabase CLI: `npm install -g supabase`
2. Create Edge Functions for EXA, Reddit, etc.
3. Store API keys as Supabase secrets

### Monitoring
- View real-time logs in Supabase Dashboard → **Logs**
- Monitor database performance in **Database** → **Query Performance**
- Set up alerts for errors or high usage

## Troubleshooting

**Problem:** "Failed to load supplement data"  
**Solution:** Check that your `.env` file has correct Supabase credentials

**Problem:** RLS policies blocking requests  
**Solution:** Ensure policies allow public read access for supplements table

**Problem:** CORS errors  
**Solution:** Supabase handles CORS automatically; check your Supabase URL is correct

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: [Your repo]/issues
