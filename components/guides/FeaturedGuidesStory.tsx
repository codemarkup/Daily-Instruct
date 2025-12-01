import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedGuidesStory.module.css';

// Import from JSON
import guidesArticlesData from '@/data/guides-articles.json';

const FeaturedGuidesStory: React.FC = () => {
  // Get the first featured article
  const featuredArticle = guidesArticlesData.articles.find(article => article.featured);

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    return null; // or you can return a fallback component
  }

  return (
    <section className={styles.featuredTechStory222}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle222}>
            <div className={styles.articleImage222}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image222}
                priority
              />
              <div className={styles.categoryTag222}>Featured</div>
            </div>
            
            <div className={styles.articleContent222}>
              <h2 className={styles.articleTitle222}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription222}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta222}>
                <span className={styles.author222}>{featuredArticle.author}</span>
                <span className={styles.separator222}>•</span>
                <span className={styles.date222}>{featuredArticle.date}</span>
                <span className={styles.separator222}>•</span>
                <span className={styles.readTime222}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton222}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedGuidesStory;