"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../../../styles/admin/components.css";
import "../../../../styles/admin/tables.css";

interface Draft {
  id: string;
  draft_id: string;
  article_data: any;
  updated_at: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/hq/drafts");
      const data = await res.json();
      setDrafts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (draft: Draft) => {
    // Load into local storage so new page picks it up instantly
    localStorage.setItem("dailyinstruct_draft", JSON.stringify(draft.article_data));
    router.push("/hq/articles/new?draft=true");
  };

  const handleDelete = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    
    try {
      setDrafts(drafts.filter((d) => d.draft_id !== draftId));
      await fetch(`/api/hq/drafts?id=${draftId}`, { method: "DELETE" });
      
      const localDraftStr = localStorage.getItem("dailyinstruct_draft");
      if (localDraftStr) {
        const localDraft = JSON.parse(localDraftStr);
        if (localDraft.slug === draftId || localDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === draftId) {
          localStorage.removeItem("dailyinstruct_draft");
        }
      }
    } catch (err) {
      console.error(err);
      fetchDrafts(); // re-fetch if failed
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            Saved Drafts
            <span className="page-subtitle">Pick up where you left off</span>
          </h1>
          <p className="page-description">
            Your securely synced drafts. Auto-saved locally and backed up to Supabase.
          </p>
        </div>
      </div>

      <div className="article-table-container" style={{ marginTop: '24px' }}>
        <div className="table-wrapper">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading drafts...</div>
          ) : drafts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">No drafts found</h3>
              <p className="empty-description" style={{ maxWidth: '600px', margin: '16px auto' }}>
                Make sure you have created the `drafts` table in your Supabase SQL editor:
                <br /><br />
                <code style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', display: 'block', textAlign: 'left', color: 'var(--premium-gold)', fontSize: '13px', lineHeight: '1.5' }}>
                  CREATE TABLE drafts (<br />
                  &nbsp;&nbsp;id UUID DEFAULT gen_random_uuid() PRIMARY KEY,<br />
                  &nbsp;&nbsp;draft_id TEXT UNIQUE NOT NULL,<br />
                  &nbsp;&nbsp;article_data JSONB NOT NULL,<br />
                  &nbsp;&nbsp;updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()<br />
                  );
                </code>
              </p>
            </div>
          ) : (
            <>
              <div className="table-header" style={{ gridTemplateColumns: '400px 180px 200px 220px', minWidth: '1000px' }}>
                <div className="header-cell title-cell" style={{ paddingLeft: '24px' }}>Draft Title</div>
                <div className="header-cell category-cell">Category</div>
                <div className="header-cell" style={{ justifyContent: 'center' }}>Last Saved</div>
                <div className="header-cell actions-cell">Actions</div>
              </div>
              <div className="table-body" style={{ minWidth: '1000px' }}>
                {drafts.map((draft) => (
                  <div key={draft.id} className="table-row" style={{ gridTemplateColumns: '400px 180px 200px 220px', minWidth: '1000px' }}>
                    <div className="table-cell title-cell" style={{ paddingLeft: '24px' }}>
                      <div className="cell-content">
                        <h4 className="article-title">{draft.article_data.title || "Untitled Draft"}</h4>
                        <p className="article-slug" style={{ maxWidth: '350px' }}>/{draft.draft_id}</p>
                      </div>
                    </div>
                    
                    <div className="table-cell category-cell">
                      <span className={`category-tag ${
                          (draft.article_data.category || '').toLowerCase() === "market"
                            ? "markets"
                            : (draft.article_data.category || '').toLowerCase() || "tech"
                        }`}>
                        {draft.article_data.category || "None"}
                      </span>
                    </div>

                    <div className="table-cell" style={{ justifyContent: 'center' }}>
                      <span className="cell-text" style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        {new Date(draft.updated_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(draft)}
                          className="action-button edit"
                          title="Resume Editing"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(draft.draft_id)}
                          className="action-button delete"
                          title="Delete Draft"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
