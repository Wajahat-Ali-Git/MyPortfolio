-- =============================================================================
-- CONTACT MESSAGES TABLE & RLS POLICIES
-- =============================================================================
-- Stores contact form submissions from portfolio

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE (including unauthenticated visitors) to INSERT contact messages
CREATE POLICY "Allow public insert on contact_messages"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Allow only authenticated users (admin) to SELECT/view messages
CREATE POLICY "Allow authenticated read on contact_messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow only authenticated users (admin) to UPDATE messages (e.g., mark as read)
CREATE POLICY "Allow authenticated update on contact_messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow only authenticated users (admin) to DELETE messages
CREATE POLICY "Allow authenticated delete on contact_messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
