// =============================================================================
// Supabase RPC Service
// =============================================================================
// Wrapper for Supabase RPC function calls
// Provides optimized database queries using Postgres functions
// =============================================================================

const { createClient } = require('@supabase/supabase-js');

let supabase = null;

// =============================================================================
// Initialize Supabase Client
// =============================================================================

function getSupabaseClient() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }
    
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  
  return supabase;
}

// =============================================================================
// RPC Function Wrappers
// =============================================================================

/**
 * Get all projects with optional filtering
 * @param {Object} options - Query options
 * @param {string} options.lang - Language code (en, ur, hi, ar, fr, de)
 * @param {boolean} options.featuredOnly - Only return featured projects
 * @param {number} options.limit - Maximum number of results
 */
async function getProjects({ lang = 'en', featuredOnly = false, limit = 100 } = {}) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_projects', {
    p_lang: lang,
    p_featured_only: featuredOnly,
    p_limit: limit
  });
  
  return { data, error };
}

/**
 * Get single project by slug
 * @param {string} slug - Project slug
 * @param {string} lang - Language code
 */
async function getProjectBySlug(slug, lang = 'en') {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_project_by_slug', {
    p_slug: slug,
    p_lang: lang
  });
  
  // RPC returns array, get first item
  return { 
    data: data && data.length > 0 ? data[0] : null, 
    error 
  };
}

/**
 * Get experiences with optional filtering
 * @param {Object} options - Query options
 * @param {string} options.lang - Language code
 * @param {boolean} options.currentOnly - Only return current position
 */
async function getExperiences({ lang = 'en', currentOnly = false } = {}) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_experiences', {
    p_lang: lang,
    p_current_only: currentOnly
  });
  
  return { data, error };
}

/**
 * Get skills with optional category filter
 * @param {string} category - Filter by category (optional)
 */
async function getSkills(category = null) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_skills', {
    p_category: category
  });
  
  return { data, error };
}

/**
 * Get certifications with optional filtering
 * @param {Object} options - Query options
 * @param {string} options.lang - Language code
 * @param {string} options.certificateType - Filter by type (optional)
 */
async function getCertifications({ lang = 'en', certificateType = null } = {}) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_certifications', {
    p_lang: lang,
    p_certificate_type: certificateType
  });
  
  return { data, error };
}

/**
 * Get active profile information
 * @param {string} lang - Language code
 */
async function getProfile(lang = 'en') {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_profile', {
    p_lang: lang
  });
  
  // RPC returns array, get first item
  return { 
    data: data && data.length > 0 ? data[0] : null, 
    error 
  };
}

/**
 * Get tools with optional category filter
 * @param {string} category - Filter by category (optional)
 */
async function getTools(category = null) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_tools', {
    p_category: category
  });
  
  return { data, error };
}

/**
 * Get GitHub repositories from cache
 * @param {number} limit - Maximum number of results
 */
async function getGitHubRepos(limit = 10) {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_github_repos', {
    p_limit: limit
  });
  
  return { data, error };
}

/**
 * Get GitHub statistics summary
 */
async function getGitHubStats() {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_github_stats');
  
  return { data, error };
}

/**
 * Get spoken languages with proficiency
 * @param {string} lang - Language code for translations
 */
async function getSpokenLanguages(lang = 'en') {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_spoken_languages', {
    p_lang: lang
  });
  
  return { data, error };
}

/**
 * Search across portfolio content
 * @param {string} query - Search query
 * @param {string} lang - Language code
 */
async function searchPortfolio(query, lang = 'en') {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('search_portfolio', {
    p_query: query,
    p_lang: lang
  });
  
  return { data, error };
}

/**
 * Get portfolio statistics summary
 */
async function getPortfolioSummary() {
  const client = getSupabaseClient();
  
  const { data, error } = await client.rpc('get_portfolio_summary');
  
  return { data, error };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  getSupabaseClient,
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
};
