-- ============================================================
-- Portfolio CMS — Supabase Database Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Bio (one row per user)
CREATE TABLE IF NOT EXISTS bio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  name text DEFAULT '',
  title text DEFAULT '',
  tagline text DEFAULT '',
  about text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  profile_picture text DEFAULT '',
  hero_image text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  position text DEFAULT '',
  company text DEFAULT '',
  start_date text DEFAULT '',
  end_date text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  featured_description text DEFAULT '',
  link text DEFAULT '',
  tech text DEFAULT '',
  featured boolean DEFAULT false,
  image text DEFAULT '',
  role text DEFAULT '',
  tools text DEFAULT '',
  status text DEFAULT '',
  timeline text DEFAULT '',
  problem text DEFAULT '',
  highlights text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text DEFAULT '',
  date text DEFAULT '',
  content text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Socials
CREATE TABLE IF NOT EXISTS socials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  platform text DEFAULT '',
  url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  institution text DEFAULT '',
  degree text DEFAULT '',
  field text DEFAULT '',
  start_year text DEFAULT '',
  end_year text DEFAULT '',
  description text DEFAULT '',
  grade text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- ── Enable Row Level Security ──────────────────────────────────────────────────
ALTER TABLE bio ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- ── Public read (portfolio is public) ─────────────────────────────────────────
CREATE POLICY "Public read bio"        ON bio        FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read projects"   ON projects   FOR SELECT USING (true);
CREATE POLICY "Public read blog"       ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read socials"    ON socials    FOR SELECT USING (true);
CREATE POLICY "Public read education"  ON education  FOR SELECT USING (true);

-- ── Owner write (only you can edit your own data) ─────────────────────────────
CREATE POLICY "Owner insert bio"    ON bio FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update bio"    ON bio FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete bio"    ON bio FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner insert exp"    ON experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update exp"    ON experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete exp"    ON experiences FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner insert proj"   ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update proj"   ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete proj"   ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner insert blog"   ON blog_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update blog"   ON blog_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete blog"   ON blog_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner insert social" ON socials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update social" ON socials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete social" ON socials FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Owner insert edu"    ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update edu"    ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete edu"    ON education FOR DELETE USING (auth.uid() = user_id);
