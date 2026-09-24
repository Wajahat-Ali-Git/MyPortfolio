import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, createAuthenticatedClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Authenticate incoming request using Supabase auth header (Bearer token).
 */
async function authenticateAdminRequest(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return { authenticated: false, status: 503, error: 'Supabase is not configured' };
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, status: 401, error: 'Unauthorized: Missing Authorization header' };
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { authenticated: false, status: 401, error: 'Unauthorized: Invalid token' };
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user.email?.toLowerCase();
  const userRole = data.user.app_metadata?.role;

  const isAdmin =
    (adminEmail && (userEmail === adminEmail || userRole === 'admin')) ||
    (!adminEmail && userRole === 'admin');

  if (!isAdmin) {
    return { authenticated: false, status: 403, error: 'Forbidden: Admin access required' };
  }

  const client = createAuthenticatedClient(token);
  return { authenticated: true, user: data.user, client };
}

export async function GET(req: NextRequest) {
  const auth = await authenticateAdminRequest(req);
  if (!auth.authenticated || !auth.client) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const client = auth.client;
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '7d'; // '24h', '7d', '30d', '90d', 'all'

  // Calculate start time based on selected range
  const now = new Date();
  let startTime: Date;
  let prevStartTime: Date;

  switch (range) {
    case '24h':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      prevStartTime = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      break;
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevStartTime = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      prevStartTime = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      startTime = new Date(0);
      prevStartTime = new Date(0);
      break;
    case '7d':
    default:
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevStartTime = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      break;
  }

  try {
    // 1. Fetch Page Views in current period
    const { data: pageViewsData, error: pvError } = await client
      .from('analytics_page_views')
      .select('*')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: true });

    // 2. Fetch Page Views in previous period (for trend calculation)
    let prevViewsCount = 0;
    let prevVisitorsCount = 0;
    if (range !== 'all') {
      const { data: prevPvData } = await client
        .from('analytics_page_views')
        .select('visitor_id')
        .gte('created_at', prevStartTime.toISOString())
        .lt('created_at', startTime.toISOString());

      if (prevPvData) {
        prevViewsCount = prevPvData.length;
        prevVisitorsCount = new Set(prevPvData.map((d) => d.visitor_id)).size;
      }
    }

    // 3. Fetch Events in current period
    const { data: eventsData, error: evError } = await client
      .from('analytics_events')
      .select('*')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    const pageViews = pageViewsData || [];
    const events = eventsData || [];

    // Aggregations
    const totalViews = pageViews.length;
    const uniqueVisitors = new Set(pageViews.map((pv) => pv.visitor_id)).size;
    const totalEvents = events.length;

    // Trend calculations
    const viewsTrend = prevViewsCount === 0 ? 100 : Math.round(((totalViews - prevViewsCount) / prevViewsCount) * 100);
    const visitorsTrend = prevVisitorsCount === 0 ? 100 : Math.round(((uniqueVisitors - prevVisitorsCount) / prevVisitorsCount) * 100);

    // 4. Views & Visitors Over Time (Time series)
    const timeMap: Record<string, { label: string; views: number; visitorsSet: Set<string> }> = {};

    if (range === '24h') {
      // Group by hour
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const key = d.toISOString().substring(0, 13);
        timeMap[key] = { label: hourLabel, views: 0, visitorsSet: new Set() };
      }
      for (const pv of pageViews) {
        const key = new Date(pv.created_at).toISOString().substring(0, 13);
        if (timeMap[key]) {
          timeMap[key].views += 1;
          timeMap[key].visitorsSet.add(pv.visitor_id);
        }
      }
    } else {
      // Group by date (YYYY-MM-DD)
      const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = d.toISOString().split('T')[0];
        const dateLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        timeMap[dateKey] = { label: dateLabel, views: 0, visitorsSet: new Set() };
      }
      for (const pv of pageViews) {
        const dateKey = new Date(pv.created_at).toISOString().split('T')[0];
        if (timeMap[dateKey]) {
          timeMap[dateKey].views += 1;
          timeMap[dateKey].visitorsSet.add(pv.visitor_id);
        }
      }
    }

    const viewsOverTime = Object.values(timeMap).map((entry) => ({
      label: entry.label,
      views: entry.views,
      visitors: entry.visitorsSet.size,
    }));

    // 5. Top Pages Breakdown
    const pageCounts: Record<string, number> = {};
    for (const pv of pageViews) {
      const p = pv.path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({
        path,
        count,
        percentage: Math.round((count / (totalViews || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 6. Top Referrers Breakdown
    const refCounts: Record<string, number> = {};
    for (const pv of pageViews) {
      let ref = pv.referrer || 'Direct';
      try {
        if (ref !== 'Direct' && ref.startsWith('http')) {
          const u = new URL(ref);
          ref = u.hostname.replace('www.', '');
        }
      } catch {
        // Keep ref as string
      }
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    }
    const topReferrers = Object.entries(refCounts)
      .map(([referrer, count]) => ({
        referrer,
        count,
        percentage: Math.round((count / (totalViews || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 7. Device Type Breakdown
    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    for (const pv of pageViews) {
      const dev = (pv.device_type || 'desktop').toLowerCase();
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    }
    const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / (totalViews || 1)) * 100),
    }));

    // 8. Browser Breakdown
    const browserCounts: Record<string, number> = {};
    for (const pv of pageViews) {
      const br = pv.browser || 'Unknown';
      browserCounts[br] = (browserCounts[br] || 0) + 1;
    }
    const browserBreakdown = Object.entries(browserCounts)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: Math.round((count / (totalViews || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // 9. Event Breakdown
    const eventCounts: Record<string, { event_name: string; event_label: string; category: string; count: number }> = {};
    for (const ev of events) {
      const key = `${ev.event_name}:${ev.event_label || ''}`;
      if (!eventCounts[key]) {
        eventCounts[key] = {
          event_name: ev.event_name,
          event_label: ev.event_label || ev.event_name,
          category: ev.event_category || 'click',
          count: 0,
        };
      }
      eventCounts[key].count += 1;
    }
    const topEvents = Object.values(eventCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 10. Recent Activity Stream (last 15 items)
    const recentActivity = [
      ...pageViews.slice(-15).map((pv) => ({
        id: pv.id,
        type: 'page_view',
        title: `Page View: ${pv.path}`,
        subtitle: `${pv.browser} on ${pv.os} • ${pv.device_type}`,
        time: pv.created_at,
        path: pv.path,
        referrer: pv.referrer,
      })),
      ...events.slice(0, 15).map((ev) => ({
        id: ev.id,
        type: 'event',
        title: `Event: ${ev.event_name}`,
        subtitle: ev.event_label ? `${ev.event_label} (${ev.event_category})` : ev.event_category,
        time: ev.created_at,
        path: ev.path,
        referrer: '',
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      range,
      data: {
        summary: {
          totalViews,
          uniqueVisitors,
          totalEvents,
          viewsTrend,
          visitorsTrend,
          avgViewsPerVisitor: uniqueVisitors ? (totalViews / uniqueVisitors).toFixed(1) : '0',
        },
        viewsOverTime,
        topPages,
        topReferrers,
        deviceBreakdown,
        browserBreakdown,
        topEvents,
        recentActivity,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error fetching analytics data' },
      { status: 500 }
    );
  }
}
