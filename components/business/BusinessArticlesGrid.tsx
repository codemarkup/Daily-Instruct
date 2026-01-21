"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BusinessArticlesGrid.module.css';

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

const BusinessArticlesGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=business');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching business articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessArticles();
  }, []);

  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = articles
  .filter(article => Boolean(article.grid))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Show only 6 articles on homepage

  if (loading) {
    return (
      <section className={styles.techArticlesGrid33}>
        <div className="container">
          <h2 className={styles.sectionTitle33}>Latest in Business</h2>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading business articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (gridArticles.length === 0) {
    return (
      <section className={styles.techArticlesGrid33}>
        <div className="container">
          <h2 className={styles.sectionTitle33}>Latest in Business</h2>
          <div className={styles.noArticles}>
            <p>No business articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techArticlesGrid33}>
      <div className="container">
        <h2 className={styles.sectionTitle33}>Latest in Business</h2>
        
        <div className={styles.articlesGrid33}>
          {gridArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.articleLink33}
            >
              <article className={styles.articleCard33}>
                <div className={styles.cardImage33}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={250}
                    className={styles.image33}
                  />
                  {/* <div className={styles.categoryTag33}>{article.category}</div> */}
                  {Boolean(article.trending) && <div className={styles.trendingBadge33}>Trending</div>}
                </div>
                
                <div className={styles.cardContent33}>
                  <h3 className={styles.cardTitle33}>{article.title}</h3>
                  <p className={styles.cardDescription33}>{article.description}</p>
                  
                  <div className={styles.cardMeta33}>
                    <span className={styles.cardAuthor33}>{article.author}</span>
                    <div className={styles.metaDetails33}>
                      <span className={styles.cardDate33}>{article.date}</span>
                      <span className={styles.cardReadTime33}>{article.readTime}</span>
                    </div>
                  </div>
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta33}>
                    <div className={styles.mobileAuthor33}>{article.author}</div>
                    <div className={styles.mobileDate33}>{article.date}</div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer33}>
          <Link href="/business/news" className={styles.loadMoreBtn33}>
            View All Business Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BusinessArticlesGrid;