import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './GuidesArticlesGrid.module.css';

// Import from JSON instead of local array
import guidesArticlesData from '@/data/guides-articles.json';

const GuidesArticlesGrid: React.FC = () => {
  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = guidesArticlesData.articles
    .filter(article => article.grid)
    .slice(0, 6); // Show only 6 articles on homepage

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
                  {article.trending && <div className={styles.trendingBadge333}>Trending</div>}
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