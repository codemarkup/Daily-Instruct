"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/services/admin-service";
import "../../styles/admin/components.css";
import "../../styles/admin/tables.css";

interface ArticleTableProps {
  articles: Article[];
  selectedArticles: string[];
  onSelectAll: () => void;
  onSelectArticle: (slug: string) => void;
  onDeleteArticle: (slug: string, category: string) => void;
  onDuplicateArticle: (article: Article) => void;
  onRefresh?: () => void;
  onToggleFlag?: (slug: string, field: keyof Article, value: boolean) => void;
  // Visibility props
  showSelection?: boolean;
  showFlags?: boolean;
  showStatus?: boolean;
  showActions?: boolean;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  selectedArticles,
  onSelectAll,
  onSelectArticle,
  onDeleteArticle,
  onDuplicateArticle,
  onRefresh,
  onToggleFlag,
  showSelection = true,
  showFlags = true,
  showStatus = true,
  showActions = true,
}) => {
  const handleDelete = (slug: string, category: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      onDeleteArticle(slug, category);
    }
  };

  const handleDuplicate = (article: Article) => {
    if (confirm("Duplicate this article?")) {
      onDuplicateArticle(article);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`article-table-container ${!showSelection ? 'dashboard-table' : ''}`}>
      <div className="table-wrapper">
        {/* Table Header */}
        <div className="table-header">
          {showSelection && (
            <div className="header-cell checkbox-cell">
              <input
                type="checkbox"
                checked={
                  articles.length > 0 &&
                  articles.every(
                    (article) => selectedArticles.includes(article.slug)
                  )
                }
                onChange={onSelectAll}
                className="checkbox-input"
              />
            </div>
          )}
          <div className="header-cell title-cell">Title</div>
          <div className="header-cell date-cell">Date</div> {/* Added Date Column */}
          {showFlags && <div className="header-cell flags-cell">Flags</div>}
          <div className="header-cell category-cell">Category</div>
          {showStatus && <div className="header-cell status-cell">Status</div>}
          {showActions && <div className="header-cell actions-cell">Actions</div>}
        </div>

        {/* Table Body */}
        <div className="table-body">
          {articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">No articles found</h3>
              <p className="empty-description">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Link href="/admin/articles/new" className="empty-action">
                Create your first article
              </Link>
              {onRefresh && (
                <button onClick={onRefresh} className="empty-refresh">
                  ↻ Refresh
                </button>
              )}
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={`article-${article.id}-${article.slug}`}
                className={`table-row ${selectedArticles.includes(article.slug) ? "selected" : ""}`}
              >
                {/* Checkbox */}
                {showSelection && (
                  <div className="table-cell checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.slug)}
                      onChange={() => onSelectArticle(article.slug)}
                      className="checkbox-input"
                    />
                  </div>
                )}

                {/* Title */}
                <div className="table-cell title-cell">
                  <div className="cell-content">
                    <h4 className="article-title">{article.title}</h4>
                    <p className="article-slug">/{article.slug}</p>
                  </div>
                </div>

                {/* Date - Added */}
                <div className="table-cell date-cell">
                  <span className="article-date">{formatDate(article.date)}</span>
                </div>

                {/* Flags (Quick Toggles) */}
                {showFlags && (
                  <div className="table-cell flags-cell">
                    <div className="flags-container">
                      <button
                        className={`flag-toggle ${article.trending ? 'active' : ''}`}
                        onClick={() => onToggleFlag?.(article.slug, 'trending', !article.trending)}
                        title="Toggle Trending"
                      >
                        🔥
                      </button>
                      <button
                        className={`flag-toggle ${article.featured ? 'active' : ''}`}
                        onClick={() => onToggleFlag?.(article.slug, 'featured', !article.featured)}
                        title="Toggle Featured"
                      >
                        ⭐
                      </button>
                      <button
                        className={`flag-toggle ${article.homeLatest ? 'active' : ''}`}
                        onClick={() => onToggleFlag?.(article.slug, 'homeLatest', !article.homeLatest)}
                        title="Toggle Home Latest"
                      >
                        🏠
                      </button>
                      <button
                        className={`flag-toggle ${article.homeTrending ? 'active' : ''}`}
                        onClick={() => onToggleFlag?.(article.slug, 'homeTrending', !article.homeTrending)}
                        title="Toggle Home Trending"
                      >
                        📈
                      </button>
                    </div>
                  </div>
                )}

                {/* Category */}
                <div className="table-cell category-cell">
                  <span
                    className={`category-tag ${article.category.toLowerCase() === "market"
                      ? "markets"
                      : article.category.toLowerCase()
                      }`}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Status */}
                {showStatus && (
                  <div className="table-cell status-cell">
                    <span className={`status-badge published`}>Published</span>
                  </div>
                )}

                {/* Actions */}
                {showActions && (
                  <div className="table-cell actions-cell extra">
                    <div className="action-buttons">
                      <Link
                        href={`/admin/articles/edit/${article.slug}`}
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
                      </Link>

                      <button
                        onClick={() => handleDuplicate(article)}
                        className="action-button duplicate"
                        title="Duplicate"
                      >
                        <Image
                          src="/icons/duplicate.svg"
                          alt="Edit"
                          width={18}
                          height={18}
                          className="icon"
                        />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(article.slug, article.category)
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
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="table-scroll-hint">
        <span className="hint-icon">↔</span>
        <span className="hint-text">
          Scroll horizontally to see more columns
        </span>
      </div>

      {/* Table Footer */}
      {showSelection && (
        <div className="table-footer">
          <div className="footer-info">
            Showing <span className="highlight">{articles.length}</span> articles
          </div>
          <div className="selected-count">
            {selectedArticles.length > 0 && (
              <>
                <span className="highlight">{selectedArticles.length}</span>{" "}
                selected
                <button
                  className="bulk-delete-btn"
                  onClick={() => {
                    if (
                      confirm(
                        `Delete ${selectedArticles.length} selected articles?`
                      )
                    ) {
                      selectedArticles.forEach((slug) => {
                        const article = articles.find((a) => a.slug === slug);
                        if (article) {
                          onDeleteArticle(article.slug, article.category);
                        }
                      });
                    }
                  }}
                >
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleTable;
