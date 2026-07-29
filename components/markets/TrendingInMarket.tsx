import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TrendingInMarket.module.css';


const TrendingInMarket = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('markets-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Filter only trending articles
  const trendingArticles = articles
  .filter(article => Boolean(article.trending))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Limit to 6 trending articles

  if (trendingArticles.length === 0) {
    return (
      <section className={styles.trendingInTech6}>
        <div className="container">
          <div className={styles.sectionHeader6}>
            <h2 className={styles.sectionTitle6}>Trending in Markets</h2>
            <p className={styles.sectionSubtitle6}>Most popular market stories this week</p>
          </div>
          <div className={styles.noArticles}>
            <p>No trending market articles at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.trendingInTech6}>
      <div className="container">
        <div className={styles.sectionHeader6}>
          <h2 className={styles.sectionTitle6}>Trending in Markets</h2>
          <p className={styles.sectionSubtitle6}>Most popular market stories this week</p>
        </div>
        
        <div className={styles.trendingGrid6}>
          {trendingArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.trendingLink6}
            >
              <article className={styles.trendingCard6}>
                <div className={styles.trendingBadge6}>
                  #{index + 1}
                </div>
                
                <div className={styles.cardImage6}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={180}
                    className={styles.image6}
                  />
                  {/* <div className={styles.categoryTag6}>{article.category}</div> */}
                </div>
                
                <div className={styles.cardContent6}>
                  <h3 className={styles.cardTitle6}>{article.title}</h3>
                  
                  <div className={styles.cardMeta6}>
                    <span className={styles.author6}>{article.author}</span>
                    <span className={styles.separator6}>•</span>
                    <span className={styles.date6}>{article.date}</span>
                  </div>
                  
                  <div className={styles.cardStats6}>
                    <span className={styles.readTime6}>{article.readTime}</span>
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

export default TrendingInMarket;