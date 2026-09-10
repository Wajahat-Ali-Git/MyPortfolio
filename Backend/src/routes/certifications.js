// =============================================================================
// Certifications Routes
// =============================================================================
// API endpoints for managing professional certifications
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
// GET /api/certifications - Get all certifications
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('certifications')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching certifications:', error);
    return sendError(res, 500, 'Failed to fetch certifications', error);
  }

  // Transform data with localization
  const certifications = (data || []).map(cert => {
    const localized = localizeRecord(cert, ['title'], lang);
    return {
      id: localized.id,
      title: localized.title,
      provider: localized.provider,
      certificate_type: localized.certificate_type,
      issue_date: localized.issue_date,
      expiry_date: localized.expiry_date,
      credential_url: localized.credential_url,
      credential_id: localized.credential_id,
      created_at: localized.created_at,
      updated_at: localized.updated_at
    };
  });

  return sendSuccess(res, certifications);
}));

// =============================================================================
// POST /api/certifications - Create new certification (Admin only)
// =============================================================================

router.post('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const {
    title,
    provider,
    certificate_type,
    issue_date,
    expiry_date,
    credential_url,
    credential_id
  } = req.body;

  // Validation
  if (!title || !provider) {
    return sendError(res, 400, 'Missing required fields: title, provider');
  }

  const certData = {
    title,
    title_en: title,
    provider,
    certificate_type,
    issue_date,
    expiry_date,
    credential_url,
    credential_id
  };

  const { data, error } = await db
    .from('certifications')
    .insert([certData])
    .select();

  if (error) {
    console.error('Error creating certification:', error);
    return sendError(res, 500, 'Failed to create certification', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Certification created successfully',
    data: data[0]
  });
}));

// =============================================================================
// PUT /api/certifications/:id - Update certification (Admin only)
// =============================================================================

router.put('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await db
    .from('certifications')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating certification:', error);
    return sendError(res, 500, 'Failed to update certification', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Certification with ID "${id}" not found`);
  }

  return sendSuccess(res, data[0], 'Certification updated successfully');
}));

// =============================================================================
// DELETE /api/certifications/:id - Delete certification (Admin only)
// =============================================================================

router.delete('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;

  const { data, error } = await db
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting certification:', error);
    return sendError(res, 500, 'Failed to delete certification', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Certification with ID "${id}" not found`);
  }

  return sendSuccess(res, null, 'Certification deleted successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
