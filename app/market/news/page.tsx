import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarketHeader from '@/components/markets/MarketHeader';
import styles from './article.module.css';
import marketArticlesData from '@/data/markets-articles.json';

const MarketsNewsPage: React.FC = () => {
  // Sort articles: featured first, then by date (newest first)
  const sortedArticles = [...marketArticlesData.articles].sort((a, b) => {
    // Featured articles come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className={styles.marketsNewsPage}>
      {/* <MarketsHeader /> */}
      
      <section className={styles.newsHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>All Market News</h1>
            <p className={styles.heroSubtitle}>
              Complete coverage of financial markets, stocks, crypto, and economic trends
            </p>
          </div>
        </div>
      </section>

      <section className={styles.allArticles}>
        <div className="container">
          <div className={styles.articlesGrid}>
            {sortedArticles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className={`${styles.articleLink} ${article.featured ? styles.featuredArticle : ''} ${article.topStory ? styles.topStoryArticle : ''}`}
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
                    <div className={styles.articleBadges}>
                      {article.featured && <div className={styles.featuredBadge}>Featured</div>}
                      {article.topStory && <div className={styles.topStoryBadge}>Top Story</div>}
                    </div>
                    {/* <div className={styles.categoryTag}>{article.category}</div> */}
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
        </div>
      </section>
    </div>
  );
};

export default MarketsNewsPage;