import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedMarketStory.module.css';

// Import from JSON
import marketArticlesData from '@/data/markets-articles.json';

const FeaturedMarketStory: React.FC = () => {
  // Get the first featured article
  const featuredArticle = marketArticlesData.articles.find(article => article.featured);

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    return null; // or you can return a fallback component
  }

  return (
    <section className={styles.featuredTechStory1}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}> {/* FIXED: Changed /market/ to /articles/ */}
          <article className={styles.featuredArticle1}>
            <div className={styles.articleImage1}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image1}
                priority
              />
              <div className={styles.categoryTag1}>Featured</div>
            </div>
            
            <div className={styles.articleContent1}>
              <h2 className={styles.articleTitle1}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription1}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta1}>
                <span className={styles.author1}>{featuredArticle.author}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.date1}>{featuredArticle.date}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.readTime1}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton1}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedMarketStory;