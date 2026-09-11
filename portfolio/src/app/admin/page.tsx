'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  LogOut,
  FolderGit2,
  Briefcase,
  Wrench,
  Award,
  UserCheck,
  MessageSquare,
  Globe,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  User as UserIcon,
  Sparkles,
  Eye,
  EyeOff,
  LayoutDashboard,
  Save,
  ExternalLink,
  Mail,
  Link2,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';
import ItemFormModal, { AdminResourceType } from './components/ItemFormModal';
import type { SectionVisibilityInput } from '@/lib/admin/actions';

type TabType =
  | 'section_visibility'
  | 'projects'
  | 'experiences'
  | 'skills'
  | 'tools'
  | 'certifications'
  | 'spoken_languages'
  | 'personal_info'
  | 'contact_messages';

// ─── Section Visibility Panel ─────────────────────────────────────────────────

const SECTION_META: { key: keyof SectionVisibilityInput; label: string; description: string; icon: React.ReactNode }[] = [
  { key: 'projects',       label: 'Projects',       description: 'Portfolio project cards grid',          icon: <FolderGit2 className="w-4 h-4" /> },
  { key: 'github',         label: 'GitHub Activity', description: 'Recent GitHub repos & activity feed',  icon: <Globe className="w-4 h-4" /> },
  { key: 'experience',     label: 'Experience',      description: 'Work history timeline',                icon: <Briefcase className="w-4 h-4" /> },
  { key: 'skills',         label: 'Skills & Tools',  description: 'Skill bars and developer tools grid',  icon: <Wrench className="w-4 h-4" /> },
  { key: 'certifications', label: 'Certifications',  description: 'Certification cards',                  icon: <Award className="w-4 h-4" /> },
  { key: 'languages',      label: 'Languages',       description: 'Spoken languages section',             icon: <Globe className="w-4 h-4" /> },
];

function SectionVisibilityPanel({
  session,
  showToast,
}: {
  session: { access_token?: string } | null;
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [visibility, setVisibility] = useState<SectionVisibilityInput>({
    projects: true,
    github: true,
    experience: true,
    skills: true,
    certifications: true,
    languages: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
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
            map[row.key] = row.value;
          }
          setVisibility({
            projects:       map['section_projects_visible']       !== 'false',
            github:         map['section_github_visible']         !== 'false',
            experience:     map['section_experience_visible']     !== 'false',
            skills:         map['section_skills_visible']         !== 'false',
            certifications: map['section_certifications_visible'] !== 'false',
            languages:      map['section_languages_visible']      !== 'false',
          });
        }
      } catch {
        // keep defaults
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [session?.access_token]);

  const toggle = (key: keyof SectionVisibilityInput) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const rows = [
        { key: 'section_projects_visible',       value: String(visibility.projects) },
        { key: 'section_github_visible',         value: String(visibility.github) },
        { key: 'section_experience_visible',     value: String(visibility.experience) },
        { key: 'section_skills_visible',         value: String(visibility.skills) },
        { key: 'section_certifications_visible', value: String(visibility.certifications) },
        { key: 'section_languages_visible',      value: String(visibility.languages) },
      ];

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
      if (failed) throw new Error(failed.error || 'Failed to save one or more settings');

      showToast('success', 'Section visibility saved — changes are live on the public site.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save visibility settings');
    } finally {
      setIsSaving(false);
    }
  };

  const visibleCount = Object.values(visibility).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-400">
        <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-mono text-xs">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            Section Visibility
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Toggle which sections are shown to visitors on the public portfolio.
            Currently <span className="text-cyan-300 font-semibold">{visibleCount}/{SECTION_META.length}</span> sections visible.
          </p>
        </div>
        <button
          onClick={save}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:from-cyan-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/10"
        >
          {isSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTION_META.map((section) => {
          const isVisible = visibility[section.key];
          return (
            <motion.div
              key={section.key}
              layout
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 select-none ${
                isVisible
                  ? 'bg-cyan-500/5 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                  : 'bg-[#121226]/60 border-white/10 opacity-70'
              }`}
              onClick={() => toggle(section.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isVisible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {isVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                {isVisible ? 'Visible' : 'Hidden'}
              </div>

              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                isVisible
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border border-white/10 text-gray-500'
              }`}>
                {section.icon}
              </div>
              <p className={`text-sm font-semibold mb-1 ${isVisible ? 'text-white' : 'text-gray-500'}`}>
                {section.label}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{section.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                  isVisible ? 'bg-cyan-500' : 'bg-white/10'
                }`}>
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ left: isVisible ? '18px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                </div>
                <span className={`text-[11px] font-medium ${isVisible ? 'text-cyan-300' : 'text-gray-500'}`}>
                  {isVisible ? 'Shown to visitors' : 'Hidden from visitors'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

function AdminDashboardContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, session } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<TabType>('section_visibility');
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadResourceData = useCallback(async (resource: TabType) => {
    if (resource === 'section_visibility') return;
    setIsFetching(true);
    setFetchError('');
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/admin/${resource}`, { headers });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Failed to load ${resource}`);
      }

      if (json.success && Array.isArray(json.data)) {
        setItems(json.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Error fetching data');
      setItems([]);
    } finally {
      setIsFetching(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (isAuthenticated && activeTab !== 'section_visibility') {
      loadResourceData(activeTab);
    }
  }, [isAuthenticated, activeTab, loadResourceData]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (formData: any): Promise<boolean> => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/admin/${activeTab}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save item');
      }

      showToast('success', `${editingItem ? 'Updated' : 'Created'} item successfully!`);
      loadResourceData(activeTab);
      return true;
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save item');
      return false;
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/admin/${activeTab}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete item');
      }

      showToast('success', 'Item deleted successfully');
      loadResourceData(activeTab);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'section_visibility', label: 'Visibility',       icon: <Eye className="w-4 h-4" /> },
    { id: 'projects',           label: 'Projects',         icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'experiences',        label: 'Experiences',      icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills',             label: 'Skills',           icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tools',              label: 'Tools',            icon: <Wrench className="w-4 h-4" /> },
    { id: 'certifications',     label: 'Certifications',   icon: <Award className="w-4 h-4" /> },
    { id: 'spoken_languages',   label: 'Languages',        icon: <Globe className="w-4 h-4" /> },
    { id: 'personal_info',      label: 'Personal Info',    icon: <UserCheck className="w-4 h-4" /> },
    { id: 'contact_messages',   label: 'Messages',         icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.company_name && item.company_name.toLowerCase().includes(term)) ||
      (item.full_name && item.full_name.toLowerCase().includes(term)) ||
      (item.language_name && item.language_name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term))
    );
  });

  const personalRecord = activeTab === 'personal_info' && items.length > 0 ? items[0] : null;

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-sm ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/90 border-red-500/50 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="bg-[#121226]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Portfolio Admin Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Supabase Auth Session Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white transition-colors duration-200 hidden sm:flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> View Public Site
            </Link>

            <div className="flex items-center gap-2 bg-[#0a0a16]/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-gray-300 font-mono max-w-[150px] truncate">
                {user?.email}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Section Visibility tab */}
        {activeTab === 'section_visibility' ? (
          <SectionVisibilityPanel session={session} showToast={showToast} />
        ) : (
          <>
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab.replace('_', ' ')}...`}
                  className="w-full bg-[#121226]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => loadResourceData(activeTab)}
                  disabled={isFetching}
                  className="p-2 rounded-xl bg-[#121226]/80 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all text-xs flex items-center gap-1.5"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-cyan-400' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                {activeTab !== 'contact_messages' && (
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{activeTab === 'personal_info' && items.length > 0 ? 'Edit Personal Info' : `Add ${activeTab.replace('_', ' ').replace(/s$/, '')}`}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Special Layout for Personal Info Tab */}
            {activeTab === 'personal_info' && personalRecord && !fetchError && !isFetching && (
              <div className="bg-[#121226]/70 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-bold">
                      {personalRecord.full_name ? personalRecord.full_name[0] : 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{personalRecord.full_name}</h2>
                      <p className="text-sm text-cyan-400 font-medium">{personalRecord.role}</p>
                      {personalRecord.availability_status && (
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                          ● {personalRecord.availability_status}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditModal(personalRecord)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit Profile & Social Links</span>
                  </button>
                </div>

                {personalRecord.bio && (
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <h4 className="text-xs font-semibold text-gray-400 mb-1">Hero Bio / About Me</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{personalRecord.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                  {personalRecord.email && (
                    <div className="flex items-center gap-2.5 text-xs text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{personalRecord.email}</span>
                    </div>
                  )}
                  {personalRecord.github_url && (
                    <a
                      href={personalRecord.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-xs text-gray-300 bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-xl border border-white/5 transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">GitHub Profile</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                  {personalRecord.linkedin_url && (
                    <a
                      href={personalRecord.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-xs text-gray-300 bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-xl border border-white/5 transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                  {personalRecord.twitter_url && (
                    <a
                      href={personalRecord.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-xs text-gray-300 bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-xl border border-white/5 transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">Twitter Profile</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-gray-500" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* General Content Table */}
            {fetchError ? (
              <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-300 font-semibold">{fetchError}</p>
                <button
                  onClick={() => loadResourceData(activeTab)}
                  className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-xl text-xs text-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : isFetching ? (
              <div className="p-16 text-center text-gray-400">
                <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="font-mono text-xs">Loading {activeTab.replace('_', ' ')}...</p>
              </div>
            ) : filteredItems.length === 0 && activeTab !== 'personal_info' ? (
              <div className="p-16 rounded-2xl bg-[#121226]/50 border border-white/5 text-center text-gray-400">
                <p className="text-sm font-medium">No records found for {activeTab.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 mt-1">Click "+ Add" to create your first record.</p>
              </div>
            ) : activeTab !== 'personal_info' && (
              <div className="bg-[#121226]/70 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-black/30 border-b border-white/10 text-gray-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Title / Name</th>
                        <th className="p-4">Details & Tags</th>
                        <th className="p-4">Status / Meta</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredItems.map((item) => (
                        <tr key={item.id || item.slug || Math.random()} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-medium text-white">
                            <div className="flex items-center gap-2">
                              {item.flag_emoji && <span className="text-base">{item.flag_emoji}</span>}
                              <span>{item.title || item.name || item.full_name || item.company_name || item.language_name || 'Untitled'}</span>
                            </div>
                            {item.slug && <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.slug}</div>}
                            {item.company_slug && <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.company_slug}</div>}
                          </td>
                          <td className="p-4 text-gray-400 max-w-md">
                            <div className="line-clamp-2">{item.description || item.role || item.provider || item.category || item.email || item.message || '-'}</div>
                            
                            {/* Render Tag Badges */}
                            {Array.isArray(item.tech_stack) && item.tech_stack.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.tech_stack.slice(0, 4).map((tech: string, i: number) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                                    {tech}
                                  </span>
                                ))}
                                {item.tech_stack.length > 4 && (
                                  <span className="text-[10px] text-gray-500">+{item.tech_stack.length - 4} more</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-gray-400">
                            {item.proficiency !== undefined && item.proficiency !== null && (
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${item.proficiency}%` }} />
                                </div>
                                <span>{item.proficiency}%</span>
                              </div>
                            )}
                            {item.is_visible !== undefined && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${item.is_visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {item.is_visible ? 'Visible' : 'Hidden'}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {activeTab !== 'contact_messages' && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(item)}
                                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Item Add/Edit Modal */}
      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={activeTab as AdminResourceType}
        initialData={editingItem}
        onSave={handleSaveItem}
      />
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboardContent />;
}
