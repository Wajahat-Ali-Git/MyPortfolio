// =============================================================================
// Skills Routes
// =============================================================================
// API endpoints for managing technical skills
// =============================================================================

const express = require('express');
const router = express.Router();
const { getDatabase } = require('../services/database');
const {
  validateLanguage,
  validateCategory,
  asyncHandler,
  sendError,
  sendSuccess,
  requireApiKey
} = require('../middleware/validation');

// =============================================================================
// GET /api/skills - Get all skills
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();

  const { data, error } = await db
    .from('skills')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return sendError(res, 500, 'Failed to fetch skills', error);
  }

  // Transform data
  const skills = (data || []).map(skill => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
    icon: skill.icon,
    color: skill.color,
    created_at: skill.created_at,
    updated_at: skill.updated_at
  }));

  return sendSuccess(res, skills);
}));

// =============================================================================
// GET /api/skills/category/:category - Get skills by category
// =============================================================================

router.get('/category/:category', validateLanguage, validateCategory, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { category } = req.params;

  const { data, error } = await db
    .from('skills')
    .select('*')
    .eq('is_visible', true)
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching skills by category:', error);
    return sendError(res, 500, 'Failed to fetch skills', error);
  }

  // Transform data
  const skills = (data || []).map(skill => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
    icon: skill.icon,
    color: skill.color
  }));

  return sendSuccess(res, skills);
}));

// =============================================================================
// POST /api/skills - Create new skill (Admin only)
// =============================================================================

router.post('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { name, category, proficiency, icon, color } = req.body;

  // Validation
  if (!name || !category || proficiency === undefined) {
    return sendError(res, 400, 'Missing required fields: name, category, proficiency');
  }

  if (proficiency < 0 || proficiency > 100) {
    return sendError(res, 400, 'Proficiency must be between 0 and 100');
  }

  const skillData = {
    name,
    category,
    proficiency,
    icon,
    color
  };

  const { data, error } = await db
    .from('skills')
    .insert([skillData])
    .select();

  if (error) {
    console.error('Error creating skill:', error);
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return sendError(res, 409, `Skill with name "${name}" already exists`);
    }
    
    return sendError(res, 500, 'Failed to create skill', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    data: data[0]
  });
}));

// =============================================================================
// PUT /api/skills/:id - Update skill (Admin only)
// =============================================================================

router.put('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;
  const updates = req.body;

  // Validate proficiency if present
  if (updates.proficiency !== undefined && (updates.proficiency < 0 || updates.proficiency > 100)) {
    return sendError(res, 400, 'Proficiency must be between 0 and 100');
  }

  const { data, error } = await db
    .from('skills')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating skill:', error);
    return sendError(res, 500, 'Failed to update skill', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Skill with ID "${id}" not found`);
  }

  return sendSuccess(res, data[0], 'Skill updated successfully');
}));

// =============================================================================
// DELETE /api/skills/:id - Delete skill (Admin only)
// =============================================================================

router.delete('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;

  const { data, error } = await db
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting skill:', error);
    return sendError(res, 500, 'Failed to delete skill', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Skill with ID "${id}" not found`);
  }

  return sendSuccess(res, null, 'Skill deleted successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
