import React from 'react';
import Image from 'next/image';
import styles from './TrendingInBusiness.module.css';

const TrendingInBusiness: React.FC = () => {
  const trendingArticles = [
    {
      id: 1,
      title: "Apple's New AR Glasses: First Look",
      category: "Gadgets",
      author: "Emma Rodriguez",
      date: "March 16, 2024",
      views: "15.2K",
      image: "/images/tech/2.png",
    },
    {
      id: 2,
      title: "OpenAI's Latest Breakthrough in Natural Language",
      category: "AI",
      author: "Dr. Benjamin Carter",
      date: "March 15, 2024",
      views: "12.8K",
      image: "/images/tech/2.png",
    },
    {
      id: 3,
      title: "The Future of Quantum Internet",
      category: "Innovation",
      author: "Sarah Kim",
      date: "March 15, 2024",
      views: "9.7K",
      image: "/images/tech/2.png",
    },
    {
      id: 4,
      title: "Microsoft's AI-Powered Developer Tools",
      category: "Software",
      author: "Alex Thompson",
      date: "March 14, 2024",
      views: "8.4K",
      image: "/images/tech/2.png",
    },
    {
      id: 5,
      title: "Cybersecurity Threats in 2024",
      category: "Security",
      author: "Lisa Wong",
      date: "March 14, 2024",
      views: "11.3K",
      image: "/images/tech/2.png",
    },
    {
      id: 6,
      title: "The Rise of Neural Interfaces",
      category: "Innovation",
      author: "Dr. Michael Park",
      date: "March 13, 2024",
      views: "7.9K",
      image: "/images/tech/2.png",
    }
  ];

  return (
    <section className={styles.trendingInTech44}>
      <div className="container">
        <div className={styles.sectionHeader44}>
          <h2 className={styles.sectionTitle44}>Trending in Business</h2>
          <p className={styles.sectionSubtitle44}>Most popular tech stories this week</p>
        </div>
        
        <div className={styles.trendingGrid44}>
          {trendingArticles.map((article, index) => (
            <article key={article.id} className={styles.trendingCard44}>
              <div className={styles.trendingBadge44}>
                #{index + 1}
              </div>
              
              <div className={styles.cardImage44}>
                <Image 
                  src={article.image}
                  alt={article.title}
                  width={300}
                  height={180}
                  className={styles.image44}
                />
                <div className={styles.categoryTag44}>{article.category}</div>
              </div>
              
              <div className={styles.cardContent44}>
                <h3 className={styles.cardTitle44}>{article.title}</h3>
                
                <div className={styles.cardMeta44}>
                  <span className={styles.author44}>{article.author}</span>
                  <span className={styles.separator44}>•</span>
                  <span className={styles.date44}>{article.date}</span>
                </div>
                
                <div className={styles.cardStats44}>
                  <span className={styles.views44}>{article.views} views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingInBusiness;