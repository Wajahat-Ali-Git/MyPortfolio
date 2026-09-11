'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  signInAdmin,
  signOutAdmin,
  getAdminSession,
  onAuthStateChange,
  type AdminAuthResponse,
} from '@/lib/admin/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<AdminAuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentSession = await getAdminSession();
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Subscribe to auth state changes from Supabase
    const subscription = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  const login = async (email: string, pass: string): Promise<AdminAuthResponse> => {
    setIsLoading(true);
    const res = await signInAdmin(email, pass);
    if (res.success && res.user && res.session) {
      setUser(res.user);
      setSession(res.session);
    }
    setIsLoading(false);
    return res;
  };

  const logout = async () => {
    setIsLoading(true);
    await signOutAdmin();
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  const value: AdminAuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isConfigured,
    login,
    logout,
    refreshSession: checkSession,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
