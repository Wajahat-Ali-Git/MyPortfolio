'use client';

// Helper utilities for visitor tracking & analytics events

const VISITOR_KEY = 'pa_visitor_id';
const SESSION_KEY = 'pa_session_id';

/**
 * Gets or creates a persistent visitor ID (stored in localStorage)
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'v_anonymous';
  }
}

/**
 * Gets or creates a session ID (stored in sessionStorage, resets when tab/window is closed)
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 's_anonymous';
  }
}

/**
 * Detects device category from userAgent
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Detects browser name from userAgent
 */
export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  return 'Other';
}

/**
 * Detects OS from userAgent
 */
export function getOSName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

/**
 * Sends page view telemetry to backend tracking endpoint
 */
export async function trackPageView(path?: string, title?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname;
  const pageTitle = title || document.title;
  const referrer = document.referrer || 'Direct';

  const payload = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    path: currentPath,
    title: pageTitle,
    referrer,
    device_type: getDeviceType(),
    browser: getBrowserName(),
    os: getOSName(),
    user_agent: navigator.userAgent,
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ignore tracking errors in client
  }
}

/**
 * Sends custom interaction event telemetry to backend tracking endpoint
 */
export async function trackEvent(
  eventName: string,
  eventCategory: string = 'click',
  eventLabel?: string,
  metadata?: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;

  const payload = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    event_category: eventCategory,
    event_name: eventName,
    event_label: eventLabel || '',
    path: window.location.pathname,
    metadata: metadata || {},
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/event', blob);
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ignore event tracking errors in client
  }
}
