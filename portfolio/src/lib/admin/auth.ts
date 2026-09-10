import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AdminAuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

/**
 * Verify if a given user account is authorized as an Admin
 */
export function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    const userEmail = user.email?.toLowerCase();
    const userRole = user.app_metadata?.role || user.user_metadata?.role;
    return userEmail === adminEmail || userRole === 'admin';
  }
  return true;
}

/**
 * Sign in an admin using Supabase built-in Auth (email & password)
 */
export async function signInAdmin(
  email: string,
  pass: string
): Promise<AdminAuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase credentials are not configured in environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Role / Admin Email Verification
    if (!checkIsAdmin(data.user)) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied: This account does not have administrator privileges.',
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected authentication error occurred.',
    };
  }
}

/**
 * Sign out the currently authenticated admin
 */
export async function signOutAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to sign out',
    };
  }
}

/**
 * Get current authenticated user from Supabase built-in auth
 */
export async function getAdminUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user || !checkIsAdmin(data.user)) {
      return null;
    }
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Get active session from Supabase
 */
export async function getAdminSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session || !checkIsAdmin(data.session.user)) {
      return null;
    }
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user && !checkIsAdmin(session.user)) {
      // Auto sign out unauthorized accounts
      supabase.auth.signOut();
      callback(event, null);
    } else {
      callback(event, session);
    }
  });
  return data.subscription;
}
