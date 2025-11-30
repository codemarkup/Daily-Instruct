import React from 'react';
import Image from 'next/image';
import styles from './GuidesArticlesGrid.module.css';

// ✅ Export articles with trending flag and specific categories
export const guidesArticles = [
  {
    id: 1,
    title: "Complete Guide to React 18: New Features and Best Practices",
    description: "Step-by-step tutorial covering all the new React 18 features including concurrent rendering, automatic batching, and new hooks.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "15 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Technology Guides",
    trending: true
  },
  {
    id: 2,
    title: "Beginner's Guide to Stock Market Investing: From Zero to First Trade",
    description: "Complete walkthrough for absolute beginners on how to start investing in stocks, understand market basics, and build a portfolio.",
    author: "Michael Chen",
    date: "March 14, 2024",
    readTime: "12 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Finance & Investing Guides",
    trending: true
  },
  {
    id: 3,
    title: "How to Start a Business: Legal Steps and Funding Options",
    description: "Comprehensive guide covering business registration, legal requirements, and various funding sources for new entrepreneurs.",
    author: "Emma Rodriguez",
    date: "March 14, 2024",
    readTime: "18 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Business & Entrepreneurship Guides",
    trending: false
  },
  {
    id: 4,
    title: "Ultimate Productivity System: Tools and Techniques That Actually Work",
    description: "Step-by-step guide to building a personalized productivity system using proven methods and modern tools.",
    author: "David Park",
    date: "March 13, 2024",
    readTime: "14 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Productivity & Work-Life Guides",
    trending: true
  },
  {
    id: 5,
    title: "Mastering Excel: Advanced Formulas and Data Analysis Techniques",
    description: "Comprehensive tutorial covering advanced Excel functions, pivot tables, and data visualization for business analysis.",
    author: "Lisa Martinez",
    date: "March 13, 2024",
    readTime: "20 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Software & Tools How-Tos",
    trending: false
  },
  {
    id: 6,
    title: "Career Change Guide: How to Successfully Transition Industries",
    description: "Step-by-step plan for researching, preparing, and executing a successful career change with practical examples.",
    author: "James Wilson",
    date: "March 12, 2024",
    readTime: "16 min read",
    image: "/images/tech/2.png",
    category: "Guides",
    specific: "Career & Skills Development Guides",
    trending: true
  }
];

const GuidesArticlesGrid: React.FC = () => {
  return (
    <section className={styles.techArticlesGrid333}>
      <div className="container">
        <h2 className={styles.sectionTitle333}>Latest in Guides</h2>
        
        <div className={styles.articlesGrid333}>
          {guidesArticles.map((article) => (
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
                {article.trending && <div className={styles.trendingBadge333}>Trending</div>}
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