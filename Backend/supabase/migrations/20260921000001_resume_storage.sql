-- =============================================================================
-- Resume Storage — Supabase Storage bucket + site_settings seed
-- =============================================================================
-- Creates a public storage bucket called "resumes" for the admin-managed CV.
-- RLS is set on storage.objects so only authenticated admins may write,
-- while anyone may read (public download links for portfolio visitors).
--
-- The active resume's public URL is persisted in the existing site_settings
-- table under the key "resume_file_url".
-- =============================================================================

-- ─── 1. Create the storage bucket ───────────────────────────────────────────
-- NOTE: This is a Supabase Storage bucket. The INSERT into storage.buckets is
-- the standard way to create buckets via SQL migrations with the Supabase CLI.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  true,               -- public bucket: objects are accessible via public URL
  10485760,           -- 10 MB max file size
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── 2. RLS policies on storage.objects ────────────────────────────────────

-- Allow anyone to read/download objects from the resumes bucket
CREATE POLICY "Public can read resume files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

-- Allow authenticated users (admin) to upload new resume files
CREATE POLICY "Authenticated users can upload resume"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to replace (update) existing resume files
CREATE POLICY "Authenticated users can update resume"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to delete resume files
CREATE POLICY "Authenticated users can delete resume"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');

-- ─── 3. Seed resume_file_url key in site_settings ───────────────────────────
-- Start with an empty value; will be populated by the admin panel on first upload.
INSERT INTO site_settings (key, value)
VALUES ('resume_file_url', '')
ON CONFLICT (key) DO NOTHING;
