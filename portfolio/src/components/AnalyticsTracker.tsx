'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    // Don't track admin pages to keep visitor analytics clean
    if (pathname?.startsWith('/admin')) return;

    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      // Delay tracking slightly to let page title settle
      const timer = setTimeout(() => {
        trackPageView(pathname, document.title);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
