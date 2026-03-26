-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- ENUMS
-- =========================

CREATE TYPE topic_status AS ENUM (
  'queued',
  'generating',
  'generated',
  'reviewing',
  'ready',
  'failed',
  'delayed'
);

CREATE TYPE progress_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

-- =========================
-- TOPICS (Core Pipeline Unit)
-- =========================

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,

  status topic_status NOT NULL DEFAULT 'queued',

  release_date DATE NOT NULL,

  -- STRICT: Only 2 topics per day
  daily_slot SMALLINT NOT NULL CHECK (daily_slot IN (1, 2)),

  idempotency_key UUID UNIQUE DEFAULT uuid_generate_v4(),

  interaction_id TEXT,

  -- Worker locking
  locked_at TIMESTAMPTZ,
  locked_by TEXT,

  -- Retry system
  generation_attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,
  retry_backoff_seconds INT DEFAULT 0,

  -- Metrics
  generation_duration INTERVAL,
  token_usage INT DEFAULT 0,

  -- Error tracking
  last_error TEXT,

  -- Version reference
  current_version_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce EXACTLY 2 topics per day (slot-based)
CREATE UNIQUE INDEX unique_topic_per_day_slot
ON topics (release_date, daily_slot);

-- =========================
-- STATUS HISTORY (Audit Log)
-- =========================

CREATE TABLE topic_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,

  old_status topic_status,
  new_status topic_status,

  changed_at TIMESTAMPTZ DEFAULT NOW(),

  metadata JSONB
);

-- =========================
-- VERSIONING (Immutable Content)
-- =========================

CREATE TABLE topic_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,

  version_number INT NOT NULL,
  content TEXT NOT NULL,

  admin_id UUID,
  manual_review_notes TEXT,

  is_current BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(topic_id, version_number)
);

-- Link current version
ALTER TABLE topics
ADD CONSTRAINT fk_current_version
FOREIGN KEY (current_version_id)
REFERENCES topic_versions(id)
ON DELETE SET NULL;

-- =========================
-- USER PROFILES
-- =========================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),

  full_name TEXT,

  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,

  last_activity_date DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- USER PROGRESS
-- =========================

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,

  status progress_status DEFAULT 'not_started',

  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  UNIQUE(user_id, topic_id)
);

-- =========================
-- AUTH TRIGGER
-- =========================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  IF new.email = 'namanurwar092@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', assigned_role);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_release_date ON topics(release_date);
CREATE INDEX idx_topics_locked_at ON topics(locked_at);

CREATE INDEX idx_topic_versions_topic_id ON topic_versions(topic_id);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_topic_id ON user_progress(topic_id);

CREATE INDEX idx_status_history_topic_id ON topic_status_history(topic_id);
