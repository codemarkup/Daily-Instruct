import React from 'react';
import Image from 'next/image';
import styles from './BusinessArticlesGrid.module.css';

export const businessArticles = [
  {
    id: 1,
    title: "Global Supply Chain Revolution: How AI is Transforming Logistics",
    description: "Companies worldwide are leveraging artificial intelligence to optimize supply chains and reduce operational costs by up to 40%.",
    author: "Michael Chen",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Market Trends", 
    trending: true
  },
  {
    id: 2,
    title: "The Future of Remote Work: Hybrid Models That Actually Work",
    description: "Research reveals which hybrid work strategies are boosting productivity and employee satisfaction across industries.",
    author: "Sarah Rodriguez",
    date: "March 14, 2024",
    readTime: "6 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Work & Productivity", 
    trending: true
  },
  {
    id: 3,
    title: "Sustainable Business Practices That Drive Profitability",
    description: "How forward-thinking companies are turning environmental responsibility into competitive advantage and revenue growth.",
    author: "James Wilson",
    date: "March 14, 2024",
    readTime: "10 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Business Tips", 
    trending: false
  },
  {
    id: 4,
    title: "Digital Transformation: Why 60% of Initiatives Still Fail",
    description: "Analysis of common pitfalls and strategies for successful digital transformation in established enterprises.",
    author: "Emma Thompson",
    date: "March 13, 2024",
    readTime: "7 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Company Updates",
    trending: true
  },
  {
    id: 5,
    title: "The Rise of Corporate Venture Capital in Tech Innovation",
    description: "How major corporations are investing in startups to drive innovation and stay ahead of market disruptions.",
    author: "David Park",
    date: "March 13, 2024",
    readTime: "9 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Startup News", 
    trending: false
  },
  {
    id: 6,
    title: "Leadership in Crisis: What Separates Good Companies from Great Ones",
    description: "Case studies of business leaders who successfully navigated economic uncertainty and emerged stronger.",
    author: "Lisa Martinez",
    date: "March 12, 2024",
    readTime: "11 min read",
    image: "/images/tech/2.png",
    category: "Business",
    specific: "Personal Finance",
    trending: true
  }
];

const BusinessArticlesGrid: React.FC = () => {
  return (
    <section className={styles.techArticlesGrid33}>
      <div className="container">
        <h2 className={styles.sectionTitle33}>Latest in Business</h2>
        
        <div className={styles.articlesGrid33}>
          {businessArticles.map((article) => (
            <article key={article.id} className={styles.articleCard33}>
              <div className={styles.cardImage33}>
                <Image 
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={250}
                  className={styles.image33}
                />
                <div className={styles.categoryTag33}>{article.category}</div>
                {article.trending && <div className={styles.trendingBadge33}>Trending</div>}
              </div>
              
              <div className={styles.cardContent33}>
                <h3 className={styles.cardTitle33}>{article.title}</h3>
                <p className={styles.cardDescription33}>{article.description}</p>
                
                <div className={styles.cardMeta33}>
                  <span className={styles.cardAuthor33}>{article.author}</span>
                  <div className={styles.metaDetails33}>
                    <span className={styles.cardDate33}>{article.date}</span>
                    <span className={styles.cardReadTime33}>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer33}>
          <button className={styles.loadMoreBtn33}>Load More Articles</button>
        </div>
      </div>
    </section>
  );
};

export default BusinessArticlesGrid;