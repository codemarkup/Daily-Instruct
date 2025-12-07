"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TechArticlesGrid.module.css';

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

const TechArticlesGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=tech');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching tech articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechArticles();
  }, []);

  // Filter for grid articles - handles boolean true, string "true", or any truthy value
  const gridArticles = articles
    .filter(article => Boolean(article.grid)) // Convert to boolean: true, "true", 1, etc. all become true
    .slice(0, 6);

  if (loading) {
    return (
      <section className={styles.techArticlesGrid}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest in Technology</h2>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading tech articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (gridArticles.length === 0) {
    return (
      <section className={styles.techArticlesGrid}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest in Technology</h2>
          <div className={styles.noArticles}>
            <p>No tech articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techArticlesGrid}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Latest in Technology</h2>
        
        <div className={styles.articlesGrid}>
          {gridArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.articleLink}
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
                  {article.trending && <div className={styles.trendingBadge}>Trending</div>}
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
        
        <div className={styles.loadMoreContainer}>
          <Link href="/tech/news" className={styles.loadMoreBtn}>
            View All Tech Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechArticlesGrid;