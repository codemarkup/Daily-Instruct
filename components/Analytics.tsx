'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialLoad = useRef(false);

  useEffect(() => {
    // Exclude admin routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/hq')) {
      return;
    }

    const trackPageview = (isInitialLoad: boolean) => {
      const payload = JSON.stringify({
        path: pathname || '/',
        isInitialLoad
      });

      const url = '/api/track';

      // Send beacon if available, else fallback to fetch keepalive
      if (navigator.sendBeacon) {
        // Create Blob to send application/json via sendBeacon
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: 'POST',
          body: payload,
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(console.error);
      }
    };

    // Only track if we have a path
    if (pathname) {
      if (!hasTrackedInitialLoad.current) {
        // Initial load
        hasTrackedInitialLoad.current = true;
        trackPageview(true);
      } else {
        // Soft navigation route change
        trackPageview(false);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
