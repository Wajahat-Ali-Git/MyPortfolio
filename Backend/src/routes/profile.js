// =============================================================================
// Profile Routes
// =============================================================================
// API endpoints for managing personal information and hero section content
// =============================================================================

const express = require('express');
const router = express.Router();
const { getDatabase, localizeRecord } = require('../services/database');
const {
  validateLanguage,
  asyncHandler,
  sendError,
  sendSuccess,
  requireApiKey
} = require('../middleware/validation');

// =============================================================================
// GET /api/profile - Get profile information
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('personal_info')
    .select('*')
    .eq('is_active', true)
    .limit(1);

  if (error) {
    console.error('Error fetching profile:', error);
    return sendError(res, 500, 'Failed to fetch profile', error);
  }

  if (!data || data.length === 0) {
    return sendSuccess(res, null);
  }

  // Transform data with localization
  const profile = data[0];
  const localized = localizeRecord(profile, ['bio', 'role', 'status'], lang);

  const result = {
    id: localized.id,
    full_name: localized.full_name,
    role: localized.role || localized.role_en,
    bio: localized.bio || localized.bio_en,
    availability_status: localized.status || localized.status_en,
    email: localized.email,
    phone: localized.phone,
    location: localized.location,
    github_url: localized.github_url,
    linkedin_url: localized.linkedin_url,
    twitter_url: localized.twitter_url,
    portfolio_url: localized.portfolio_url,
    profile_image_url: localized.profile_image_url,
    resume_url: localized.resume_url,
    updated_at: localized.updated_at
  };

  return sendSuccess(res, result);
}));

// =============================================================================
// PUT /api/profile - Update profile (Admin only)
// =============================================================================

router.put('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const updates = req.body;

  // Get the active profile ID
  const { data: existingProfiles, error: fetchError } = await db
    .from('personal_info')
    .select('id')
    .eq('is_active', true)
    .limit(1);

  if (fetchError) {
    console.error('Error fetching profile:', fetchError);
    return sendError(res, 500, 'Failed to fetch profile', fetchError);
  }

  if (!existingProfiles || existingProfiles.length === 0) {
    // No profile exists, create one
    const { data: newProfile, error: createError } = await db
      .from('personal_info')
      .insert([{ ...updates, is_active: true }])
      .select();

    if (createError) {
      console.error('Error creating profile:', createError);
      return sendError(res, 500, 'Failed to create profile', createError);
    }

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: newProfile[0]
    });
  }

  // Update existing profile
  const profileId = existingProfiles[0].id;
  const { data, error } = await db
    .from('personal_info')
    .update(updates)
    .eq('id', profileId);

  if (error) {
    console.error('Error updating profile:', error);
    return sendError(res, 500, 'Failed to update profile', error);
  }

  return sendSuccess(res, data[0], 'Profile updated successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
