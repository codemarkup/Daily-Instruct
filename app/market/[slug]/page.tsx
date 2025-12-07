"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MarketHeader from "@/components/markets/MarketHeader";
import styles from "@/components/markets/MarketArticlesGrid.module.css";
import { use } from "react";

interface Article {
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
  featured: boolean;
  topStory: boolean;
  grid: boolean;
  homeFeatured: boolean;
  homeLatest: boolean;
  homeTrending: boolean;
  homeTopStory: boolean;
  content: Array<{
    type: 'paragraph' | 'heading' | 'quote';
    text: string;
    author?: string;
  }>;
}

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function MarketSubcategoryPage({ params }: SubcategoryPageProps) {
  // Unwrap the Promise using React.use()
  const { slug } = use(params);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchMarketArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=markets');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching market articles for subcategory page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0 && slug) {
      console.log("=== MARKET SUBCATEGORY DEBUG ===");
      console.log("Requested slug:", slug);
      
      // Create a map of all possible slugs
      const articleSlugMap = articles.map(article => {
        const articleSlug = article.specific
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        
        return {
          id: article.id,
          specific: article.specific,
          slug: articleSlug,
          matches: articleSlug === slug
        };
      });
      
      console.log("Article slug mapping:", articleSlugMap);
      console.log("Unique specifics:", [...new Set(articles.map(a => a.specific))]);

      const filtered = articles.filter((article) => {
        const articleSlug = article.specific
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        
        return articleSlug === slug;
      });

      console.log("Filtered articles count:", filtered.length);
      console.log("Filtered articles:", filtered.map(a => ({ title: a.title, specific: a.specific })));
      
      setFilteredArticles(filtered);
    }
  }, [articles, slug]);

  // Format the title for display
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (loading) {
    return (
      <div>
        <MarketHeader />
        <section className={styles.techArticlesGrid3}>
          <div className="container">
            <h2 className={styles.sectionTitle3}>
              {formattedTitle} Articles
            </h2>
            <div className={styles.loadingPlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading {formattedTitle} articles...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!slug) {
    return (
      <div>
        <MarketHeader />
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>
      </div>
    );
  }

  return (
    <div>
      <MarketHeader />

      <section className={styles.techArticlesGrid3}>
        <div className="container">
          <h2 className={styles.sectionTitle3}>
            {formattedTitle} Articles
          </h2>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "2rem", padding: "2rem" }}>
              <p>No articles found in "{formattedTitle}" category.</p>
              {articles.length > 0 && (
                <>
                  <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                    <strong>Requested Slug:</strong> {slug}
                  </p>
                  <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                    <strong>Available Specifics:</strong> {[...new Set(articles.map(a => a.specific))].join(', ')}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className={styles.articlesGrid3}>
              {filteredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className={styles.articleLink3}
                >
                  <article className={styles.articleCard3}>
                    <div className={styles.cardImage3}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={250}
                        className={styles.image3}
                      />
                      <div className={styles.categoryTag3}>{article.category}</div>
                      {article.trending && <div className={styles.trendingBadge3}>Trending</div>}
                    </div>

                    <div className={styles.cardContent3}>
                      <h3 className={styles.cardTitle3}>{article.title}</h3>
                      <p className={styles.cardDescription3}>{article.description}</p>

                      <div className={styles.cardMeta3}>
                        <span className={styles.cardAuthor3}>{article.author}</span>
                        <div className={styles.metaDetails3}>
                          <span className={styles.cardDate3}>{article.date}</span>
                          <span className={styles.cardReadTime3}>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}