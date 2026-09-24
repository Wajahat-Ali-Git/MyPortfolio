-- =============================================================================
-- Admin Activity Audit Log Schema & Security Setup
-- =============================================================================
-- This migration creates the `admin_activity_logs` table to record administrative actions
-- performed through the portfolio CMS (Create, Update, Delete, Visibility Toggles, Resume Updates, Settings).
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email VARCHAR(255) NOT NULL,
    admin_id VARCHAR(100),
    action VARCHAR(100) NOT NULL,    -- e.g. 'CREATE', 'UPDATE', 'DELETE', 'TOGGLE_VISIBILITY', 'SETTINGS_CHANGE'
    resource VARCHAR(100) NOT NULL,  -- e.g. 'projects', 'experiences', 'skills', 'tools', 'certifications', 'resume', 'site_settings'
    resource_id VARCHAR(100),
    details JSONB DEFAULT '{}',      -- Structured info (item title, changed keys, etc.)
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Performance indexes for auditing, filtering, and reporting
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_email ON admin_activity_logs (admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_logs (action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_resource ON admin_activity_logs (resource);

COMMENT ON TABLE admin_activity_logs IS 'Audit log of administrative actions performed in the portfolio CMS';

-- Row Level Security (RLS)
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read audit logs
CREATE POLICY "Allow authenticated users select admin_activity_logs"
ON admin_activity_logs FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert audit logs
CREATE POLICY "Allow authenticated users insert admin_activity_logs"
ON admin_activity_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Prevent unauthorized deletion or mutation of historical audit logs
CREATE POLICY "Prevent delete admin_activity_logs"
ON admin_activity_logs FOR DELETE
TO authenticated
USING (false);
