-- =============================================================================
-- SUPABASE RPC FUNCTIONS & POLICIES
-- =============================================================================
-- Advanced Supabase features: RPC functions, RLS policies, triggers
-- Run this AFTER schema-portfolio-content.sql
-- =============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE spoken_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS POLICIES - PUBLIC READ, AUTHENTICATED WRITE
-- ═══════════════════════════════════════════════════════════════════════════

-- Projects Policies
CREATE POLICY "Public can view visible projects"
  ON projects FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Experiences Policies
CREATE POLICY "Public can view visible experiences"
  ON experiences FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage experiences"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated');

-- Skills Policies
CREATE POLICY "Public can view visible skills"
  ON skills FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated');

-- Certifications Policies
CREATE POLICY "Public can view visible certifications"
  ON certifications FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage certifications"
  ON certifications FOR ALL
  USING (auth.role() = 'authenticated');

-- Spoken Languages Policies
CREATE POLICY "Public can view visible languages"
  ON spoken_languages FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage languages"
  ON spoken_languages FOR ALL
  USING (auth.role() = 'authenticated');

-- Personal Info Policies
CREATE POLICY "Public can view active personal info"
  ON personal_info FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage personal info"
  ON personal_info FOR ALL
  USING (auth.role() = 'authenticated');

-- GitHub Cache Policies
CREATE POLICY "Public can view non-private repos"
  ON github_cache FOR SELECT
  USING (is_private = false AND is_archived = false);

CREATE POLICY "Authenticated users can manage github cache"
  ON github_cache FOR ALL
  USING (auth.role() = 'authenticated');

-- Tools Policies
CREATE POLICY "Public can view visible tools"
  ON tools FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage tools"
  ON tools FOR ALL
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET PROJECTS WITH FILTERS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_projects(
  p_lang VARCHAR DEFAULT 'en',
  p_featured_only BOOLEAN DEFAULT FALSE,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  github_url VARCHAR,
  live_url VARCHAR,
  featured BOOLEAN,
  status VARCHAR,
  color VARCHAR,
  tech_stack JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN p.description_en
        WHEN 'ur' THEN p.description_ur
        WHEN 'hi' THEN p.description_hi
        WHEN 'ar' THEN p.description_ar
        WHEN 'fr' THEN p.description_fr
        WHEN 'de' THEN p.description_de
        ELSE p.description_en
      END,
      p.description
    ) as description,
    p.github_url,
    p.live_url,
    p.featured,
    p.status,
    p.color,
    p.tech_stack,
    p.created_at,
    p.updated_at
  FROM projects p
  WHERE p.is_visible = true
    AND (NOT p_featured_only OR p.featured = true)
  ORDER BY p.display_order ASC
  LIMIT p_limit;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET PROJECT BY SLUG
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_project_by_slug(
  p_slug VARCHAR,
  p_lang VARCHAR DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  github_url VARCHAR,
  live_url VARCHAR,
  featured BOOLEAN,
  status VARCHAR,
  color VARCHAR,
  tech_stack JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN p.description_en
        WHEN 'ur' THEN p.description_ur
        WHEN 'hi' THEN p.description_hi
        WHEN 'ar' THEN p.description_ar
        WHEN 'fr' THEN p.description_fr
        WHEN 'de' THEN p.description_de
        ELSE p.description_en
      END,
      p.description
    ) as description,
    p.github_url,
    p.live_url,
    p.featured,
    p.status,
    p.color,
    p.tech_stack,
    p.created_at,
    p.updated_at
  FROM projects p
  WHERE p.slug = p_slug AND p.is_visible = true
  LIMIT 1;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET EXPERIENCES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_experiences(
  p_lang VARCHAR DEFAULT 'en',
  p_current_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID,
  company_name VARCHAR,
  company_slug VARCHAR,
  role VARCHAR,
  location VARCHAR,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN,
  description TEXT,
  achievements JSONB,
  tech_stack JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.company_name,
    e.company_slug,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN e.role_en
        WHEN 'ur' THEN e.role_ur
        WHEN 'hi' THEN e.role_hi
        ELSE e.role_en
      END,
      e.role
    ) as role,
    e.location,
    e.start_date,
    e.end_date,
    e.is_current,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN e.description_en
        WHEN 'ur' THEN e.description_ur
        WHEN 'hi' THEN e.description_hi
        ELSE e.description_en
      END,
      e.description
    ) as description,
    e.achievements,
    e.tech_stack,
    e.created_at,
    e.updated_at
  FROM experiences e
  WHERE e.is_visible = true
    AND (NOT p_current_only OR e.is_current = true)
  ORDER BY e.start_date DESC
  LIMIT CASE WHEN p_current_only THEN 1 ELSE 100 END;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET SKILLS BY CATEGORY
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_skills(
  p_category VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  category VARCHAR,
  proficiency INTEGER,
  icon VARCHAR,
  color VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.category,
    s.proficiency,
    s.icon,
    s.color,
    s.created_at,
    s.updated_at
  FROM skills s
  WHERE s.is_visible = true
    AND (p_category IS NULL OR s.category = p_category)
  ORDER BY s.display_order ASC, s.proficiency DESC;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET CERTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_certifications(
  p_lang VARCHAR DEFAULT 'en',
  p_certificate_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  provider VARCHAR,
  certificate_type VARCHAR,
  issue_date DATE,
  expiry_date DATE,
  credential_url VARCHAR,
  credential_id VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN c.title_en
        WHEN 'ur' THEN c.title_ur
        WHEN 'hi' THEN c.title_hi
        ELSE c.title_en
      END,
      c.title
    ) as title,
    c.provider,
    c.certificate_type,
    c.issue_date,
    c.expiry_date,
    c.credential_url,
    c.credential_id,
    c.created_at,
    c.updated_at
  FROM certifications c
  WHERE c.is_visible = true
    AND (p_certificate_type IS NULL OR c.certificate_type = p_certificate_type)
  ORDER BY c.display_order ASC;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET PROFILE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_profile(
  p_lang VARCHAR DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  full_name VARCHAR,
  role VARCHAR,
  bio TEXT,
  availability_status VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  location VARCHAR,
  github_url VARCHAR,
  linkedin_url VARCHAR,
  twitter_url VARCHAR,
  portfolio_url VARCHAR,
  profile_image_url VARCHAR,
  resume_url VARCHAR,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN p.role_en
        WHEN 'ur' THEN p.role_ur
        WHEN 'hi' THEN p.role_hi
        ELSE p.role_en
      END,
      p.role
    ) as role,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN p.bio_en
        WHEN 'ur' THEN p.bio_ur
        WHEN 'hi' THEN p.bio_hi
        WHEN 'ar' THEN p.bio_ar
        ELSE p.bio_en
      END,
      p.bio
    ) as bio,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN p.status_en
        WHEN 'ur' THEN p.status_ur
        WHEN 'hi' THEN p.status_hi
        ELSE p.status_en
      END,
      p.availability_status
    ) as availability_status,
    p.email,
    p.phone,
    p.location,
    p.github_url,
    p.linkedin_url,
    p.twitter_url,
    p.portfolio_url,
    p.profile_image_url,
    p.resume_url,
    p.updated_at
  FROM personal_info p
  WHERE p.is_active = true
  LIMIT 1;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET TOOLS BY CATEGORY
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_tools(
  p_category VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  category VARCHAR,
  icon VARCHAR,
  website_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.category,
    t.icon,
    t.website_url,
    t.created_at,
    t.updated_at
  FROM tools t
  WHERE t.is_visible = true
    AND (p_category IS NULL OR t.category = p_category)
  ORDER BY t.display_order ASC;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET GITHUB REPOSITORIES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_github_repos(
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  repo_name VARCHAR,
  repo_url VARCHAR,
  description TEXT,
  language VARCHAR,
  stars INTEGER,
  forks INTEGER,
  watchers INTEGER,
  open_issues INTEGER,
  last_commit_message TEXT,
  last_commit_date TIMESTAMP WITH TIME ZONE,
  is_fork BOOLEAN,
  fetched_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.repo_name,
    g.repo_url,
    g.description,
    g.language,
    g.stars,
    g.forks,
    g.watchers,
    g.open_issues,
    g.last_commit_message,
    g.last_commit_date,
    g.is_fork,
    g.fetched_at
  FROM github_cache g
  WHERE g.is_private = false AND g.is_archived = false
  ORDER BY g.last_commit_date DESC NULLS LAST
  LIMIT p_limit;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET GITHUB STATISTICS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_github_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_repos', COUNT(*),
    'total_stars', COALESCE(SUM(stars), 0),
    'total_forks', COALESCE(SUM(forks), 0),
    'total_watchers', COALESCE(SUM(watchers), 0),
    'languages', (
      SELECT json_agg(DISTINCT language)
      FROM github_cache
      WHERE language IS NOT NULL AND is_private = false
    ),
    'last_updated', MAX(fetched_at)
  )
  INTO result
  FROM github_cache
  WHERE is_private = false;
  
  RETURN result;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET SPOKEN LANGUAGES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_spoken_languages(
  p_lang VARCHAR DEFAULT 'en'
)
RETURNS TABLE (
  id UUID,
  language_code VARCHAR,
  language_name VARCHAR,
  proficiency VARCHAR,
  flag_emoji VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.language_code,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN l.name_en
        WHEN 'ur' THEN l.name_ur
        WHEN 'hi' THEN l.name_hi
        ELSE l.name_en
      END,
      l.language_name
    ) as language_name,
    COALESCE(
      CASE p_lang
        WHEN 'en' THEN l.proficiency_en
        WHEN 'ur' THEN l.proficiency_ur
        WHEN 'hi' THEN l.proficiency_hi
        ELSE l.proficiency_en
      END,
      l.proficiency
    ) as proficiency,
    l.flag_emoji,
    l.created_at,
    l.updated_at
  FROM spoken_languages l
  WHERE l.is_visible = true
  ORDER BY l.display_order ASC;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: SEARCH CONTENT (Full Text Search)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION search_portfolio(
  p_query TEXT,
  p_lang VARCHAR DEFAULT 'en'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'projects', (
      SELECT json_agg(
        json_build_object(
          'id', id,
          'title', title,
          'slug', slug,
          'type', 'project'
        )
      )
      FROM projects
      WHERE is_visible = true
        AND (
          title ILIKE '%' || p_query || '%'
          OR description ILIKE '%' || p_query || '%'
          OR description_en ILIKE '%' || p_query || '%'
        )
      LIMIT 5
    ),
    'experiences', (
      SELECT json_agg(
        json_build_object(
          'id', id,
          'company_name', company_name,
          'role', role,
          'type', 'experience'
        )
      )
      FROM experiences
      WHERE is_visible = true
        AND (
          company_name ILIKE '%' || p_query || '%'
          OR role ILIKE '%' || p_query || '%'
          OR description ILIKE '%' || p_query || '%'
        )
      LIMIT 5
    ),
    'skills', (
      SELECT json_agg(
        json_build_object(
          'id', id,
          'name', name,
          'category', category,
          'type', 'skill'
        )
      )
      FROM skills
      WHERE is_visible = true
        AND name ILIKE '%' || p_query || '%'
      LIMIT 5
    )
  )
  INTO result;
  
  RETURN result;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC FUNCTION: GET PORTFOLIO SUMMARY
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION get_portfolio_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_projects', (SELECT COUNT(*) FROM projects WHERE is_visible = true),
    'featured_projects', (SELECT COUNT(*) FROM projects WHERE is_visible = true AND featured = true),
    'total_experiences', (SELECT COUNT(*) FROM experiences WHERE is_visible = true),
    'current_position', (SELECT company_name FROM experiences WHERE is_current = true LIMIT 1),
    'total_skills', (SELECT COUNT(*) FROM skills WHERE is_visible = true),
    'total_certifications', (SELECT COUNT(*) FROM certifications WHERE is_visible = true),
    'github_repos', (SELECT COUNT(*) FROM github_cache WHERE is_private = false),
    'github_stars', (SELECT COALESCE(SUM(stars), 0) FROM github_cache WHERE is_private = false),
    'last_updated', NOW()
  )
  INTO result;
  
  RETURN result;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- CREATE INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════

-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_projects_description_search ON projects USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_experiences_description_search ON experiences USING gin(to_tsvector('english', description));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_featured_visible ON projects(featured, is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_current_visible ON experiences(is_current, is_visible, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_skills_category_visible ON skills(category, is_visible, display_order);

-- ═══════════════════════════════════════════════════════════════════════════
-- GRANT PERMISSIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_projects TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_project_by_slug TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_experiences TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_skills TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_certifications TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_profile TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_tools TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_github_repos TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_github_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_spoken_languages TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_portfolio TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_portfolio_summary TO authenticated, anon;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERY
-- ═══════════════════════════════════════════════════════════════════════════

-- List all RPC functions
SELECT 
  routine_name as function_name,
  routine_type as type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'get_%'
  OR routine_name = 'search_portfolio'
ORDER BY routine_name;

-- ═══════════════════════════════════════════════════════════════════════════
-- SETUP COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════

COMMENT ON FUNCTION get_projects IS 'Get all visible projects with language support';
COMMENT ON FUNCTION get_project_by_slug IS 'Get single project by slug';
COMMENT ON FUNCTION get_experiences IS 'Get all experiences with language support';
COMMENT ON FUNCTION get_skills IS 'Get skills filtered by category';
COMMENT ON FUNCTION get_certifications IS 'Get certifications with language support';
COMMENT ON FUNCTION get_profile IS 'Get active profile with language support';
COMMENT ON FUNCTION get_tools IS 'Get tools filtered by category';
COMMENT ON FUNCTION get_github_repos IS 'Get cached GitHub repositories';
COMMENT ON FUNCTION get_github_stats IS 'Get GitHub statistics summary';
COMMENT ON FUNCTION get_spoken_languages IS 'Get spoken languages with proficiency';
COMMENT ON FUNCTION search_portfolio IS 'Full-text search across portfolio content';
COMMENT ON FUNCTION get_portfolio_summary IS 'Get portfolio statistics summary';
