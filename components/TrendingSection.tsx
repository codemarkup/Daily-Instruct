import React from 'react';
import styles from './TrendingSection.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { getAllArticles, Article } from '../lib/json-utils';

const TrendingSection = async () => {
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
  } catch (error) {
    console.error('Error fetching trending articles:', error);
  }

  // FIXED: Added sorting by date (newest first)
  const trendingArticles = articles
    .filter(article => article.homeTrending)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .slice(0, 10);

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