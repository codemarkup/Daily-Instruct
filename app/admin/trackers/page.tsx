"use client";

import React, { useState, useEffect } from "react";
import { AdminService, Tracker } from "@/services/admin-service";
import Link from "next/link";
import "../../../styles/admin/components.css";

export default function TrackersAdminPage() {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getAllTrackers().then(data => {
      setTrackers(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this tracker? All its updates will be lost.")) {
      try {
        await AdminService.deleteTracker(slug);
        setTrackers(trackers.filter(t => t.slug !== slug));
      } catch (e) {
        alert("Failed to delete tracker.");
      }
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Situation Trackers</h1>
          <p className="page-description">Manage ongoing event trackers and explainer hubs.</p>
        </div>
        <Link href="/hq/trackers/new" style={{ padding: '10px 20px', background: 'var(--premium-gold)', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          + Create Tracker
        </Link>
      </div>

      <div className="article-table-container tracker-table" style={{ marginTop: '24px' }}>
        <div className="table-wrapper">
          <div className="table-header" style={{ gridTemplateColumns: 'minmax(300px, 2fr) 150px 150px 200px' }}>
            <div className="header-cell" style={{ paddingLeft: '24px', justifyContent: 'flex-start' }}>Tracker</div>
            <div className="header-cell" style={{ justifyContent: 'flex-start' }}>Category</div>
            <div className="header-cell" style={{ justifyContent: 'flex-start' }}>Status</div>
            <div className="header-cell" style={{ justifyContent: 'flex-start' }}>Actions</div>
          </div>
          <div className="table-body">
            {trackers.map(tracker => (
              <div key={tracker.id} className="table-row" style={{ gridTemplateColumns: 'minmax(300px, 2fr) 150px 150px 200px' }}>
                <div className="table-cell" style={{ paddingLeft: '24px', justifyContent: 'flex-start' }}>
                  <div className="cell-content">
                    <h4 className="article-title">{tracker.title}</h4>
                    <p className="article-slug">/{tracker.slug}</p>
                  </div>
                </div>
                <div className="table-cell" style={{ justifyContent: 'flex-start' }}>
                  <span className="category-tag">{tracker.category}</span>
                </div>
                <div className="table-cell" style={{ justifyContent: 'flex-start' }}>
                  <span className={`status-badge ${tracker.status === 'active' ? 'published' : 'draft'}`}>
                    {tracker.status}
                  </span>
                </div>
                <div className="table-cell" style={{ justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link 
                      href={`/hq/trackers/new?edit=${tracker.id}`} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        background: 'transparent', 
                        border: '1px solid var(--gray-600)', 
                        color: 'var(--text-light)', 
                        borderRadius: '6px', 
                        textDecoration: 'none', 
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--premium-gold)';
                        e.currentTarget.style.color = 'var(--premium-gold)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gray-600)';
                        e.currentTarget.style.color = 'var(--text-light)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(tracker.slug)} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        background: 'transparent', 
                        border: '1px solid var(--gray-600)', 
                        color: 'var(--text-light)', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ef4444';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gray-600)';
                        e.currentTarget.style.color = 'var(--text-light)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {trackers.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No trackers created yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .tracker-table .table-cell, 
        .tracker-table .header-cell {
          border-right: none !important;
          border-left: none !important;
        }
      `}} />
    </div>
  );
}
