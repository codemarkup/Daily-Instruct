-- DailyInstruct Dashboard Pivot Migration

-- 1. Extend `articles` table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_position INTEGER;

-- 2. Create `trackers` table
CREATE TABLE IF NOT EXISTS trackers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  category TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Run this if the table already exists:
-- ALTER TABLE trackers ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 3. Create `tracker_updates` table
CREATE TABLE IF NOT EXISTS tracker_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracker_id UUID NOT NULL REFERENCES trackers(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT NOT NULL,
  source_note TEXT,
  linked_article_id BIGINT REFERENCES articles(id) ON DELETE SET NULL
);

-- 4. Create `homepage_config` table
CREATE TABLE IF NOT EXISTS homepage_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  trending_tags JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Insert default homepage config if not exists
INSERT INTO homepage_config (id, trending_tags) 
VALUES (1, '[{"label": "Geopolitics", "link": "/geopolitics"}, {"label": "Tech Earnings", "link": "/tech"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Row Level Security
ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

-- Trackers RLS
CREATE POLICY "Allow public read access on trackers" ON trackers FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users on trackers" ON trackers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tracker Updates RLS
CREATE POLICY "Allow public read access on tracker_updates" ON tracker_updates FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users on tracker_updates" ON tracker_updates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Homepage Config RLS
CREATE POLICY "Allow public read access on homepage_config" ON homepage_config FOR SELECT USING (true);
CREATE POLICY "Allow full access for authenticated users on homepage_config" ON homepage_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
