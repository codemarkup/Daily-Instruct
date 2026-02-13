'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/services/admin-service';
import '../../../styles/admin/components.css'; // Reuse admin styles
import '../../../styles/admin/analytics.css'; // New analytics styles

// Interface for detailed event content
interface AnalyticsEvent {
    id: string;
    timestamp: string;
    slug: string;
    visitorId: string;
    ip: string;
    country: string;
    referrer?: string;
}

const AnalyticsPage = () => {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check auth
        if (!document.cookie.includes('admin-auth=true')) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const stats = await AdminService.getAnalyticsStats();
                setData(stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll for live updates every 30s (safe for Vercel free tier)
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);

    }, [router]);

    if (loading) {
        return (
            <div className="loading-container-analytics" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
                <div className="loading-text-gold">Loading Analytics...</div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="page-header-flex animate-slide-in">
                    <div>
                        <button
                            onClick={() => router.push('/admin')}
                            className="back-link"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="page-title-large">
                            Traffic <span className="text-gold">Analytics</span>
                        </h1>
                        <p className="page-description">Detailed breakdown of content performance</p>
                    </div>
                    <div className="total-stat-box">
                        <div className="total-label">Total Views</div>
                        <div className="total-value-large">{data?.totalViews.toLocaleString()}</div>
                    </div>
                </div>

                {/* Live Traffic Log (NEW) */}
                <div className="content-section animate-slide-in delay-100 mb-8">
                    <h3 className="section-title-large">
                        <span className="text-gold">●</span> Live Traffic Log
                        <span className="live-badge" style={{ marginLeft: '10px' }}>Real-Time</span>
                    </h3>

                    <div className="analytics-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="analytics-table">
                            <thead style={{ position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 10 }}>
                                <tr>
                                    <th>Time</th>
                                    <th>Visitor</th>
                                    <th>Page</th>
                                    <th>Location</th>
                                    <th style={{ textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.events?.map((event: AnalyticsEvent) => (
                                    <tr key={event.id}>
                                        <td style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '12px' }}>
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td>
                                            <div style={{ color: '#fff', fontSize: '13px' }}>
                                                Guest-{event.visitorId.slice(0, 6)}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                                {event.ip}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="page-slug" style={{ fontSize: '13px' }}>
                                                {event.slug}
                                            </div>
                                            {event.referrer && (
                                                <div style={{ fontSize: '10px', color: '#6b7280', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Ref: {event.referrer}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '14px', marginRight: '6px' }}>
                                                {event.country === 'Localhost' ? '💻' : '🌍'}
                                            </span>
                                            <span style={{ fontSize: '13px', color: '#d1d5db' }}>
                                                {event.country}
                                            </span>
                                        </td>
                                        <td className="status-cell">
                                            <span className="status-badge">Viewed</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!data?.events || data.events.length === 0) && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                            Waiting for live traffic...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Pages Table (Existing) */}
                <div className="content-section animate-slide-in delay-200">
                    <h3 className="section-title-large">
                        <span className="text-gold">★</span> Top Performing Content
                    </h3>

                    <div className="analytics-table-wrapper">
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Page / Article Title</th>
                                    <th style={{ textAlign: 'right' }}>Views</th>
                                    <th style={{ textAlign: 'right' }}>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.topPages.map((page: any, index: number) => (
                                    <tr key={page.slug}>
                                        <td className="rank-cell">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td>
                                            <div className="page-slug">
                                                {page.slug === '_total' ? 'All Pages' : page.slug}
                                            </div>
                                            <div className="page-path">
                                                /article/{page.slug}
                                            </div>
                                        </td>
                                        <td className="views-cell">
                                            {page.views.toLocaleString()}
                                        </td>
                                        <td className="status-cell">
                                            <div className="status-badge">
                                                Active
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
