import React from "react";
import styles from "./CategoriesSection.module.css";

const CategoriesSection: React.FC = () => {
  const categories = [
    {
      id: 1,
      name: "Technology",
      count: "128 Articles",
      icon: "desktop.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Business",
      count: "96 Articles",
      icon: "business.svg",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Startups",
      count: "74 Articles",
      icon: "bulb.svg",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Markets",
      count: "85 Articles",
      icon: "chart.svg",
      color: "#EF4444",
    },
    {
      id: 5,
      name: "Science",
      count: "63 Articles",
      icon: "microscope.svg",
      color: "#8B5CF6",
    },
    {
      id: 6,
      name: "AI & ML",
      count: "42 Articles",
      icon: "robot.svg",
      color: "#06B6D4",
    },
    {
      id: 7,
      name: "Guides",
      count: "58 Articles",
      icon: "book.svg",
      color: "#84CC16",
    },
    {
      id: 8,
      name: "Reviews",
      count: "37 Articles",
      icon: "star.svg",
      color: "#F97316",
    },
  ];

  return (
    <section className={styles.categoriesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Explore Categories</h2>
        <p className={styles.sectionSubtitle}>
          Dive deep into your favorite topics
        </p>

        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
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
                <p className={styles.categoryCount}>{category.count}</p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
