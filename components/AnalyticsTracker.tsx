'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastTracked = useRef<string | null>(null);

    useEffect(() => {
        let slug = pathname === '/' ? 'home' : pathname.replace(/^\//, '');

        // Remove 'articles/' prefix if present to match article slugs
        if (slug.startsWith('articles/')) {
            slug = slug.replace('articles/', '');
        }

        const trackView = async () => {
            try {
                // Don't track admin pages or API routes
                if (slug.startsWith('admin') || slug.startsWith('api')) return;

                // Get or create persistent Visitor ID
                let visitorId = localStorage.getItem('daily_visitor_id');
                if (!visitorId) {
                    visitorId = crypto.randomUUID();
                    localStorage.setItem('daily_visitor_id', visitorId);
                }

                console.log(`[Tracker] Sending view for: ${slug} (Visitor: ${visitorId.slice(0, 6)}...)`);

                await fetch('/api/log-view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        slug,
                        visitorId,
                        referrer: document.referrer
                    }),
                });
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        trackView();
    }, [pathname, searchParams]);

    return null;
}
