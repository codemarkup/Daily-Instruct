"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInTech.module.css';

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

const TrendingInTech: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=tech');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching tech articles for trending:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechArticles();
  }, []);

  // Filter only trending articles - use Boolean() to handle duplicates
  const trendingArticles = articles
  .filter(article => Boolean(article.trending))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Limit to 6 trending articles

  if (loading) {
    return (
      <section className={styles.trendingInTech}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending in Tech</h2>
            <p className={styles.sectionSubtitle}>Most popular tech stories this week</p>
          </div>
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
      <section className={styles.trendingInTech}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending in Tech</h2>
            <p className={styles.sectionSubtitle}>Most popular tech stories this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending tech articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingInTech}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending in Tech</h2>
          <p className={styles.sectionSubtitle}>Most popular tech stories this week</p>
        </div>
        
        <div className={styles.trendingGrid}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink}
            >
              <article className={styles.trendingCard}>
                <div className={styles.trendingBadge}>
                  #{index + 1}
                </div>
                
                <div className={styles.cardImage}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image}
                  />
                  {/* <div className={styles.categoryTag}>{article.category}</div> */}
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  
                  <div className={styles.cardMeta}>
                    <span className={styles.author}>{article.author}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>{article.date}</span>
                  </div>
                  
                  <div className={styles.cardStats}>
                    <span className={styles.cardReadTime}>{article.readTime}</span>
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

export default TrendingInTech;