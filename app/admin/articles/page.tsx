'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticleTable from '@/components/admin/ArticleTable';
import BulkActions from '@/components/admin/BulkActions';
import SearchFilters from '@/components/admin/SearchFilters';
import { AdminService, Article } from '@/services/admin-service';
import '../../../styles/admin/components.css';

const ArticlesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'trending', 'featured', etc.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // =========== AUTH CHECK ===========
  useEffect(() => {
    const hasCookie = document.cookie.includes('admin-auth=true');

    if (!hasCookie) {
      router.push('/login');
    } else {
      setAuthChecking(false);
    }
  }, [router]);

  // Read URL Params on Load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');
    const sortByParam = searchParams.get('sortBy');

    if (categoryParam) {
      setCategoryFilter(categoryParam.toLowerCase());
    }

    if (filterParam) {
      setActiveFilter(filterParam);
    } else if (sortByParam === 'date') {
      setActiveFilter('latest');
    }
  }, [searchParams]);

  // Load articles on mount
  useEffect(() => {
    if (!authChecking) {
      fetchArticles();
    }
  }, [authChecking]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="articles-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    // 1. Search Query
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Filter
    const matchesCategory = categoryFilter === 'all' ||
      article.category.toLowerCase() === categoryFilter.toLowerCase();

    // 3. Status/Type Filter (Active Filter)
    let matchesType = true;
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'trending':
          matchesType = article.trending;
          break;
        case 'featured':
          matchesType = article.featured;
          break;
        case 'topStory':
          matchesType = article.topStory;
          break;
        case 'homeTrending':
          matchesType = article.homeTrending;
          break;
        case 'homeFeatured':
          matchesType = article.homeFeatured;
          break;
        case 'homeLatest':
          matchesType = article.homeLatest;
          break;
        case 'latest':
          // Sort handled later, just ensures all match here
          matchesType = true;
          break;
        default:
          matchesType = true;
      }
    }

    // 4. Status Filter (Published/Draft - future use)
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' /* && article.published */);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  }).sort((a, b) => {
    // Apply sorting if needed
    if (activeFilter === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    // Default sort by date desc
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleSelectAll = () => {
    const filteredSlugs = filteredArticles.map(article => article.slug);

    // Check if ALL filtered articles are selected
    const allFilteredSelected = filteredSlugs.every(slug =>
      selectedArticles.includes(slug)
    );

    if (allFilteredSelected) {
      // Deselect all filtered articles
      setSelectedArticles(prev =>
        prev.filter(slug => !filteredSlugs.includes(slug))
      );
    } else {
      // Select all filtered articles
      setSelectedArticles(prev => {
        const newSelection = new Set([...prev, ...filteredSlugs]);
        return Array.from(newSelection);
      });
    }
  };

  const handleSelectArticle = (slug: string) => {
    setSelectedArticles(prev =>
      prev.includes(slug)
        ? prev.filter(articleSlug => articleSlug !== slug)
        : [...prev, slug]
    );
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedArticles.length} articles?`)) {
      try {
        // Get articles to delete
        const articlesToDelete = articles.filter(a => selectedArticles.includes(a.slug));

        // Delete each article
        const deletePromises = articlesToDelete.map(async (article) => {
          await AdminService.deleteArticle(article.slug);
        });

        await Promise.all(deletePromises);

        // Update local state
        setArticles(prev => prev.filter(article => !selectedArticles.includes(article.slug)));
        setSelectedArticles([]);

        alert(`Successfully deleted ${selectedArticles.length} articles`);

      } catch (err) {
        console.error('Error deleting articles:', err);
        alert('Failed to delete some articles. Please try again.');
        // Refresh to sync with server
        await fetchArticles();
      }
    }
  };

  const handleDeleteArticle = async (slug: string, category: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      console.log(`Deleting article: ${slug}, category: ${category}`);

      // First, remove from local state for immediate UI update
      const articleToDelete = articles.find(a => a.slug === slug && a.category === category);
      if (!articleToDelete) {
        alert('Article not found in local state');
        return;
      }

      // Remove from local state immediately
      setArticles(prev => prev.filter(article => !(article.slug === slug && article.category === category)));

      // Remove from selected articles if it was selected
      setSelectedArticles(prev => prev.filter(slug => slug !== articleToDelete.slug));

      // Then call API
      await AdminService.deleteArticle(slug); // Remove category parameter

      console.log('Article deleted successfully');

    } catch (err: any) {
      console.error('Error deleting article:', err);

      // If API fails, refresh the list to restore the article
      await fetchArticles();

      alert(`Failed to delete article: ${err.message || 'Unknown error'}`);
    }
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
        await fetchArticles(); // Refresh the list
        alert('Article duplicated successfully!');
      } catch (err) {
        console.error('Error duplicating article:', err);
        alert('Failed to duplicate article. Please try again.');
      }
    }
  };

  const handleNewArticle = () => {
    router.push('/admin/articles/new');
  };

  const handleToggleFlag = async (slug: string, field: keyof Article, value: boolean) => {
    try {
      // Optimistic update
      setArticles(prev =>
        prev.map(a => a.slug === slug ? { ...a, [field]: value } : a)
      );

      // Call API
      await AdminService.updateArticle(slug, { [field]: value });

    } catch (err) {
      console.error('Error toggling flag:', err);
      alert('Failed to update article status');
      // Revert on error
      fetchArticles();
    }
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalArticles: articles.length,
      articles: articles
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-instruct-articles-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="articles-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Failed to load articles</h3>
          <p className="error-message">{error}</p>
          <button onClick={fetchArticles} className="retry-button">
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-container">
      {/* Page Header */}
      <div className="page-header animate-slide-in">
        <div className="header-content">
          <h1 className="page-title">
            Article Management
            <span className="page-subtitle">Total: {articles.length} articles</span>
          </h1>
          <p className="page-description">
            Manage all your blog articles. Edit, delete, or create new content.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleNewArticle} className="primary-button gold">
            <span className="button-icon">+</span>
            New Article
          </button>
          <button onClick={handleExport} className="secondary-button">
            <span className="button-icon">📊</span>
            Export
          </button>
          <button onClick={fetchArticles} className="secondary-button">
            <span className="button-icon">↻</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <BulkActions
          selectedCount={selectedArticles.length}
          onDelete={handleBulkDelete}
          onStatusChange={(status) => {
            alert('Status update functionality coming soon!');
          }}
        />
      )}

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
      />

      {/* Article Table */}
      <ArticleTable
        articles={filteredArticles}
        selectedArticles={selectedArticles}
        onSelectAll={handleSelectAll}
        onSelectArticle={handleSelectArticle}
        onDeleteArticle={handleDeleteArticle}
        onDuplicateArticle={handleDuplicateArticle}
        onRefresh={fetchArticles}
        onToggleFlag={handleToggleFlag}
      />

      {/* Stats Footer */}
      <div className="stats-footer">
        <div className="stat-item">
          <span className="stat-value gold-text">{articles.length}</span>
          <span className="stat-label">Total Articles</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{articles.filter(a => a.featured).length}</span>
          <span className="stat-label">Featured</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{articles.filter(a => a.trending).length}</span>
          <span className="stat-label">Trending</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{articles.filter(a => a.topStory).length}</span>
          <span className="stat-label">Top Stories</span>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;