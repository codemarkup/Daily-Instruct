import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BusinessArticlesGrid.module.css';

// Import from JSON instead of local array
import businessArticlesData from '@/data/business-articles.json';

const BusinessArticlesGrid: React.FC = () => {
  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = businessArticlesData.articles
    .filter(article => article.grid)
    .slice(0, 6); // Show only 6 articles on homepage

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
                  {article.trending && <div className={styles.trendingBadge33}>Trending</div>}
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