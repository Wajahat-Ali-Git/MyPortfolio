'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Image as ImageIcon, Save, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import type { AdminSeoSettingsInput } from '@/lib/admin/types';

const DEFAULT_SEO: AdminSeoSettingsInput = {
  seo_title: 'Wajahat Ali | Software Engineer & Developer',
  seo_description: 'Software Engineer & Developer Portfolio – projects, skills, and work experience.',
  seo_keywords: 'software engineer, developer, portfolio, React, Next.js, TypeScript, Fullstack',
  seo_og_title: '',
  seo_og_description: '',
  seo_og_image_url: '',
  seo_twitter_card: 'summary_large_image',
  seo_author: 'Wajahat Ali',
  seo_canonical_url: '',
  seo_robots: 'index, follow',
};

export default function SeoManagementPanel({
  session,
  showToast,
}: {
  session: { access_token?: string } | null;
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [seoData, setSeoData] = useState<AdminSeoSettingsInput>(DEFAULT_SEO);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSeoSettings() {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        const res = await fetch('/api/admin/site_settings', { headers });
        const json = await res.json();

        if (res.ok && json.success && Array.isArray(json.data)) {
          const map: Record<string, string> = {};
          for (const row of json.data as { key: string; value: string }[]) {
            if (row.key.startsWith('seo_')) {
              map[row.key] = row.value;
            }
          }
          setSeoData((prev) => ({
            ...prev,
            ...map,
          }));
        }
      } catch (err) {
        showToast('error', 'Failed to load SEO settings');
      } finally {
        setIsLoading(false);
      }
    }
    loadSeoSettings();
  }, [session?.access_token, showToast]);

  const handleChange = (key: keyof AdminSeoSettingsInput, value: string) => {
    setSeoData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const rows = Object.entries(seoData).map(([key, value]) => ({
        key,
        value: String(value ?? ''),
      }));

      const results = await Promise.all(
        rows.map((row) =>
          fetch('/api/admin/site_settings', {
            method: 'POST',
            headers,
            body: JSON.stringify(row),
          }).then((r) => r.json())
        )
      );

      const failed = results.find((r) => !r.success);
      if (failed) throw new Error(failed.error || 'Failed to save SEO settings');

      showToast('success', 'SEO settings saved successfully! Live site updated.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-400">
        <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs">Loading SEO configurations…</p>
      </div>
    );
  }

  const effectiveOgTitle = seoData.seo_og_title.trim() || seoData.seo_title;
  const effectiveOgDescription = seoData.seo_og_description.trim() || seoData.seo_description;
  const canonicalHost = seoData.seo_canonical_url.trim() || 'https://wajahatali.dev';

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            SEO & Social Meta Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure how your portfolio appears in search engine results and social media shares.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:from-cyan-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/10"
        >
          {isSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {isSaving ? 'Saving…' : 'Save SEO Settings'}
        </button>
      </div>

      {/* Main Grid: Forms & Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Live Previews */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Google Search Result Preview */}
          <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 pb-2 border-b border-white/5">
              <GoogleIcon className="w-4 h-4" />
              <span>Google Search Preview</span>
            </div>
            <div className="bg-[#202124] rounded-xl p-4 flex flex-col gap-1 text-left font-sans">
              <div className="flex items-center gap-2 text-xs text-[#bdc1c6] truncate">
                <Globe className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span className="truncate">{canonicalHost}</span>
              </div>
              <h3 className="text-base text-[#8ab4f8] hover:underline cursor-pointer font-normal truncate mt-0.5">
                {seoData.seo_title || 'Title snippet preview'}
              </h3>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed mt-0.5">
                {seoData.seo_description || 'Description snippet preview will appear here.'}
              </p>
            </div>
          </div>

          {/* Social Share / Open Graph Preview */}
          <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Open Graph / Social Card Preview</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {seoData.seo_twitter_card}
              </span>
            </div>
            <div className="bg-[#18191c] rounded-xl border border-white/10 overflow-hidden flex flex-col">
              {seoData.seo_og_image_url ? (
                <div className="relative w-full h-36 bg-black/40 overflow-hidden">
                  {/* eslint-disable-next-html-element-suppression */}
                  <img
                    src={seoData.seo_og_image_url}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-tr from-cyan-950/40 via-purple-950/30 to-black flex flex-col items-center justify-center text-gray-500 gap-2 p-4 text-center">
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                  <span className="text-[11px]">No OG Image specified (Will use default fallback)</span>
                </div>
              )}
              <div className="p-3.5 flex flex-col gap-1 bg-[#1e1f23]">
                <span className="text-[10px] text-gray-400 font-mono uppercase truncate">{canonicalHost}</span>
                <h4 className="text-xs font-bold text-white truncate">{effectiveOgTitle}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">{effectiveOgDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Input Forms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Meta Settings */}
          <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              General Search Engine Tags
            </h3>

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-300">Page Title (title)</label>
                <span
                  className={`text-[10px] font-mono ${
                    seoData.seo_title.length > 60
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}
                >
                  {seoData.seo_title.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={seoData.seo_title}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                placeholder="Page title for search engines"
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-300">Meta Description</label>
                <span
                  className={`text-[10px] font-mono ${
                    seoData.seo_description.length > 160
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}
                >
                  {seoData.seo_description.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoData.seo_description}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                placeholder="Brief summary of your site..."
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80 resize-none"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Keywords (Comma Separated)</label>
              <input
                type="text"
                value={seoData.seo_keywords}
                onChange={(e) => handleChange('seo_keywords', e.target.value)}
                placeholder="e.g. portfolio, developer, react, next.js"
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
              />
            </div>

            {/* Author & Canonical URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Author</label>
                <input
                  type="text"
                  value={seoData.seo_author}
                  onChange={(e) => handleChange('seo_author', e.target.value)}
                  placeholder="Wajahat Ali"
                  className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Canonical URL</label>
                <input
                  type="url"
                  value={seoData.seo_canonical_url}
                  onChange={(e) => handleChange('seo_canonical_url', e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>
            </div>

            {/* Robots Directive */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Indexing Directives (Robots)</label>
              <select
                value={seoData.seo_robots}
                onChange={(e) => handleChange('seo_robots', e.target.value)}
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
              >
                <option value="index, follow">index, follow (Allow Indexing & Links)</option>
                <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
                <option value="noindex, nofollow">noindex, nofollow (Block Search Crawlers)</option>
              </select>
            </div>
          </div>

          {/* Social / Open Graph Meta */}
          <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Open Graph & Social Media Tags
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                OG Title <span className="text-gray-500 text-[10px]">(Optional - falls back to main title)</span>
              </label>
              <input
                type="text"
                value={seoData.seo_og_title}
                onChange={(e) => handleChange('seo_og_title', e.target.value)}
                placeholder="Custom Open Graph Title"
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                OG Description <span className="text-gray-500 text-[10px]">(Optional - falls back to main description)</span>
              </label>
              <textarea
                rows={2}
                value={seoData.seo_og_description}
                onChange={(e) => handleChange('seo_og_description', e.target.value)}
                placeholder="Custom Open Graph Description"
                className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">OG Image URL</label>
                <input
                  type="url"
                  value={seoData.seo_og_image_url}
                  onChange={(e) => handleChange('seo_og_image_url', e.target.value)}
                  placeholder="https://domain.com/og-image.jpg"
                  className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Twitter Card Type</label>
                <select
                  value={seoData.seo_twitter_card}
                  onChange={(e) => handleChange('seo_twitter_card', e.target.value)}
                  className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                >
                  <option value="summary_large_image">summary_large_image (Large Card)</option>
                  <option value="summary">summary (Small Card)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}
