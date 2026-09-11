-- Migration: site_settings table for admin-controlled section visibility
-- Created: 2026-09-10

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (needed by the public portfolio page)
CREATE POLICY "Public can read site settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Only authenticated admin can insert / update / delete
CREATE POLICY "Authenticated users can modify site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default visibility: all sections visible
INSERT INTO site_settings (key, value) VALUES
  ('section_projects_visible',      'true'),
  ('section_github_visible',        'true'),
  ('section_experience_visible',    'true'),
  ('section_skills_visible',        'true'),
  ('section_certifications_visible','true'),
  ('section_languages_visible',     'true')
ON CONFLICT (key) DO NOTHING;
