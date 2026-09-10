// =============================================================================
// Experiences Routes
// =============================================================================
// API endpoints for managing work experience and employment history
// =============================================================================

const express = require('express');
const router = express.Router();
const { getDatabase, localizeRecord, parseJsonField } = require('../services/database');
const {
  validateLanguage,
  validateSlug,
  asyncHandler,
  sendError,
  sendSuccess,
  requireApiKey
} = require('../middleware/validation');

// =============================================================================
// GET /api/experiences - Get all work history (sorted by date)
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('experiences')
    .select('*')
    .eq('is_visible', true)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching experiences:', error);
    return sendError(res, 500, 'Failed to fetch experiences', error);
  }

  // Transform data with localization
  const experiences = (data || []).map(exp => {
    const localized = localizeRecord(exp, ['role', 'description'], lang);
    return {
      id: localized.id,
      company_name: localized.company_name,
      company_slug: localized.company_slug,
      role: localized.role,
      location: localized.location,
      start_date: localized.start_date,
      end_date: localized.end_date,
      is_current: localized.is_current,
      description: localized.description,
      achievements: parseJsonField(localized.achievements),
      tech_stack: parseJsonField(localized.tech_stack),
      created_at: localized.created_at,
      updated_at: localized.updated_at
    };
  });

  return sendSuccess(res, experiences);
}));

// =============================================================================
// GET /api/experiences/current - Get current position
// =============================================================================

router.get('/current', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('experiences')
    .select('*')
    .eq('is_visible', true)
    .eq('is_current', true)
    .order('start_date', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching current experience:', error);
    return sendError(res, 500, 'Failed to fetch current experience', error);
  }

  if (!data || data.length === 0) {
    return sendSuccess(res, null);
  }

  // Transform data with localization
  const exp = data[0];
  const localized = localizeRecord(exp, ['role', 'description'], lang);
  const experience = {
    id: localized.id,
    company_name: localized.company_name,
    company_slug: localized.company_slug,
    role: localized.role,
    location: localized.location,
    start_date: localized.start_date,
    description: localized.description,
    achievements: parseJsonField(localized.achievements),
    tech_stack: parseJsonField(localized.tech_stack)
  };

  return sendSuccess(res, experience);
}));

// =============================================================================
// GET /api/experiences/:slug - Get single experience by slug
// =============================================================================

router.get('/:slug', validateLanguage, validateSlug, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;
  const { slug } = req.params;

  const { data, error } = await db
    .from('experiences')
    .select('*')
    .eq('company_slug', slug)
    .eq('is_visible', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
      return sendError(res, 404, `Experience with slug "${slug}" not found`);
    }
    console.error('Error fetching experience:', error);
    return sendError(res, 500, 'Failed to fetch experience', error);
  }

  // Transform data with localization
  const localized = localizeRecord(data, ['role', 'description'], lang);
  const experience = {
    id: localized.id,
    company_name: localized.company_name,
    company_slug: localized.company_slug,
    role: localized.role,
    location: localized.location,
    start_date: localized.start_date,
    end_date: localized.end_date,
    is_current: localized.is_current,
    description: localized.description,
    achievements: parseJsonField(localized.achievements),
    tech_stack: parseJsonField(localized.tech_stack),
    created_at: localized.created_at,
    updated_at: localized.updated_at
  };

  return sendSuccess(res, experience);
}));

// =============================================================================
// POST /api/experiences - Create new experience (Admin only)
// =============================================================================

router.post('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const {
    company_name,
    company_slug,
    role,
    location,
    start_date,
    end_date,
    is_current,
    description,
    achievements,
    tech_stack
  } = req.body;

  // Validation
  if (!company_name || !company_slug || !role || !start_date || !description) {
    return sendError(res, 400, 'Missing required fields: company_name, company_slug, role, start_date, description');
  }

  const experienceData = {
    company_name,
    company_slug,
    role,
    role_en: role,
    location,
    start_date,
    end_date: end_date || null,
    is_current: is_current || false,
    description,
    description_en: description,
    achievements: JSON.stringify(achievements || []),
    tech_stack: JSON.stringify(tech_stack || [])
  };

  const { data, error } = await db
    .from('experiences')
    .insert([experienceData])
    .select();

  if (error) {
    console.error('Error creating experience:', error);
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return sendError(res, 409, `Experience with slug "${company_slug}" already exists`);
    }
    
    return sendError(res, 500, 'Failed to create experience', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Experience created successfully',
    data: data[0]
  });
}));

// =============================================================================
// PUT /api/experiences/:id - Update experience (Admin only)
// =============================================================================

router.put('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;
  const updates = req.body;

  // Convert arrays to JSON if present
  if (updates.achievements) {
    updates.achievements = JSON.stringify(updates.achievements);
  }
  if (updates.tech_stack) {
    updates.tech_stack = JSON.stringify(updates.tech_stack);
  }

  const { data, error } = await db
    .from('experiences')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating experience:', error);
    return sendError(res, 500, 'Failed to update experience', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Experience with ID "${id}" not found`);
  }

  return sendSuccess(res, data[0], 'Experience updated successfully');
}));

// =============================================================================
// DELETE /api/experiences/:id - Delete experience (Admin only)
// =============================================================================

router.delete('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;

  const { data, error } = await db
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting experience:', error);
    return sendError(res, 500, 'Failed to delete experience', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Experience with ID "${id}" not found`);
  }

  return sendSuccess(res, null, 'Experience deleted successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
