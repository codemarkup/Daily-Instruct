"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
// import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"; // REMOVED
import ArticleTable from "@/components/admin/ArticleTable";
import { AdminService, Article } from "@/services/admin-service";
import "../../styles/admin/components.css";

// ... imports ...

const AdminDashboard = () => {
  const router = useRouter();

  // =========== AUTH CHECK ===========
  useEffect(() => {
    // Simple cookie check
    const hasAuthCookie = document.cookie.includes('admin-auth=true');

    if (!hasAuthCookie) {
      console.log('No auth cookie, redirecting to login');
      router.push('/login');
    }
  }, [router]);
  // =========== END AUTH CHECK ===========

  const [globalStats, setGlobalStats] = useState([
    {
      title: "Total Articles",
      value: "0",
      change: "+0%",
      icon: "/icons/admin/article.svg",
      color: "gold",
      trend: "up",
      onClick: () => { },
    },
    {
      title: "Home Trending",
      value: "0",
      change: "+0%",
      icon: "/icons/admin/trending.svg",
      color: "blue",
      trend: "up",
      onClick: () => { },
    },
    {
      title: "Home Featured",
      value: "0",
      change: "+0",
      icon: "/icons/admin/featured.svg",
      color: "purple",
      trend: "up",
      onClick: () => { },
    },
    {
      title: "Home Latest",
      value: "0",
      change: "-0",
      icon: "/icons/admin/latest.svg",
      color: "orange",
      trend: "down",
      onClick: () => { },
    },
    {
      title: "Home Top Story",
      value: "0",
      change: "-0",
      icon: "/icons/admin/latest.svg",
      color: "green",
      trend: "down",
      onClick: () => { },
    },
  ]);

  interface CategoryStat {
    title: string;
    stats: {
      title: string;
      value: string;
      change: string;
      icon: string;
      color: string;
      trend: string;
      onClick?: () => void;
    }[];
  }

  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
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
      path: "/admin/articles/new",
      onClick: () => router.push("/admin/articles/new"),
    },
    {
      title: "Manage Categories",
      icon: "/icons/admin/article.svg",
      color: "purple",
      path: "/admin/categories",
      onClick: () => router.push("/admin/categories"),
    },
    // Analytics Removed
    // {
    //   title: "View Analytics",
    //   icon: "/icons/admin/analytics.svg", 
    //   color: "blue",
    //   path: "/admin/analytics",
    //   onClick: () => alert("Analytics page coming soon!"),
    // },
    {
      title: "Backup Data",
      icon: "/icons/admin/backup.svg",
      color: "green",
      path: "/admin/utilities/backup",
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

      // --- GLOBAL STATS (HOME PAGE) ---
      const totalArticles = allArticles.length;
      const homeTrending = allArticles.filter((a) => a.homeTrending).length;
      const homeFeatured = allArticles.filter((a) => a.homeFeatured).length;
      const homeLatest = allArticles.filter((a) => a.homeLatest).length;

      setGlobalStats([
        {
          title: "Total Articles",
          value: totalArticles.toString(),
          change: "+0%",
          icon: "/icons/admin/article.svg",
          color: "gold",
          trend: "up",
          // @ts-ignore
          onClick: () => router.push("/admin/articles"),
        },
        {
          title: "Home Trending",
          value: homeTrending.toString(),
          change: "+0%",
          icon: "/icons/admin/trending.svg",
          color: "blue",
          trend: "up",
          // @ts-ignore
          onClick: () => router.push("/admin/articles?filter=homeTrending"),
        },
        {
          title: "Home Featured",
          value: homeFeatured.toString(),
          change: "+0",
          icon: "/icons/admin/featured.svg",
          color: "purple",
          trend: "up",
          // @ts-ignore
          onClick: () => router.push("/admin/articles?filter=homeFeatured"),
        },
        {
          title: "Home Latest",
          value: homeLatest.toString(),
          change: "-0",
          icon: "/icons/admin/latest.svg",
          color: "orange",
          trend: "down",
          // @ts-ignore
          onClick: () => router.push("/admin/articles?filter=homeLatest"),
        },
        {
          title: "Home Top Story",
          value: allArticles.filter((a) => a.homeTopStory).length.toString(),
          change: "-0",
          icon: "/icons/admin/latest.svg", // Using latest icon or a custom one if available
          color: "green", // Distinct color
          trend: "down",
          // @ts-ignore
          onClick: () => router.push("/admin/articles?filter=homeTopStory"),
        },
      ]);

      // --- CATEGORY STATS ---
      const categories = ['Tech', 'Business', 'Markets', 'Guides'];
      const newCategoryStats: CategoryStat[] = categories.map(cat => {
        const catArticles = allArticles.filter(a => a.category.toLowerCase() === cat.toLowerCase());
        const total = catArticles.length;
        // "only that page relevant flag shall be present"
        // For categories, we use generic flags: trending, featured, topStory (as proxy for latest/top)
        const trending = catArticles.filter(a => a.trending).length;
        const featured = catArticles.filter(a => a.featured).length;
        const topStories = catArticles.filter(a => a.topStory).length; // Using topStory as requested variant

        return {
          title: cat,
          stats: [
            {
              title: `${cat} Total`,
              value: total.toString(),
              change: "+0%",
              icon: "/icons/admin/article.svg",
              color: "gold",
              trend: "up",
              onClick: () => router.push(`/admin/articles?category=${cat.toLowerCase()}`),
            },
            {
              title: `${cat} Trending`,
              value: trending.toString(),
              change: "+0%",
              icon: "/icons/admin/trending.svg",
              color: "blue",
              trend: "up",
              onClick: () => router.push(`/admin/articles?category=${cat.toLowerCase()}&filter=trending`),
            },
            {
              title: `${cat} Featured`,
              value: featured.toString(),
              change: "+0",
              icon: "/icons/admin/featured.svg",
              color: "purple",
              trend: "up",
              onClick: () => router.push(`/admin/articles?category=${cat.toLowerCase()}&filter=featured`),
            },
            {
              title: `${cat} Top Stories`,
              value: topStories.toString(),
              change: "-0",
              icon: "/icons/admin/latest.svg", // Using star/latest icon for top stories
              color: "orange",
              trend: "down",
              onClick: () => router.push(`/admin/articles?category=${cat.toLowerCase()}&filter=topStory`),
            },
          ]
        };
      });

      setCategoryStats(newCategoryStats);

      // Get recent articles (last 5 sorted by date for table)
      const sortedByDate = [...allArticles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentArticles(sortedByDate);

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
    router.push(`/admin/articles/edit/${slug}`);
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

  const handleDuplicateArticle = async (originalArticle: Article) => {
    if (confirm('Duplicate this article?')) {
      try {
        const newArticle: Omit<Article, 'id'> & { category: string } = {
          ...originalArticle,
          title: `${originalArticle.title} (Copy)`,
          slug: `${originalArticle.slug}-copy-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          category: originalArticle.category
        };

        await AdminService.createArticle(newArticle);
        fetchDashboardData(); // Refresh
        alert('Article duplicated successfully!');
      } catch (err) {
        console.error('Error duplicating article:', err);
        alert('Failed to duplicate article. Please try again.');
      }
    }
  };

  const handleToggleFlag = async (slug: string, field: keyof Article, value: boolean) => {
    try {
      // Optimistic update
      setRecentArticles(prev =>
        prev.map(a => a.slug === slug ? { ...a, [field]: value } : a)
      );

      // Call API
      await AdminService.updateArticle(slug, { [field]: value });
      // Refresh stats to reflect flag change
      fetchDashboardData();

    } catch (err) {
      console.error('Error toggling flag:', err);
      // Revert on error
      fetchDashboardData();
    }
  };

  const handleViewAllArticles = () => {
    router.push("/admin/articles");
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

      {/* Analytics Dashboard (Top Section) */}
      {/* Analytics Dashboard (Removed) */}
      {/* 
      <div className="animate-slide-in">
        <AnalyticsDashboard />
      </div> 
      */}

      {/* Stats Grid - GLOBAL (Home Page) */}
      <h3 className="section-title" style={{ marginTop: '30px', marginBottom: '15px' }}>Home Page Stats</h3>
      <div className="stats-grid animate-slide-in delay-100">
        {globalStats.map((stat, index) => (
          <StatsCard key={`global-${index}`} {...stat} />
        ))}
      </div>

      {/* Stats Grid - CATEGORIES */}
      {categoryStats.map((catStat, idx) => (
        <div key={catStat.title} className="category-stats-section animate-slide-in" style={{ animationDelay: `${(idx + 2) * 100}ms` }}>
          <h3 className="section-title" style={{ marginTop: '30px', marginBottom: '15px' }}>{catStat.title} Stats</h3>
          <div className="stats-grid">
            {catStat.stats.map((stat, index) => (
              <StatsCard key={`${catStat.title}-${index}`} {...stat} />
            ))}
          </div>
        </div>
      ))}

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

          <ArticleTable
            articles={recentArticles}
            selectedArticles={[]}
            onSelectAll={() => { }}
            onSelectArticle={() => { }}
            onDeleteArticle={handleDeleteArticle}
            onDuplicateArticle={handleDuplicateArticle}
            onRefresh={fetchDashboardData}
            onToggleFlag={handleToggleFlag}
            // Dashboard specific customization
            showSelection={false}
            showFlags={false}
            showStatus={false}
          />
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
