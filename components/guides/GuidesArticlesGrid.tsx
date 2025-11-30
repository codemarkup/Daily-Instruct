import React from 'react';
import Image from 'next/image';
import styles from './GuidesArticlesGrid.module.css';

const GuidesArticlesGrid: React.FC = () => {
  const techArticles = [
    {
      id: 1,
      title: "Quantum Computing Breakthrough: What It Means for Encryption",
      description: "Recent advancements in quantum processing are challenging traditional security systems and opening new possibilities.",
      author: "Dr. Michael Torres",
      date: "March 15, 2024",
      readTime: "8 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    },
    {
      id: 2,
      title: "The Future of Web Development: Beyond React and Vue",
      description: "Exploring emerging frameworks and tools that are shaping the next generation of web applications.",
      author: "Alex Johnson",
      date: "March 14, 2024",
      readTime: "6 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    },
    {
      id: 3,
      title: "Sustainable Tech: How Companies Are Reducing Digital Carbon Footprints",
      description: "Innovative approaches to making technology more environmentally friendly and energy efficient.",
      author: "Lisa Park",
      date: "March 14, 2024",
      readTime: "10 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    },
    {
      id: 4,
      title: "The Rise of Edge Computing in IoT Ecosystems",
      description: "How edge computing is transforming data processing and enabling real-time IoT applications.",
      author: "Robert Kim",
      date: "March 13, 2024",
      readTime: "7 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    },
    {
      id: 5,
      title: "Blockchain Beyond Cryptocurrency: Real-World Applications",
      description: "From supply chain management to digital identity, blockchain technology is finding practical uses.",
      author: "Sarah Williams",
      date: "March 13, 2024",
      readTime: "9 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    },
    {
      id: 6,
      title: "The Evolution of Programming Languages: What's Next?",
      description: "A look at emerging programming languages and how they're addressing modern development challenges.",
      author: "David Chen",
      date: "March 12, 2024",
      readTime: "11 min read",
      image: "/images/tech/2.png",
      category: "Tech"
    }
  ];

  return (
    <section className={styles.techArticlesGrid333}>
      <div className="container">
        <h2 className={styles.sectionTitle333}>Latest in Guides</h2>
        
        <div className={styles.articlesGrid333}>
          {techArticles.map((article) => (
            <article key={article.id} className={styles.articleCard333}>
              <div className={styles.cardImage333}>
                <Image 
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={250}
                  className={styles.image333}
                />
                <div className={styles.categoryTag333}>{article.category}</div>
              </div>
              
              <div className={styles.cardContent333}>
                <h3 className={styles.cardTitle333}>{article.title}</h3>
                <p className={styles.cardDescription333}>{article.description}</p>
                
                <div className={styles.cardMeta333}>
                  <span className={styles.cardAuthor333}>{article.author}</span>
                  <div className={styles.metaDetails333}>
                    <span className={styles.cardDate333}>{article.date}</span>
                    <span className={styles.cardReadTime333}>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className={styles.loadMoreContainer333}>
          <button className={styles.loadMoreBtn333}>Load More Articles</button>
        </div>
      </div>
    </section>
  );
};

export default GuidesArticlesGrid;