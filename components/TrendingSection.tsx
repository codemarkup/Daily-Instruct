import React from 'react';
import styles from './TrendingSection.module.css';

const TrendingSection: React.FC = () => {
  const trendingArticles = [
    {
      id: 1,
      title: "AI Revolution: What's Next for Machine Learning",
      category: "Tech",
      author: "Dr. Amanda Zhou",
      date: "March 15, 2024",
      readTime: "9 min read",
      views: "12.4K",
      image: "/images/hero/8.png"
    },
    {
      id: 2,
      title: "The Metaverse Economy: Business Opportunities",
      category: "Business",
      author: "Marcus Johnson",
      date: "March 14, 2024",
      readTime: "11 min read",
      views: "9.8K",
      image: "/images/hero/9.png"
    },
    {
      id: 3,
      title: "Sustainable Investing: Profits with Purpose",
      category: "Markets",
      author: "Sophie Williams",
      date: "March 14, 2024",
      readTime: "7 min read",
      views: "8.3K",
      image: "/images/hero/10.png"
    },
    {
      id: 4,
      title: "Web3: The Future of Internet Ownership",
      category: "Tech",
      author: "Alex Rivera",
      date: "March 13, 2024",
      readTime: "14 min read",
      views: "15.2K",
      image: "/images/hero/11.png"
    },
    {
      id: 5,
      title: "Quantum Security: Protecting Digital Assets",
      category: "Science",
      author: "Dr. Benjamin Carter",
      date: "March 13, 2024",
      readTime: "10 min read",
      views: "7.6K",
      image: "/images/hero/12.png"
    }
  ];

  return (
    <section className={styles.trendingSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <p className={styles.sectionSubtitle}>Most popular articles this week</p>
        
        <div className={styles.trendingGrid}>
          {trendingArticles.map((article, index) => (
            <article key={article.id} className={styles.trendingCard}>
              <div className={styles.trendingNumber}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              
              <div className={styles.cardImage}>
                <img src={article.image} alt={article.title} />
                <div className={styles.cardCategory}>{article.category}</div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                
                <div className={styles.cardMeta}>
                  <span className={styles.cardAuthor}>{article.author}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.cardDate}>{article.date}</span>
                </div>
                
                <div className={styles.cardStats}>
                  <span className={styles.readTime}>{article.readTime}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.views}>{article.views} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;