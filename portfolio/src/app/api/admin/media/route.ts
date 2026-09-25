import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, isSupabaseConfigured, createAuthenticatedClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const BUCKET = 'portfolio-media';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

async function authenticateRequest(req: NextRequest): Promise<
  | { authenticated: true; client: ReturnType<typeof createAuthenticatedClient> }
  | { authenticated: false; forbidden?: boolean; unavailable?: boolean; error: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      authenticated: false,
      unavailable: true,
      error: 'Service unavailable: Supabase is not configured.',
    };
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Unauthorized: Missing Authorization header' };
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { authenticated: false, error: 'Unauthorized: Invalid or expired token' };
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user.email?.toLowerCase();
  const userRole = data.user.app_metadata?.role;

  const isAdmin =
    (adminEmail && (userEmail === adminEmail || userRole === 'admin')) ||
    (!adminEmail && userRole === 'admin');

  if (!isAdmin) {
    return {
      authenticated: false,
      forbidden: true,
      error: 'Forbidden: User is not authorized as an administrator',
    };
  }

  return { authenticated: true, client: createAuthenticatedClient(token) };
}

/**
 * POST /api/admin/media
 * Uploads an image file to Supabase Storage in the portfolio-media bucket.
 * Query params or form field 'folder' can specify a subfolder (e.g., 'og', 'hero', 'projects').
 */
export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error }, { status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'general';

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Expected a "file" field in form data.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type "${file.type}". Allowed types: JPG, PNG, WebP, GIF, SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { success: false, error: `File size (${mb} MB) exceeds maximum allowed size of 10 MB.` },
        { status: 400 }
      );
    }

    // Generate clean unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const fileName = `${folder}/${cleanBaseName}-${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await auth.client.storage
      .from(BUCKET)
      .upload(fileName, uint8, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage media upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = auth.client.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: { url: publicUrl, path: fileName },
      message: 'Media uploaded successfully.',
    });
  } catch (err) {
    console.error('POST /api/admin/media error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Media upload failed' },
      { status: 500 }
    );
  }
}
