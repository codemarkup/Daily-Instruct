"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInBusiness.module.css';

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

const TrendingInBusiness: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=business');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching business articles for trending:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessArticles();
  }, []);

  // Filter only trending articles
  const trendingArticles = articles
  .filter(article => Boolean(article.trending))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Limit to 6 trending articles

  if (loading) {
    return (
      <section className={styles.trendingInTech44}>
        <div className="container">
          <div className={styles.sectionHeader44}>
            <h2 className={styles.sectionTitle44}>Trending in Business</h2>
            <p className={styles.sectionSubtitle44}>Most popular business stories this week</p>
          </div>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading trending business articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingInTech44}>
        <div className="container">
          <div className={styles.sectionHeader44}>
            <h2 className={styles.sectionTitle44}>Trending in Business</h2>
            <p className={styles.sectionSubtitle44}>Most popular business stories this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending business articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingInTech44}>
      <div className="container">
        <div className={styles.sectionHeader44}>
          <h2 className={styles.sectionTitle44}>Trending in Business</h2>
          <p className={styles.sectionSubtitle44}>Most popular business stories this week</p>
        </div>
        
        <div className={styles.trendingGrid44}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink44}
            >
              <article className={styles.trendingCard44}>
                <div className={styles.trendingBadge44}>
                  #{index + 1}
                </div>
                
                <div className={styles.cardImage44}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image44}
                  />
                  {/* <div className={styles.categoryTag44}>{article.category}</div> */}
                </div>
                
                <div className={styles.cardContent44}>
                  <h3 className={styles.cardTitle44}>{article.title}</h3>
                  
                  <div className={styles.cardMeta44}>
                    <span className={styles.author44}>{article.author}</span>
                    <span className={styles.separator44}>•</span>
                    <span className={styles.date44}>{article.date}</span>
                  </div>
                  
                  <div className={styles.cardStats44}>
                    <span className={styles.readTime44}>{article.readTime}</span>
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

export default TrendingInBusiness;