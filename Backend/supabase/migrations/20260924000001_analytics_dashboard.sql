-- =============================================================================
-- Portfolio Analytics Database Schema & Security Setup
-- =============================================================================
-- This migration creates tables for tracking visitor page views and interaction events.
-- Row-level security (RLS) allows anonymous inserts for telemetry and restricts reads to admin users.
-- =============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. PAGE VIEWS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    visitor_id VARCHAR(100) NOT NULL,
    path VARCHAR(500) NOT NULL DEFAULT '/',
    title VARCHAR(500),
    referrer VARCHAR(500),
    device_type VARCHAR(50) DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50) DEFAULT 'Unknown',
    os VARCHAR(50) DEFAULT 'Unknown',
    country VARCHAR(100) DEFAULT 'Unknown',
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexing for performance on dashboard queries
CREATE INDEX IF NOT EXISTS idx_analytics_pv_created_at ON analytics_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_visitor_id ON analytics_page_views (visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_session_id ON analytics_page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_path ON analytics_page_views (path);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_device ON analytics_page_views (device_type);

COMMENT ON TABLE analytics_page_views IS 'Stores page view analytics for visitor insights';

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. INTERACTION EVENTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    visitor_id VARCHAR(100) NOT NULL,
    event_category VARCHAR(100) NOT NULL, -- e.g. 'click', 'download', 'form_submit', 'section_view'
    event_name VARCHAR(100) NOT NULL,     -- e.g. 'resume_download', 'github_click', 'project_demo_click'
    event_label VARCHAR(250),              -- e.g. 'Resume PDF', 'Project: AI SaaS'
    path VARCHAR(500) DEFAULT '/',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexing for event analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events (event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events (visitor_id);

COMMENT ON TABLE analytics_events IS 'Stores user interaction events like button clicks, downloads, and form submissions';

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts (for tracking visits and events without auth token)
CREATE POLICY "Allow public anonymous insert to analytics_page_views"
ON analytics_page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public anonymous insert to analytics_events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Restrict read/select/delete to authenticated admin users only
CREATE POLICY "Allow authenticated users select analytics_page_views"
ON analytics_page_views FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users select analytics_events"
ON analytics_events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users delete analytics_page_views"
ON analytics_page_views FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users delete analytics_events"
ON analytics_events FOR DELETE
TO authenticated
USING (true);
