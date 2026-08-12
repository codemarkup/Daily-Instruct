"use client";
import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import '@/styles/admin/components.css'; // Use global admin styles instead

export default function SEOAuditPage() {
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [titleResults, setTitleResults] = useState<any[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<any>(null);

  const [slugsLoading, setSlugsLoading] = useState(false);
  const [slugResults, setSlugResults] = useState<any[]>([]);
  const [slugSuggestions, setSlugSuggestions] = useState<any>(null);

  const handleAuditTitles = async () => {
    setTitlesLoading(true);
    try {
      const res = await fetch('/api/hq/seo/get-long-titles');
      const data = await res.json();
      setTitleResults(data.flagged || []);
      
      if (data.flagged?.length > 0) {
        const titlesToFix = data.flagged.slice(0, 5).map((a: any) => a.currentTitle);
        const groqRes = await fetch('/api/hq/seo/suggest-titles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titles: titlesToFix })
        });
        const groqData = await groqRes.json();
        setTitleSuggestions(groqData.results || []);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to audit titles");
    }
    setTitlesLoading(false);
  };

  const handleAuditSlugs = async () => {
    setSlugsLoading(true);
    try {
      const res = await fetch('/api/hq/seo/get-bad-slugs');
      const data = await res.json();
      setSlugResults(data.flagged || []);
      
      if (data.flagged?.length > 0) {
        const slugsToFix = data.flagged.slice(0, 5).map((a: any) => ({
          currentTitle: a.currentTitle,
          currentSlug: a.currentSlug
        }));
        const groqRes = await fetch('/api/hq/seo/suggest-slugs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articles: slugsToFix })
        });
        const groqData = await groqRes.json();
        setSlugSuggestions(groqData.results || []);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to audit slugs");
    }
    setSlugsLoading(false);
  };

  const handleApplyTitles = async () => {
    try {
      const updates = titleSuggestions.map((t: any) => {
        const originalItem = titleResults.find(r => r.currentTitle === t.original);
        return { id: originalItem?.id, newTitle: t.suggested };
      }).filter((u: any) => u.id);

      const res = await fetch('/api/hq/seo/apply-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (res.ok) {
        alert("Titles updated successfully!");
        setTitleSuggestions(null);
        handleAuditTitles();
      }
    } catch (e) {
      alert("Error applying titles");
    }
  };

  const handleApplySlugs = async () => {
    try {
      const updates = slugSuggestions.map((s: any) => ({
        oldSlug: s.currentSlug,
        newSlug: s.proposedSlug
      }));

      const res = await fetch('/api/hq/seo/apply-slugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (res.ok) {
        alert("Slugs updated and 308 redirects created!");
        setSlugSuggestions(null);
        handleAuditSlugs();
      }
    } catch (e) {
      alert("Error applying slugs");
    }
  };

  return (
    <div className="dashboard-container">
      <AdminHeader />
      <div className="dashboard-content">
        
        {/* TITLE LENGTH AUDIT */}
        <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header">
            <h3 className="section-title">Title Length Auditor</h3>
            <button 
              className="btn-primary" 
              onClick={handleAuditTitles}
              disabled={titlesLoading}
            >
              {titlesLoading ? 'Auditing...' : 'Run Title Audit'}
            </button>
          </div>
          
          <div>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
              Scans all existing articles for titles over 60 characters and uses AI to suggest shorter, punchy replacements.
            </p>

            {titleSuggestions && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1rem' }}>Review Proposed Changes (Sample Batch)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {titleSuggestions.map((item: any, i: number) => (
                    <label key={i} style={{ display: 'flex', gap: '12px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <input type="checkbox" defaultChecked />
                      <div style={{ width: '100%' }}>
                        <div style={{ fontSize: '0.85rem', color: '#ef4444', textDecoration: 'line-through', marginBottom: '4px' }}>
                          {item.original} ({item.original.length} chars)
                        </div>
                        <div style={{ fontSize: '1rem', color: '#059669', fontWeight: 600 }}>
                          {item.suggested} ({item.suggested.length} chars)
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button className="btn-secondary" onClick={() => setTitleSuggestions(null)}>Cancel</button>
                  <button className="btn-primary" onClick={handleApplyTitles}>
                    Approve & Apply Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SLUG REDIRECT TOOL */}
        <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
          <div className="section-header">
            <h3 className="section-title">Slug Redirect Tool</h3>
            <button 
              className="btn-primary" 
              onClick={handleAuditSlugs}
              disabled={slugsLoading}
            >
              {slugsLoading ? 'Generating Redirects...' : 'Run Slug Audit'}
            </button>
          </div>
          
          <div>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
              Scans all existing articles for unoptimized slugs (too long, contains stop words) and uses AI to generate an old-slug → proposed-new-slug map.
            </p>

            {slugSuggestions && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1rem' }}>Review Proposed Redirect Map (Sample Batch)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {slugSuggestions.map((item: any, i: number) => (
                    <label key={i} style={{ display: 'flex', gap: '12px', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <input type="checkbox" defaultChecked />
                      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, fontSize: '0.9rem', color: '#ef4444', fontFamily: 'monospace', padding: '8px', background: '#fef2f2', borderRadius: '4px' }}>
                          /{item.currentSlug}
                        </div>
                        <div style={{ color: '#94a3b8' }}>→</div>
                        <div style={{ flex: 1, fontSize: '0.9rem', color: '#059669', fontFamily: 'monospace', padding: '8px', background: '#ecfdf5', borderRadius: '4px' }}>
                          /{item.proposedSlug}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button className="btn-secondary" onClick={() => setSlugSuggestions(null)}>Cancel</button>
                  <button className="btn-primary" onClick={handleApplySlugs}>
                    Approve & Generate 301 Redirects
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
