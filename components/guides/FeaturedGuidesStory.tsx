import React from 'react';
import Image from 'next/image';
import styles from './FeaturedGuidesStory.module.css';

const FeaturedGuidesStory: React.FC = () => {
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
    <section className={styles.featuredTechStory222}>
      <div className="container">
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
            <div className={styles.categoryTag222}>{featuredArticle.category}</div>
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
      </div>
    </section>
  );
};

export default FeaturedGuidesStory;