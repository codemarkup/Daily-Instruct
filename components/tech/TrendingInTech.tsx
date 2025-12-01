import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInTech.module.css';

// Import from JSON
import techArticlesData from '@/data/tech-articles.json';

const TrendingInTech: React.FC = () => {
  // Filter only trending articles
  const trendingArticles = techArticlesData.articles
    .filter(article => article.trending)
    .slice(0, 6); // Limit to 6 trending articles

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
                    <span className={styles.readTime}>{article.readTime}</span>
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