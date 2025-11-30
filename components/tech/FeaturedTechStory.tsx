import React from 'react';
import Image from 'next/image';
import styles from './FeaturedTechStory.module.css';

const FeaturedTechStory: React.FC = () => {
  const featuredArticle = {
    title: "The AI Revolution: How Machine Learning is Reshaping Global Industries",
    description: "From healthcare to finance, artificial intelligence is creating unprecedented opportunities and challenges for businesses worldwide. Explore the latest developments and what they mean for the future.",
    author: "Dr. Sarah Chen",
    date: "March 16, 2024",
    readTime: "12 min read",
    image: "/images/tech/2.png",
    category: "Tech"
  };

  return (
    <section className={styles.featuredTechStory}>
      <div className="container">
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
            <div className={styles.categoryTag}>{featuredArticle.category}</div>
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
      </div>
    </section>
  );
};

export default FeaturedTechStory;