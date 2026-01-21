"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
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
  const [searchTime, setSearchTime] = useState(0);

  // Improved search with ranking
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const startTime = performance.now();
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        
        // If API returns results, use them
        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setTotalResults(data.total || data.results.length);
        } else {
          // Fallback to local search with ranking
          await performLocalSearch(searchQuery);
        }
      } else {
        // Fallback to local search
        await performLocalSearch(searchQuery);
      }
    } catch (error) {
      console.error('Search page error:', error);
      // Fallback to local search
      await performLocalSearch(searchQuery);
    } finally {
      const endTime = performance.now();
      setSearchTime(Math.round(endTime - startTime));
      setLoading(false);
    }
  }, []);

  // FIXED: Improved local search function with better filtering
  const performLocalSearch = async (searchQuery: string) => {
    try {
      const [techData, businessData, marketData, guidesData] = await Promise.all([
        import('@/data/tech-articles.json'),
        import('@/data/business-articles.json'),
        import('@/data/markets-articles.json'),
        import('@/data/guides-articles.json')
      ]);

      const allArticles = [
        ...techData.articles,
        ...businessData.articles,
        ...marketData.articles,
        ...guidesData.articles
      ];

      const query = searchQuery.toLowerCase().trim();
      const words = query.split(/\s+/).filter(word => word.length > 1);
      
      // First, filter articles that actually contain search words
      const relevantArticles = allArticles.filter(article => {
        const title = (article.title || '').toLowerCase();
        const description = (article.description || '').toLowerCase();
        const author = (article.author || '').toLowerCase();
        const category = (article.category || '').toLowerCase();
        const specific = (article.specific || '').toLowerCase();
        
        // Check if any search word appears in any field
        return words.some(word => 
          title.includes(word) ||
          description.includes(word) ||
          author.includes(word) ||
          category.includes(word) ||
          specific.includes(word)
        );
      });
      
      // If no relevant articles found, show empty results
      if (relevantArticles.length === 0) {
        setResults([]);
        setTotalResults(0);
        return;
      }
      
      // Now score only the relevant articles
      const scoredResults = relevantArticles
        .map(article => {
          let score = 0;
          const title = article.title.toLowerCase();
          const description = article.description.toLowerCase();
          const author = article.author.toLowerCase();
          const category = article.category.toLowerCase();
          const specific = (article.specific || '').toLowerCase();
          
          // Calculate relevance score with better weighting
          words.forEach(word => {
            // Exact title match is best (weight: 20)
            if (title === query) score += 20;
            
            // Title contains word (weight: 10)
            if (title.includes(word)) score += 10;
            
            // Title starts with word (weight: 15)
            if (title.startsWith(word)) score += 15;
            
            // Description contains word (weight: 5)
            if (description.includes(word)) score += 5;
            
            // Category exact match (weight: 12)
            if (category === word) score += 12;
            
            // Category contains word (weight: 8)
            if (category.includes(word)) score += 8;
            
            // Specific/tags match (weight: 6)
            if (specific.includes(word)) score += 6;
            
            // Author match (weight: 4)
            if (author.includes(word)) score += 4;
            
            // Partial word matching for better recall
            if (word.length > 3) {
              // Try matching first few characters
              const partial = word.substring(0, Math.max(3, word.length - 1));
              if (title.includes(partial)) score += 3;
              if (description.includes(partial)) score += 2;
            }
          });
          
          // Additional scoring factors
          
          // Boost trending articles
          if (article.trending) score += 8;
          
          // Boost recent articles (assuming date format: "Month Day, Year")
          const articleDate = new Date(article.date);
          const currentDate = new Date();
          const daysDifference = Math.floor((currentDate.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDifference < 30) score += 5; // Articles from last month
          if (daysDifference < 7) score += 3; // Articles from last week
          
          // Boost if multiple words match
          if (words.length > 1) {
            const matchedWords = words.filter(word => 
              title.includes(word) || 
              description.includes(word) ||
              category.includes(word)
            );
            if (matchedWords.length === words.length) {
              score += 10; // All search words matched
            } else if (matchedWords.length > 1) {
              score += 5; // Multiple words matched
            }
          }
          
          return { ...article, score };
        })
        .sort((a, b) => b.score - a.score); // Sort by score descending
      
      setResults(scoredResults);
      setTotalResults(scoredResults.length);
    } catch (error) {
      console.error('Local search error:', error);
      setResults([]);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
    }
  }, [query, performSearch]);

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
      {query && !loading && (
        <div className={styles.resultsInfo}>
          <p>
            Found <strong>{totalResults}</strong> results for "{query}"
            {searchTime > 0 && <span className={styles.searchTime}> in {searchTime}ms</span>}
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
          <div className={styles.searchSuggestions}>
            <p>Suggestions:</p>
            <ul>
              <li>Try fewer keywords</li>
              <li>Check for typos</li>
              <li>Use more general terms</li>
              <li>Search by category (Tech, Business, etc.)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <>
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
                    {article.trending && (
                      <span className={styles.trendingBadge}>Trending</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Show relevance info */}
          {results.length > 1 && (
            <div className={styles.relevanceInfo}>
              <p>Results are sorted by relevance. Most relevant articles appear first.</p>
            </div>
          )}
        </>
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