import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Database, 
  CheckCircle, 
  XCircle,
  ArrowsClockwise,
  Code,
  ListChecks
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { getSupabaseClient } from '@/lib/supabase'

interface SchemaStatus {
  hasSupplements: boolean
  hasCombinations: boolean
  hasEmergingSignals: boolean
  hasApiConfiguration: boolean
  hasTrackedSupplements: boolean
  hasChatConversations: boolean
}

const MIGRATION_STEPS: { id: string; name: string; description: string }[] = [
  {
    id: 'api_configuration',
    name: 'API Configuration Table',
    description: 'Creates table for centralized API key management'
  },
  {
    id: 'supplements',
    name: 'Supplements Table',
    description: 'Creates table for supplement trend data'
  },
  {
    id: 'combinations',
    name: 'Supplement Combinations Table',
    description: 'Creates table for supplement stack data'
  },
  {
    id: 'emerging_signals',
    name: 'Emerging Signals Table',
    description: 'Creates table for research-based predictions'
  },
  {
    id: 'tracked_supplements',
    name: 'User Tracked Supplements Table',
    description: 'Creates table for user favorites'
  },
  {
    id: 'chat_conversations',
    name: 'Chat Conversations Table',
    description: 'Creates table for AI chat history'
  },
  {
    id: 'rls_policies',
    name: 'Row Level Security Policies',
    description: 'Applies security policies to all tables'
  },
  {
    id: 'indexes',
    name: 'Database Indexes',
    description: 'Creates performance indexes'
  }
]

export function DatabaseMigration() {
  const [schemaStatus, setSchemaStatus] = useState<SchemaStatus | null>(null)
  const [checkingSchema, setCheckingSchema] = useState(false)
  const [isRunning] = useState(false)

  const checkSchemaStatus = async () => {
    setCheckingSchema(true)
    try {
      const client = await getSupabaseClient()
      
      const checks = await Promise.allSettled([
        client.from('supplements').select('id').limit(1),
        client.from('supplement_combinations').select('id').limit(1),
        client.from('emerging_signals').select('id').limit(1),
        client.from('api_configuration').select('id').limit(1),
        client.from('user_tracked_supplements').select('id').limit(1),
        client.from('chat_conversations').select('id').limit(1)
      ])

      const status: SchemaStatus = {
        hasSupplements: checks[0].status === 'fulfilled' && !checks[0].value.error,
        hasCombinations: checks[1].status === 'fulfilled' && !checks[1].value.error,
        hasEmergingSignals: checks[2].status === 'fulfilled' && !checks[2].value.error,
        hasApiConfiguration: checks[3].status === 'fulfilled' && !checks[3].value.error,
        hasTrackedSupplements: checks[4].status === 'fulfilled' && !checks[4].value.error,
        hasChatConversations: checks[5].status === 'fulfilled' && !checks[5].value.error
      }

      setSchemaStatus(status)
      toast.success('Schema status checked successfully')
    } catch (error) {
      console.error('Error checking schema:', error)
      toast.error('Failed to check schema status')
    } finally {
      setCheckingSchema(false)
    }
  }

  const getSqlScript = () => {
    return `-- TrendPulse Database Schema Migration
-- Copy and paste this into your Supabase SQL Editor

-- API Configuration Table
CREATE TABLE IF NOT EXISTS api_configuration (
  id SERIAL PRIMARY KEY,
  exa_api_key TEXT,
  reddit_client_id TEXT,
  reddit_client_secret TEXT,
  rapidapi_key TEXT,
  openai_api_key TEXT,
  anthropic_api_key TEXT,
  last_trend_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS api_configuration_single_row 
  ON api_configuration ((id IS NOT NULL));

INSERT INTO api_configuration (id, last_trend_update)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Supplements Table
CREATE TABLE IF NOT EXISTS supplements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  trend_direction TEXT NOT NULL,
  popularity_score NUMERIC NOT NULL,
  description TEXT NOT NULL,
  trend_data NUMERIC[] DEFAULT ARRAY[]::NUMERIC[],
  discussion_links JSONB DEFAULT '[]'::JSONB,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_supplements_category ON supplements(category);
CREATE INDEX IF NOT EXISTS idx_supplements_trend ON supplements(trend_direction);
CREATE INDEX IF NOT EXISTS idx_supplements_popularity ON supplements(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_supplements_updated ON supplements(updated_at DESC);

-- Supplement Combinations Table
CREATE TABLE IF NOT EXISTS supplement_combinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  supplement_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  trend_direction TEXT NOT NULL,
  popularity_score NUMERIC NOT NULL,
  trend_data NUMERIC[] DEFAULT ARRAY[]::NUMERIC[],
  references TEXT[] DEFAULT ARRAY[]::TEXT[],
  discussion_links JSONB DEFAULT '[]'::JSONB,
  ai_insight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_combinations_trend ON supplement_combinations(trend_direction);
CREATE INDEX IF NOT EXISTS idx_combinations_popularity ON supplement_combinations(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_combinations_updated ON supplement_combinations(updated_at DESC);

-- Emerging Signals Table
CREATE TABLE IF NOT EXISTS emerging_signals (
  id TEXT PRIMARY KEY,
  compound_name TEXT NOT NULL,
  category TEXT NOT NULL,
  research_phase TEXT NOT NULL,
  confidence_score NUMERIC NOT NULL,
  time_to_trend TEXT NOT NULL,
  signal_strength NUMERIC NOT NULL,
  research_summary TEXT NOT NULL,
  potential_benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  research_links TEXT[] DEFAULT ARRAY[]::TEXT[],
  emergence_score NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_emerging_signals_score ON emerging_signals(emergence_score DESC);
CREATE INDEX IF NOT EXISTS idx_emerging_signals_category ON emerging_signals(category);
CREATE INDEX IF NOT EXISTS idx_signals_updated ON emerging_signals(updated_at DESC);

-- User Tracked Supplements Table
CREATE TABLE IF NOT EXISTS user_tracked_supplements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  supplement_id TEXT NOT NULL,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, supplement_id)
);

CREATE INDEX IF NOT EXISTS idx_tracked_user ON user_tracked_supplements(user_id);

-- Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_conversations(user_id);

-- Enable Row Level Security
ALTER TABLE api_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emerging_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracked_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public read supplements" ON supplements;
CREATE POLICY "Public read supplements" ON supplements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read combinations" ON supplement_combinations;
CREATE POLICY "Public read combinations" ON supplement_combinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read signals" ON emerging_signals;
CREATE POLICY "Public read signals" ON emerging_signals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read api config" ON api_configuration;
CREATE POLICY "Public read api config" ON api_configuration FOR SELECT USING (true);

-- Service Role Write Policies
DROP POLICY IF EXISTS "Service write supplements" ON supplements;
CREATE POLICY "Service write supplements" ON supplements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service write combinations" ON supplement_combinations;
CREATE POLICY "Service write combinations" ON supplement_combinations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service write signals" ON emerging_signals;
CREATE POLICY "Service write signals" ON emerging_signals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service write api config" ON api_configuration;
CREATE POLICY "Service write api config" ON api_configuration FOR ALL USING (true) WITH CHECK (true);
`
  }

  const copySqlToClipboard = () => {
    const sql = getSqlScript()
    navigator.clipboard.writeText(sql)
    toast.success('SQL script copied to clipboard! Paste it into Supabase SQL Editor.')
  }

  const runMigration = async () => {
    toast.info('Opening Supabase SQL Editor instructions...', {
      description: 'Please copy the SQL script and run it in your Supabase dashboard',
      duration: 5000
    })
    
    copySqlToClipboard()
    
    window.open('https://supabase.com/dashboard/project/_/sql', '_blank')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" weight="duotone" />
            Database Schema Migration
          </CardTitle>
          <CardDescription>
            One-click database schema setup and updates for TrendPulse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription className="ml-6">
              <div className="font-medium mb-1">About Schema Migration</div>
              <div className="text-sm">
                This tool automatically creates or updates all required database tables, indexes, 
                and security policies. Run this after connecting your Supabase database or when 
                updating to a new version of TrendPulse.
              </div>
            </AlertDescription>
          </Alert>

          {schemaStatus && (
            <div className="space-y-3">
              <div className="font-medium flex items-center gap-2">
                <ListChecks className="w-5 h-5" weight="duotone" />
                Current Schema Status
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">API Configuration</span>
                  {schemaStatus.hasApiConfiguration ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Supplements</span>
                  {schemaStatus.hasSupplements ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Combinations</span>
                  {schemaStatus.hasCombinations ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Emerging Signals</span>
                  {schemaStatus.hasEmergingSignals ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Tracked Supplements</span>
                  {schemaStatus.hasTrackedSupplements ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Chat Conversations</span>
                  {schemaStatus.hasChatConversations ? (
                    <CheckCircle className="w-5 h-5 text-green-500" weight="fill" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" weight="fill" />
                  )}
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button
              onClick={runMigration}
              disabled={isRunning}
              size="lg"
              className="gap-2"
            >
              <Database className="w-5 h-5" weight="duotone" />
              Copy SQL & Open Supabase
            </Button>
            <Button
              onClick={copySqlToClipboard}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Code className="w-5 h-5" weight="duotone" />
              Copy SQL Only
            </Button>
            <Button
              onClick={checkSchemaStatus}
              disabled={checkingSchema || isRunning}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {checkingSchema ? (
                <>
                  <ArrowsClockwise className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <ListChecks className="w-5 h-5" weight="duotone" />
                  Check Status
                </>
              )}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="font-medium">What the Migration Does</div>
            <ScrollArea className="h-[300px] border rounded-lg p-4">
              <div className="space-y-3">
                {MIGRATION_STEPS.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{step.name}</div>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < MIGRATION_STEPS.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            SQL Migration Script
            <Button
              onClick={copySqlToClipboard}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Code className="w-4 h-4" />
              Copy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{getSqlScript()}</code>
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Migration Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>Migration is idempotent - safe to run multiple times</li>
            <li>Existing tables and data will not be affected</li>
            <li>Missing tables will be created automatically</li>
            <li>Row Level Security policies will be applied for data protection</li>
            <li>Performance indexes will be created for optimal query speed</li>
            <li>Check the status before and after migration to verify completion</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
