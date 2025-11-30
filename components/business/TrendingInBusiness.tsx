import React from 'react';
import Image from 'next/image';
import styles from './TrendingInBusiness.module.css';
import { businessArticles } from './BusinessArticlesGrid';

const TrendingInBusiness: React.FC = () => {
  // ✅ Filter only trending business articles
  const trendingArticles = businessArticles
    .filter(article => article.trending)
    .slice(0, 6); // Limit to 6 trending articles

  return (
    <section className={styles.trendingInTech44}>
      <div className="container">
        <div className={styles.sectionHeader44}>
          <h2 className={styles.sectionTitle44}>Trending in Business</h2>
          <p className={styles.sectionSubtitle44}>Most popular business stories this week</p>
        </div>
        
        <div className={styles.trendingGrid44}>
          {trendingArticles.map((article, index) => (
            <article key={article.id} className={styles.trendingCard44}>
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
                <div className={styles.categoryTag44}>{article.category}</div>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingInBusiness;