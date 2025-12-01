import React from "react";
import styles from "./BusinessSubcategories.module.css";
import Link from "next/link";

// Import from JSON
import businessArticlesData from '@/data/business-articles.json';

const BusinessSubcategories: React.FC = () => {
  const subcategories = [
    {
      id: 1,
      name: "Startup News",
      slug: "startup-news",
      description: "Latest updates on new startups, launches, and funding rounds",
      icon: "newspaper.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Company Updates",
      slug: "company-updates",
      description: "Big company announcements, strategy changes, and business moves",
      icon: "bell.svg",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Market Trends",
      slug: "market-trends",
      description: "Insights into rising industries, shifting markets, and economic patterns",
      icon: "chart.svg",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Business Tips",
      slug: "business-tips",
      description: "Simple guides and actionable advice for growing and managing a business",
      icon: "note.svg",
      color: "#EF4444",
    },
    {
      id: 5,
      name: "Personal Finance",
      slug: "personal-finance",
      description: "Easy money tips, budgeting advice, and beginner-level investing basics",
      icon: "data.svg",
      color: "#8B5CF6",
    },
    {
      id: 6,
      name: "Work & Productivity",
      slug: "work-productivity",
      description: "Tips on work habits, improving focus, and boosting daily productivity",
      icon: "gear.svg",
      color: "#06B6D4",
    },
  ];

  const updatedSubcategories = subcategories.map((subcat) => {
    const count = businessArticlesData.articles.filter(
      (article) => article.specific === subcat.name
    ).length;
    return {
      ...subcat,
      articleCount: `${count} Articles`,
    };
  });

  return (
    <section className={styles.techSubcategories55}>
      <div className="container">
        <div className={styles.sectionHeader55}>
          <h2 className={styles.sectionTitle55}>Explore Categories</h2>
          <p className={styles.sectionSubtitle55}>
            Dive deeper into specific business domains
          </p>
        </div>

        <div className={styles.categoriesGrid55}>
          {updatedSubcategories.map((category) => (
            <Link
              key={category.id}
              href={`/business/${category.slug}`}
              className={styles.categoryCard55}
            >
              <div
                className={styles.categoryIcon55}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={`/icons/${category.icon}`}
                  alt={category.name}
                  className={styles.svgIcon55}
                />
              </div>

              <div className={styles.categoryContent55}>
                <h3 className={styles.categoryName55}>{category.name}</h3>
                <p className={styles.categoryDescription55}>
                  {category.description}
                </p>
                <span className={styles.articleCount55}>
                  {category.articleCount}
                </span>
              </div>

              <div className={styles.categoryArrow55}>
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

export default BusinessSubcategories;