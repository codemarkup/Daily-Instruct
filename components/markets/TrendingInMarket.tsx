"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInMarket.module.css';

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

const TrendingInMarket: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=markets');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching market articles for trending:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketArticles();
  }, []);

  // Filter only trending articles
  const trendingArticles = articles
    .filter(article => Boolean(article.trending))
    .slice(0, 6); // Limit to 6 trending articles

  if (loading) {
    return (
      <section className={styles.trendingInTech6}>
        <div className="container">
          <div className={styles.sectionHeader6}>
            <h2 className={styles.sectionTitle6}>Trending in Markets</h2>
            <p className={styles.sectionSubtitle6}>Most popular market stories this week</p>
          </div>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading trending market articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingInTech6}>
        <div className="container">
          <div className={styles.sectionHeader6}>
            <h2 className={styles.sectionTitle6}>Trending in Markets</h2>
            <p className={styles.sectionSubtitle6}>Most popular market stories this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending market articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingInTech6}>
      <div className="container">
        <div className={styles.sectionHeader6}>
          <h2 className={styles.sectionTitle6}>Trending in Markets</h2>
          <p className={styles.sectionSubtitle6}>Most popular market stories this week</p>
        </div>
        
        <div className={styles.trendingGrid6}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink6}
            >
              <article className={styles.trendingCard6}>
                <div className={styles.trendingBadge6}>
                  #{index + 1}
                </div>
                
                <div className={styles.cardImage6}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image6}
                  />
                  {/* <div className={styles.categoryTag6}>{article.category}</div> */}
                </div>
                
                <div className={styles.cardContent6}>
                  <h3 className={styles.cardTitle6}>{article.title}</h3>
                  
                  <div className={styles.cardMeta6}>
                    <span className={styles.author6}>{article.author}</span>
                    <span className={styles.separator6}>•</span>
                    <span className={styles.date6}>{article.date}</span>
                  </div>
                  
                  <div className={styles.cardStats6}>
                    <span className={styles.readTime6}>{article.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingInMarket;