'use client';

import React, { useState, useEffect } from 'react';
import { getAnalyticsData, getLiveSessionsCount } from './actions';
import '../../../styles/admin/components.css';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const [data, setData] = useState<any>(null);
  const [liveCount, setLiveCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Load analytics data when range changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await getAnalyticsData(range);
      setData(result);
      setLoading(false);
    };
    loadData();
  }, [range]);

  // Poll live sessions every 15 seconds
  useEffect(() => {
    const fetchLive = async () => {
      const count = await getLiveSessionsCount();
      setLiveCount(count);
    };
    fetchLive(); // Initial fetch
    
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="articles-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Find max views for the chart scale
  const maxViews = data?.chartData?.reduce((max: number, day: any) => Math.max(max, day.views), 0) || 1;

  return (
    <div className="articles-container">
      {/* Page Header */}
      <div className="page-header animate-slide-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="header-content">
          <h1 className="page-title">
            Traffic Analytics
            <span className="page-subtitle">First-Party Privacy-Safe Tracking</span>
          </h1>
          <p className="page-description">
            Monitor site views, live readers, and content performance.
          </p>
        </div>
        <div className="header-actions">
          <select 
            className="bulk-select" 
            value={range} 
            onChange={(e) => setRange(Number(e.target.value) as 7 | 30 | 90)}
            style={{ minWidth: '140px', padding: '8px 12px' }}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ color: 'var(--premium-gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>
            🔴 Reading Now
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-light)' }}>
            {liveCount}
          </div>
        </div>
        
        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>
            Today's Views
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-light)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            {data.todayViews.toLocaleString()}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>
              {data.todayUniques.toLocaleString()} unique
            </span>
          </div>
        </div>

        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>
            Total Views ({range}d)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-light)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            {data.totalViews.toLocaleString()}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>
              {data.totalUniques.toLocaleString()} unique
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Chart (Native HTML/CSS for speed & no deps) */}
      <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '24px' }}>Traffic Over Time</h3>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', position: 'relative' }}>
          {data.chartData.map((day: any, i: number) => {
            const heightPercent = (day.views / maxViews) * 100;
            return (
              <div key={i} className="group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  background: 'var(--premium-gold)', 
                  height: `${heightPercent}%`, 
                  minHeight: day.views > 0 ? '4px' : '0px',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                  transition: 'height 0.3s ease'
                }} title={`${day.date}: ${day.views} views`} />
                {range <= 30 && (i % (range === 30 ? 3 : 1) === 0) && (
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                    {day.date.slice(5)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {/* Top Content Table */}
        <div style={{ gridColumn: '1 / -1', background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '24px' }}>Top Content</h3>
          <div className="table-wrapper">
            <div className="table-header" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr' }}>
              <div className="header-cell">Article</div>
              <div className="header-cell">Category</div>
              <div className="header-cell" style={{ textAlign: 'right' }}>Views</div>
              <div className="header-cell" style={{ textAlign: 'right' }}>Uniques</div>
            </div>
            <div className="table-body">
              {data.topContent.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No data yet</div>}
              {data.topContent.map((row: any, i: number) => (
                <div key={i} className="table-row" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr', padding: '12px 16px' }}>
                  <div className="table-cell" style={{ minWidth: 0 }}>
                    <h4 className="article-title" style={{ fontSize: '14px', marginBottom: '4px' }}>{row.title}</h4>
                    <p className="article-slug" style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.path}</p>
                  </div>
                  <div className="table-cell">
                    <span className={`category-tag ${row.category.toLowerCase()}`}>{row.category}</span>
                  </div>
                  <div className="table-cell" style={{ textAlign: 'right', color: 'var(--text-light)', fontWeight: 500 }}>
                    {row.views.toLocaleString()}
                  </div>
                  <div className="table-cell" style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    {row.uniques.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Referrers */}
        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '24px' }}>Top Referrers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.topReferrers.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No data yet</div>}
            {data.topReferrers.map((ref: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>{ref.domain}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{ref.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Geography */}
        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '24px' }}>Top Countries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.topCountries.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No data yet</div>}
            {data.topCountries.map((geo: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>{geo.country}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{geo.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Devices */}
        <div style={{ background: 'rgba(26, 26, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '24px' }}>Devices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.devices.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No data yet</div>}
            {data.devices.map((dev: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-light)', fontSize: '14px', textTransform: 'capitalize' }}>{dev.device}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{dev.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
