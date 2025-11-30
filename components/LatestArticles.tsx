import React from 'react';
import styles from './LatestArticles.module.css';
import Image from 'next/image';

const LatestArticles: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "The Rise of Sustainable Technology in Modern Business",
      category: "Business",
      description: "Exploring how companies are integrating eco-friendly solutions to drive innovation and reduce environmental impact.",
      author: "Michael Chen",
      date: "March 14, 2024",
      readTime: "6 min read",
      image: "/images/hero/2.png"
    },
    {
      id: 2,
      title: "Understanding Blockchain's Impact on Financial Markets",
      category: "Markets",
      description: "A deep dive into how blockchain technology is reshaping traditional financial systems and creating new opportunities.",
      author: "Sarah Johnson",
      date: "March 14, 2024",
      readTime: "10 min read",
      image: "/images/hero/3.png"
    },
    {
      id: 3,
      title: "The Psychology Behind Successful Startup Founders",
      category: "Startups",
      description: "What mental frameworks and habits distinguish the most successful entrepreneurs from the rest.",
      author: "David Park",
      date: "March 13, 2024",
      readTime: "7 min read",
      image: "/images/hero/4.png"
    },
    {
      id: 4,
      title: "Quantum Computing: The Next Frontier in Tech",
      category: "Tech",
      description: "How quantum computers are solving problems that were previously thought to be impossible.",
      author: "Dr. Emily Watson",
      date: "March 13, 2024",
      readTime: "12 min read",
      image: "/images/hero/5.png"
    },
    {
      id: 5,
      title: "Global Economic Trends to Watch in 2024",
      category: "Markets",
      description: "Key economic indicators and trends that will shape global markets in the coming year.",
      author: "Robert Kim",
      date: "March 12, 2024",
      readTime: "8 min read",
      image: "/images/hero/6.png"
    },
    {
      id: 6,
      title: "The Future of Remote Work: Beyond the Pandemic",
      category: "Business",
      description: "How remote work is evolving and what it means for the future of corporate culture.",
      author: "Lisa Martinez",
      date: "March 12, 2024",
      readTime: "5 min read",
      image: "/images/hero/7.png"
    }
  ];

  return (
    <section className={styles.latestArticles}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Latest Articles</h2>
        
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <article key={article.id} className={styles.articleCard}>
              <div className={styles.cardImage}>
                <img src={article.image} alt={article.title} />
                <div className={styles.cardCategory}>{article.category}</div>
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
          ))}
        </div>
        
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn}>Load More Articles</button>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;