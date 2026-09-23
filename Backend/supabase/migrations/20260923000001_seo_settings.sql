-- Migration: Seed default SEO key/value pairs in site_settings
-- Created: 2026-09-23

INSERT INTO site_settings (key, value) VALUES
  ('seo_title',          'Wajahat Ali | Software Engineer & Developer'),
  ('seo_description',    'Software Engineer & Developer Portfolio – projects, skills, and work experience.'),
  ('seo_keywords',       'software engineer, developer, portfolio, React, Next.js, TypeScript, Fullstack'),
  ('seo_og_title',       'Wajahat Ali | Software Engineer & Developer'),
  ('seo_og_description', 'Software Engineer & Developer Portfolio – projects, skills, and work experience.'),
  ('seo_og_image_url',   ''),
  ('seo_twitter_card',   'summary_large_image'),
  ('seo_author',         'Wajahat Ali'),
  ('seo_canonical_url',  ''),
  ('seo_robots',         'index, follow')
ON CONFLICT (key) DO NOTHING;
