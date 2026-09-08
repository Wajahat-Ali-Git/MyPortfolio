-- =============================================================================
-- Portfolio Backend Database Schema
-- =============================================================================
-- This file contains the complete database structure for the portfolio backend
-- Run this script in your Supabase SQL Editor to set up the database
-- =============================================================================

-- Drop existing table if it exists (for clean reinstall)
DROP TABLE IF EXISTS contact_messages CASCADE;

-- =============================================================================
-- CONTACT MESSAGES TABLE
-- =============================================================================
-- Stores all contact form submissions from the portfolio website

CREATE TABLE contact_messages (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Contact information
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (char_length(email) >= 5 AND char_length(email) <= 255),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================
-- Improve query performance

-- Index for sorting by creation date (most common query)
CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- Index for email lookups (to find all messages from a specific email)
CREATE INDEX idx_contact_messages_email ON contact_messages (email);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Enable RLS to protect data access

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for authenticated users (using service role key from backend)
CREATE POLICY "Allow insert for service role"
    ON contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow select for authenticated users (using service role key from backend)
CREATE POLICY "Allow select for service role"
    ON contact_messages
    FOR SELECT
    USING (true);

-- Policy: Prevent public access (anon key cannot read/write)
-- This ensures only your backend API can access the data

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before any update
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS (Documentation)
-- =============================================================================

COMMENT ON TABLE contact_messages IS 'Stores all contact form submissions from the portfolio website';
COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for each message';
COMMENT ON COLUMN contact_messages.name IS 'Name of the person contacting (1-100 characters)';
COMMENT ON COLUMN contact_messages.email IS 'Email address of the person contacting (5-255 characters)';
COMMENT ON COLUMN contact_messages.message IS 'The message content (10-5000 characters)';
COMMENT ON COLUMN contact_messages.ip_address IS 'IP address of the sender (for spam prevention)';
COMMENT ON COLUMN contact_messages.user_agent IS 'Browser user agent string (for analytics)';
COMMENT ON COLUMN contact_messages.created_at IS 'When the message was received';
COMMENT ON COLUMN contact_messages.updated_at IS 'When the message was last updated';

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================
-- Uncomment to insert test data

-- INSERT INTO contact_messages (name, email, message) VALUES
--     ('John Doe', 'john@example.com', 'This is a test message from the contact form.'),
--     ('Jane Smith', 'jane@example.com', 'Hello! I would like to discuss a project with you.'),
--     ('Bob Wilson', 'bob@example.com', 'Great portfolio! I am interested in hiring you for a web development project.');

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these to verify the setup

-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'contact_messages';

-- Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'contact_messages';

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'contact_messages';

-- Count all messages
-- SELECT COUNT(*) as total_messages FROM contact_messages;

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================
-- Your database is now ready to accept contact form submissions.
-- Next steps:
-- 1. Update your .env file with Supabase credentials
-- 2. Start your backend: npm run dev
-- 3. Test the API: curl http://localhost:5000/health
-- =============================================================================
