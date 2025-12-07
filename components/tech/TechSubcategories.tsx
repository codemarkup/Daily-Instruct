"use client";

import React, { useEffect, useState } from "react";
import styles from "./TechSubcategories.module.css";
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

const TechSubcategories: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=tech');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching tech articles for subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechArticles();
  }, []);

  const subcategories = [
    {
      id: 1,
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "Machine learning, neural networks, and AI applications",
      icon: "robot.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Gadgets & Devices",
      slug: "gadgets-devices",
      description: "Latest smartphones, wearables, and consumer electronics",
      icon: "devices.svg",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Software Development",
      slug: "software-development",
      description: "Programming, frameworks, and development tools",
      icon: "software.svg",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Online security, encryption, and threat protection",
      icon: "shield.svg",
      color: "#EF4444",
    },
    {
      id: 5,
      name: "Data & Analytics",
      slug: "data-analytics",
      description: "Covers data trends, analytics tools, dashboards, visualization, big data, and how companies use data to make smarter decisions",
      icon: "data.svg",
      color: "#EF4444",
    }
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
      <section className={styles.techSubcategories}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore Categories</h2>
            <p className={styles.sectionSubtitle}>
              Dive deeper into specific technology domains
            </p>
          </div>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.techSubcategories}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Explore Categories</h2>
          <p className={styles.sectionSubtitle}>
            Dive deeper into specific technology domains
          </p>
        </div>

        <div className={styles.categoriesGrid}>
          {updatedSubcategories.map((category) => (
            <Link
              key={category.id}
              href={`/tech/${category.slug}`}
              className={styles.categoryCard}
            >
              <div
                className={styles.categoryIcon}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={`/icons/${category.icon}`}
                  alt={category.name}
                  className={styles.svgIcon}
                />
              </div>

              <div className={styles.categoryContent}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
                <span className={styles.articleCount}>
                  {category.articleCount}
                </span>
              </div>

              <div className={styles.categoryArrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSubcategories;