import { NextRequest } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

export interface AdminActivityInput {
  client: SupabaseClient;
  adminEmail: string;
  adminId?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TOGGLE_VISIBILITY' | 'SETTINGS_CHANGE' | 'RESUME_UPDATE' | 'LOGIN';
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  req?: NextRequest;
}

/**
 * Inserts an immutable administrative audit log entry into Supabase.
 */
export async function recordAdminActivity({
  client,
  adminEmail,
  adminId = '',
  action,
  resource,
  resourceId = '',
  details = {},
  req,
}: AdminActivityInput): Promise<void> {
  try {
    let ip_address = '127.0.0.1';
    let user_agent = '';

    if (req) {
      ip_address =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';
      user_agent = req.headers.get('user-agent') || '';
    }

    await client.from('admin_activity_logs').insert({
      admin_email: adminEmail,
      admin_id: adminId,
      action,
      resource,
      resource_id: resourceId,
      details,
      ip_address,
      user_agent: user_agent.substring(0, 500),
    });
  } catch (err) {
    // Non-blocking catch to ensure main CMS operation does not fail if audit log write fails
    console.error('Failed to log admin activity:', err);
  }
}
