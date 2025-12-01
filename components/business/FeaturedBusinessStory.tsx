import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedBusinessStory.module.css';

// Import from JSON
import businessArticlesData from '@/data/business-articles.json';

const FeaturedBusinessStory: React.FC = () => {
  // Get the first featured article
  const featuredArticle = businessArticlesData.articles.find(article => article.featured);

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    return null; // or you can return a fallback component
  }

  return (
    <section className={styles.featuredTechStory22}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle22}>
            <div className={styles.articleImage22}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image22}
                priority
              />
              <div className={styles.categoryTag22}>Featured</div>
            </div>
            
            <div className={styles.articleContent22}>
              <h2 className={styles.articleTitle22}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription22}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta22}>
                <span className={styles.author22}>{featuredArticle.author}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.date22}>{featuredArticle.date}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.readTime22}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton22}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedBusinessStory;