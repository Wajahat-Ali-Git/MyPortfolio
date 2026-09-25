-- =============================================================================
-- Portfolio Media Storage — Supabase Storage bucket for portfolio images & media
-- =============================================================================
-- Creates a public storage bucket called "portfolio-media" for hero images,
-- OG social preview cards, project images, and general portfolio media.
-- RLS is set on storage.objects so only authenticated admins may write,
-- while anyone may read (public access for site visitors).
-- =============================================================================

-- ─── 1. Create the storage bucket ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,               -- public bucket: objects are accessible via public URL
  10485760,           -- 10 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── 2. RLS policies on storage.objects ────────────────────────────────────

-- Allow anyone to read/download images from portfolio-media bucket
CREATE POLICY "Public can read portfolio media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Allow authenticated users (admin) to upload media files
CREATE POLICY "Authenticated users can upload portfolio media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

-- Allow authenticated users to update media files
CREATE POLICY "Authenticated users can update portfolio media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media')
  WITH CHECK (bucket_id = 'portfolio-media');

-- Allow authenticated users to delete media files
CREATE POLICY "Authenticated users can delete portfolio media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');
