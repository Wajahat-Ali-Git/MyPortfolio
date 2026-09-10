// =============================================================================
// GitHub Routes
// =============================================================================
// API endpoints for GitHub repository data and statistics
// =============================================================================

const express = require('express');
const router = express.Router();
const { getDatabase, parseJsonField } = require('../services/database');
const {
  validateLanguage,
  asyncHandler,
  sendError,
  sendSuccess,
  requireApiKey
} = require('../middleware/validation');

// =============================================================================
// GET /api/github/repos - Get cached repository data
// =============================================================================

router.get('/repos', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();

  const { data, error } = await db
    .from('github_cache')
    .select('*')
    .eq('is_private', false)
    .eq('is_archived', false)
    .order('last_commit_date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching GitHub repos:', error);
    return sendError(res, 500, 'Failed to fetch repositories', error);
  }

  // Transform data
  const repos = (data || []).map(repo => ({
    id: repo.id,
    repo_name: repo.repo_name,
    repo_url: repo.repo_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    watchers: repo.watchers,
    open_issues: repo.open_issues,
    last_commit_message: repo.last_commit_message,
    last_commit_date: repo.last_commit_date,
    is_fork: repo.is_fork,
    fetched_at: repo.fetched_at
  }));

  return sendSuccess(res, repos);
}));

// =============================================================================
// GET /api/github/stats - Get GitHub profile statistics
// =============================================================================

router.get('/stats', validateLanguage, asyncHandler(async (req, res) => {
  const { db } = getDatabase();

  const { data, error } = await db
    .from('github_cache')
    .select('*')
    .eq('is_private', false);

  if (error) {
    console.error('Error fetching GitHub stats:', error);
    return sendError(res, 500, 'Failed to fetch statistics', error);
  }

  // Calculate statistics
  const stats = {
    total_repos: data.length,
    total_stars: data.reduce((sum, repo) => sum + (repo.stars || 0), 0),
    total_forks: data.reduce((sum, repo) => sum + (repo.forks || 0), 0),
    languages: [...new Set(data.map(repo => repo.language).filter(Boolean))],
    most_starred: data.sort((a, b) => (b.stars || 0) - (a.stars || 0))[0],
    most_recent: data.sort((a, b) => 
      new Date(b.last_commit_date || 0) - new Date(a.last_commit_date || 0)
    )[0],
    last_updated: data.length > 0 ? data[0].fetched_at : null
  };

  return sendSuccess(res, stats);
}));

// =============================================================================
// POST /api/github/sync - Sync with GitHub API (Admin only)
// =============================================================================

router.post('/sync', requireApiKey, asyncHandler(async (req, res) => {
  const { db } = getDatabase();
  const username = process.env.GITHUB_USERNAME || 'Wajahat-Ali-Git';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return sendError(res, 500, 'GitHub token not configured');
  }

  try {
    // Fetch repositories from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Backend'
      }
    });

    if (!response.ok) {
      return sendError(res, response.status, 'Failed to fetch from GitHub API');
    }

    const repos = await response.json();
    const syncedRepos = [];

    // Update cache for each repository
    for (const repo of repos) {
      // Fetch latest commit
      let lastCommit = null;
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-Backend'
            }
          }
        );
        
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          lastCommit = commits[0];
        }
      } catch (err) {
        console.error(`Failed to fetch commits for ${repo.name}:`, err.message);
      }

      const repoData = {
        repo_name: repo.name,
        repo_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        open_issues: repo.open_issues_count,
        last_commit_message: lastCommit?.commit?.message || null,
        last_commit_date: lastCommit?.commit?.author?.date || repo.updated_at,
        last_commit_sha: lastCommit?.sha || null,
        is_fork: repo.fork,
        is_archived: repo.archived,
        is_private: repo.private,
        fetched_at: new Date().toISOString()
      };

      // Upsert: Insert or update if exists
      const { data: existing } = await db
        .from('github_cache')
        .select('id')
        .eq('repo_name', repo.name)
        .limit(1);

      if (existing && existing.length > 0) {
        // Update existing
        await db
          .from('github_cache')
          .update(repoData)
          .eq('id', existing[0].id);
      } else {
        // Insert new
        await db
          .from('github_cache')
          .insert([repoData]);
      }

      syncedRepos.push(repo.name);
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${syncedRepos.length} repositories`,
      data: {
        synced_count: syncedRepos.length,
        repositories: syncedRepos,
        synced_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error syncing with GitHub:', error);
    return sendError(res, 500, 'Failed to sync with GitHub', error);
  }
}));

// =============================================================================
// Exports
// =============================================================================

module.exports = router;
