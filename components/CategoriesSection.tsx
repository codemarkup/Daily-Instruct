import React from "react";
import Link from "next/link";
import styles from "./CategoriesSection.module.css";
import techArticlesData from "@/data/tech-articles.json";
import businessArticlesData from "@/data/business-articles.json";
import marketArticlesData from "@/data/markets-articles.json";
import guidesArticlesData from "@/data/guides-articles.json";

const CategoriesSection: React.FC = () => {
  // Combine all articles
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles,
    ...marketArticlesData.articles,
    ...guidesArticlesData.articles
  ];

  const categories = [
    {
      id: 1,
      name: "Technology",
      slug: "tech",
      count: techArticlesData.articles.length,
      icon: "desktop.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Business",
      slug: "business",
      count: businessArticlesData.articles.length,
      icon: "business.svg",
      color: "#10B981",
    },
    // {
    //   id: 3,
    //   name: "Startups",
    //   slug: "business/startup-news", // This is a subcategory of Business
    //   count: businessArticlesData.articles.filter(article => article.specific === "Startup News").length,
    //   icon: "bulb.svg",
    //   color: "#F59E0B",
    // },
    {
      id: 4,
      name: "Markets",
      slug: "market",
      count: marketArticlesData.articles.length,
      icon: "chart.svg",
      color: "#EF4444",
    },
    // {
    //   id: 5,
    //   name: "Science",
    //   slug: "tech/artificial-intelligence", // Using AI as proxy for Science
    //   count: techArticlesData.articles.filter(article => article.specific === "Artificial Intelligence").length,
    //   icon: "microscope.svg",
    //   color: "#8B5CF6",
    // },
    // {
    //   id: 6,
    //   name: "AI & ML",
    //   slug: "tech/artificial-intelligence",
    //   count: techArticlesData.articles.filter(article => article.specific === "Artificial Intelligence").length,
    //   icon: "robot.svg",
    //   color: "#06B6D4",
    // },
    {
      id: 7,
      name: "Guides",
      slug: "guides",
      count: guidesArticlesData.articles.length,
      icon: "book.svg",
      color: "#84CC16",
    },
    // {
    //   id: 8,
    //   name: "Reviews",
    //   slug: "tech/gadgets-devices", // Using Gadgets as proxy for Reviews
    //   count: techArticlesData.articles.filter(article => article.specific === "Gadgets & Devices").length,
    //   icon: "star.svg",
    //   color: "#F97316",
    // },
  ];

  // Update categories with formatted count
  const updatedCategories = categories.map(category => ({
    ...category,
    formattedCount: `${category.count} ${category.count === 1 ? 'Article' : 'Articles'}`
  }));

  return (
    <section className={styles.categoriesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Explore Categories</h2>
        <p className={styles.sectionSubtitle}>
          Dive deep into your favorite topics
        </p>

        <div className={styles.categoriesGrid}>
          {updatedCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/${category.slug}`}
              className={styles.categoryLink}
            >
              <div className={styles.categoryCard}>
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
                  <p className={styles.categoryCount}>{category.formattedCount}</p>
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;