// =============================================================================
// Validation Middleware
// =============================================================================
// Input validation and error handling utilities
// =============================================================================

/**
 * Validate language parameter
 * Supported: en, ur, hi, ar, fr, de
 */
function validateLanguage(req, res, next) {
  const supportedLangs = ['en', 'ur', 'hi', 'ar', 'fr', 'de'];
  const lang = req.query.lang || 'en';
  
  if (!supportedLangs.includes(lang)) {
    return res.status(400).json({
      success: false,
      error: `Invalid language. Supported: ${supportedLangs.join(', ')}`
    });
  }
  
  req.lang = lang;
  next();
}

/**
 * Validate slug parameter
 */
function validateSlug(req, res, next) {
  const slug = req.params.slug;
  
  if (!slug || typeof slug !== 'string' || slug.length < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing slug parameter'
    });
  }
  
  // Basic slug format validation (alphanumeric, hyphens, underscores)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
    });
  }
  
  next();
}

/**
 * Validate category parameter
 */
function validateCategory(req, res, next) {
  const category = req.params.category;
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing category parameter'
    });
  }
  
  next();
}

/**
 * Validate UUID parameter
 */
function validateUUID(req, res, next) {
  const id = req.params.id;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!id || !uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format. Expected UUID.'
    });
  }
  
  next();
}

/**
 * API Key authentication middleware
 * Checks X-API-Key header
 */
function requireApiKey(req, res, next) {
  const configuredKey = process.env.API_KEY;

  // Fail closed: if API_KEY is not set or is empty, deny all requests.
  // This prevents accidental open access if the env var is missing in production.
  if (!configuredKey) {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable: API_KEY is not configured on the server'
    });
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing API key'
    });
  }

  if (apiKey !== configuredKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid API key'
    });
  }

  next();
}

/**
 * Async handler wrapper to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Generic error response helper
 */
function sendError(res, statusCode, message, error = null) {
  const response = {
    success: false,
    error: message
  };
  
  // Include detailed error in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.details = error.message;
    response.stack = error.stack;
  }
  
  return res.status(statusCode).json(response);
}

/**
 * Generic success response helper
 */
function sendSuccess(res, data, message = null) {
  const response = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.json(response);
}

/**
 * Pagination validation and parsing
 */
function parsePagination(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 per page
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

/**
 * Validate required body fields
 */
function validateRequired(fields) {
  return (req, res, next) => {
    const missing = [];
    
    fields.forEach(field => {
      if (!req.body[field]) {
        missing.push(field);
      }
    });
    
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`
      });
    }
    
    next();
  };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  validateLanguage,
  validateSlug,
  validateCategory,
  validateUUID,
  requireApiKey,
  asyncHandler,
  sendError,
  sendSuccess,
  parsePagination,
  validateRequired
};
