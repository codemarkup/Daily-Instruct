import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInGuides.module.css';

// Import from JSON
import guidesArticlesData from '@/data/guides-articles.json';

const TrendingInGuides: React.FC = () => {
  // Filter only trending articles
  const trendingArticles = guidesArticlesData.articles
    .filter(article => article.trending)
    .slice(0, 6); // Limit to 6 trending articles

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