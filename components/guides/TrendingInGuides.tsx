"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInGuides.module.css';

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

const TrendingInGuides: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidesArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=guides');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching guides articles for trending:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuidesArticles();
  }, []);

  // Filter only trending articles
  const trendingArticles = articles
  .filter(article => Boolean(article.trending))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Limit to 6 trending articles

  if (loading) {
    return (
      <section className={styles.trendingInTech444}>
        <div className="container">
          <div className={styles.sectionHeader444}>
            <h2 className={styles.sectionTitle444}>Trending in Guides</h2>
            <p className={styles.sectionSubtitle444}>Most popular guides this week</p>
          </div>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading trending guides...</p>
          </div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingInTech444}>
        <div className="container">
          <div className={styles.sectionHeader444}>
            <h2 className={styles.sectionTitle444}>Trending in Guides</h2>
            <p className={styles.sectionSubtitle444}>Most popular guides this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending guides at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingInTech444}>
      <div className="container">
        <div className={styles.sectionHeader444}>
          <h2 className={styles.sectionTitle444}>Trending in Guides</h2>
          <p className={styles.sectionSubtitle444}>Most popular guides this week</p>
        </div>
        
        <div className={styles.trendingGrid444}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink444}
            >
              <article className={styles.trendingCard444}>
                <div className={styles.trendingBadge444}>
                  #{index + 1}
                </div>
                
                <div className={styles.cardImage444}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image444}
                  />
                  {/* <div className={styles.categoryTag444}>{article.category}</div> */}
                </div>
                
                <div className={styles.cardContent444}>
                  <h3 className={styles.cardTitle444}>{article.title}</h3>
                  
                  <div className={styles.cardMeta444}>
                    <span className={styles.author444}>{article.author}</span>
                    <span className={styles.separator444}>•</span>
                    <span className={styles.date444}>{article.date}</span>
                  </div>
                  
                  <div className={styles.cardStats444}>
                    <span className={styles.readTime444}>{article.readTime}</span>
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

export default TrendingInGuides;