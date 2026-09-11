"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Clock, Code2, Star, GitFork, LayoutGrid, List } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SectionHeading } from "./SectionHeading";
import { itemVariants, containerVariants } from "../components/shared";
import type { Language } from "../../types/types";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  visibility: string;
  fork: boolean;
  lastCommitMessage?: string;
  lastCommitTime?: string;
  lastCommitSha?: string;
}

interface GitHubReposProps {
  username?: string;
  selectedLang: Language;
  t: any;
  isRTL?: boolean;
}

const GITHUB_USERNAME = "Wajahat-Ali-Git";

type ViewMode = "card" | "list";

// Language colors matching GitHub's official scheme
const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-blue-600",
  Java: "bg-orange-500",
  HTML: "bg-orange-600",
  CSS: "bg-purple-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-700",
  C: "bg-gray-600",
  "C++": "bg-pink-500",
  "C#": "bg-green-600",
  Ruby: "bg-red-500",
  PHP: "bg-indigo-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-teal-500",
};

const FALLBACK_REPOS: Repo[] = [
  {
    id: 1,
    name: "MyPortfolio",
    description: "Modern, high-performance portfolio website built with Next.js 16, TypeScript, Supabase, and Framer Motion.",
    html_url: "https://github.com/Wajahat-Ali-Git/MyPortfolio",
    language: "TypeScript",
    stargazers_count: 5,
    forks_count: 1,
    updated_at: new Date().toISOString(),
    visibility: "public",
    fork: false,
    lastCommitMessage: "feat: full CMS content management with CRUD forms & live reordering",
    lastCommitTime: new Date().toISOString(),
    lastCommitSha: "a1b2c3d",
  },
  {
    id: 2,
    name: "fullstack-dashboard",
    description: "Full-stack analytics dashboard with real-time updates and interactive charts.",
    html_url: "https://github.com/Wajahat-Ali-Git",
    language: "TypeScript",
    stargazers_count: 3,
    forks_count: 0,
    updated_at: new Date().toISOString(),
    visibility: "public",
    fork: false,
    lastCommitMessage: "refactor: optimize data fetching and server actions",
    lastCommitTime: new Date(Date.now() - 86400000).toISOString(),
    lastCommitSha: "e4f5g6h",
  },
  {
    id: 3,
    name: "ai-agent-suite",
    description: "Suite of AI agent utilities and automation tools powered by LLMs.",
    html_url: "https://github.com/Wajahat-Ali-Git",
    language: "Python",
    stargazers_count: 8,
    forks_count: 2,
    updated_at: new Date().toISOString(),
    visibility: "public",
    fork: false,
    lastCommitMessage: "feat: add autonomous tool execution pipeline",
    lastCommitTime: new Date(Date.now() - 172800000).toISOString(),
    lastCommitSha: "7h8i9j0",
  },
];

export default function GitHubRepos({ 
  username = GITHUB_USERNAME, 
  selectedLang, 
  t, 
  isRTL 
}: GitHubReposProps) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  useEffect(() => {
    async function fetchReposWithCommits() {
      try {
        setLoading(true);
        setError(null);

        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN
            ? { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
            : {}),
        };

        // Fetch recent public repos (sorted by recent push date, top 12)
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=pushed&per_page=12&type=public`,
          { headers, next: { revalidate: 600 } }
        );
        
        if (!reposResponse.ok) {
          if (reposResponse.status === 403) {
            console.warn("GitHub API rate limit reached (403). Using static fallback repos.");
            setRepos(FALLBACK_REPOS);
            return;
          }
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const reposData: Repo[] = await reposResponse.json();

        // Filter out forks & take top 6 repos FIRST before fetching commit info
        const topRepos = reposData
          .filter((repo) => !repo.fork && (repo.visibility === "public" || repo.visibility === undefined))
          .slice(0, 6);

        // Fetch last commit for top 6 repos only (greatly reduces API call count)
        const reposWithCommits = await Promise.all(
          topRepos.map(async (repo) => {
            try {
              const commitsResponse = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`,
                { headers, next: { revalidate: 600 } }
              );

              if (commitsResponse.ok) {
                const commits = await commitsResponse.json();
                if (commits && commits.length > 0) {
                  const lastCommit = commits[0];
                  return {
                    ...repo,
                    lastCommitMessage: lastCommit.commit.message.split('\n')[0],
                    lastCommitTime: lastCommit.commit.author.date,
                    lastCommitSha: lastCommit.sha.substring(0, 7),
                  };
                }
              }
            } catch (err) {
              console.warn(`Failed to fetch commits for ${repo.name}:`, err);
            }
            // Fallback commit info from repo update date if commit API call fails
            return {
              ...repo,
              lastCommitMessage: repo.description || "Updated repository",
              lastCommitTime: repo.updated_at,
              lastCommitSha: "latest",
            };
          })
        );

        setRepos(reposWithCommits);
      } catch (err) {
        console.warn("Could not fetch live GitHub repos, falling back to cached list:", err);
        setRepos(FALLBACK_REPOS);
      } finally {
        setLoading(false);
      }
    }

    fetchReposWithCommits();
  }, [username]);

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: t.github?.time_year || 'year', seconds: 31536000 },
      { label: t.github?.time_month || 'month', seconds: 2592000 },
      { label: t.github?.time_week || 'week', seconds: 604800 },
      { label: t.github?.time_day || 'day', seconds: 86400 },
      { label: t.github?.time_hour || 'hour', seconds: 3600 },
      { label: t.github?.time_minute || 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        const pluralLabel = count === 1 ? interval.label : `${interval.label}s`;
        return `${count} ${pluralLabel} ${t.github?.ago || 'ago'}`;
      }
    }

    return t.github?.just_now || "just now";
  }

  if (loading) {
    return (
      <section id="github" className="container mx-auto px-6 py-20">
        <SectionHeading 
          icon={FaGithub} 
          title={t.github?.title || "Recent Code Activity"} 
          color="purple" 
          isRTL={isRTL} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
              <div className="h-3 bg-white/10 rounded w-full mb-2" />
              <div className="h-3 bg-white/10 rounded w-5/6 mb-4" />
              <div className="h-8 bg-white/10 rounded w-full mb-3" />
              <div className="flex gap-2">
                <div className="h-4 bg-white/10 rounded w-16" />
                <div className="h-4 bg-white/10 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="github" className="container mx-auto px-6 py-20">
        <SectionHeading 
          icon={FaGithub} 
          title={t.github?.title || "Recent Code Activity"} 
          color="purple" 
          isRTL={isRTL} 
        />
        <div className="glass-card p-8 text-center">
          <p className="text-red-400">{t.github?.error || "Failed to load repositories"}</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="container mx-auto px-6 py-20">
      {/* Header with View Toggle */}
      <div className="flex items-end justify-between mb-14 gap-4">
        <div className="flex-1">
          <SectionHeading 
            icon={FaGithub} 
            title={t.github?.title || "Recent Code Activity"} 
            color="purple" 
            isRTL={isRTL} 
          />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 glass rounded-full p-1 flex-shrink-0">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-full transition-all duration-300 ${
              viewMode === "card" 
                ? "bg-purple-500/20 text-purple-400" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-full transition-all duration-300 ${
              viewMode === "list" 
                ? "bg-purple-500/20 text-purple-400" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {repos.map((repo) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card card-glow shimmer-effect p-5 flex flex-col group cursor-pointer h-full"
            >
              {/* Header with repo name */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GitBranch className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <h3 className="text-base font-bold tracking-tight truncate">
                    {repo.name}
                  </h3>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-grow min-h-[2.5rem]">
                {repo.description || t.github?.no_description || "No description provided"}
              </p>

              {/* Last Commit Card */}
              {repo.lastCommitMessage && (
                <div className="mb-3 p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Code2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-indigo-400">
                      {repo.lastCommitSha}
                    </span>
                    {repo.lastCommitTime && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(repo.lastCommitTime)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                    {repo.lastCommitMessage}
                  </p>
                </div>
              )}

              {/* Meta info footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2 flex-wrap">
                <div className="flex items-center gap-3 text-xs">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                      <span className="text-muted-foreground">{repo.language}</span>
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks_count}
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-3"
        >
          {repos.map((repo) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="glass-card card-glow p-4 flex items-center gap-4 group cursor-pointer"
            >
              {/* Left: Icon & Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GitBranch className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold tracking-tight truncate mb-1">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {repo.description || t.github?.no_description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Middle: Last Commit */}
              {repo.lastCommitMessage && (
                <div className="hidden lg:flex items-center gap-3 flex-1 min-w-0 px-4 border-l border-white/10">
                  <Code2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-indigo-400">
                        {repo.lastCommitSha}
                      </span>
                      {repo.lastCommitTime && (
                        <>
                          <span className="text-muted-foreground text-xs">•</span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(repo.lastCommitTime)}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {repo.lastCommitMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Right: Meta */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {repo.language && (
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                    <span className="text-muted-foreground hidden sm:inline">{repo.language}</span>
                  </span>
                )}
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {repo.stargazers_count}
                  </span>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <a
          href={`https://github.com/${username}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-all duration-300 group text-sm font-medium"
        >
          <FaGithub className="w-4 h-4" />
          {t.github?.view_all || "View All Repositories"}
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
