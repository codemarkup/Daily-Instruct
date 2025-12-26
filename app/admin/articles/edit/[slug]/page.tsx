"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { AdminService, Article } from "@/services/admin-service";
import "../../../../../styles/admin/components.css";

const EditArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;


  useEffect(() => {
      const hasCookie = document.cookie.includes('admin-auth=true');
      if (!hasCookie) {
        router.push('/login');
      }
    }, [router]);

  const [article, setArticle] = useState<
    Partial<Article> & { category: string }
  >({
    title: "",
    slug: "",
    description: "",
    author: "",
    date: "",
    readTime: "",
    image: "",
    category: "",
    specific: "",
    trending: false,
    featured: false,
    topStory: false,
    grid: false,
    homeFeatured: false,
    homeLatest: false,
    homeTrending: false,
    homeTopStory: false,
    content: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalArticle, setOriginalArticle] =
    useState<Partial<Article> | null>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const fetchedArticle = await AdminService.getArticleBySlug(slug);
      const category = fetchedArticle?.category || "";

      setArticle({
        ...fetchedArticle,
        category,
      });
      setOriginalArticle(fetchedArticle);
    } catch (error) {
      console.error("Error loading article:", error);
      alert("Article not found!");
      router.push("/admin/articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update article
      await AdminService.updateArticle(slug, article);

      setShowSaveModal(false);
      setHasChanges(false);
      alert("Article updated successfully!");

      // Refresh the data
      loadArticle();
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Failed to update article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await AdminService.deleteArticle(slug);
      setShowDeleteModal(false);
      alert("Article deleted successfully!");
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  const handleUpdate = (updatedArticle: Partial<Article>) => {
    const newArticle = { ...article, ...updatedArticle };
    setArticle(newArticle);

    // Check if there are changes
    if (originalArticle) {
      const hasChanges =
        JSON.stringify(newArticle) !==
        JSON.stringify({ ...originalArticle, category: article.category });
      setHasChanges(hasChanges);
    }
  };

  const handlePreview = () => {
    window.open(`/articles/${slug}`, "_blank");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="gold-spinner"></div>
        <p className="loading-text">Loading article data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="edit-article-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-top">
              <button
                onClick={() => router.back()}
                className="back-button"
                title="Go back"
              >
                ← Back
              </button>
              <span className="header-badge editing">EDITING</span>
            </div>
            <h1 className="page-title">
              Edit Article
              <span className="page-subtitle">{article.title}</span>
            </h1>
            <p className="page-description">
              Editing: <span className="article-slug">/{article.slug}</span>
              {hasChanges && (
                <span className="unsaved-changes"> • Unsaved changes</span>
              )}
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="danger-button"
              disabled={saving}
            >
              <span className="button-icon">🗑️</span>
              Delete
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="primary-button gold"
              disabled={!hasChanges || saving}
            >
              <span className="button-icon">💾</span>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-layout">
            {/* Left Column - Main Form */}
            <div className="form-main">
              {/* Basic Information Card */}
              <div className="form-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📋</span>
                    Article Information
                  </h3>
                  <div className="card-stats">
                    <span className="stat-item">
                      <span className="stat-label">ID:</span>
                      <span className="stat-value">#{article.id}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-label">Category:</span>
                      <span className="stat-value">{article.category}</span>
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <ArticleForm
                    article={article}
                    onUpdate={handleUpdate}
                    isEditing={true}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="form-sidebar">
              {/* Article Stats Card */}
              <div className="sidebar-card sticky">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">📊</span>
                    Article Stats
                  </h3>
                </div>
                <div className="card-body">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-icon">📝</span>
                      <span className="stat-value">
                        {article.content?.filter(
                          (b: any) => b.type === "paragraph"
                        ).length || 0}
                      </span>
                      <span className="stat-label">Paragraphs</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">#</span>
                      <span className="stat-value">
                        {article.content?.filter(
                          (b: any) => b.type === "heading"
                        ).length || 0}
                      </span>
                      <span className="stat-label">Headings</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">
                        {article.content?.filter((b: any) => b.type === "quote")
                          .length || 0}
                      </span>
                      <span className="stat-label">Quotes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">📏</span>
                      <span className="stat-value">{article.readTime}</span>
                      <span className="stat-label">Read Time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="sidebar-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-icon">👁️</span>
                    Preview
                  </h3>
                </div>
                <div className="card-body">
                  <div className="preview-actions">
                    <button onClick={handlePreview} className="preview-button">
                      🔗 Live Preview
                    </button>
                    <div className="preview-info">
                      <p className="info-text">
                        Last saved:{" "}
                        <span className="info-value">
                          {originalArticle ? "Recently" : "Never"}
                        </span>
                      </p>
                      <p className="info-text">
                        Created:{" "}
                        <span className="info-value">{article.date}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        confirmColor="danger"
        icon="🗑️"
        loading={saving}
      />

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Changes"
        message="Save all changes to this article?"
        confirmText="Save"
        confirmColor="gold"
        icon="💾"
        loading={saving}
      />
    </>
  );
};

export default EditArticlePage;
