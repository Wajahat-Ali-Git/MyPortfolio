-- =============================================================================
-- SEED PORTFOLIO INITIAL CONTENT
-- =============================================================================
-- Populates the initial projects, experiences, skills, tools, and certifications
-- =============================================================================

-- 1. SEED PROJECTS
INSERT INTO public.projects (title, slug, description, github_url, live_url, featured, color, tech_stack, display_order, is_visible)
VALUES
  (
    'CARSAGE',
    'carsage',
    'A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.',
    'https://github.com/Wajahat-Ali-Git/CARSAGE',
    NULL,
    TRUE,
    'purple',
    '["React Native", "Expo", "Firebase", "TensorFlow", "Flask"]'::jsonb,
    1,
    TRUE
  ),
  (
    'BlogDRFProject',
    'blogdrf',
    'A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.',
    'https://github.com/Wajahat-Ali-Git/BlogDRFProject',
    NULL,
    FALSE,
    'blue',
    '["Django", "DRF", "Python", "PostgreSQL"]'::jsonb,
    2,
    TRUE
  ),
  (
    'OpenSea-Project',
    'opensea-project',
    'A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.',
    'https://github.com/Wajahat-Ali-Git/OpenSea-Project',
    NULL,
    FALSE,
    'teal',
    '["Web3", "Blockchain", "Solidity"]'::jsonb,
    3,
    TRUE
  ),
  (
    'chat-app',
    'chat-app',
    'A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.',
    'https://github.com/Wajahat-Ali-Git/chat-app',
    NULL,
    FALSE,
    'orange',
    '["React", "WebSockets", "Node.js"]'::jsonb,
    4,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  github_url = EXCLUDED.github_url,
  featured = EXCLUDED.featured,
  color = EXCLUDED.color,
  tech_stack = EXCLUDED.tech_stack,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- 2. SEED EXPERIENCES
INSERT INTO public.experiences (company_name, company_slug, role, location, start_date, end_date, is_current, description, achievements, tech_stack, display_order, is_visible)
VALUES
  (
    'CMIT Internship Program, Lahore',
    'cmit-internship',
    'Full Stack Development Intern',
    'Lahore, Pakistan',
    '2026-07-01',
    NULL,
    TRUE,
    'Architected a full-stack blog platform (React + Vite + Supabase PostgreSQL) with RBAC, JWT-based sessions, MFA/AAL2 step-up auth, complete CRUD with role-based post scheduling, and PostgreSQL cron jobs (pg_cron) for automated announcements and subscription lifecycle management.',
    '["Architected full-stack blog platform with RBAC & MFA", "Configured pg_cron jobs for background automation", "Implemented role-based post scheduling"]'::jsonb,
    '["React", "Vite", "Supabase", "PostgreSQL", "pg_cron"]'::jsonb,
    1,
    TRUE
  ),
  (
    'DevFlovv, Lahore',
    'devflovv',
    'Associate Software Engineer',
    'Lahore, Pakistan',
    '2025-06-01',
    '2026-06-30',
    FALSE,
    'Building scalable web applications and contributing to full-stack development projects.',
    '["Built scalable web application components", "Collaborated on production full-stack systems"]'::jsonb,
    '["Next.js", "TypeScript", "Node.js", "PostgreSQL"]'::jsonb,
    2,
    TRUE
  )
ON CONFLICT (company_slug) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  role = EXCLUDED.role,
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  is_current = EXCLUDED.is_current,
  tech_stack = EXCLUDED.tech_stack,
  display_order = EXCLUDED.display_order;

-- 3. SEED SKILLS
INSERT INTO public.skills (name, category, proficiency, display_order, is_visible)
VALUES
  ('JavaScript', 'language', 90, 1, TRUE),
  ('React', 'framework', 85, 2, TRUE),
  ('Django / Python', 'framework', 80, 3, TRUE),
  ('HTML / CSS', 'language', 92, 4, TRUE),
  ('SQL / PostgreSQL', 'database', 75, 5, TRUE),
  ('Git / GitHub', 'tool', 88, 6, TRUE)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  proficiency = EXCLUDED.proficiency,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- 4. SEED TOOLS
INSERT INTO public.tools (name, category, display_order, is_visible)
VALUES
  ('VS Code', 'editor', 1, TRUE),
  ('DBeaver', 'database', 2, TRUE),
  ('Postman', 'api', 3, TRUE),
  ('Zapier', 'automation', 4, TRUE),
  ('Docker', 'other', 5, TRUE),
  ('Bruno', 'api', 6, TRUE),
  ('Antigravity', 'other', 7, TRUE),
  ('ChatGPT', 'other', 8, TRUE)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- 5. SEED CERTIFICATIONS
INSERT INTO public.certifications (title, provider, certificate_type, display_order, is_visible)
VALUES
  ('Introduction to JavaScript', 'Great Learning', 'online', 1, TRUE),
  ('Drive Advertising Revenue with Google Ad Manager', 'Google', 'online', 2, TRUE),
  ('PITMAN ENGLISH', 'Pitman Training', 'online', 3, TRUE),
  ('Build a Full Website using WordPress', 'Coursera', 'online', 4, TRUE),
  ('Inter Services Public Relations Internship', 'ISPR', 'internship', 5, TRUE);
