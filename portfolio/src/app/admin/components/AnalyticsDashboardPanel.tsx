'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Eye,
  Users,
  Activity,
  MousePointer,
  RefreshCw,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    totalEvents: number;
    viewsTrend: number;
    visitorsTrend: number;
    avgViewsPerVisitor: string;
  };
  viewsOverTime: Array<{ label: string; views: number; visitors: number }>;
  topPages: Array<{ path: string; count: number; percentage: number }>;
  topReferrers: Array<{ referrer: string; count: number; percentage: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
  topEvents: Array<{ event_name: string; event_label: string; category: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: 'page_view' | 'event';
    title: string;
    subtitle: string;
    time: string;
    path: string;
    referrer: string;
  }>;
}

type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

export default function AnalyticsDashboardPanel({
  session,
  showToast,
}: {
  session: { access_token?: string } | null;
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [range, setRange] = useState<TimeRange>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchAnalytics = useCallback(async (showSpin = true) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/admin/analytics?range=${range}`, { headers });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load analytics data');
      }

      setData(json.data);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [range, session?.access_token, showToast]);

  useEffect(() => {
    fetchAnalytics(true);
  }, [fetchAnalytics]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchAnalytics(false), 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  if (isLoading && !data) {
    return (
      <div className="p-16 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-xs">Loading analytics insights…</p>
      </div>
    );
  }

  const summary = data?.summary || {
    totalViews: 0,
    uniqueVisitors: 0,
    totalEvents: 0,
    viewsTrend: 0,
    visitorsTrend: 0,
    avgViewsPerVisitor: '0',
  };

  // Find maximum view count for scaling SVG chart
  const maxChartValue = Math.max(
    10,
    ...(data?.viewsOverTime.map((d) => Math.max(d.views, d.visitors)) || [10])
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Range Filters */}
      <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Portfolio Analytics & Visitor Insights
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time traffic metrics, user engagement, and interactive event analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            {autoRefresh ? 'Live Updating' : 'Auto Refresh'}
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh
          </button>

          {/* Time Range Pills */}
          <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl">
            {(['24h', '7d', '30d', '90d', 'all'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  range === r
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r === '24h' ? '24h' : r === '7d' ? '7d' : r === '30d' ? '30d' : r === '90d' ? '90d' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#121226]/70 rounded-2xl border border-cyan-500/20 p-5 relative overflow-hidden group shadow-lg shadow-cyan-500/5"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Page Views</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">{summary.totalViews.toLocaleString()}</span>
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                summary.viewsTrend >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {summary.viewsTrend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(summary.viewsTrend)}%
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Page loads in chosen period</p>
        </motion.div>

        {/* Unique Visitors */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#121226]/70 rounded-2xl border border-purple-500/20 p-5 relative overflow-hidden group shadow-lg shadow-purple-500/5"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Unique Visitors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">{summary.uniqueVisitors.toLocaleString()}</span>
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                summary.visitorsTrend >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {summary.visitorsTrend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(summary.visitorsTrend)}%
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Distinct visitor devices</p>
        </motion.div>

        {/* User Interactions & Events */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#121226]/70 rounded-2xl border border-pink-500/20 p-5 relative overflow-hidden group shadow-lg shadow-pink-500/5"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full filter blur-xl group-hover:bg-pink-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Interactions & Events</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">{summary.totalEvents.toLocaleString()}</span>
            <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded-full">
              Clicks / Downloads
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Active engagement actions</p>
        </motion.div>

        {/* Avg Views Per Visitor */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-[#121226]/70 rounded-2xl border border-amber-500/20 p-5 relative overflow-hidden group shadow-lg shadow-amber-500/5"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full filter blur-xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Views / Visitor</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">{summary.avgViewsPerVisitor}</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Depth
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Pages explored per session</p>
        </motion.div>
      </div>

      {/* Main Chart: Traffic Over Time */}
      <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Traffic Trends (Page Views vs Visitors)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Timeline representation of portfolio visitors</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
              <span className="text-gray-300">Page Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
              <span className="text-gray-300">Unique Visitors</span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Area & Line Chart */}
        <div className="h-64 w-full relative mt-2">
          {(!data?.viewsOverTime || data.viewsOverTime.length === 0) ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
              No traffic data recorded in this period yet.
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-between">
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                ))}

                {/* SVG Area for Page Views */}
                <path
                  d={
                    data.viewsOverTime.reduce((acc, point, idx) => {
                      const x = (idx / (data.viewsOverTime.length - 1 || 1)) * 1000;
                      const y = 200 - (point.views / maxChartValue) * 180;
                      return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }, '') + ` L 1000 200 L 0 200 Z`
                  }
                  fill="url(#viewsGradient)"
                  opacity="0.25"
                />

                {/* SVG Line for Page Views */}
                <path
                  d={data.viewsOverTime.reduce((acc, point, idx) => {
                    const x = (idx / (data.viewsOverTime.length - 1 || 1)) * 1000;
                    const y = 200 - (point.views / maxChartValue) * 180;
                    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* SVG Line for Unique Visitors */}
                <path
                  d={data.viewsOverTime.reduce((acc, point, idx) => {
                    const x = (idx / (data.viewsOverTime.length - 1 || 1)) * 1000;
                    const y = 200 - (point.visitors / maxChartValue) * 180;
                    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {data.viewsOverTime.map((point, idx) => {
                  const x = (idx / (data.viewsOverTime.length - 1 || 1)) * 1000;
                  const yViews = 200 - (point.views / maxChartValue) * 180;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={yViews} r="4" fill="#0a0a16" stroke="#22d3ee" strokeWidth="2" />
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-2 border-t border-white/5 font-mono">
                {data.viewsOverTime.map((d, i) => (
                  <span key={i} className="truncate max-w-[50px] text-center">
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Top Pages & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Most Visited Pages
          </h3>

          <div className="flex flex-col gap-3">
            {(!data?.topPages || data.topPages.length === 0) ? (
              <p className="text-xs text-gray-500 italic py-4 text-center">No page views recorded yet</p>
            ) : (
              data.topPages.map((p, i) => (
                <div key={i} className="flex flex-col gap-1.5 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-cyan-300 truncate max-w-[240px]">{p.path}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{p.count} views</span>
                      <span className="text-[10px] text-gray-400 font-mono">({p.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, p.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traffic Sources / Referrers */}
        <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-purple-400" />
            Top Traffic Sources (Referrers)
          </h3>

          <div className="flex flex-col gap-3">
            {(!data?.topReferrers || data.topReferrers.length === 0) ? (
              <p className="text-xs text-gray-500 italic py-4 text-center">No referrer data recorded yet</p>
            ) : (
              data.topReferrers.map((r, i) => (
                <div key={i} className="flex flex-col gap-1.5 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-200 flex items-center gap-1.5 truncate max-w-[240px]">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      {r.referrer}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{r.count} visits</span>
                      <span className="text-[10px] text-gray-400 font-mono">({r.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, r.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid: Devices/Browsers & Interaction Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device & Browser Breakdown */}
        <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-amber-400" />
            Devices & Browsers
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {['desktop', 'mobile', 'tablet'].map((dev) => {
              const item = data?.deviceBreakdown.find((d) => d.device === dev) || { count: 0, percentage: 0 };
              const Icon = dev === 'desktop' ? Monitor : dev === 'mobile' ? Smartphone : Tablet;
              return (
                <div key={dev} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col items-center text-center">
                  <Icon className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[11px] font-semibold capitalize text-gray-300">{dev}</span>
                  <span className="text-lg font-bold text-white mt-0.5">{item.percentage}%</span>
                  <span className="text-[10px] text-gray-400 font-mono">{item.count} sessions</span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Browser Popularity</span>
            <div className="flex flex-wrap gap-2">
              {data?.browserBreakdown.map((b, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
                  <span className="text-gray-300 font-medium">{b.browser}</span>
                  <span className="text-cyan-400 font-bold font-mono">{b.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Visitor Interaction Events */}
        <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Visitor Interactions & Conversions
          </h3>

          <div className="flex flex-col gap-2.5">
            {(!data?.topEvents || data.topEvents.length === 0) ? (
              <p className="text-xs text-gray-500 italic py-4 text-center">No interactive events recorded yet</p>
            ) : (
              data.topEvents.map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xs">
                      {ev.event_name.includes('download') ? <Download className="w-3.5 h-3.5" /> : <MousePointer className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white capitalize">{ev.event_name.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-gray-400">{ev.event_label || ev.category}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-xs font-bold">
                    {ev.count} times
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-time Activity Stream */}
      <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Recent Visitor Activity Log
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">Latest 20 telemetry entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Action / Path</th>
                <th className="py-2.5 px-3">Device & Browser</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {(!data?.recentActivity || data.recentActivity.length === 0) ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 italic">
                    No recent activity logged yet
                  </td>
                </tr>
              ) : (
                data.recentActivity.map((act) => (
                  <tr key={act.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          act.type === 'page_view'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                        }`}
                      >
                        {act.type === 'page_view' ? 'Page View' : 'Event'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-gray-200">{act.title}</p>
                      {act.subtitle && <p className="text-[10px] text-gray-400">{act.subtitle}</p>}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-[11px]">
                      {act.subtitle || 'Desktop'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-400 font-mono text-[11px]">
                      {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
