import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './all-articles.module.css';
import techArticlesData from '@/data/tech-articles.json';
import businessArticlesData from '@/data/business-articles.json';
import marketArticlesData from '@/data/markets-articles.json';
import guidesArticlesData from '@/data/guides-articles.json';

const AllArticlesPage: React.FC = () => {
  // Combine articles from ALL categories
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles,
    ...marketArticlesData.articles,
    ...guidesArticlesData.articles
  ];
  
  // Get all articles with homeLatest flag (could also remove filter to show ALL articles)
  const latestArticles = allArticles
    .filter(article => article.homeLatest)
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className={styles.allArticlesPage}>
      <section className={styles.newsHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>All Latest Articles</h1>
            <p className={styles.heroSubtitle}>
              Browse through the latest content from all categories: Tech, Business, Markets, and Guides
            </p>
            {/* <div className={styles.categoryFilters}>
              <span className={styles.filterTag}>Tech</span>
              <span className={styles.filterTag}>Business</span>
              <span className={styles.filterTag}>Markets</span>
              <span className={styles.filterTag}>Guides</span>
            </div> */}
          </div>
        </div>
      </section>

      <section className={styles.allArticlesSection}>
        <div className="container">
          <div className={styles.articlesGrid}>
            {latestArticles.map((article) => (
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
                      {/* <div className={styles.categoryBadge}>{article.category}</div> */}
                      {article.featured && <div className={styles.featuredBadge}>Featured</div>}
                      {article.topStory && <div className={styles.topStoryBadge}>Top Story</div>}
                    </div>
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

export default AllArticlesPage;