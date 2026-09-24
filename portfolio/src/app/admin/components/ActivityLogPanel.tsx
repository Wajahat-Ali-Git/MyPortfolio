'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  User,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Settings,
  Download,
  Calendar,
  FileText,
  Clock,
  Code,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AuditLogItem {
  id: string;
  admin_email: string;
  admin_id?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_VISIBILITY' | 'SETTINGS_CHANGE' | 'RESUME_UPDATE' | 'LOGIN';
  resource: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export default function ActivityLogPanel({
  session,
  showToast,
}: {
  session: { access_token?: string } | null;
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [resourceFilter, setResourceFilter] = useState<string>('ALL');
  const [selectedDetailLog, setSelectedDetailLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = useCallback(async (showSpin = true) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/admin/admin_activity_logs', { headers });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch activity logs');
      }

      setLogs(json.data || []);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Error loading audit logs');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [session?.access_token, showToast]);

  useEffect(() => {
    fetchLogs(true);
  }, [fetchLogs]);

  // Filtering
  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (resourceFilter !== 'ALL' && log.resource !== resourceFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const detailsStr = JSON.stringify(log.details || {}).toLowerCase();
    return (
      log.admin_email.toLowerCase().includes(term) ||
      log.resource.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      detailsStr.includes(term)
    );
  });

  // Export CSV Audit Report
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast('error', 'No audit logs available to export');
      return;
    }

    const headers = ['ID', 'Timestamp', 'Admin Email', 'Action', 'Resource', 'Resource ID', 'Details'];
    const csvRows = [
      headers.join(','),
      ...filteredLogs.map((log) =>
        [
          `"${log.id}"`,
          `"${new Date(log.created_at).toISOString()}"`,
          `"${log.admin_email}"`,
          `"${log.action}"`,
          `"${log.resource}"`,
          `"${log.resource_id || ''}"`,
          `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Exported audit log report to CSV!');
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return { label: 'Create', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', icon: PlusCircle };
      case 'UPDATE':
        return { label: 'Update', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400', icon: Edit3 };
      case 'DELETE':
        return { label: 'Delete', color: 'bg-red-500/10 border-red-500/30 text-red-400', icon: Trash2 };
      case 'TOGGLE_VISIBILITY':
        return { label: 'Visibility', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400', icon: Eye };
      case 'SETTINGS_CHANGE':
        return { label: 'Settings', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', icon: Settings };
      default:
        return { label: action, color: 'bg-gray-500/10 border-gray-500/30 text-gray-400', icon: History };
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-xs">Loading CMS Audit Logs…</p>
      </div>
    );
  }

  const todayCount = logs.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-[#121226]/80 rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Admin Activity Audit Log
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Immutable audit trail of administrative modifications, updates, and setting toggles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all shadow-lg shadow-cyan-500/10"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => fetchLogs(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{logs.length}</p>
            <p className="text-xs text-gray-400">Total Audit Logs</p>
          </div>
        </div>

        <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{todayCount}</p>
            <p className="text-xs text-gray-400">Actions Today</p>
          </div>
        </div>

        <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-[180px]">
              {logs[0]?.admin_email || 'System Admin'}
            </p>
            <p className="text-xs text-gray-400">Active Administrator</p>
          </div>
        </div>
      </div>

      {/* Action Bar: Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121226]/60 p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by admin email, resource, or details..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="TOGGLE_VISIBILITY">Visibility</option>
            <option value="SETTINGS_CHANGE">Settings</option>
          </select>

          {/* Resource Filter */}
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Resources</option>
            <option value="projects">Projects</option>
            <option value="experiences">Experiences</option>
            <option value="skills">Skills</option>
            <option value="tools">Tools</option>
            <option value="certifications">Certifications</option>
            <option value="spoken_languages">Languages</option>
            <option value="site_settings">Site Settings</option>
            <option value="resume">Resume</option>
          </select>
        </div>
      </div>

      {/* Activity Stream Log Table */}
      <div className="bg-[#121226]/80 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4">Resource & Details</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
                <th className="py-3 px-4 text-center">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 italic">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  const itemTitle =
                    log.details?.title || log.details?.name || log.resource_id || log.resource;

                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                          <Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{log.admin_email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white capitalize">{log.resource.replace(/_/g, ' ')}</span>
                          <span className="text-[11px] text-gray-400 truncate max-w-[280px]">
                            {itemTitle}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                        {log.ip_address || '127.0.0.1'}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDetailLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all text-[11px] font-semibold flex items-center gap-1 mx-auto"
                        >
                          <Code className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      <AnimatePresence>
        {selectedDetailLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121226] border border-white/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col gap-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold">Audit Event Payload Details</h3>
                </div>
                <button
                  onClick={() => setSelectedDetailLog(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-gray-400">Action:</span> <span className="text-cyan-300 font-bold">{selectedDetailLog.action}</span>
                </div>
                <div>
                  <span className="text-gray-400">Resource:</span> <span className="text-purple-300 font-bold">{selectedDetailLog.resource}</span>
                </div>
                <div>
                  <span className="text-gray-400">Admin:</span> <span className="text-gray-200">{selectedDetailLog.admin_email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Timestamp:</span> <span className="text-gray-200">{new Date(selectedDetailLog.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-400 mb-2 block">JSON Payload Data:</span>
                <pre className="bg-black/60 p-4 rounded-xl text-xs font-mono text-cyan-300 border border-white/10 overflow-x-auto max-h-64 leading-relaxed">
                  {JSON.stringify(selectedDetailLog.details || {}, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedDetailLog(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
