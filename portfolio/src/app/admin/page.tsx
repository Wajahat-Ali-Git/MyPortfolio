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
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';
import {
  adminUpsertProject,
  adminDeleteProject,
  adminUpsertExperience,
  adminDeleteExperience,
  adminUpsertSkill,
  adminDeleteSkill,
  adminUpsertTool,
  adminDeleteTool,
  adminUpsertCertification,
  adminDeleteCertification,
  adminUpdatePersonalInfo,
} from '@/lib/admin/actions';

type TabType =
  | 'projects'
  | 'experiences'
  | 'skills'
  | 'tools'
  | 'certifications'
  | 'personal_info'
  | 'contact_messages';

function AdminDashboardContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, session } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [items, setItems] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect to login if not authenticated. isLoading is already false here
  // because layout.tsx's AdminSessionGate blocks rendering until the session
  // check completes — so this redirect fires immediately on mount when there
  // is no valid session, with no content flash.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch resource data for active tab
  const loadResourceData = useCallback(async (resource: TabType) => {
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
    if (isAuthenticated) {
      loadResourceData(activeTab);
    }
  }, [isAuthenticated, activeTab, loadResourceData]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
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

  // Layout gate already blocked rendering while isLoading was true.
  // This guard covers the edge case where the session expires mid-session.
  if (!isAuthenticated) {
    return null;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'experiences', label: 'Experiences', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'personal_info', label: 'Personal Info', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'contact_messages', label: 'Contact Messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.company_name && item.company_name.toLowerCase().includes(term)) ||
      (item.full_name && item.full_name.toLowerCase().includes(term)) ||
      (item.email && item.email.toLowerCase().includes(term))
    );
  });

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
          </div>
        </div>

        {/* Content Table / Grid */}
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
        ) : filteredItems.length === 0 ? (
          <div className="p-16 rounded-2xl bg-[#121226]/50 border border-white/5 text-center text-gray-400">
            <p className="text-sm font-medium">No records found for {activeTab.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500 mt-1">Data from database will appear here when added.</p>
          </div>
        ) : (
          <div className="bg-[#121226]/70 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-black/30 border-b border-white/10 text-gray-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Title / Name</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.map((item) => (
                    <tr key={item.id || item.slug || Math.random()} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-medium text-white">
                        <div>
                          {item.title || item.name || item.full_name || item.company_name || 'Untitled'}
                        </div>
                        {item.slug && <div className="text-[10px] text-gray-500 font-mono">{item.slug}</div>}
                      </td>
                      <td className="p-4 text-gray-400 max-w-md truncate">
                        {item.description || item.role || item.category || item.email || item.message || '-'}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 text-right">
                        {activeTab !== 'contact_messages' && activeTab !== 'personal_info' && (
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return <AdminDashboardContent />;
}
