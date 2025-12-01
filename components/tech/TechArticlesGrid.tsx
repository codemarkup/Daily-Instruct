import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TechArticlesGrid.module.css';

// Import from JSON instead of local array
import techArticlesData from '@/data/tech-articles.json';

const TechArticlesGrid: React.FC = () => {
  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = techArticlesData.articles
    .filter(article => article.grid)
    .slice(0, 6); // Show only 6 articles on homepage

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
                  {/* <div className={styles.categoryTag}>{article.category}</div> */}
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