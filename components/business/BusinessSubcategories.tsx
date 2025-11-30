import React from "react";
import styles from "./BusinessSubcategories.module.css";

const BusinessSubcategories: React.FC = () => {
  const subcategories = [
    {
      id: 1,
      name: "Startup News",
      slug: "startup",
      description: "Latest updates on new startups, launches, and funding rounds",
      articleCount: "142 Articles",
      icon: "newspaper.svg",
      color: "#3B82F6",
    },
    {
      id: 2,
      name: "Company Updates",
      slug: "company_updates",
      description: "Big company announcements, strategy changes, and business moves",
      articleCount: "89 Articles",
      icon: "bell.svg",
      color: "#10B981",
    },
    {
      id: 3,
      name: "Market Trends",
      slug: "market_trends",
      description: "Insights into rising industries, shifting markets, and economic patterns",
      articleCount: "156 Articles",
      icon: "chart.svg",
      color: "#F59E0B",
    },
    {
      id: 4,
      name: "Business Tips",
      slug: "business_tips",
      description: "Simple guides and actionable advice for growing and managing a business",
      articleCount: "78 Articles",
      icon: "note.svg",
      color: "#EF4444",
    },
    {
      id: 5,
      name: "Personal Finance",
      slug: "personal_finance",
      description: "Easy money tips, budgeting advice, and beginner-level investing basics",
      articleCount: "63 Articles",
      icon: "data.svg",
      color: "#8B5CF6",
    },
    {
      id: 6,
      name: "Work & Productivity",
      slug: "work_productivity",
      description: "Tips on work habits, improving focus, and boosting daily productivity",
      articleCount: "54 Articles",
      icon: "gear.svg",
      color: "#06B6D4",
    },
  ];

  return (
    <section className={styles.techSubcategories55}>
      <div className="container">
        <div className={styles.sectionHeader55}>
          <h2 className={styles.sectionTitle55}>Explore Categories</h2>
          <p className={styles.sectionSubtitle55}>
            Dive deeper into specific technology domains
          </p>
        </div>

        <div className={styles.categoriesGrid55}>
          {subcategories.map((category) => (
            <a
              key={category.id}
              href={`/tech/${category.slug}`}
              className={styles.categoryCard55}
            >
              <div
                className={styles.categoryIcon55}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={`/icons/${category.icon}`}
                  alt={category.name}
                  className={styles.svgIcon}
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessSubcategories;
