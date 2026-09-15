-- =============================================================================
-- FIX: Admin RLS SELECT Policies
-- =============================================================================
-- Problem: The existing SELECT policies only allow reading rows where
-- is_visible = true. This means authenticated admin users cannot see hidden
-- items in the admin panel, making them impossible to un-hide.
--
-- Fix: Add explicit SELECT policies for authenticated users that allow
-- reading ALL rows regardless of is_visible status.
-- =============================================================================

-- Projects: existing policy "Public can view visible projects" restricts to is_visible=true
-- The "Authenticated users can insert/update/delete" policies don't cover SELECT
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

-- Skills: existing policy "Public can view visible skills" restricts to is_visible=true
CREATE POLICY "Authenticated users can view all skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

-- Tools: same issue
CREATE POLICY "Authenticated users can view all tools"
  ON tools FOR SELECT
  TO authenticated
  USING (true);

-- Certifications: same issue
CREATE POLICY "Authenticated users can view all certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (true);

-- Spoken Languages: same issue
CREATE POLICY "Authenticated users can view all spoken_languages"
  ON spoken_languages FOR SELECT
  TO authenticated
  USING (true);

-- Experiences: has FOR ALL policy which covers SELECT for authenticated,
-- but the public SELECT restricts to is_visible=true. Add explicit for safety.
CREATE POLICY "Authenticated users can view all experiences"
  ON experiences FOR SELECT
  TO authenticated
  USING (true);

-- Personal Info: has FOR ALL policy which covers SELECT for authenticated,
-- but the public SELECT restricts to is_active=true. Add explicit for safety.
CREATE POLICY "Authenticated users can view all personal_info"
  ON personal_info FOR SELECT
  TO authenticated
  USING (true);
