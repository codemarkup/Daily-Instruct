import React from 'react';
import styles from './TrendingSection.module.css';
import Image from 'next/image';
import Link from 'next/link';
import techArticlesData from '@/data/tech-articles.json';
import businessArticlesData from '@/data/business-articles.json';

const TrendingSection: React.FC = () => {
  // Combine articles from both categories and get trending articles for homepage
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles
  ];
  
  const trendingArticles = allArticles
    .filter(article => article.homeTrending)
    .slice(0, 10);

  return (
    <section className={styles.trendingSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <p className={styles.sectionSubtitle}>Most popular articles this week</p>
        
        <div className={styles.trendingGrid}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.slug} 
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
                  
                  <div className={styles.cardMeta}>
                    <span className={styles.cardAuthor}>{article.author}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.cardDate}>{article.date}</span>
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