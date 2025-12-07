"use client";

import React, { useEffect, useState } from "react";
import styles from "./MarketSubcategories.module.css";
import Link from "next/link";

interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  specific: string;
  trending: boolean;
  featured: boolean;
  topStory: boolean;
  grid: boolean;
  homeFeatured: boolean;
  homeLatest: boolean;
  homeTrending: boolean;
  homeTopStory: boolean;
  content: Array<{
    type: 'paragraph' | 'heading' | 'quote';
    text: string;
    author?: string;
  }>;
}

const MarketSubcategories: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=markets');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching market articles for subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketArticles();
  }, []);

  const subcategories = [
    {
      id: 1,
      name: "Stock Market",
      slug: "stock-market",
      description: "Updates, tips, and analysis for stocks and share trading",
      icon: "chart.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Cryptocurrency",
      slug: "cryptocurrency",
      description: "Latest news, coin analysis, and trends in crypto markets",
      icon: "btc.svg",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Commodities",
      slug: "commodities",
      description: "Gold, oil, silver, and other commodity market updates",
      icon: "coins.svg",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Forex Market",
      slug: "forex-market",
      description: "Foreign exchange news, tips, and market analysis",
      icon: "currency.svg",
      color: "#EF4444",
    },
    {
      id: 5,
      name: "Market Trends",
      slug: "market-trends",
      description: "Insights into market movements, indices, and sector performance",
      icon: "magnifying.svg",
      color: "#8B5CF6",
    },
    {
      id: 6,
      name: "Economic News",
      slug: "economic-news",
      description: "Important macroeconomic events affecting markets globally",
      icon: "newspaper.svg",
      color: "#06B6D4",
    },
  ];

  const updatedSubcategories = subcategories.map((subcat) => {
    const count = articles.filter(
      (article) => article.specific === subcat.name
    ).length;
    return {
      ...subcat,
      articleCount: `${count} Articles`,
    };
  });

  if (loading) {
    return (
      <section className={styles.techSubcategories5}>
        <div className="container">
          <div className={styles.sectionHeader5}>
            <h2 className={styles.sectionTitle5}>Explore Categories</h2>
            <p className={styles.sectionSubtitle5}>Dive deeper into specific market domains</p>
          </div>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading market categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techSubcategories5}>
      <div className="container">
        <div className={styles.sectionHeader5}>
          <h2 className={styles.sectionTitle5}>Explore Categories</h2>
          <p className={styles.sectionSubtitle5}>Dive deeper into specific market domains</p>
        </div>
        
        <div className={styles.categoriesGrid5}>
          {updatedSubcategories.map((category) => (
            <Link
              key={category.id} 
              href={`/market/${category.slug}`}
              className={styles.categoryCard5}
            >
              <div 
                className={styles.categoryIcon5}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={`/icons/${category.icon}`}
                  alt={category.name}
                  className={styles.svgIcon5}
                />
              </div>
              
              <div className={styles.categoryContent5}>
                <h3 className={styles.categoryName5}>{category.name}</h3>
                <p className={styles.categoryDescription5}>{category.description}</p>
                <span className={styles.articleCount5}>{category.articleCount}</span>
              </div>
              
              <div className={styles.categoryArrow5}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketSubcategories;