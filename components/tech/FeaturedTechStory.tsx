import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedTechStory.module.css';

// Import from JSON
import techArticlesData from '@/data/tech-articles.json';

const FeaturedTechStory: React.FC = () => {
  // Get the first featured article
  const featuredArticle = techArticlesData.articles.find(article => article.featured);

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    return null; // or you can return a fallback component
  }

  return (
    <section className={styles.featuredTechStory}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle}>
            <div className={styles.articleImage}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image}
                priority
              />
              <div className={styles.categoryTag}>Featured</div>
            </div>
            
            <div className={styles.articleContent}>
              <h2 className={styles.articleTitle}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta}>
                <span className={styles.author}>{featuredArticle.author}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.date}>{featuredArticle.date}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedTechStory;