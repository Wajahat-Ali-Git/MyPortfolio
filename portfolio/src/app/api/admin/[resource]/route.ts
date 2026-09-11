import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, createAuthenticatedClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const ALLOWED_RESOURCES = [
  'projects',
  'experiences',
  'skills',
  'tools',
  'certifications',
  'spoken_languages',
  'personal_info',
  'contact_messages',
  'site_settings',
];

type Props = {
  params: Promise<{ resource: string }>;
};

/**
 * Authenticate incoming request using Supabase auth header (Bearer token).
 * Returns a typed result so callers can distinguish 401, 403, and 503.
 */
async function authenticateRequest(req: NextRequest): Promise<
  | { authenticated: true; user: import('@supabase/supabase-js').User; client: ReturnType<typeof createAuthenticatedClient> }
  | { authenticated: false; forbidden?: boolean; unavailable?: boolean; error: string; client: typeof supabase }
> {
  // Supabase must be configured — never allow unauthenticated fallback in any environment.
  if (!isSupabaseConfigured()) {
    return {
      authenticated: false,
      unavailable: true,
      client: supabase,
      error: 'Service unavailable: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, client: supabase, error: 'Unauthorized: Missing Authorization header' };
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { authenticated: false, client: supabase, error: 'Unauthorized: Invalid or expired token' };
  }

  // Admin email or role restriction — always enforced (see checkIsAdmin in auth.ts).
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user.email?.toLowerCase();
  const userRole = data.user.app_metadata?.role || data.user.user_metadata?.role;

  // If NEXT_PUBLIC_ADMIN_EMAIL is set, user must match it or carry role=admin.
  // If it is NOT set, fall back to role check only — access is denied without an explicit role.
  const isAdmin =
    (adminEmail && (userEmail === adminEmail || userRole === 'admin')) ||
    (!adminEmail && userRole === 'admin');

  if (!isAdmin) {
    return {
      authenticated: false,
      forbidden: true,
      client: supabase,
      error: 'Forbidden: User is not authorized as an administrator',
    };
  }

  const authenticatedClient = createAuthenticatedClient(token);
  return { authenticated: true, user: data.user, client: authenticatedClient };
}

/**
 * GET /api/admin/[resource]
 * Fetches all records of a given resource for admin display (Strictly Protected)
 */
export async function GET(req: NextRequest, { params }: Props) {
  let { resource } = await params;

  if (resource === 'languages') resource = 'spoken_languages';

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status });
  }

  try {
    const client = auth.client;

    let query = client.from(resource).select('*');
    
    // Sort by display_order if applicable, else created_at
    if (['projects', 'experiences', 'skills', 'tools', 'certifications', 'spoken_languages'].includes(resource)) {
      query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Database fetch failed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/[resource]
 * Creates or updates a record (Strictly Protected)
 */
export async function POST(req: NextRequest, { params }: Props) {
  let { resource } = await params;
  if (resource === 'languages') resource = 'spoken_languages';

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status });
  }

  try {
    const body = await req.json();

    let result;

    // site_settings uses `key` as PK (not UUID `id`) — always upsert by key
    if (resource === 'site_settings') {
      result = await auth.client
        .from('site_settings')
        .upsert([{ ...body, updated_at: new Date().toISOString() }], { onConflict: 'key' })
        .select();
    } else if (body && typeof body === 'object' && body.id) {
      const { id, ...updateFields } = body;
      result = await auth.client
        .from(resource)
        .update(updateFields)
        .eq('id', id)
        .select();
    } else {
      result = await auth.client
        .from(resource)
        .insert([body])
        .select();
    }

    if (result.error) {
      console.error(`Database operation error on '${resource}':`, result.error);
      return NextResponse.json(
        { success: false, error: result.error.message || 'Database save failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error(`POST /api/admin/${resource} error:`, err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Database save failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/[resource]?id=...
 * Deletes a record by ID (Strictly Protected)
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  let { resource } = await params;
  if (resource === 'languages') resource = 'spoken_languages';
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing required query parameter "id"' }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status });
  }

  try {
    const { error } = await auth.client.from(resource).delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: `Deleted ${id} from ${resource}` });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Database delete failed' },
      { status: 500 }
    );
  }
}
