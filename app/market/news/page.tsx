"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarketHeader from '@/components/markets/MarketHeader';
import styles from './article.module.css';

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

const MarketsNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortedArticles, setSortedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchMarketArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=markets');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching market articles for news page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      // Sort articles: featured first, then by date (newest first)
      const sorted = [...articles].sort((a, b) => {
        // Featured articles come first
        if (Boolean(a.featured) && !Boolean(b.featured)) return -1;
        if (!Boolean(a.featured) && Boolean(b.featured)) return 1;
        
        // Then sort by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setSortedArticles(sorted);
    }
  }, [articles]);

  if (loading) {
    return (
      <div className={styles.marketsNewsPage}>
        <section className={styles.newsHero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>All Market News</h1>
              <p className={styles.heroSubtitle}>
                Complete coverage of financial markets, stocks, crypto, and economic trends
              </p>
            </div>
          </div>
        </section>

        <section className={styles.allArticles}>
          <div className="container">
            <div className={styles.loadingPlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading market articles...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.marketsNewsPage}>
      <MarketHeader />
      
      <section className={styles.newsHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>All Market News</h1>
            <p className={styles.heroSubtitle}>
              Complete coverage of financial markets, stocks, crypto, and economic trends
            </p>
          </div>
        </div>
      </section>

      <section className={styles.allArticles}>
        <div className="container">
          {sortedArticles.length === 0 ? (
            <div className={styles.noArticles}>
              <p>No market articles available at the moment.</p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {sortedArticles.map((article) => (
                <Link 
                  key={article.slug} 
                  href={`/articles/${article.slug}`}
                  className={`${styles.articleLink} ${Boolean(article.featured) ? styles.featuredArticle : ''} ${Boolean(article.topStory) ? styles.topStoryArticle : ''}`}
                >
                  <article className={styles.articleCard}>
                    <div className={styles.cardImage}>
                      <Image 
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={250}
                        className={styles.image}
                      />
                      <div className={styles.articleBadges}>
                        {Boolean(article.featured) && <div className={styles.featuredBadge}>Featured</div>}
                        {Boolean(article.topStory) && <div className={styles.topStoryBadge}>Top Story</div>}
                      </div>
                      {/* <div className={styles.categoryTag}>{article.category}</div> */}
                    </div>
                    
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{article.title}</h3>
                      <p className={styles.cardDescription}>{article.description}</p>
                      
                      <div className={styles.cardMeta}>
                        <span className={styles.cardAuthor}>{article.author}</span>
                        <div className={styles.metaDetails}>
                          <span className={styles.cardDate}>{article.date}</span>
                          <span className={styles.cardReadTime}>{article.readTime}</span>
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
};

export default MarketsNewsPage;