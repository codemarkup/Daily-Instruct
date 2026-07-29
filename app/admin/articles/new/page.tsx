"use client";

import { useEffect } from "react";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { AdminService } from "@/services/admin-service";
import "../../../../styles/admin/components.css";

const AddArticlePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraftRecovery = searchParams.get("draft") === "true";

  const [article, setArticle] = useState({
    title: "",
    slug: "",
    description: "",
    author: "Admin",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: "5 min read",
    image: "/images/default.png",
    category: "tech",
    specific: "",
    trending: false,
    featured: false,
    topStory: false,
    grid: false,
    homeFeatured: false,
    homeLatest: false,
    homeTrending: false,
    homeTopStory: false,
    trackers: [],
    content: [{ type: "paragraph" as const, text: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // Inline Message States
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");

  const showTempMessage = (setter: React.Dispatch<React.SetStateAction<string>>, msg: string) => {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  };

  useEffect(() => {
    // Auth is now handled by middleware.ts
  }, [router]);

  // Load draft from localStorage on mount ONLY if explicitly requested
  useEffect(() => {
    if (isDraftRecovery) {
      const savedDraft = localStorage.getItem('dailyinstruct_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setArticle(parsed);
          showTempMessage(setDraftMessage, "Previous draft recovered from local storage");
        } catch (e) {
          console.error("Failed to parse local draft", e);
        }
      }
    } else {
      // Starting a fresh article - clear any lingering drafts
      localStorage.removeItem('dailyinstruct_draft');
    }
  }, [isDraftRecovery]);

  // Auto-save to localStorage when article changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if it has some content
      if (article.title || (article.content && article.content[0].text)) {
        localStorage.setItem('dailyinstruct_draft', JSON.stringify(article));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (
        !article.title ||
        !article.slug ||
        !article.description ||
        !article.category||
        !article.specific
      ) {
        showTempMessage(setPublishError, "Please fill in all required fields (marked with *)");
        setShowSaveModal(false);
        return;
      }

      // Create article - using correct type
      await AdminService.createArticle({
        ...article,
        category: article.category,
      });

      // Revalidate paths
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'saad@saad4242', // Ideally from an env var in admin component or passed securely
          paths: [
            '/',
            `/${article.category.toLowerCase()}`,
            `/articles/${article.slug}`
          ]
        })
      });

      // Clear draft locally and in DB
      localStorage.removeItem('dailyinstruct_draft');
      if (article.slug) {
        await fetch(`/api/hq/drafts?id=${article.slug}`, { method: 'DELETE' });
      }

      setShowSaveModal(false);
      showTempMessage(setPublishSuccess, "Article created successfully!");
      setTimeout(() => router.push("/hq/articles"), 1000);
    } catch (error: any) {
      console.error("Error creating article:", error);
      showTempMessage(setPublishError, `Failed to create article: ${error.message}`);
      setShowSaveModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedArticle: any) => {
    console.log("Parent received update:", updatedArticle);
    setArticle((prev) => {
      const newState = { ...prev, ...updatedArticle };
      console.log("New article state:", newState);
      return newState;
    });
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      if (!article.slug && !article.title) {
        showTempMessage(setDraftMessage, "Please enter a title or slug to save draft");
        return;
      }
      
      const draftId = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const res = await fetch('/api/hq/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: draftId,
          article_data: article
        })
      });

      if (!res.ok) throw new Error('Failed to save to database');
      
      // Also save locally
      localStorage.setItem('dailyinstruct_draft', JSON.stringify(article));
      
      showTempMessage(setDraftMessage, "Draft securely saved to database!");
    } catch (err: any) {
      console.error(err);
      showTempMessage(setDraftMessage, "Failed to sync draft to DB. Saved locally.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    showTempMessage(setPreviewMessage, "Preview will be available after saving");
  };

  const titleLength = article.title?.length || 0;
  const descriptionLength = article.description?.length || 0;
  const contentBlocks = article.content?.length || 0;

  return (
    <>
      <div className="add-article-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              Create New Article
              <span className="page-subtitle">Fill in all required fields</span>
            </h1>
            <p className="page-description">
              Craft your next masterpiece. All fields marked with * are required.
            </p>
          </div>
          <div className="header-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveDraft}
                className="secondary-button"
                disabled={loading}
              >
                <span className="button-icon">💾</span>
                Save Draft
              </button>
              <button
                onClick={handlePreview}
                className="secondary-button"
                disabled={loading}
              >
                <span className="button-icon">👁️</span>
                Preview
              </button>
            </div>
            {draftMessage && <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500 }}>{draftMessage}</span>}
            {previewMessage && <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500 }}>{previewMessage}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-layout">
            <div className="form-main">
              <div className="form-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📋</span>
                    Basic Information
                  </h3>
                  <span className="card-badge required">Required</span>
                </div>
                <div className="card-body">
                  <ArticleForm
                    key={article.category} // Force re-render when category changes
                    article={article}
                    onUpdate={handleUpdate}
                    isEditing={false}
                  />
                </div>
              </div>
            </div>

            <div className="form-sidebar">
              <div className="sidebar-card sticky">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">🚀</span>
                    Publish
                  </h3>
                </div>
                <div className="card-body">
                  <div className="publish-controls">
                    <div className="glossy-action-group">
                      <button
                        type="submit"
                        className="glossy-publish-btn"
                        disabled={loading}
                      >
                        <span className="btn-glow"></span>
                        <span className="btn-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </span>
                        <span className="btn-text">{loading ? "Publishing..." : "Publish Article"}</span>
                      </button>
                      <button
                        type="button"
                        className="glossy-secondary-btn"
                        onClick={handlePreview}
                        disabled={loading}
                      >
                        <span className="btn-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span className="btn-text">Live Preview</span>
                      </button>
                      <button
                        type="button"
                        className="glossy-tertiary-btn"
                        onClick={handleSaveDraft}
                        disabled={loading}
                      >
                        <span className="btn-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        </span>
                        <span className="btn-text">Save Draft</span>
                      </button>
                    </div>
                    {publishError && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>{publishError}</div>}
                    {publishSuccess && <div style={{ color: '#10B981', fontSize: '13px', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>{publishSuccess}</div>}
                    {draftMessage && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>{draftMessage}</div>}
                    {previewMessage && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>{previewMessage}</div>}
                    <div className="form-hint">
                      <p className="hint-text">
                        ⓘ Article will be saved to JSON file in the selected category.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📊</span>
                    Quick Stats
                  </h3>
                </div>
                <div className="card-body">
                  <div className="stats-grid small">
                    <div className="stat-item">
                      <span className="stat-value">{titleLength}</span>
                      <span className="stat-label">Title Length</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{descriptionLength}</span>
                      <span className="stat-label">Desc Length</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{contentBlocks}</span>
                      <span className="stat-label">Content Blocks</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{article.category}</span>
                      <span className="stat-label">Category</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Publish Article"
        message="Are you sure you want to publish this article? It will be saved to the JSON file."
        confirmText="Publish"
        confirmColor="gold"
        icon="🚀"
        loading={loading}
      />
    </>
  );
};

export default function Page() {
  return (
    <React.Suspense fallback={<div style={{ padding: '20px' }}>Loading editor...</div>}>
      <AddArticlePage />
    </React.Suspense>
  );
}
