"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './GuidesArticlesGrid.module.css';

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

const GuidesArticlesGrid: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidesArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=guides');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching guides articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuidesArticles();
  }, []);

  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = articles
  .filter(article => Boolean(article.grid))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Show only 6 articles on homepage

  if (loading) {
    return (
      <section className={styles.techArticlesGrid333}>
        <div className="container">
          <h2 className={styles.sectionTitle333}>Latest in Guides</h2>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading guides...</p>
          </div>
        </div>
      </section>
    );
  }

  if (gridArticles.length === 0) {
    return (
      <section className={styles.techArticlesGrid333}>
        <div className="container">
          <h2 className={styles.sectionTitle333}>Latest in Guides</h2>
          <div className={styles.noArticles}>
            <p>No guides available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techArticlesGrid333}>
      <div className="container">
        <h2 className={styles.sectionTitle333}>Latest in Guides</h2>
        
        <div className={styles.articlesGrid333}>
          {gridArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.articleLink333}
            >
              <article className={styles.articleCard333}>
                <div className={styles.cardImage333}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={250}
                    className={styles.image333}
                  />
                  {/* <div className={styles.categoryTag333}>{article.category}</div> */}
                  {Boolean(article.trending) && <div className={styles.trendingBadge333}>Trending</div>}
                </div>
                
                <div className={styles.cardContent333}>
                  <h3 className={styles.cardTitle333}>{article.title}</h3>
                  <p className={styles.cardDescription333}>{article.description}</p>
                  
                  <div className={styles.cardMeta333}>
                    <span className={styles.cardAuthor333}>{article.author}</span>
                    <div className={styles.metaDetails333}>
                      <span className={styles.cardDate333}>{article.date}</span>
                      <span className={styles.cardReadTime333}>{article.readTime}</span>
                    </div>
                  </div>
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta333}>
                    <div className={styles.mobileAuthor333}>{article.author}</div>
                    <div className={styles.mobileDate333}>{article.date}</div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer333}>
          <Link href="/guides/news" className={styles.loadMoreBtn333}>
            View All Guides
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GuidesArticlesGrid;