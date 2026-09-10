import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
 * GET /api/admin/[resource]
 * Fetches all records of a given resource for admin display
 */
export async function GET(req: NextRequest, { params }: Props) {
  const { resource } = await params;

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
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
 * Creates or updates a record
 */
export async function POST(req: NextRequest, { params }: Props) {
  const { resource } = await params;

  if (!ALLOWED_RESOURCES.includes(resource)) {
    return NextResponse.json({ error: `Invalid resource: ${resource}` }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { data, error } = await supabase.from(resource).upsert([body]).select();

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
 * Deletes a record by ID
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

  try {
    const { error } = await supabase.from(resource).delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: `Deleted ${id} from ${resource}` });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Database delete failed' },
      { status: 500 }
    );
  }
}
