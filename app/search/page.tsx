"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SearchPage.module.css';

// Create a separate component that uses useSearchParams
function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setTotalResults(data.total || 0);
      }
    } catch (error) {
      console.error('Search page error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <h1 className={styles.pageTitle} style={{ marginTop: '4rem' }}>Search Results</h1>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for articles..."
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {/* Results Info */}
      {query && (
        <div className={styles.resultsInfo}>
          <p>
            Found <strong>{totalResults}</strong> results for "{query}"
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Searching...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <div className={styles.noResults}>
          <h3>No results found for "{query}"</h3>
          <p>Try different keywords or check your spelling.</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div className={styles.resultsGrid}>
          {results.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.articleCard}
            >
              <div className={styles.cardImage}>
                <Image 
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={250}
                  className={styles.image}
                />
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.categoryBadge}>{article.category}</div>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardDescription}>{article.description}</p>
                
                <div className={styles.cardMeta}>
                  <span className={styles.cardAuthor}>{article.author}</span>
                  <span className={styles.cardDate}>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!query && !loading && (
        <div className={styles.emptyState}>
          <h3>Search for articles</h3>
          <p>Enter keywords in the search box above to find articles.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className={styles.searchPage}>
      <div className="container">
        <Suspense fallback={
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading search...</p>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}