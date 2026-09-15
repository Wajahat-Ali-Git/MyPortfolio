import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_USERNAME = 'Wajahat-Ali-Git';
const TOP_REPOS = 6;

function getGitHubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-app',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET() {
  const headers = getGitHubHeaders();
  const hasToken = Boolean(process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN);

  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=12&type=public`,
      { headers, cache: 'no-store' }
    );

    if (!reposRes.ok) {
      const rateLimitRemaining = reposRes.headers.get('x-ratelimit-remaining');
      const rateLimitReset = reposRes.headers.get('x-ratelimit-reset');

      if (reposRes.status === 403 || reposRes.status === 429) {
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toISOString()
          : 'unknown';
        return NextResponse.json(
          {
            success: false,
            rateLimited: true,
            error: hasToken
              ? `GitHub API rate limit reached. Resets at ${resetTime}.`
              : 'GitHub API rate limit reached. Add GITHUB_TOKEN to .env.local and restart the dev server.',
            remaining: rateLimitRemaining,
          },
          {
            status: 429,
            headers: { 'Cache-Control': 'no-store' },
          }
        );
      }

      return NextResponse.json(
        { success: false, error: `GitHub API error: ${reposRes.status}` },
        { status: reposRes.status, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const allRepos: Array<{
      fork?: boolean;
      visibility?: string;
      name: string;
      description?: string | null;
      updated_at?: string;
    }> = await reposRes.json();

    const topRepos = allRepos
      .filter((r) => !r.fork && r.visibility === 'public')
      .slice(0, TOP_REPOS);

    const reposWithCommits = await Promise.all(
      topRepos.map(async (repo) => {
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
            { headers, cache: 'no-store' }
          );

          if (commitsRes.ok) {
            const commits: Array<{
              sha?: string;
              commit?: { message?: string; author?: { date?: string } };
            }> = await commitsRes.json();
            if (commits.length > 0 && commits[0].commit?.message && commits[0].sha) {
              const c = commits[0];
              return {
                ...repo,
                lastCommitMessage: c.commit!.message!.split('\n')[0],
                lastCommitTime: c.commit!.author?.date,
                lastCommitSha: c.sha!.substring(0, 7),
              };
            }
          }
        } catch {
          // Keep repo data without a fabricated commit
        }

        return repo;
      })
    );

    return NextResponse.json(
      { success: true, data: reposWithCommits, authenticated: hasToken },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('GitHub proxy error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch GitHub data' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
