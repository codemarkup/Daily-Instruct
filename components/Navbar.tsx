"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

// Define article type for search results
interface SearchArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  specific: string;
  trending: boolean;
  content?: string; // Added for better search
  tags?: string[]; // Added for better search
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    'Technology', 'Business', 'AI', 'Startup', 'Investing', 'Crypto', 'Web3', 'Marketing'
  ]);

  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();



  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())
    ].slice(0, 5); // Keep only 5 most recent

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when component mounts
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Improved search function with better ranking
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Try API search first
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setShowSearchResults(true);
          return;
        }
      }
      // Fallback to local search
      await performLocalSearch(query);
    } catch (error) {
      console.error('Search error:', error);
      await performLocalSearch(query);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Optimized debounced search
  // Optimized debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 200); // Slightly reduced delay
    } else if (searchQuery.length === 0) {
      setSearchResults([]);
      // DON'T automatically show results when query is empty
      // Only show when user focuses on search input (handled by onFocus)
      // setShowSearchResults(true); // <-- REMOVE OR COMMENT THIS LINE
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Improved local search with ranking
  // Improved local search with ranking
  // Improved local search with ranking
  const performLocalSearch = async (query: string) => {
    try {
      const [techData, businessData, marketData, guidesData] = await Promise.all([
        import('@/data/tech-articles.json'),
        import('@/data/business-articles.json'),
        import('@/data/markets-articles.json'),
        import('@/data/guides-articles.json')
      ]);

      // Extract articles from each data set
      const allArticles: any[] = [
        ...(techData.articles || []),
        ...(businessData.articles || []),
        ...(marketData.articles || []),
        ...(guidesData.articles || [])
      ];

      const searchQuery = query.toLowerCase().trim();
      const words = searchQuery.split(/\s+/).filter(word => word.length > 1);

      if (words.length === 0) {
        setSearchResults([]);
        return;
      }

      // Create an array to store articles with scores
      const scoredArticles = allArticles
        .map(article => {
          let score = 0;
          const title = (article.title || '').toLowerCase();
          const description = (article.description || '').toLowerCase();
          const author = (article.author || '').toLowerCase();
          const category = (article.category || '').toLowerCase();
          const specific = (article.specific || '').toLowerCase();

          // Calculate relevance score
          words.forEach(word => {
            // Title matches are most important (weight: 10)
            if (title.includes(word)) score += 10;
            // Exact title match bonus
            if (title === searchQuery) score += 15;

            // Description matches (weight: 5)
            if (description.includes(word)) score += 5;

            // Category matches (weight: 8)
            if (category.includes(word)) score += 8;

            // Specific/tags matches (weight: 6)
            if (specific.includes(word)) score += 6;

            // Author matches (weight: 3)
            if (author.includes(word)) score += 3;

            // Partial word matches in title
            if (word.length > 3) {
              if (title.includes(word.substring(0, word.length - 1))) score += 2;
            }
          });

          // Boost trending articles
          if (article.trending) score += 5;

          // Boost if query appears at beginning of title
          if (title.startsWith(searchQuery)) score += 12;

          return { article, score };
        })
        .filter(item => item.score > 0) // Only include relevant results
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 8);

      // Extract just the articles without scores and cast to SearchArticle type
      const results: SearchArticle[] = scoredArticles.map(item => ({
        id: item.article.id || 0,
        slug: item.article.slug || '',
        title: item.article.title || '',
        description: item.article.description || '',
        author: item.article.author || '',
        date: item.article.date || '',
        readTime: item.article.readTime || '',
        image: item.article.image || '',
        category: item.article.category || '',
        specific: item.article.specific || '',
        trending: item.article.trending || false,
        content: item.article.content || '',
        tags: item.article.tags || []
      }));

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Local search error:', error);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (slug: string) => {
    saveRecentSearch(searchQuery);
    router.push(`/articles/${slug}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setShowSearchResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  // Rest of the component remains exactly the same...
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tech', href: '/tech' },
    { name: 'Business', href: '/business' },
    { name: 'Markets', href: '/market' },
    { name: 'Guides', href: '/guides' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Hide Navbar on admin pages and login page
  if (pathname && (pathname.startsWith('/admin') || pathname === '/login')) {
    return null;
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        {/* Logo */}
        <Link href="/" className={styles.navLogo}>
          <span className={styles.logoSerif}>Daily</span>
          <span className={styles.logoSans}>Instruct</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navCenter}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${styles.navLink} ${isActiveLink(link.href) ? styles.active : ''}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side Actions - Search Bar Always Visible */}
        <div className={styles.navActions}>
          {/* Premium Search Bar - Always Visible */}
          <div className={styles.searchContainer} ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchInputWrapper}>
                <svg
                  className={styles.searchIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search articles, topics"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.length > 1) {
                      setShowSearchResults(true);
                    } else {
                      setShowSearchResults(true); // Show empty state on focus
                    }
                  }}
                  suppressHydrationWarning={true}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => setSearchQuery('')}
                    suppressHydrationWarning={true}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                <button type="submit" className={styles.searchSubmitBtn} suppressHydrationWarning={true}>
                  Search
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className={styles.searchResults}>
                <div className={styles.searchResultsContent}>
                  {/* Search Results */}
                  {searchQuery.length > 0 && searchResults.length > 0 && (
                    <div className={styles.resultsSection}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>Search Results</span>
                        {isSearching && <span className={styles.searchingText}>Searching...</span>}
                      </div>

                      <div className={styles.resultsList}>
                        {searchResults.map((article) => (
                          <div
                            key={article.id}
                            className={styles.resultItem}
                            onClick={() => handleResultClick(article.slug)}
                          >
                            <div className={styles.resultContent}>
                              <h4 className={styles.resultTitle}>{article.title}</h4>
                              <div className={styles.resultMeta}>
                                <span className={styles.resultCategory}>{article.category}</span>
                                <span className={styles.resultAuthor}>By {article.author}</span>
                                <span className={styles.resultDate}>{article.date}</span>
                              </div>
                            </div>
                            <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ))}
                      </div>

                      <div className={styles.viewAllResults}>
                        <button
                          onClick={handleSearchSubmit}
                          className={styles.viewAllBtn}
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery.length > 0 && !isSearching && searchResults.length === 0 && (
                    <div className={styles.noResults}>
                      <div className={styles.noResultsIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h4>No results found</h4>
                      <p>Try different keywords or check your spelling.</p>
                    </div>
                  )}

                  {/* Empty Search State */}
                  {searchQuery.length === 0 && (
                    <>
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div className={styles.resultsSection}>
                          <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>Recent Searches</span>
                            <button
                              onClick={clearRecentSearches}
                              className={styles.clearRecentBtn}
                            >
                              Clear all
                            </button>
                          </div>

                          <div className={styles.recentSearchesList}>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                className={styles.recentSearchItem}
                                onClick={() => handlePopularSearchClick(search)}
                              >
                                <svg className={styles.clockIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{search}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      <div className={styles.resultsSection}>
                        <div className={styles.sectionHeader}>
                          <span className={styles.sectionTitle}>Popular Searches</span>
                        </div>

                        <div className={styles.popularSearchesList}>
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              className={styles.popularSearchItem}
                              onClick={() => handlePopularSearchClick(search)}
                            >
                              <span>{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search Tips */}
                      <div className={styles.searchTips}>
                        <div className={styles.sectionHeader}>
                          <span className={styles.sectionTitle}>Search Tips</span>
                        </div>
                        <ul className={styles.tipsList}>
                          <li>Try using specific keywords</li>
                          <li>Search by author name</li>
                          <li>Use category names like "Tech" or "Business"</li>
                          <li>Try trending topics</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
          {/* Mobile Search */}
          <div className={styles.mobileSearch}>
            <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
              <div className={styles.mobileSearchInputWrapper}>
                <svg className={styles.mobileSearchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className={styles.mobileSearchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.mobileClearButton}
                    onClick={() => setSearchQuery('')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                <button type="submit" className={styles.mobileSearchBtn}>
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActiveLink(link.href) ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;