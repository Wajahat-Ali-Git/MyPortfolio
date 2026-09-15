"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import {
  GitCommit,
  GitPullRequest,
  GitMerge,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Activity,
} from "lucide-react";

/* ─── Types ─── */

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: { sha: string; message: string; author: { name: string } }[];
    pull_request?: { title: string; html_url: string; merged: boolean; number: number };
    size?: number;
    /** SHA before the push */
    before?: string;
    /** HEAD SHA after the push */
    head?: string;
  };
}

interface ParsedEvent {
  id: string;
  type: "push" | "pr" | "create" | "other";
  icon: React.ElementType;
  title: string;
  description: string;
  repo: string;
  /** Full owner/repo name for API calls */
  repoFullName: string;
  repoUrl: string;
  time: string;
  relativeTime: string;
  commitCount?: number;
  color: string;
  /** SHAs for fetching commit details via Compare API */
  beforeSha?: string;
  headSha?: string;
}

/* ─── Helpers ─── */

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function parseEvent(event: GitHubEvent): ParsedEvent | null {
  const repoShort = event.repo.name.split("/").pop() || event.repo.name;
  const repoFullName = event.repo.name; // e.g. "Wajahat-Ali-Git/MyPortfolio"
  const repoUrl = `https://github.com/${event.repo.name}`;
  const time = new Date(event.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const relativeTime = getRelativeTime(event.created_at);

  switch (event.type) {
    case "PushEvent": {
      const branch = event.payload.ref?.replace("refs/heads/", "") || "main";
      // GitHub removed commits array AND size from PushEvent payloads (Oct 2025).
      // We'll enrich commit counts later via the Compare API.
      const commitCount = event.payload.size ?? event.payload.commits?.length;
      return {
        id: event.id,
        type: "push",
        icon: GitCommit,
        title: `Pushed to ${branch}`,
        description: "Loading commit info…",
        repo: repoShort,
        repoFullName,
        repoUrl,
        time,
        relativeTime,
        commitCount,
        color: "emerald",
        beforeSha: event.payload.before,
        headSha: event.payload.head,
      };
    }
    case "PullRequestEvent": {
      const pr = event.payload.pull_request;
      if (!pr) return null;
      const action = event.payload.action || "opened";
      const merged = pr.merged;
      return {
        id: event.id,
        type: "pr",
        icon: merged ? GitMerge : GitPullRequest,
        title: `${merged ? "Merged" : action.charAt(0).toUpperCase() + action.slice(1)} PR #${pr.number}`,
        description: pr.title,
        repo: repoShort,
        repoFullName,
        repoUrl,
        time,
        relativeTime,
        color: merged ? "purple" : action === "opened" ? "blue" : "orange",
      };
    }
    case "CreateEvent": {
      const refType = event.payload.ref_type || "repository";
      const ref = event.payload.ref;
      return {
        id: event.id,
        type: "create",
        icon: Activity,
        title: `Created ${refType}${ref ? ` ${ref}` : ""}`,
        description: `New ${refType} in ${repoShort}`,
        repo: repoShort,
        repoFullName,
        repoUrl,
        time,
        relativeTime,
        color: "teal",
      };
    }
    default:
      return null;
  }
}

/* ─── Color Mapping ─── */

const eventColors: Record<string, { bg: string; border: string; text: string; dot: string; glow: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.4)]",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
    glow: "shadow-[0_0_12px_rgba(96,165,250,0.4)]",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    dot: "bg-purple-400",
    glow: "shadow-[0_0_12px_rgba(192,132,252,0.4)]",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    dot: "bg-orange-400",
    glow: "shadow-[0_0_12px_rgba(251,146,60,0.4)]",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-400",
    dot: "bg-teal-400",
    glow: "shadow-[0_0_12px_rgba(45,212,191,0.4)]",
  },
};

/* ─── Animation Variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Main Component ─── */

export default function GitHubActivity() {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
          : {}),
      };

      const res = await fetch(
        "https://api.github.com/users/Wajahat-Ali-Git/events/public?per_page=30",
        {
          headers,
          next: { revalidate: 300 }, // cache for 5 min
        }
      );
      
      if (!res.ok) {
        if (res.status === 403) {
          console.warn("GitHub API rate limit reached (403) on events.");
          setError("GitHub API rate limit reached. Activity will refresh automatically soon.");
          return;
        }
        throw new Error(`GitHub API returned ${res.status}`);
      }

      const data: GitHubEvent[] = await res.json();

      const parsed = data
        .map(parseEvent)
        .filter((e): e is ParsedEvent => e !== null)
        .slice(0, 8);

      setEvents(parsed);
    } catch (err) {
      console.warn("Unable to load GitHub activity:", err);
      setError("Unable to load GitHub activity at this time");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div ref={sectionRef} className="mt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <FaGithub className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white/95">
              Recent Activity
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live from GitHub
            </p>
          </div>
        </div>

        <motion.button
          onClick={fetchEvents}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </motion.div>

      {/* Loading State */}
      {loading && events.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass-card p-6 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/10 rounded-lg w-full" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-white/10 rounded-full w-20" />
                    <div className="h-3 bg-white/10 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 w-fit mx-auto mb-4">
            <Activity className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-[var(--muted-foreground)] mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {events.map((event) => {
            const colors = eventColors[event.color] || eventColors.emerald;
            const Icon = event.icon;

            return (
              <motion.a
                key={event.id}
                href={event.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card card-glow shimmer-effect p-6 group cursor-pointer relative overflow-hidden"
              >
                {/* Subtle top-border accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] ${colors.bg} opacity-60`}
                  style={{
                    background: `linear-gradient(90deg, transparent, var(--tw-gradient-stops, ${
                      event.color === "emerald"
                        ? "rgb(52,211,153)"
                        : event.color === "blue"
                        ? "rgb(96,165,250)"
                        : event.color === "purple"
                        ? "rgb(192,132,252)"
                        : event.color === "orange"
                        ? "rgb(251,146,60)"
                        : "rgb(45,212,191)"
                    }), transparent)`,
                  }}
                />

                <div className="flex items-start gap-4">
                  {/* Event Icon */}
                  <div
                    className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border} flex-shrink-0 group-hover:${colors.glow} transition-all duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-semibold text-[var(--foreground)] text-sm leading-tight">
                        {event.title}
                      </h4>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-0.5" />
                    </div>

                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
                      {/* Repo tag */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[var(--muted-foreground)]">
                        <FaGithub className="w-3 h-3" />
                        {event.repo}
                      </span>

                      {/* Commit count */}
                      {event.commitCount && event.commitCount > 0 && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${colors.text}`}>
                          <GitCommit className="w-3 h-3" />
                          {event.commitCount} commit{event.commitCount > 1 ? "s" : ""}
                        </span>
                      )}

                      {/* Time */}
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Clock className="w-3 h-3" />
                        {event.relativeTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 w-fit mx-auto mb-4">
            <FaGithub className="w-6 h-6 text-[var(--muted-foreground)]" />
          </div>
          <p className="text-[var(--muted-foreground)]">No recent activity found</p>
        </motion.div>
      )}
    </div>
  );
}
