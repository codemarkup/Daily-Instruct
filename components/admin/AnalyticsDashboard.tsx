'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/services/admin-service';
import '../../styles/admin/analytics.css';

interface AnalyticsData {
    totalViews: number;
    viewsToday: number;
    history: { date: string; views: number }[];
    topPages: { slug: string; views: number }[];
}

const AnalyticsDashboard: React.FC = () => {
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const stats = await AdminService.getAnalyticsStats();
            setData(stats);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 30 seconds for "live" updates (safe for Vercel free tier)
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="loading-container-analytics">
                <div className="loading-text-gold">Loading Analytics...</div>
            </div>
        );
    }

    if (!data) return null;

    const maxViews = Math.max(...data.history.map(d => d.views), 1);

    return (
        <div className="analytics-dashboard">
            {/* "Luxury" Glow Effect */}
            <div className="analytics-glow" />

            <div className="analytics-header">
                <div>
                    <h2 className="analytics-title">
                        Real-Time Analytics
                        <span className="live-badge">Live</span>
                    </h2>
                    <p className="analytics-subtitle">Traffic overview and user engagement</p>
                </div>
                <button
                    onClick={() => router.push('/admin/analytics')}
                    className="analytics-report-btn"
                >
                    Detailed Report <span>→</span>
                </button>
            </div>

            <div className="analytics-grid">
                {/* Stat Card 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="analytics-card"
                >
                    <div className="card-label">Total Views</div>
                    <div className="card-value value-white">{data.totalViews.toLocaleString()}</div>
                    <div className="card-footer text-green">
                        <span className="dot dot-green" />
                        All time
                    </div>
                </motion.div>

                {/* Stat Card 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="analytics-card"
                >
                    <div className="card-label">Views Today</div>
                    <div className="card-value value-gold">{data.viewsToday.toLocaleString()}</div>
                    <div className="card-footer text-blue">
                        <span className="dot dot-blue" />
                        Active Now
                    </div>
                </motion.div>

                {/* Mini Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="analytics-card"
                    style={{ justifyContent: 'flex-end', paddingBottom: '0' }}
                >
                    <div className="analytics-chart-container">
                        {data.history.map((day, i) => (
                            <div key={day.date} className="chart-bar-group">
                                <div className="chart-bar-bg">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(day.views / maxViews) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`chart-bar ${i === 6 ? 'bar-active' : 'bar-default'}`}
                                    />
                                    {/* Tooltip */}
                                    <div className="chart-tooltip">
                                        {day.views}
                                    </div>
                                </div>
                                <div className="chart-label">
                                    {i === 6 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
