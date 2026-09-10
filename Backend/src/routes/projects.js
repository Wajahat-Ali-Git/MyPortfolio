// =============================================================================
// Projects Routes
// =============================================================================
// API endpoints for managing portfolio projects
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
// GET /api/projects - Get all visible projects
// =============================================================================

router.get('/', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return sendError(res, 500, 'Failed to fetch projects', error);
  }

  // Transform data with localization
  const projects = (data || []).map(project => {
    const localized = localizeRecord(project, ['description'], lang);
    return {
      id: localized.id,
      title: localized.title,
      slug: localized.slug,
      description: localized.description,
      github_url: localized.github_url,
      live_url: localized.live_url,
      featured: localized.featured,
      status: localized.status,
      color: localized.color,
      tech_stack: parseJsonField(localized.tech_stack),
      created_at: localized.created_at,
      updated_at: localized.updated_at
    };
  });

  return sendSuccess(res, projects);
}));

// =============================================================================
// GET /api/projects/featured - Get featured projects only
// =============================================================================

router.get('/featured', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .eq('featured', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured projects:', error);
    return sendError(res, 500, 'Failed to fetch featured projects', error);
  }

  // Transform data with localization
  const projects = (data || []).map(project => {
    const localized = localizeRecord(project, ['description'], lang);
    return {
      id: localized.id,
      title: localized.title,
      slug: localized.slug,
      description: localized.description,
      github_url: localized.github_url,
      live_url: localized.live_url,
      color: localized.color,
      tech_stack: parseJsonField(localized.tech_stack),
      created_at: localized.created_at
    };
  });

  return sendSuccess(res, projects);
}));

// =============================================================================
// GET /api/projects/:slug - Get single project by slug
// =============================================================================

router.get('/:slug', validateLanguage, validateSlug, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const lang = req.lang;
  const { slug } = req.params;

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_visible', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
      return sendError(res, 404, `Project with slug "${slug}" not found`);
    }
    console.error('Error fetching project:', error);
    return sendError(res, 500, 'Failed to fetch project', error);
  }

  // Transform data with localization
  const localized = localizeRecord(data, ['description'], lang);
  const project = {
    id: localized.id,
    title: localized.title,
    slug: localized.slug,
    description: localized.description,
    github_url: localized.github_url,
    live_url: localized.live_url,
    featured: localized.featured,
    status: localized.status,
    color: localized.color,
    tech_stack: parseJsonField(localized.tech_stack),
    created_at: localized.created_at,
    updated_at: localized.updated_at
  };

  return sendSuccess(res, project);
}));

// =============================================================================
// POST /api/projects - Create new project (Admin only)
// =============================================================================

router.post('/', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const {
    title,
    slug,
    description,
    github_url,
    live_url,
    tech_stack,
    featured,
    color,
    status
  } = req.body;

  // Validation
  if (!title || !slug || !description) {
    return sendError(res, 400, 'Missing required fields: title, slug, description');
  }

  const projectData = {
    title,
    slug,
    description,
    description_en: description,
    github_url,
    live_url,
    tech_stack: JSON.stringify(tech_stack || []),
    featured: featured || false,
    color: color || 'purple',
    status: status || 'completed'
  };

  const { data, error } = await db
    .from('projects')
    .insert([projectData])
    .select();

  if (error) {
    console.error('Error creating project:', error);
    
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return sendError(res, 409, `Project with slug "${slug}" already exists`);
    }
    
    return sendError(res, 500, 'Failed to create project', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: data[0]
  });
}));

// =============================================================================
// PUT /api/projects/:id - Update project (Admin only)
// =============================================================================

router.put('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;
  const updates = req.body;

  // Convert tech_stack to JSON if present
  if (updates.tech_stack) {
    updates.tech_stack = JSON.stringify(updates.tech_stack);
  }

  const { data, error } = await db
    .from('projects')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating project:', error);
    return sendError(res, 500, 'Failed to update project', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Project with ID "${id}" not found`);
  }

  return sendSuccess(res, data[0], 'Project updated successfully');
}));

// =============================================================================
// DELETE /api/projects/:id - Delete project (Admin only)
// =============================================================================

router.delete('/:id', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const { id } = req.params;

  const { data, error } = await db
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return sendError(res, 500, 'Failed to delete project', error);
  }

  if (!data || data.length === 0) {
    return sendError(res, 404, `Project with ID "${id}" not found`);
  }

  return sendSuccess(res, null, 'Project deleted successfully');
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
