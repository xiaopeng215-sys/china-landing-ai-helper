-- Migration: 003_booking_intents
-- Tracks user booking intent clicks for conversion analytics

CREATE TABLE IF NOT EXISTS booking_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  place_name TEXT NOT NULL,
  place_type TEXT,  -- hotel/attraction/restaurant
  check_in DATE,
  check_out DATE,
  adults INTEGER DEFAULT 1,
  email TEXT,
  affiliate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user history queries
CREATE INDEX IF NOT EXISTS idx_booking_intents_user_id ON booking_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_intents_created_at ON booking_intents(created_at DESC);

-- RLS: users can only read their own intents; inserts are open (anonymous tracking)
ALTER TABLE booking_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking intents"
  ON booking_intents FOR SELECT
  USING (user_id = auth.uid()::text OR user_id IS NULL);

CREATE POLICY "Anyone can insert booking intents"
  ON booking_intents FOR INSERT
  WITH CHECK (true);
