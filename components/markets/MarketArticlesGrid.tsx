import React from 'react';
import Image from 'next/image';
import styles from './MarketArticlesGrid.module.css';

// ✅ Export articles with trending flag and specific categories
export const marketArticles = [
  {
    id: 1,
    title: "Stock Market Hits All-Time High: What's Driving the Rally?",
    description: "Major indices reach record levels as investor confidence grows amid positive economic indicators and corporate earnings.",
    author: "Michael Chen",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Stock Market",
    trending: true
  },
  {
    id: 2,
    title: "Bitcoin Surges Past $70,000: Analyzing the Crypto Bull Run",
    description: "Cryptocurrency markets experience significant growth as institutional adoption increases and regulatory clarity emerges.",
    author: "Sarah Rodriguez",
    date: "March 14, 2024",
    readTime: "6 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Cryptocurrency",
    trending: true
  },
  {
    id: 3,
    title: "Gold Prices Stabilize Amid Global Economic Uncertainty",
    description: "Precious metals market shows resilience as investors seek safe-haven assets during volatile economic conditions.",
    author: "James Wilson",
    date: "March 14, 2024",
    readTime: "10 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Commodities",
    trending: false
  },
  {
    id: 4,
    title: "US Dollar Strengthens Against Major Currencies in Forex Markets",
    description: "Currency traders adjust positions as Federal Reserve policy decisions impact global foreign exchange rates.",
    author: "Emma Thompson",
    date: "March 13, 2024",
    readTime: "7 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Forex Market",
    trending: true
  },
  {
    id: 5,
    title: "Emerging Markets Show Strong Growth Potential for 2024",
    description: "Analysis of developing economies and their increasing influence on global market trends and investment opportunities.",
    author: "David Park",
    date: "March 13, 2024",
    readTime: "9 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Market Trends",
    trending: false
  },
  {
    id: 6,
    title: "Inflation Data Release: Impact on Bond Markets and Interest Rates",
    description: "Latest economic indicators shape monetary policy expectations and fixed income investment strategies.",
    author: "Lisa Martinez",
    date: "March 12, 2024",
    readTime: "11 min read",
    image: "/images/tech/2.png",
    category: "Markets",
    specific: "Economic News",
    trending: true
  }
];

const MarketArticlesGrid: React.FC = () => {
  return (
    <section className={styles.techArticlesGrid3}>
      <div className="container">
        <h2 className={styles.sectionTitle3}>Latest in Markets</h2>
        
        <div className={styles.articlesGrid3}>
          {marketArticles.map((article) => (
            <article key={article.id} className={styles.articleCard3}>
              <div className={styles.cardImage3}>
                <Image 
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={250}
                  className={styles.image3}
                />
                <div className={styles.categoryTag3}>{article.category}</div>
                {article.trending && <div className={styles.trendingBadge3}>Trending</div>}
              </div>
              
              <div className={styles.cardContent3}>
                <h3 className={styles.cardTitle3}>{article.title}</h3>
                <p className={styles.cardDescription3}>{article.description}</p>
                
                <div className={styles.cardMeta3}>
                  <span className={styles.cardAuthor3}>{article.author}</span>
                  <div className={styles.metaDetails3}>
                    <span className={styles.cardDate3}>{article.date}</span>
                    <span className={styles.cardReadTime3}>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer3}>
          <button className={styles.loadMoreBtn3}>Load More Articles</button>
        </div>
      </div>
    </section>
  );
};

export default MarketArticlesGrid;