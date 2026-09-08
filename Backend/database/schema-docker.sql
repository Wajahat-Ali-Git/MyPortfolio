-- =============================================================================
-- Portfolio Backend Database Schema - Docker Version
-- =============================================================================
-- This file is automatically run when PostgreSQL container first starts
-- =============================================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS contact_messages CASCADE;

-- =============================================================================
-- CONTACT MESSAGES TABLE
-- =============================================================================

CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (char_length(email) >= 5 AND char_length(email) <= 255),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),
    
    ip_address TEXT,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX idx_contact_messages_email ON contact_messages (email);

-- =============================================================================
-- UPDATE TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE contact_messages IS 'Stores all contact form submissions';
COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for each message';
COMMENT ON COLUMN contact_messages.name IS 'Name of the person contacting';
COMMENT ON COLUMN contact_messages.email IS 'Email address of the person contacting';
COMMENT ON COLUMN contact_messages.message IS 'The message content';

-- =============================================================================
-- SAMPLE DATA (Optional)
-- =============================================================================

-- Uncomment to insert test data
-- INSERT INTO contact_messages (name, email, message) VALUES
--     ('John Doe', 'john@example.com', 'This is a test message from Docker setup.'),
--     ('Jane Smith', 'jane@example.com', 'Testing the local database connection.');

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Display table info
DO $$
BEGIN
    RAISE NOTICE 'Database schema initialized successfully!';
    RAISE NOTICE 'Table: contact_messages created';
END $$;
