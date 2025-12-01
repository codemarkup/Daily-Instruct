import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BusinessHeader from '@/components/business/BusinessHeader';
import styles from './news.module.css';
import businessArticlesData from '@/data/business-articles.json';

const BusinessNewsPage: React.FC = () => {
  // Sort articles: featured first, then by date (newest first)
  const sortedArticles = [...businessArticlesData.articles].sort((a, b) => {
    // Featured articles come first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className={styles.businessNewsPage}>
      {/* <BusinessHeader /> */}
      
      <section className={styles.newsHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>All Business News</h1>
            <p className={styles.heroSubtitle}>
              Complete coverage of the latest in business, markets, and industry trends
            </p>
          </div>
        </div>
      </section>

      <section className={styles.allArticles}>
        <div className="container">
          <div className={styles.articlesGrid}>
            {sortedArticles.map((article) => (
              <Link 
                key={article.id} 
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

export default BusinessNewsPage;