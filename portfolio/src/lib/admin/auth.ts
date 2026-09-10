import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AdminAuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

/**
 * Verify if a given user account is authorized as an Admin.
 *
 * Rules (in priority order):
 *  1. NEXT_PUBLIC_ADMIN_EMAIL is set → user's email must match it OR role must be 'admin'.
 *  2. NEXT_PUBLIC_ADMIN_EMAIL is NOT set → user must carry role='admin' in app_metadata.
 *     Returning true for any authenticated user is intentionally rejected here because it
 *     would allow any Supabase account on the project to become an admin.
 */
export function checkIsAdmin(user: User | null): boolean {
  if (!user) {
    console.log('[checkIsAdmin] No user provided');
    return false;
  }

  const userRole = user.app_metadata?.role || user.user_metadata?.role;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

  console.log('[checkIsAdmin] Debug:', {
    userEmail: user.email,
    userRole,
    adminEmail: adminEmail || '(not set)',
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
  });

  if (adminEmail) {
    const userEmail = user.email?.toLowerCase();
    const isAdmin = userEmail === adminEmail || userRole === 'admin';
    console.log('[checkIsAdmin] Admin email is set, result:', isAdmin);
    return isAdmin;
  }

  // No admin email configured — require an explicit role claim to prevent
  // any authenticated Supabase user from being treated as an admin.
  const isAdmin = userRole === 'admin';
  console.log('[checkIsAdmin] No admin email set, checking role only, result:', isAdmin);
  return isAdmin;
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
      // Clear session manually in case logout endpoint is blocked
      await supabase.auth.setSession({ access_token: '', refresh_token: '' });
      await supabase.auth.getSession();
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
 * Sign out the currently authenticated admin.
 * 
 * Note: Some Supabase projects have the logout endpoint blocked entirely (403).
 * As a workaround, we clear the session from localStorage manually and let the
 * auth state change listener pick it up. This is functionally equivalent to
 * signOut() for single-device logout.
 */
export async function signOutAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    // Try the standard signOut first
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    
    // If it succeeds, great
    if (!error) {
      return { success: true };
    }

    // If it fails with 403 (logout endpoint blocked), clear session manually
    if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
      // Clear the session from client-side storage
      await supabase.auth.setSession({ access_token: '', refresh_token: '' });
      // Force a session refresh which will detect the invalid token and clear everything
      await supabase.auth.getSession();
      return { success: true };
    }

    // Other errors — return them
    return { success: false, error: error.message };
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
      // Auto sign out unauthorized accounts.
      // Use manual session clearing in case the logout endpoint is blocked.
      supabase.auth.setSession({ access_token: '', refresh_token: '' }).then(() => {
        supabase.auth.getSession();
      });
      callback(event, null);
    } else {
      callback(event, session);
    }
  });
  return data.subscription;
}
