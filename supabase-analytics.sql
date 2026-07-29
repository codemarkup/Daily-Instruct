-- First-Party Analytics Schema for DailyInstruct

-- 1. daily_page_stats
CREATE TABLE IF NOT EXISTS daily_page_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  path TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, path)
);

-- 2. daily_referrer_stats
CREATE TABLE IF NOT EXISTS daily_referrer_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  path TEXT NOT NULL,
  referrer_domain TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, path, referrer_domain)
);

-- 3. daily_geo_stats
CREATE TABLE IF NOT EXISTS daily_geo_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  path TEXT NOT NULL,
  country TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, path, country)
);

-- 4. daily_device_stats
CREATE TABLE IF NOT EXISTS daily_device_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, device_type)
);

-- 5. visitor_hashes (Insert-only, pruned daily)
CREATE TABLE IF NOT EXISTS visitor_hashes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  hash TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, hash, path)
);

-- 6. live_sessions (Upserted, pruned frequently)
CREATE TABLE IF NOT EXISTS live_sessions (
  hash TEXT NOT NULL,
  path TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (hash, path)
);

-- 7. rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash TEXT PRIMARY KEY,
  requests INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RPC for Atomic Upserts
CREATE OR REPLACE FUNCTION track_analytics_event(
  p_day DATE,
  p_path TEXT,
  p_is_unique BOOLEAN,
  p_referrer TEXT,
  p_country TEXT,
  p_device TEXT,
  p_hash TEXT
) RETURNS void AS $$
BEGIN
  -- 1. daily_page_stats
  INSERT INTO daily_page_stats (day, path, views, unique_visitors)
  VALUES (p_day, p_path, 1, CASE WHEN p_is_unique THEN 1 ELSE 0 END)
  ON CONFLICT (day, path) DO UPDATE
  SET views = daily_page_stats.views + 1,
      unique_visitors = daily_page_stats.unique_visitors + (CASE WHEN p_is_unique THEN 1 ELSE 0 END),
      updated_at = NOW();

  -- 2. daily_referrer_stats
  IF p_referrer IS NOT NULL THEN
    INSERT INTO daily_referrer_stats (day, path, referrer_domain, views)
    VALUES (p_day, p_path, p_referrer, 1)
    ON CONFLICT (day, path, referrer_domain) DO UPDATE
    SET views = daily_referrer_stats.views + 1,
        updated_at = NOW();
  END IF;

  -- 3. daily_geo_stats
  IF p_country IS NOT NULL THEN
    INSERT INTO daily_geo_stats (day, path, country, views)
    VALUES (p_day, p_path, p_country, 1)
    ON CONFLICT (day, path, country) DO UPDATE
    SET views = daily_geo_stats.views + 1,
        updated_at = NOW();
  END IF;

  -- 4. daily_device_stats
  INSERT INTO daily_device_stats (day, device_type, views)
  VALUES (p_day, p_device, 1)
  ON CONFLICT (day, device_type) DO UPDATE
  SET views = daily_device_stats.views + 1,
      updated_at = NOW();

  -- 5. live_sessions
  INSERT INTO live_sessions (hash, path, last_seen)
  VALUES (p_hash, p_path, NOW())
  ON CONFLICT (hash, path) DO UPDATE
  SET last_seen = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RLS Policies (All admin-only, service role bypasses RLS naturally)
ALTER TABLE daily_page_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_referrer_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_geo_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_device_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read daily_page_stats" ON daily_page_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read daily_referrer_stats" ON daily_referrer_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read daily_geo_stats" ON daily_geo_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read daily_device_stats" ON daily_device_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read live_sessions" ON live_sessions FOR SELECT TO authenticated USING (true);
