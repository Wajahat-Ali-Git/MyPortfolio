'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '../AdminAuthContext';

function AdminLoginForm() {
  const router = useRouter();
  const { user, isAuthenticated, isConfigured, login } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Layout gate already handled the loading state. If session is valid,
  // redirect immediately — no need to wait for isLoading here.
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white relative overflow-hidden flex flex-col justify-center items-center p-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Return to site link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Card */}
        <div className="bg-[#121226]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 flex items-center justify-center mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Admin Authentication
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Sign in with your Supabase credentials to manage portfolio data
            </p>
          </div>

          {/* Config Warning if env variables are missing */}
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">Supabase Not Configured</p>
                <p className="mt-1 opacity-90">
                  Please set <code className="bg-black/30 px-1 py-0.5 rounded text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-black/30 px-1 py-0.5 rounded text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment variables.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-[#0a0a16]/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#0a0a16]/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <CheckCircle2 className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-cyan-400/70" />
              <span>Secured with Supabase Built-in Auth & Row-Level Security</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
