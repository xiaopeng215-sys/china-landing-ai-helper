-- Migration: 004_analytics.sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_type_created_at ON analytics_events(type, created_at);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_created_at ON analytics_events(user_id, created_at);
