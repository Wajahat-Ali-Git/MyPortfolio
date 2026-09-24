import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      body = JSON.parse(text);
    }

    const {
      visitor_id,
      session_id,
      event_category = 'click',
      event_name,
      event_label = '',
      path = '/',
      metadata = {},
    } = body || {};

    if (!visitor_id || !session_id || !event_name) {
      return NextResponse.json({ success: false, error: 'Missing required event fields' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      await supabase.from('analytics_events').insert({
        visitor_id,
        session_id,
        event_category: event_category.substring(0, 100),
        event_name: event_name.substring(0, 100),
        event_label: event_label.substring(0, 250),
        path: path.substring(0, 500),
        metadata,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to log event' },
      { status: 500 }
    );
  }
}
