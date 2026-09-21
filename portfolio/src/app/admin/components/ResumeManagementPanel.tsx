'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  X,
  UploadCloud,
  FileCheck,
  Eye,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

interface ResumeManagementPanelProps {
  session: { access_token?: string } | null;
  showToast: (type: 'success' | 'error', message: string) => void;
}

type PanelState = 'loading' | 'empty' | 'uploaded' | 'uploading' | 'error';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_SIZE_LABEL = '10 MB';

export default function ResumeManagementPanel({ session, showToast }: ResumeManagementPanelProps) {
  const [panelState, setPanelState] = useState<PanelState>('loading');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {};
    let token = session?.access_token;
    if (!token) {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [session?.access_token]);

  // ── Fetch current resume URL ─────────────────────────────────────────────
  const fetchResumeStatus = useCallback(async () => {
    setPanelState('loading');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/resume', { headers });
      const json = await res.json();
      if (res.ok && json.success) {
        const url = json.data?.url || null;
        setResumeUrl(url);
        setPanelState(url ? 'uploaded' : 'empty');
      } else {
        throw new Error(json.error || 'Failed to load resume status');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load resume status');
      setPanelState('error');
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchResumeStatus();
  }, [fetchResumeStatus]);

  // ── Client-side file validation ──────────────────────────────────────────
  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return `Invalid file type "${file.type}". Please upload a PDF file.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return `File is too large (${mb} MB). Maximum allowed size is ${MAX_SIZE_LABEL}.`;
    }
    return null;
  };

  // ── Upload handler ───────────────────────────────────────────────────────
  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      showToast('error', validationError);
      return;
    }

    setSelectedFile(file);
    setPanelState('uploading');
    setUploadProgress(0);

    // Simulate smooth progress animation while the real upload happens
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + Math.random() * 12;
      });
    }, 200);

    try {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/resume', {
        method: 'POST',
        headers,
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      // Small delay so the 100% state is visible
      await new Promise((r) => setTimeout(r, 400));

      setResumeUrl(json.data.url);
      setPanelState('uploaded');
      setSelectedFile(null);
      showToast('success', 'Resume uploaded successfully!');
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(msg);
      setPanelState('error');
      showToast('error', msg);
    }
  };

  // ── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setPanelState('loading');

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/resume', {
        method: 'DELETE',
        headers,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Delete failed');
      }
      setResumeUrl(null);
      setPanelState('empty');
      showToast('success', 'Resume deleted successfully.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setErrorMessage(msg);
      setPanelState('error');
      showToast('error', msg);
    }
  };

  // ── Drag-and-drop handlers ───────────────────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // ── File input change ────────────────────────────────────────────────────
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so the same file can be re-selected after error
    e.target.value = '';
  };

  // ── Derived filename from URL ────────────────────────────────────────────
  const getDisplayName = () => {
    if (selectedFile) return selectedFile.name;
    if (resumeUrl) {
      try {
        const urlObj = new URL(resumeUrl.split('?')[0]);
        const parts = urlObj.pathname.split('/');
        return parts[parts.length - 1] || 'resume.pdf';
      } catch {
        return 'resume.pdf';
      }
    }
    return 'resume.pdf';
  };

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header card ── */}
      <div className="bg-[#121226]/70 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Resume / CV Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Upload your resume as a PDF (max {MAX_SIZE_LABEL}). The public portfolio will link
            directly to the active file.
          </p>
        </div>

        {panelState === 'uploaded' && (
          <button
            onClick={fetchResumeStatus}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        )}
      </div>

      {/* ── Main panel ── */}
      <AnimatePresence mode="wait">
        {/* Loading state */}
        {panelState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-16 text-center text-gray-400"
          >
            <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono text-xs">Loading resume status…</p>
          </motion.div>
        )}

        {/* Empty state — upload zone */}
        {panelState === 'empty' && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-4"
          >
            {/* Drag-and-drop zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-5 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-white/15 bg-[#121226]/50 hover:border-cyan-500/50 hover:bg-cyan-500/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                id="resume-upload-input"
                onChange={handleFileInputChange}
              />

              {/* Animated icon */}
              <motion.div
                animate={isDragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${
                  isDragging
                    ? 'bg-cyan-500/20 border-cyan-500/50'
                    : 'bg-white/5 border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30'
                }`}
              >
                <UploadCloud
                  className={`w-9 h-9 transition-colors duration-300 ${
                    isDragging ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'
                  }`}
                />
              </motion.div>

              <div className="text-center">
                <p className={`text-sm font-semibold transition-colors duration-300 ${isDragging ? 'text-cyan-300' : 'text-gray-300 group-hover:text-white'}`}>
                  {isDragging ? 'Drop your PDF here' : 'Drag & drop your resume'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or{' '}
                  <span className="text-cyan-400 underline underline-offset-2 cursor-pointer">
                    click to browse
                  </span>
                </p>
                <p className="text-[11px] text-gray-600 mt-3 font-mono">
                  PDF only · Max {MAX_SIZE_LABEL}
                </p>
              </div>

              {/* Animated gradient border on hover */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(139,92,246,0.05))',
                  }}
                />
              )}
            </div>

            {/* Specs row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <FileText className="w-4 h-4 text-cyan-400" />, label: 'Format', value: 'PDF only' },
                { icon: <UploadCloud className="w-4 h-4 text-purple-400" />, label: 'Max Size', value: MAX_SIZE_LABEL },
                { icon: <FileCheck className="w-4 h-4 text-emerald-400" />, label: 'Storage', value: 'Supabase Storage' },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#121226]/60 border border-white/5"
                >
                  {spec.icon}
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{spec.label}</p>
                    <p className="text-xs text-gray-300 font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Uploading state */}
        {panelState === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-[#121226]/70 rounded-2xl border border-white/10 p-8 flex flex-col items-center gap-6"
          >
            {/* File icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <FileText className="w-9 h-9 text-cyan-400" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-cyan-400/30 border-t-cyan-400"
              />
            </div>

            <div className="w-full max-w-sm text-center">
              <p className="text-sm font-semibold text-white mb-1">Uploading resume…</p>
              {selectedFile && (
                <p className="text-xs text-gray-400 font-mono mb-4 truncate">{selectedFile.name}</p>
              )}

              {/* Progress bar */}
              <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-cyan-300 font-mono mt-2">
                {Math.min(Math.round(uploadProgress), 100)}%
              </p>
            </div>
          </motion.div>
        )}

        {/* Uploaded state */}
        {panelState === 'uploaded' && resumeUrl && (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-[#121226]/70 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Top success banner */}
            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-emerald-300">
                Resume is active — visible to public portfolio visitors
              </span>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* PDF icon */}
              <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center shrink-0 gap-0.5">
                <FileText className="w-7 h-7 text-red-400" />
                <span className="text-[9px] font-bold text-red-400 font-mono tracking-widest">PDF</span>
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{getDisplayName()}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-mono break-all line-clamp-1">
                  {resumeUrl.split('?')[0]}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Active
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Supabase Storage · PDF</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="resume-view-btn"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  View
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>

                <label
                  htmlFor="resume-replace-input"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-xs font-semibold text-cyan-300 cursor-pointer transition-all shadow-lg shadow-cyan-500/10"
                  title="Replace current resume"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Replace
                </label>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="application/pdf"
                  id="resume-replace-input"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  id="resume-delete-btn"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 transition-all"
                  title="Delete resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Public link info */}
            <div className="mx-6 mb-6 p-3 rounded-xl bg-black/30 border border-white/5">
              <p className="text-[11px] text-gray-400 mb-1 font-mono uppercase tracking-wider">Public Download URL</p>
              <p className="text-[11px] text-cyan-300 font-mono break-all">{resumeUrl.split('?')[0]}</p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {panelState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center flex flex-col items-center gap-4"
          >
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <div>
              <p className="text-red-300 font-semibold text-sm">Something went wrong</p>
              <p className="text-xs text-red-400/70 mt-1 font-mono">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                setErrorMessage('');
                fetchResumeStatus();
              }}
              className="px-5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold text-red-200 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation dialog ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-[#121226] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Delete Resume?</h3>
                    <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                The current resume will be permanently removed from Supabase Storage and the public
                portfolio download link will be disabled.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  id="resume-delete-confirm-btn"
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-bold text-red-300 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
