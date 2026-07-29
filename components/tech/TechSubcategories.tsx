import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import styles from "./TechSubcategories.module.css";
import Link from "next/link";


const TechSubcategories = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('tech-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  const subcategories = [
  {
    id: 1,
    name: "Artificial Intelligence", // Already matches
    description: "Machine learning, neural networks, and AI applications",
    icon: "robot.svg",
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Gadgets & Devices", // Changed from "gadgets devices" 
    description: "Latest smartphones, wearables, and consumer electronics",
    icon: "devices.svg",
    color: "#10B981",
  },
  {
    id: 3,
    name: "Software Development", // Capitalized
    description: "Programming, frameworks, and development tools",
    icon: "software.svg",
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Cybersecurity", // Capitalized
    description: "Online security, encryption, and threat protection",
    icon: "shield.svg",
    color: "#EF4444",
  },
  {
    id: 5,
    name: "Data & Analytics", // Changed from "data analytics"
    description: "Covers data trends, analytics tools, dashboards, visualization, big data, and how companies use data to make smarter decisions",
    icon: "data.svg",
    color: "#8B5CF6",
  }
];

  // Generate slugs using the SAME logic as TechSubcategoryPage
  const updatedSubcategories = subcategories.map((subcat) => {
    // Generate slug - MUST match the logic in TechSubcategoryPage
    const slug = subcat.name
      .toLowerCase()
      .replace(/&/g, 'and') // Convert "&" to "and" - THIS IS KEY!
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    // Count articles - IMPORTANT: Use case-insensitive comparison
    const count = articles.filter((article) => {
      // Normalize both strings for comparison
      const normalize = (str: string) => 
        str.toLowerCase()
           .replace(/&/g, 'and') // Also normalize & in article specific
           .replace(/[^a-z0-9\s]/g, '')
           .replace(/\s+/g, ' ')
           .trim();
      
      const normalizedSubcat = normalize(subcat.name);
      const normalizedArticle = normalize(article.specific);
      
      return normalizedArticle === normalizedSubcat;
    }).length;
    
    return {
      ...subcat,
      slug: slug, // Use generated slug
      articleCount: `${count} ${count === 1 ? 'Article' : 'Articles'}`,
    };
  });

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