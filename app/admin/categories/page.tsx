"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../../../styles/admin/components.css";
import { AdminService, Article } from "@/services/admin-service";

interface CategoryStats {
  name: string;
  slug: string;
  articleCount: number;
  featuredCount: number;
  trendingCount: number;
  description: string;
  color: string;
}

const CategoriesPage = () => {
  const router = useRouter();

  useEffect(() => {
    const hasCookie = document.cookie.includes('admin-auth=true');
    if (!hasCookie) {
      router.push('/login');
    }
  }, [router]);


  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryStats[]>([
    {
      name: "Tech",
      slug: "tech",
      articleCount: 0,
      featuredCount: 0,
      trendingCount: 0,
      description: "Technology, AI, Programming, Gadgets",
      color: "#3B82F6",
    },
    {
      name: "Business",
      slug: "business",
      articleCount: 0,
      featuredCount: 0,
      trendingCount: 0,
      description: "Entrepreneurship, Management, Startups",
      color: "#10B981",
    },
    {
      name: "Market",
      slug: "markets",
      articleCount: 0,
      featuredCount: 0,
      trendingCount: 0,
      description: "Investing, Stocks, Crypto, Real Estate",
      color: "#F59E0B",
    },
    {
      name: "Guides",
      slug: "guides",
      articleCount: 0,
      featuredCount: 0,
      trendingCount: 0,
      description: "Tutorials, How-To, Beginners Guides",
      color: "#8B5CF6",
    },
  ]);

  const [totalStats, setTotalStats] = useState({
    totalArticles: 0,
    totalFeatured: 0,
    totalTrending: 0,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
  const [showArticlesModal, setShowArticlesModal] = useState(false);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      const allArticles = await AdminService.getAllArticles();

      // Calculate stats for each category
      const updatedCategories = categories.map((category) => {
        const categoryArticles = allArticles.filter(
          (article) =>
            article.category.toLowerCase() === category.slug.toLowerCase()
        );

        return {
          ...category,
          articleCount: categoryArticles.length,
          featuredCount: categoryArticles.filter((article) => article.featured)
            .length,
          trendingCount: categoryArticles.filter((article) => article.trending)
            .length,
        };
      });

      // Calculate total stats
      const totalArticles = allArticles.length;
      const totalFeatured = allArticles.filter(
        (article) => article.featured
      ).length;
      const totalTrending = allArticles.filter(
        (article) => article.trending
      ).length;

      setCategories(updatedCategories);
      setTotalStats({
        totalArticles,
        totalFeatured,
        totalTrending,
      });
    } catch (error) {
      console.error("Error fetching category stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCategory = async (slug: string, name: string) => {
    try {
      setSelectedCategory(name);
      const allArticles = await AdminService.getAllArticles();
      const filteredArticles = allArticles.filter(
        (article) => article.category.toLowerCase() === slug.toLowerCase()
      );
      setCategoryArticles(filteredArticles);
      setShowArticlesModal(true);
    } catch (error) {
      console.error("Error fetching category articles:", error);
    }
  };

  const handleEditArticle = (slug: string) => {
    router.push(`/admin/articles/edit/${slug}`);
    setShowArticlesModal(false);
  };

  const handleDeleteArticle = async (slug: string, category: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await AdminService.deleteArticle(slug);
        // Refresh stats
        fetchCategoryStats();
        // Refresh articles in modal if open
        if (selectedCategory) {
          const allArticles = await AdminService.getAllArticles();
          const filteredArticles = allArticles.filter(
            (article) =>
              article.category.toLowerCase() === selectedCategory.toLowerCase()
          );
          setCategoryArticles(filteredArticles);
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article. Please try again.");
      }
    }
  };

  const handlePreviewArticle = (slug: string) => {
    window.open(`/articles/${slug}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleRefresh = () => {
    fetchCategoryStats();
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="categories-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              Category Management
              <span className="page-subtitle">
                Total: {categories.length} categories
              </span>
            </h1>
            <p className="page-description">
              Manage your blog categories. Each category controls article
              grouping and navigation.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={handleRefresh}
              title="Refresh data"
            >
              ↻ Refresh
            </button>
            {/* <button className="primary-button gold" disabled>
              <span className="button-icon">+</span>
              New Category
            </button> */}
          </div>
        </div>

        {/* Warning Banner */}
        <div className="warning-banner">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4 className="warning-title">Important Notice</h4>
            <p className="warning-text">
              Changing category names or slugs will break existing URLs. Only
              modify if necessary. Categories are hardcoded in the navigation
              structure.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.slug} className="category-card">
              <div className="category-header">
                <div
                  className="category-color"
                  style={{ backgroundColor: category.color }}
                ></div>
                <h3 className="category-name">{category.name}</h3>
                <span className="category-slug">/{category.slug}</span>
              </div>

              <div className="category-body">
                <p className="category-description">{category.description}</p>

                <div className="category-stats">
                  <div className="stat-item">
                    <span className="stat-label">Articles</span>
                    <span className="stat-value">{category.articleCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Featured</span>
                    <span className="stat-value">{category.featuredCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Trending</span>
                    <span className="stat-value">{category.trendingCount}</span>
                  </div>
                </div>

                <div className="category-actions">
                  <button
                    onClick={() =>
                      handleViewCategory(category.slug, category.name)
                    }
                    className="action-button preview"
                    disabled={category.articleCount === 0}
                  >
                    <Image
                      src="/icons/view.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                      className="icon"
                    />{" "}
                    View ({category.articleCount})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Stats */}
        <div className="category-stats-overview">
          <h3 className="stats-title">Category Overview</h3>
          <div className="stats-grid">
            <div className="overview-stat">
              <span className="overview-value gold-text">
                {totalStats.totalArticles}
              </span>
              <span className="overview-label">Total Articles</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{totalStats.totalFeatured}</span>
              <span className="overview-label">Featured Articles</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{totalStats.totalTrending}</span>
              <span className="overview-label">Trending Articles</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{categories.length}</span>
              <span className="overview-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Modal */}
      {showArticlesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowArticlesModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedCategory} Articles
                <span className="modal-subtitle">
                  {categoryArticles.length} articles
                </span>
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowArticlesModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {categoryArticles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3 className="empty-title">No articles found</h3>
                  <p className="empty-description">
                    There are no articles in this category yet.
                  </p>
                  <button
                    className="empty-action"
                    onClick={() => {
                      setShowArticlesModal(false);
                      router.push("/admin/articles/new");
                    }}
                  >
                    Create New Article
                  </button>
                </div>
              ) : (
                <div className="articles-table-container">
                  <div className="articles-table">
                    <div className="table-header">
                      <div className="header-cell title-cell">Title</div>
                      <div className="header-cell author-cell">Author</div>
                      <div className="header-cell date-cell">Date</div>
                      <div className="header-cell status-cell">Status</div>
                      <div className="header-cell actions-cell">Actions</div>
                    </div>

                    <div className="table-body">
                      {categoryArticles.map((article) => (
                        <div key={article.slug} className="table-row">
                          <div className="table-cell title-cell">
                            <div className="article-title-cell">
                              <h4 className="article-title">{article.title}</h4>
                              <p className="article-slug">/{article.slug}</p>
                            </div>
                          </div>
                          <div className="table-cell author-cell">
                            <span className="cell-text">{article.author}</span>
                          </div>
                          <div className="table-cell date-cell">
                            <span className="cell-text">
                              {formatDate(article.date)}
                            </span>
                          </div>
                          <div className="table-cell status-cell">
                            <span className="status-badge published">
                              Published
                            </span>
                          </div>
                          <div className="table-cell actions-cell">
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEditArticle(article.slug)}
                                className="action-button edit"
                                title="Edit"
                              >
                                <Image
                                  src="/icons/edit.svg"
                                  alt="Edit"
                                  width={18}
                                  height={18}
                                  className="icon"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteArticle(
                                    article.slug,
                                    article.category
                                  )
                                }
                                className="action-button delete"
                                title="Delete"
                              >
                                <Image
                                  src="/icons/delete.svg"
                                  alt="Edit"
                                  width={18}
                                  height={18}
                                  className="icon"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handlePreviewArticle(article.slug)
                                }
                                className="action-button preview"
                                title="Preview"
                              >
                                <Image
                                  src="/icons/view.svg"
                                  alt="Edit"
                                  width={18}
                                  height={18}
                                  className="icon"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowArticlesModal(false)}
              >
                Close
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setShowArticlesModal(false);
                  router.push("/admin/articles/new");
                }}
              >
                + Add to {selectedCategory}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS styles for modal */}
      <style jsx>{`
        /* Add to your admin/components.css or create a new modal.css */

        /* Articles Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #333;
          width: 88%;
          max-width: 1400px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
          overflow: hidden; /* Prevent content overflow */
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #222;
          border-radius: 12px 12px 0 0;
          flex-shrink: 0; /* Prevent header from shrinking */
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-subtitle {
          font-size: 0.875rem;
          color: #888;
          font-weight: 400;
        }

        .modal-close {
          background: #333;
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: #444;
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 0;
          overflow: hidden; /* Changed from auto to hidden for container */
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .modal-footer {
          padding: 20px 32px;
          border-top: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #222;
          border-radius: 0 0 12px 12px;
          flex-shrink: 0;
        }

        /* Articles Table Container */
        .articles-table-container {
          padding: 24px;
          overflow: auto; /* Enable scrolling on container */
          flex: 1;
        }

        .articles-table {
          border: 1px solid #333;
          border-radius: 8px;
          overflow: hidden;
          background: #1a1a1a;
          min-width: 900px; /* Ensure minimum width for table */
          width: 100%;
          table-layout: fixed; /* Fixed table layout for consistent columns */
        }

        /* Table Structure */
        .articles-table .table-header {
          display: grid;
          grid-template-columns: 300px 150px 150px 120px 200px; /* Fixed pixel widths */
          background: #222;
          border-bottom: 1px solid #333;
          width: 100%;
        }

        .articles-table .table-row {
          display: grid;
          grid-template-columns: 300px 150px 150px 120px 200px; /* Same fixed widths as header */
          border-bottom: 1px solid #333;
          transition: background 0.2s;
          width: 100%;
        }

        .articles-table .table-row:last-child {
          border-bottom: none;
        }

        .articles-table .table-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        /* Header Cell Styling */
        .articles-table .header-cell {
          padding: 16px 20px;
          font-weight: 600;
          color: #fff;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-right: 1px solid #333;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .articles-table .header-cell:last-child {
          border-right: none;
        }

        /* Table Cell Styling */
        .articles-table .table-cell {
          padding: 16px 20px;
          border-right: 1px solid #333;
          display: flex;
          align-items: center;
          min-height: 72px; /* Fixed minimum height */
          overflow: hidden; /* Prevent content overflow */
        }

        .articles-table .table-cell:last-child {
          border-right: none;
        }

        /* Specific Column Styles */
        .title-cell {
          min-width: 300px;
          max-width: 300px;
          width: 300px;
        }

        .author-cell,
        .date-cell {
          min-width: 150px;
          max-width: 150px;
          width: 150px;
        }

        .status-cell {
          min-width: 120px;
          max-width: 120px;
          width: 120px;
        }

        .actions-cell {
          min-width: 200px;
          max-width: 200px;
          width: 200px;
          justify-content: center;
        }

        /* Cell Content Styling */
        .article-title-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          overflow: hidden;
        }

        .article-title {
          font-weight: 500;
          color: white;
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.4;
          white-space: normal; /* Allow text to wrap */
          overflow-wrap: break-word; /* Break long words */
          word-wrap: break-word;
          hyphens: auto; /* Add hyphens for long words */
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Limit to 2 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .article-slug {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cell-text {
          color: #ccc;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* Status Badge */
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-block;
          white-space: nowrap;
        }

        .status-badge.published {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
          padding: 3px 8px; /* Even more compact */
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
          display: inline-block;
          white-space: nowrap;
          text-align: center;
          min-width: 65px;
          box-sizing: border-box;
          line-height: 1;
          text-transform: uppercase; /* Optional: make it uppercase for better fit */
          letter-spacing: 0.5px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: nowrap; /* Prevent buttons from wrapping */
        }

        .action-button {
          background: #2a2a2a;
          border: 1px solid #3a3a3a;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          flex-shrink: 0; /* Prevent buttons from shrinking */
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .action-button.edit:hover {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .action-button.delete:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        .action-button.preview:hover {
          background: #10b981;
          border-color: #10b981;
        }

        /* Scrollbar Styling */
        .articles-table-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }

        .articles-table-container::-webkit-scrollbar-track {
          background: #222;
          border-radius: 4px;
        }

        .articles-table-container::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }

        .articles-table-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .articles-table-container::-webkit-scrollbar-corner {
          background: #1a1a1a;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 64px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }

        .empty-description {
          color: #888;
          margin-bottom: 32px;
          max-width: 400px;
          line-height: 1.6;
        }

        .empty-action {
          background: linear-gradient(135deg, #d4af37, #b8860b);
          color: black;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .empty-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        /* Button Styles */
        .primary-button {
          background: linear-gradient(135deg, #d4af37, #b8860b);
          color: black;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .secondary-button {
          background: #333;
          color: white;
          border: 1px solid #444;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .secondary-button:hover {
          background: #444;
          border-color: #555;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .modal-content {
            width: 98%;
            margin: 16px;
          }

          .articles-table {
            min-width: 800px;
          }

          .articles-table .table-header,
          .articles-table .table-row {
            grid-template-columns: 250px 130px 130px 110px 180px;
          }

          .title-cell {
            min-width: 250px;
            max-width: 250px;
            width: 250px;
          }

          .author-cell,
          .date-cell {
            min-width: 130px;
            max-width: 130px;
            width: 130px;
          }

          .status-cell {
            min-width: 110px;
            max-width: 110px;
            width: 110px;
          }

          .actions-cell {
            min-width: 180px;
            max-width: 180px;
            width: 180px;
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 100%;
            height: 100vh;
            max-height: 100vh;
            margin: 0;
            border-radius: 0;
          }

          .articles-table {
            min-width: 700px;
          }

          .modal-header,
          .modal-footer {
            padding: 16px 20px;
          }

          .articles-table-container {
            padding: 16px;
          }

          .articles-table .header-cell,
          .articles-table .table-cell {
            padding: 12px 16px;
          }

          .modal-footer {
            flex-direction: column;
            gap: 12px;
          }

          .modal-footer button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .articles-table {
            min-width: 600px;
          }

          .articles-table .table-header,
          .articles-table .table-row {
            grid-template-columns: 200px 120px 120px 100px 160px;
          }

          .title-cell {
            min-width: 200px;
            max-width: 200px;
            width: 200px;
          }

          .author-cell,
          .date-cell {
            min-width: 120px;
            max-width: 120px;
            width: 120px;
          }

          .status-cell {
            min-width: 100px;
            max-width: 100px;
            width: 100px;
          }

          .actions-cell {
            min-width: 160px;
            max-width: 160px;
            width: 160px;
          }
        }

        /* Horizontal scroll indicator */
        .table-scroll-hint {
          display: none; /* Hide since we have proper scrollbars */
        }

        /* Force consistent cell heights */
        .table-cell {
          min-height: 72px !important;
          height: auto !important;
          align-items: flex-start !important;
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }

        /* Ensure all cells have same vertical alignment */
        .articles-table .header-cell {
          align-items: center !important;
          height: 56px !important;
        }

        /* Make sure content doesn't overflow cells */
        .article-title-cell {
          max-height: 100%;
          overflow: hidden;
        }

        /* Adjust title display for better alignment */
        .article-title {
          min-height: 2.8em; /* Approximately 2 lines of text */
          max-height: 2.8em;
        }
      `}</style>
    </>
  );
};

export default CategoriesPage;
