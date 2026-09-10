// =============================================================================
// Supabase-Optimized Routes
// =============================================================================
// Uses RPC functions for optimal performance with Supabase
// Mount these routes if using Supabase cloud instead of local PostgreSQL
// =============================================================================

const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  getExperiences,
  getSkills,
  getCertifications,
  getProfile,
  getTools,
  getGitHubRepos,
  getGitHubStats,
  getSpokenLanguages,
  searchPortfolio,
  getPortfolioSummary
} = require('../services/supabase-rpc');
const {
  validateLanguage,
  validateSlug,
  asyncHandler,
  sendError,
  sendSuccess
} = require('../middleware/validation');

// =============================================================================
// GET /api/v2/projects - Get all projects using RPC
// =============================================================================

router.get('/projects', validateLanguage, asyncHandler(async (req, res) => {
  const lang = req.lang;
  const featuredOnly = req.query.featured === 'true';
  
  const { data, error } = await getProjects({ 
    lang, 
    featuredOnly 
  });

  if (error) {
    console.error('Error fetching projects:', error);
    return sendError(res, 500, 'Failed to fetch projects', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/projects/:slug - Get project by slug using RPC
// =============================================================================

router.get('/projects/:slug', validateLanguage, validateSlug, asyncHandler(async (req, res) => {
  const lang = req.lang;
  const { slug } = req.params;

  const { data, error } = await getProjectBySlug(slug, lang);

  if (error) {
    console.error('Error fetching project:', error);
    return sendError(res, 500, 'Failed to fetch project', error);
  }

  if (!data) {
    return sendError(res, 404, `Project with slug "${slug}" not found`);
  }

  return sendSuccess(res, data);
}));

// =============================================================================
// GET /api/v2/experiences - Get experiences using RPC
// =============================================================================

router.get('/experiences', validateLanguage, asyncHandler(async (req, res) => {
  const lang = req.lang;
  const currentOnly = req.query.current === 'true';

  const { data, error } = await getExperiences({ 
    lang, 
    currentOnly 
  });

  if (error) {
    console.error('Error fetching experiences:', error);
    return sendError(res, 500, 'Failed to fetch experiences', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/skills - Get skills using RPC
// =============================================================================

router.get('/skills', validateLanguage, asyncHandler(async (req, res) => {
  const category = req.query.category || null;

  const { data, error } = await getSkills(category);

  if (error) {
    console.error('Error fetching skills:', error);
    return sendError(res, 500, 'Failed to fetch skills', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/certifications - Get certifications using RPC
// =============================================================================

router.get('/certifications', validateLanguage, asyncHandler(async (req, res) => {
  const lang = req.lang;
  const certificateType = req.query.type || null;

  const { data, error } = await getCertifications({ 
    lang, 
    certificateType 
  });

  if (error) {
    console.error('Error fetching certifications:', error);
    return sendError(res, 500, 'Failed to fetch certifications', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/profile - Get profile using RPC
// =============================================================================

router.get('/profile', validateLanguage, asyncHandler(async (req, res) => {
  const lang = req.lang;

  const { data, error } = await getProfile(lang);

  if (error) {
    console.error('Error fetching profile:', error);
    return sendError(res, 500, 'Failed to fetch profile', error);
  }

  return sendSuccess(res, data);
}));

// =============================================================================
// GET /api/v2/tools - Get tools using RPC
// =============================================================================

router.get('/tools', validateLanguage, asyncHandler(async (req, res) => {
  const category = req.query.category || null;

  const { data, error } = await getTools(category);

  if (error) {
    console.error('Error fetching tools:', error);
    return sendError(res, 500, 'Failed to fetch tools', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/github/repos - Get GitHub repos using RPC
// =============================================================================

router.get('/github/repos', validateLanguage, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const { data, error } = await getGitHubRepos(limit);

  if (error) {
    console.error('Error fetching GitHub repos:', error);
    return sendError(res, 500, 'Failed to fetch repositories', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/github/stats - Get GitHub statistics using RPC
// =============================================================================

router.get('/github/stats', validateLanguage, asyncHandler(async (req, res) => {
  const { data, error } = await getGitHubStats();

  if (error) {
    console.error('Error fetching GitHub stats:', error);
    return sendError(res, 500, 'Failed to fetch statistics', error);
  }

  return sendSuccess(res, data);
}));

// =============================================================================
// GET /api/v2/languages - Get spoken languages using RPC
// =============================================================================

router.get('/languages', validateLanguage, asyncHandler(async (req, res) => {
  const lang = req.lang;

  const { data, error } = await getSpokenLanguages(lang);

  if (error) {
    console.error('Error fetching languages:', error);
    return sendError(res, 500, 'Failed to fetch languages', error);
  }

  return sendSuccess(res, data || []);
}));

// =============================================================================
// GET /api/v2/search - Search portfolio content using RPC
// =============================================================================

router.get('/search', validateLanguage, asyncHandler(async (req, res) => {
  const query = req.query.q || req.query.query;
  const lang = req.lang;

  if (!query || query.length < 2) {
    return sendError(res, 400, 'Search query must be at least 2 characters');
  }

  const { data, error } = await searchPortfolio(query, lang);

  if (error) {
    console.error('Error searching portfolio:', error);
    return sendError(res, 500, 'Search failed', error);
  }

  return sendSuccess(res, data);
}));

// =============================================================================
// GET /api/v2/summary - Get portfolio summary using RPC
// =============================================================================

router.get('/summary', asyncHandler(async (req, res) => {
  const { data, error } = await getPortfolioSummary();

  if (error) {
    console.error('Error fetching portfolio summary:', error);
    return sendError(res, 500, 'Failed to fetch summary', error);
  }

  return sendSuccess(res, data);
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
