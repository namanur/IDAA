-- Phase -1: Robust Production-Safe Data Architecture (idaa)

-- 1. Topics: The Heart of the System
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- State Machine: Strict Lifecycle
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
    'queued', 'generating', 'generated', 'reviewing', 'ready', 'failed', 'delayed'
  )),
  
  -- Enforcing "1 Topic/Day"
  release_date DATE UNIQUE,
  
  -- Observability & Orchestration
  idempotency_key UUID DEFAULT uuid_generate_v4(),
  interaction_id TEXT, -- For Gemini Deep Research tracking
  locked_at TIMESTAMPTZ, 
  generation_attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  generation_duration INTERVAL,
  last_error TEXT,
  token_usage INT DEFAULT 0,
  
  -- Version Promotion Logic
  current_version_id UUID, -- Foreign Key added after table creation below
  
  status_history JSONB DEFAULT '[]', -- Observability tracking
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Versioning: Immutable Audit Trail
CREATE TABLE topic_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  content TEXT NOT NULL,
  admin_id UUID,
  manual_review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, version_number)
);

-- 3. Link Version back to Topics (for Promotion)
ALTER TABLE topics ADD CONSTRAINT fk_current_version 
FOREIGN KEY (current_version_id) REFERENCES topic_versions(id) ON DELETE SET NULL;

-- 3. User & Progress
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name TEXT,
  current_streak INT DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  longest_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'reading', 'practice', 'completed'
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- 5. Annotations (Bookmarks/Highlights)
CREATE TABLE user_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  type TEXT NOT NULL, 
  content_selector TEXT, 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Helper: Active Task Guard
-- To be used in Edge Functions to enforce "Max 1 Active Task"
-- SELECT COUNT(*) FROM topics WHERE status = 'generating';
