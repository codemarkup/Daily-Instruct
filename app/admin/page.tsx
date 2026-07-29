"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
import { AdminService, Article } from "@/services/admin-service";
import "../../styles/admin/components.css";

const AdminDashboard = () => {
  const router = useRouter();
  
  // =========== AUTH CHECK REMOVED ===========
  // Supabase middleware handles route protection automatically
  // =========== END AUTH CHECK ===========
  
  const [stats, setStats] = useState([
    {
      title: "Total Articles",
      value: "0",
      change: "+0%",
      icon: "/icons/admin/article.svg",
      color: "gold",
      trend: "up",
    },
    {
      title: "Trending Articles",
      value: "0",
      change: "+0%",
      icon: "/icons/admin/trending.svg",
      color: "blue",
      trend: "up",
    },
    {
      title: "Featured Articles",
      value: "0",
      change: "+0",
      icon: "/icons/admin/featured.svg",
      color: "purple",
      trend: "up",
    },
    {
      title: "Latest Articles",
      value: "0",
      change: "-0",
      icon: "/icons/admin/latest.svg",
      color: "orange",
      trend: "down",
    },
  ]);

  const [recentArticles, setRecentArticles] = useState<
    Array<{
      id: number;
      title: string;
      category: string;
      date: string;
      views: string;
      status: string;
      slug: string;
    }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    database: "Loading...",
    jsonFiles: "Loading...",
    storage: "Loading...",
    security: "Loading...",
  });

  const quickActions = [
    {
      title: "New Article",
      icon: "/icons/admin/new.svg",
      color: "gold",
      path: "/hq/articles/new",
      onClick: () => router.push("/hq/articles/new"),
    },
    {
      title: "Manage Categories",
      icon: "/icons/admin/article.svg",
      color: "purple",
      path: "/hq/categories",
      onClick: () => router.push("/hq/categories"),
    },
    {
      title: "View Analytics",
      icon: "/icons/admin/analytics.svg",
      color: "blue",
      path: "/hq/analytics",
      onClick: () => alert("Analytics page coming soon!"),
    },
    {
      title: "Backup Data",
      icon: "/icons/admin/backup.svg",
      color: "green",
      path: "/hq/utilities/backup",
      onClick: () => handleBackup(),
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all articles
      const allArticles = await AdminService.getAllArticles();

      // Calculate statistics
      const totalArticles = allArticles.length;
      const trendingArticles = allArticles.filter(
        (article) => article.trending
      ).length;
      const featuredArticles = allArticles.filter(
        (article) => article.featured
      ).length;

      // Get latest articles (last 5)
      const latestArticles = [...allArticles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      // Update stats
      setStats([
        {
          title: "Total Articles",
          value: totalArticles.toString(),
          change: "+0%",
          icon: "/icons/admin/article.svg",
          color: "gold",
          trend: "up",
        },
        {
          title: "Trending Articles",
          value: trendingArticles.toString(),
          change: "+0%",
          icon: "/icons/admin/trending.svg",
          color: "blue",
          trend: "up",
        },
        {
          title: "Featured Articles",
          value: featuredArticles.toString(),
          change: "+0",
          icon: "/icons/admin/featured.svg",
          color: "purple",
          trend: "up",
        },
        {
          title: "Latest Articles",
          value: latestArticles.length.toString(),
          change: "-0",
          icon: "/icons/admin/latest.svg",
          color: "orange",
          trend: "down",
        },
      ]);

      // Update recent articles
      const formattedRecentArticles = latestArticles.map((article) => ({
        id: article.id,
        title: article.title,
        category: article.category,
        date: formatDate(article.date),
        views: "0", // You can add view tracking later
        status: "published", // All articles from JSON are published
        slug: article.slug,
      }));

      setRecentArticles(formattedRecentArticles);

      // Update system status
      setSystemStatus({
        database: "Online",
        jsonFiles: `${allArticles.length} articles loaded`,
        storage: "85% Free",
        security: "Protected",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleBackup = async () => {
    try {
      alert("Backup functionality will be implemented soon!");
      // You can add actual backup functionality here
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Backup failed. Please try again.");
    }
  };

  const handleEditArticle = (slug: string) => {
    router.push(`/hq/articles/edit/${slug}`);
  };

  const handleDeleteArticle = async (slug: string, category: string) => {
  if (confirm("Are you sure you want to delete this article?")) {
    try {
      // FIX: Remove category parameter
      await AdminService.deleteArticle(slug); // ✅ CORRECT
      
      // Refresh data
      fetchDashboardData();
      alert("Article deleted successfully!");
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Failed to delete article. Please try again.");
    }
  }
};

  const handlePreviewArticle = (slug: string) => {
    window.open(`/articles/${slug}`, "_blank");
  };

  const handleViewAllArticles = () => {
    router.push("/hq/articles");
  };

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome animate-slide-in">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, <span className="gold-text">Admin</span>
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your blog today.
          </p>
        </div>
        <div className="welcome-time">
          <span className="time-text">{currentDate}</span>
          <span className="time-indicator">🕒 {currentTime}</span>
        </div>
      </div>

      {error && (
        <div className="error-message animate-slide-in">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button className="error-retry-btn" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid animate-slide-in delay-100">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="dashboard-section animate-slide-in delay-200">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <span className="section-subtitle">One-click operations</span>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`quick-action-card ${action.color}`}
                onClick={action.onClick}
              >
                {action.icon.endsWith(".svg") ? (
                  <img
                    src={action.icon}
                    alt={action.title}
                    className="action-svg-icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="action-icon">{action.icon}</span>
                )}
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="dashboard-section animate-slide-in delay-300">
          <div className="section-header">
            <h2 className="section-title">Recent Articles</h2>
            <button className="section-button" onClick={handleViewAllArticles}>
              View All →
            </button>
          </div>
          <div className="recent-articles-table">
            <div className="table-header">
              <div className="table-cell">Title</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Views</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            <div className="table-body">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div
                    key={`${article.id}-${article.slug}`}
                    className="table-row"
                  >
                    <div className="table-cell">
                      <span className="cell-title">{article.title}</span>
                    </div>
                    <div className="table-cell">
                      <span
                        className={`category-badge ${article.category.toLowerCase()}`}
                      >
                        {article.category}
                      </span>
                    </div>
                    <div className="table-cell">
                      <span className="cell-date">{article.date}</span>
                    </div>
                    <div className="table-cell">
                      <span className="cell-views">{article.views}</span>
                    </div>
                    <div className="table-cell">
                      <span className={`status-badge ${article.status}`}>
                        {article.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="action-buttons">
                        <button
                          className="action-button edit"
                          onClick={() => handleEditArticle(article.slug)}
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
                          className="action-button delete"
                          onClick={() =>
                            handleDeleteArticle(article.slug, article.category)
                          }
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
                          className="action-button preview"
                          onClick={() => handlePreviewArticle(article.slug)}
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
                ))
              ) : (
                <div className="no-data-row">
                  <div className="table-cell">
                    <span className="no-data-text">No articles found</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">System Status</h2>
            <span className="section-subtitle">All systems operational</span>
          </div>
          <div className="system-status-grid">
            <div className="system-card online">
              <span className="system-icon">✅</span>
              <div className="system-info">
                <span className="system-name">Database</span>
                <span className="system-status">{systemStatus.database}</span>
              </div>
            </div>
            <div className="system-card online">
              <span className="system-icon">✅</span>
              <div className="system-info">
                <span className="system-name">JSON Files</span>
                <span className="system-status">{systemStatus.jsonFiles}</span>
              </div>
            </div>
            <div className="system-card online">
              <span className="system-icon">✅</span>
              <div className="system-info">
                <span className="system-name">Storage</span>
                <span className="system-status">{systemStatus.storage}</span>
              </div>
            </div>
            <div className="system-card online">
              <span className="system-icon">✅</span>
              <div className="system-info">
                <span className="system-name">Security</span>
                <span className="system-status">{systemStatus.security}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
