"use client";

import React, { useEffect, useState } from 'react';
import styles from './TrendingSection.module.css';
import Image from 'next/image';
import Link from 'next/link';

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

const TrendingSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        // Fetch from all categories
        const [techRes, businessRes, marketRes, guidesRes] = await Promise.all([
          fetch('/api/github/articles?category=tech'),
          fetch('/api/github/articles?category=business'),
          fetch('/api/github/articles?category=markets'),
          fetch('/api/github/articles?category=guides')
        ]);

        const [techData, businessData, marketData, guidesData] = await Promise.all([
          techRes.json(),
          businessRes.json(),
          marketRes.json(),
          guidesRes.json()
        ]);

        // Combine all articles
        const allArticles = [
          ...(techData.articles || []),
          ...(businessData.articles || []),
          ...(marketData.articles || []),
          ...(guidesData.articles || [])
        ];

        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllArticles();
  }, []);

  // FIXED: Added sorting by date (newest first)
  const trendingArticles = articles
    .filter(article => article.homeTrending)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .slice(0, 10);

  if (loading) {
    return (
      <section className={styles.trendingSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Trending Now</h2>
          <p className={styles.sectionSubtitle}>Most popular articles this week</p>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading trending articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Trending Now</h2>
          <p className={styles.sectionSubtitle}>Most popular articles this week</p>
          <div className={styles.noArticles}>
            <p>No trending articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <p className={styles.sectionSubtitle}>Most popular articles this week</p>
        
        <div className={styles.trendingGrid}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={`${article.category}-${article.id}`} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink}
            >
              <article className={styles.trendingCard}>
                <div className={styles.trendingNumber}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                <div className={styles.cardImage}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image}
                  />
                  <div className={styles.cardCategory}>{article.category}</div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  
                  {/* Desktop meta - shown on larger screens */}
                  <div className={styles.cardMeta}>
                    <span className={styles.cardAuthor}>{article.author}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.cardDate}>{article.date}</span>
                  </div>
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta}>
                    <div className={styles.mobileAuthor}>{article.author}</div>
                    <div className={styles.mobileDate}>{article.date}</div>
                  </div>
                  
                  <div className={styles.cardStats}>
                    <span className={styles.readTime}>{article.readTime}</span>
                    {article.trending && <span className={styles.views}>Trending</span>}
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

export default TrendingSection;