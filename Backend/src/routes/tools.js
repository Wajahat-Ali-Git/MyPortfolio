// =============================================================================
// Tools Routes
// =============================================================================
// API endpoints for managing development tools
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
// GET /api/tools - Get all tools
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();

  const { data, error } = await db
    .from('tools')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching tools:', error);
    return sendError(res, 500, 'Failed to fetch tools', error);
  }

  // Transform data
  const tools = (data || []).map(tool => ({
    id: tool.id,
    name: tool.name,
    category: tool.category,
    icon: tool.icon,
    website_url: tool.website_url,
    created_at: tool.created_at,
    updated_at: tool.updated_at
  }));

  return sendSuccess(res, tools);
}));

// =============================================================================
// GET /api/tools/category/:category - Get tools by category
// =============================================================================

router.get('/category/:category', validateLanguage, validateCategory, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { category } = req.params;

  const { data, error } = await db
    .from('tools')
    .select('*')
    .eq('is_visible', true)
    .eq('category', category)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching tools by category:', error);
    return sendError(res, 500, 'Failed to fetch tools', error);
  }

  // Transform data
  const tools = (data || []).map(tool => ({
    id: tool.id,
    name: tool.name,
    category: tool.category,
    icon: tool.icon,
    website_url: tool.website_url
  }));

  return sendSuccess(res, tools);
}));

// =============================================================================
// POST /api/tools - Create new tool (Admin only)
// =============================================================================

router.post('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { name, category, icon, website_url } = req.body;

  // Validation
  if (!name || !category) {
    return sendError(res, 400, 'Missing required fields: name, category');
  }

  const toolData = {
    name,
    category,
    icon,
    website_url
  };

  const { data, error } = await db
    .from('tools')
    .insert([toolData])
    .select();

  if (error) {
    console.error('Error creating tool:', error);
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return sendError(res, 409, `Tool with name "${name}" already exists`);
    }
    
    return sendError(res, 500, 'Failed to create tool', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Tool created successfully',
    data: data[0]
  });
}));

// =============================================================================
// PUT /api/tools/:id - Update tool (Admin only)
// =============================================================================

router.put('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await db
    .from('tools')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating tool:', error);
    return sendError(res, 500, 'Failed to update tool', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Tool with ID "${id}" not found`);
  }

  return sendSuccess(res, data[0], 'Tool updated successfully');
}));

// =============================================================================
// DELETE /api/tools/:id - Delete tool (Admin only)
// =============================================================================

router.delete('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;

  const { data, error } = await db
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    return sendError(res, 500, 'Failed to delete tool', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Tool with ID "${id}" not found`);
  }

  return sendSuccess(res, null, 'Tool deleted successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
