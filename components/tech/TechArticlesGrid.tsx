import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TechArticlesGrid.module.css';


const TechArticlesGrid = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('tech-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Filter for grid articles - handles boolean true, string "true", or any truthy value
  const gridArticles = articles
  .filter(article => Boolean(article.grid)) // Convert to boolean: true, "true", 1, etc. all become true
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6);

  if (gridArticles.length === 0) {
    return (
      <section className={styles.techArticlesGrid}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest in Technology</h2>
          <div className={styles.noArticles}>
            <p>No tech articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta}>
                    <div className={styles.mobileAuthor}>{article.author}</div>
                    <div className={styles.mobileDate}>{article.date}</div>
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