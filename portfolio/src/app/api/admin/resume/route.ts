import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, isSupabaseConfigured, createAuthenticatedClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const BUCKET = 'resumes';
const RESUME_KEY = 'resume_file_url';
const RESUME_STORAGE_PATH = 'resume.pdf'; // single canonical file per portfolio
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─── Auth helper (mirrors the pattern in [resource]/route.ts) ────────────────

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

// ─── GET /api/admin/resume ───────────────────────────────────────────────────
// Returns the current resume URL stored in site_settings.
// Public-readable (no auth required) so the portfolio page can use it.

export async function GET(req: NextRequest) {
  // Allow public access for the portfolio's Download CV button
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, data: { url: null } });
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', RESUME_KEY)
      .maybeSingle();

    if (error) throw error;

    const url = data?.value || null;
    return NextResponse.json({ success: true, data: { url: url || null } });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch resume URL' },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/resume ──────────────────────────────────────────────────
// Accepts multipart/form-data with a single `file` field (PDF, max 10 MB).
// Uploads to Supabase Storage, then updates site_settings with the public URL.
// If a resume already exists it is replaced (same canonical path).

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error }, { status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided. Expected a "file" field in the form data.' },
        { status: 400 }
      );
    }

    // ── Server-side validations ──────────────────────────────────────────
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: `Invalid file type "${file.type}". Only PDF files are accepted.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { success: false, error: `File is too large (${mb} MB). Maximum allowed size is 10 MB.` },
        { status: 400 }
      );
    }

    // ── Upload to Supabase Storage (upsert = replace if exists) ─────────
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await auth.client.storage
      .from(BUCKET)
      .upload(RESUME_STORAGE_PATH, uint8, {
        contentType: 'application/pdf',
        upsert: true, // replace existing file at the same path
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // ── Get the public URL for the uploaded file ─────────────────────────
    const { data: publicUrlData } = auth.client.storage
      .from(BUCKET)
      .getPublicUrl(RESUME_STORAGE_PATH);

    const publicUrl = publicUrlData.publicUrl;

    // Append a cache-busting timestamp so browsers always get the latest file
    // even though the filename is canonical (resume.pdf).
    const urlWithBust = `${publicUrl}?t=${Date.now()}`;

    // ── Persist URL in site_settings ─────────────────────────────────────
    const { error: settingsError } = await auth.client
      .from('site_settings')
      .upsert([{ key: RESUME_KEY, value: urlWithBust, updated_at: new Date().toISOString() }], {
        onConflict: 'key',
      });

    if (settingsError) {
      console.error('site_settings upsert error:', settingsError);
      return NextResponse.json(
        { success: false, error: `Failed to save resume URL: ${settingsError.message}` },
        { status: 500 }
      );
    }

    revalidatePath('/');
    return NextResponse.json({
      success: true,
      data: { url: urlWithBust },
      message: 'Resume uploaded successfully.',
    });
  } catch (err) {
    console.error('POST /api/admin/resume error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/resume ────────────────────────────────────────────────
// Removes the file from Supabase Storage and clears the site_settings URL.

export async function DELETE(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    const status = auth.unavailable ? 503 : auth.forbidden ? 403 : 401;
    return NextResponse.json({ success: false, error: auth.error }, { status });
  }

  try {
    // ── Remove from storage ───────────────────────────────────────────────
    const { error: removeError } = await auth.client.storage
      .from(BUCKET)
      .remove([RESUME_STORAGE_PATH]);

    if (removeError) {
      // If the file doesn't exist in storage that's fine — still clear the setting.
      console.warn('Storage remove warning (file may not exist):', removeError.message);
    }

    // ── Clear the URL in site_settings ───────────────────────────────────
    const { error: settingsError } = await auth.client
      .from('site_settings')
      .upsert([{ key: RESUME_KEY, value: '', updated_at: new Date().toISOString() }], {
        onConflict: 'key',
      });

    if (settingsError) {
      return NextResponse.json(
        { success: false, error: `Failed to clear resume URL: ${settingsError.message}` },
        { status: 500 }
      );
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('DELETE /api/admin/resume error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
