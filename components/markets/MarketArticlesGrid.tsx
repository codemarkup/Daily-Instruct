import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MarketArticlesGrid.module.css';


const MarketArticlesGrid = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('markets-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Get only articles that should appear in the grid (limit to 6 for homepage)
  const gridArticles = articles
  .filter(article => Boolean(article.grid))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
  .slice(0, 6); // Show only 6 articles on homepage

  if (gridArticles.length === 0) {
    return (
      <section className={styles.techArticlesGrid3}>
        <div className="container">
          <h2 className={styles.sectionTitle3}>Latest in Markets</h2>
          <div className={styles.noArticles}>
            <p>No market articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techArticlesGrid3}>
      <div className="container">
        <h2 className={styles.sectionTitle3}>Latest in Markets</h2>
        
        <div className={styles.articlesGrid3}>
          {gridArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug}`}
              className={styles.articleLink3}
            >
              <article className={styles.articleCard3}>
                <div className={styles.cardImage3}>
                  <Image 
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={250}
                    className={styles.image3}
                  />
                  {/* <div className={styles.categoryTag3}>{article.category}</div> */}
                  {article.trending && <div className={styles.trendingBadge3}>Trending</div>}
                </div>
                
                <div className={styles.cardContent3}>
                  <h3 className={styles.cardTitle3}>{article.title}</h3>
                  <p className={styles.cardDescription3}>{article.description}</p>
                  
                  <div className={styles.cardMeta3}>
                    <span className={styles.cardAuthor3}>{article.author}</span>
                    <div className={styles.metaDetails3}>
                      <span className={styles.cardDate3}>{article.date}</span>
                      <span className={styles.cardReadTime3}>{article.readTime}</span>
                    </div>
                  </div>
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta3}>
                    <div className={styles.mobileAuthor3}>{article.author}</div>
                    <div className={styles.mobileDate3}>{article.date}</div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer3}>
          <Link href="/market/news" className={styles.loadMoreBtn3}>
            View All Market Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MarketArticlesGrid;