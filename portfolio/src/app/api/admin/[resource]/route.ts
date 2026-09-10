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
];

type Props = {
  params: Promise<{ resource: string }>;
};

/**
 * Authenticate incoming request using Supabase auth header (Bearer token)
 */
async function authenticateRequest(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    // If Supabase is not configured yet (local dev fallback), allow with default client
    return { authenticated: true, client: supabase };
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

  // Optional Admin Email / Role Restriction
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user.email?.toLowerCase();
  const userRole = data.user.app_metadata?.role || data.user.user_metadata?.role;

  if (adminEmail && userEmail !== adminEmail && userRole !== 'admin') {
    return { authenticated: false, forbidden: true, client: supabase, error: 'Forbidden: User is not authorized as an administrator' };
  }

  const authenticatedClient = createAuthenticatedClient(token);
  return { authenticated: true, user: data.user, client: authenticatedClient };
}

/**
 * GET /api/admin/[resource]
 * Fetches all records of a given resource for admin display (Strictly Protected)
 */
export async function GET(req: NextRequest, { params }: Props) {
  const { resource } = await params;

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (isSupabaseConfigured() && !auth.authenticated) {
    const status = auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status });
  }

  try {
    const client = auth.client;

    const { data, error } = await client
      .from(resource)
      .select('*')
      .order('created_at', { ascending: false });

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
  const { resource } = await params;

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (isSupabaseConfigured() && !auth.authenticated) {
    const status = auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status });
  }

  try {
    const body = await req.json();
    const { data, error } = await auth.client.from(resource).upsert([body]).select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
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
  const { resource } = await params;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing required query parameter "id"' }, { status: 400 });
  }

  const auth = await authenticateRequest(req);
  if (isSupabaseConfigured() && !auth.authenticated) {
    const status = auth.forbidden ? 403 : 401;
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
