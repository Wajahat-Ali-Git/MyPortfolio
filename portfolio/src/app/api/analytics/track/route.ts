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
      path = '/',
      title = '',
      referrer = 'Direct',
      device_type = 'desktop',
      browser = 'Unknown',
      os = 'Unknown',
      user_agent = '',
    } = body || {};

    if (!visitor_id || !session_id) {
      return NextResponse.json({ success: false, error: 'Missing session or visitor ID' }, { status: 400 });
    }

    // Extract client IP address from headers
    const ip_address =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isSupabaseConfigured()) {
      await supabase.from('analytics_page_views').insert({
        visitor_id,
        session_id,
        path: path.substring(0, 500),
        title: title.substring(0, 500),
        referrer: referrer.substring(0, 500),
        device_type,
        browser,
        os,
        ip_address,
        user_agent: user_agent.substring(0, 1000),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to log page view' },
      { status: 500 }
    );
  }
}
