import React from 'react';
import Image from 'next/image';
import styles from './FeaturedBusinessStory.module.css';

const FeaturedBusinessStory: React.FC = () => {
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
    <section className={styles.featuredTechStory22}>
      <div className="container">
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
            <div className={styles.categoryTag22}>{featuredArticle.category}</div>
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
      </div>
    </section>
  );
};

export default FeaturedBusinessStory;