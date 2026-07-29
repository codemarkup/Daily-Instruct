import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInTech.module.css';


const TrendingInTech = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('tech-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Filter only trending articles - use Boolean() to handle duplicates
  const trendingArticles = articles
  .filter(article => Boolean(article.trending))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Limit to 6 trending articles

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingInTech}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending in Tech</h2>
            <p className={styles.sectionSubtitle}>Most popular tech stories this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending tech articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
                    <span className={styles.cardReadTime}>{article.readTime}</span>
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