"use client";

import { useEffect } from "react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import { AdminService } from "@/services/admin-service";
import "../../../../styles/admin/components.css";

const AddArticlePage = () => {
  const router = useRouter();

  useEffect(() => {
    const hasCookie = document.cookie.includes('admin-auth=true');
    if (!hasCookie) {
      router.push('/login');
    }
  }, [router]);




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
    content: [{ type: "paragraph" as const, text: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

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
        !article.category ||
        !article.specific
      ) {
        alert("Please fill in all required fields");
        setShowSaveModal(false);
        return;
      }

      // Create article - using correct type
      await AdminService.createArticle({
        ...article,
        category: article.category,
      });

      setShowSaveModal(false);
      alert("Article created successfully!");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error("Error creating article:", error);
      alert(`Failed to create article: ${error.message}`);
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

  const handleSaveDraft = () => {
    alert("Draft functionality coming soon!");
  };

  const handlePreview = () => {
    // 1. Validate basic fields
    if (!article.title) {
      alert("Please enter at least a title to preview.");
      return;
    }

    // 2. Save current state to localStorage
    try {
      localStorage.setItem("admin_preview_draft", JSON.stringify(article));

      // 3. Open preview window
      window.open("/admin/preview", "_blank");
    } catch (error) {
      console.error("Failed to save preview data:", error);
      alert("Failed to launch preview. Please try again.");
    }
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
          <div className="header-actions">
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
              className="preview-button-main"
              disabled={loading}
              title="Preview article in new tab"
            >
              <span className="button-icon">👁️</span>
              Preview
            </button>
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
                    <div className="button-group">
                      <button
                        type="submit"
                        className="primary-button gold publish"
                        disabled={loading}
                      >
                        <span className="button-icon">🚀</span>
                        {loading ? "Creating..." : "Publish Article"}
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleSaveDraft}
                        disabled={loading}
                      >
                        Save as Draft
                      </button>
                      <button
                        type="button"
                        className="tertiary-button"
                        onClick={handlePreview}
                        disabled={loading}
                      >
                        Preview
                      </button>
                    </div>
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

export default AddArticlePage;