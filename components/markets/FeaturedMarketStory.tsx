import React from 'react';
import Image from 'next/image';
import styles from './FeaturedMarketStory.module.css';

const FeaturedMarketStory: React.FC = () => {
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
    <section className={styles.featuredTechStory1}>
      <div className="container">
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
            <div className={styles.categoryTag1}>{featuredArticle.category}</div>
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
      </div>
    </section>
  );
};

export default FeaturedMarketStory;