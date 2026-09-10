'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';

/**
 * Inner gate — rendered inside AdminAuthProvider so it can read auth state.
 * While the session check is still in-flight it renders a full-screen spinner
 * rather than briefly flashing protected UI.  The actual redirect to /admin/login
 * is handled by each protected page; this gate just prevents a content flash.
 */
function AdminSessionGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a16] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full" />
        </motion.div>
        <p className="text-gray-400 font-mono text-sm">Verifying session...</p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Layout for all /admin/* routes.
 * - Provides AdminAuthContext to every admin page via a single provider.
 * - Blocks rendering until the Supabase session check completes, so no
 *   admin page ever briefly renders unauthenticated content.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminSessionGate>{children}</AdminSessionGate>
    </AdminAuthProvider>
  );
}
