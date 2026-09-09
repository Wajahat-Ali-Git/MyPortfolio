-- =============================================================================
-- Portfolio Content Database Schema
-- =============================================================================
-- This schema stores all dynamic content for the portfolio website
-- Allows CMS-like management of portfolio data
-- =============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. PROJECTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Info
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    
    -- Metadata
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'archived')),
    color VARCHAR(50) DEFAULT 'purple' CHECK (color IN ('purple', 'blue', 'teal', 'orange', 'green')),
    
    -- Technologies (JSON array)
    tech_stack JSONB NOT NULL DEFAULT '[]', -- ['React', 'Node.js', ...]
    
    -- Multi-language descriptions
    description_en TEXT,
    description_ur TEXT,
    description_hi TEXT,
    description_ar TEXT,
    description_fr TEXT,
    description_de TEXT,
    
    -- Display order
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_projects_featured ON projects (featured, display_order);
CREATE INDEX idx_projects_slug ON projects (slug);
CREATE INDEX idx_projects_visible ON projects (is_visible, display_order);

COMMENT ON TABLE projects IS 'Stores portfolio projects with multi-language support';

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. EXPERIENCE / WORK HISTORY TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Company Info
    company_name VARCHAR(200) NOT NULL,
    company_slug VARCHAR(200) UNIQUE NOT NULL,
    role VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    
    -- Duration
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means current
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Description
    description TEXT NOT NULL,
    achievements JSONB DEFAULT '[]', -- Array of bullet points
    
    -- Technologies used
    tech_stack JSONB DEFAULT '[]', -- ['React', 'Firebase', ...]
    
    -- Multi-language support
    role_en VARCHAR(200),
    role_ur VARCHAR(200),
    role_hi VARCHAR(200),
    description_en TEXT,
    description_ur TEXT,
    description_hi TEXT,
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_experiences_dates ON experiences (start_date DESC, end_date DESC);
CREATE INDEX idx_experiences_current ON experiences (is_current, display_order);
CREATE INDEX idx_experiences_visible ON experiences (is_visible, display_order);

COMMENT ON TABLE experiences IS 'Stores work experience and employment history';

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. SKILLS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Skill Info
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('language', 'framework', 'tool', 'database', 'other')),
    proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
    
    -- Metadata
    icon VARCHAR(100), -- Icon name/class
    color VARCHAR(50),
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_skills_category ON skills (category, display_order);
CREATE INDEX idx_skills_proficiency ON skills (proficiency DESC);
CREATE INDEX idx_skills_visible ON skills (is_visible, category, display_order);

COMMENT ON TABLE skills IS 'Stores technical skills with proficiency levels';

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. CERTIFICATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Certificate Info
    title VARCHAR(300) NOT NULL,
    provider VARCHAR(200) NOT NULL, -- 'Google', 'Coursera', etc.
    certificate_type VARCHAR(50) CHECK (certificate_type IN ('online', 'internship', 'degree', 'other')),
    
    -- Dates
    issue_date DATE,
    expiry_date DATE,
    
    -- Links
    credential_url VARCHAR(500),
    credential_id VARCHAR(200),
    
    -- Multi-language titles
    title_en VARCHAR(300),
    title_ur VARCHAR(300),
    title_hi VARCHAR(300),
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_certifications_provider ON certifications (provider);
CREATE INDEX idx_certifications_type ON certifications (certificate_type);
CREATE INDEX idx_certifications_visible ON certifications (is_visible, display_order);

COMMENT ON TABLE certifications IS 'Stores professional certifications and courses';

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. LANGUAGES (SPOKEN) TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE spoken_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Language Info
    language_code VARCHAR(10) NOT NULL UNIQUE, -- 'en', 'ur', 'hi'
    language_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50) CHECK (proficiency IN ('native', 'fluent', 'intermediate', 'basic', 'understand')),
    
    -- Display
    flag_emoji VARCHAR(10), -- '🇬🇧', '🇵🇰'
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Multi-language names
    name_en VARCHAR(100),
    name_ur VARCHAR(100),
    name_hi VARCHAR(100),
    proficiency_en VARCHAR(50),
    proficiency_ur VARCHAR(50),
    proficiency_hi VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_spoken_languages_visible ON spoken_languages (is_visible, display_order);

COMMENT ON TABLE spoken_languages IS 'Stores spoken language proficiencies';

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. HERO SECTION / PERSONAL INFO TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Info
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    bio TEXT,
    availability_status VARCHAR(100), -- 'Available for opportunities'
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(200),
    
    -- Social Links
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    
    -- Profile Images
    profile_image_url VARCHAR(500),
    resume_url VARCHAR(500),
    
    -- Multi-language bio
    bio_en TEXT,
    bio_ur TEXT,
    bio_hi TEXT,
    bio_ar TEXT,
    role_en VARCHAR(200),
    role_ur VARCHAR(200),
    role_hi VARCHAR(200),
    status_en VARCHAR(100),
    status_ur VARCHAR(100),
    status_hi VARCHAR(100),
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE personal_info IS 'Stores personal information and hero section content';

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. GITHUB STATS CACHE TABLE (Optional - for performance)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE github_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Repository Info
    repo_name VARCHAR(200) NOT NULL,
    repo_url VARCHAR(500) NOT NULL,
    description TEXT,
    language VARCHAR(100),
    
    -- Stats
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    watchers INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    
    -- Last Commit
    last_commit_message TEXT,
    last_commit_date TIMESTAMP WITH TIME ZONE,
    last_commit_sha VARCHAR(100),
    
    -- Metadata
    is_fork BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    
    -- Cache timestamp
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(repo_name)
);

CREATE INDEX idx_github_cache_updated ON github_cache (last_commit_date DESC);
CREATE INDEX idx_github_cache_fetched ON github_cache (fetched_at DESC);

COMMENT ON TABLE github_cache IS 'Caches GitHub repository data to reduce API calls';

-- ═══════════════════════════════════════════════════════════════════════════
-- 8. TOOLS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Tool Info
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) CHECK (category IN ('editor', 'database', 'api', 'automation', 'design', 'other')),
    icon VARCHAR(100),
    website_url VARCHAR(500),
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tools_category ON tools (category, display_order);
CREATE INDEX idx_tools_visible ON tools (is_visible, display_order);

COMMENT ON TABLE tools IS 'Stores development tools and software used';

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_projects_timestamp BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_experiences_timestamp BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_skills_timestamp BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_certifications_timestamp BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_spoken_languages_timestamp BEFORE UPDATE ON spoken_languages FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_personal_info_timestamp BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_github_cache_timestamp BEFORE UPDATE ON github_cache FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_tools_timestamp BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (for testing)
-- ═══════════════════════════════════════════════════════════════════════════

-- Sample Personal Info
INSERT INTO personal_info (full_name, role, bio, email, github_url, linkedin_url, is_active) VALUES
('Wajahat Ali', 'Software Engineer & Developer', 'I specialize in building scalable web and mobile applications.', 'your-email@example.com', 'https://github.com/Wajahat-Ali-Git', 'https://www.linkedin.com/in/wajahat-ali-b098b4243', TRUE);

-- Sample Projects
INSERT INTO projects (title, slug, description, github_url, tech_stack, featured, color, display_order) VALUES
('CARSAGE', 'carsage', 'A React Native car recommendation mobile app built with Expo', 'https://github.com/Wajahat-Ali-Git/CARSAGE', '["React Native", "Expo", "Firebase", "TensorFlow"]', TRUE, 'purple', 1),
('BlogDRFProject', 'blogdrf', 'A robust backend API for a blogging platform', 'https://github.com/Wajahat-Ali-Git/BlogDRFProject', '["Django", "DRF", "Python", "PostgreSQL"]', FALSE, 'blue', 2);

-- Sample Skills
INSERT INTO skills (name, category, proficiency, display_order) VALUES
('JavaScript', 'language', 90, 1),
('React', 'framework', 85, 2),
('Python', 'language', 80, 3),
('PostgreSQL', 'database', 75, 4);

-- Sample Tools
INSERT INTO tools (name, category, display_order) VALUES
('VS Code', 'editor', 1),
('DBeaver', 'database', 2),
('Postman', 'api', 3),
('Docker', 'other', 4);

-- ═══════════════════════════════════════════════════════════════════════════
-- SETUP COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════

-- Verify tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
