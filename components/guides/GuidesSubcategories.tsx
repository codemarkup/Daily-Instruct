import React from 'react';
import styles from './GuidesSubcategories.module.css';

const GuidesSubcategories: React.FC = () => {
  const subcategories = [
    {
      id: 1,
      name: "Technology Guides",
      slug: "tech_guides",
      description: "Step-by-step tutorials for software, apps, tools, and gadgets",
      articleCount: "142 Articles",
      icon: "desktop.svg",
      color: "#3B82F6"
    },
    {
      id: 2,
      name: "Finance & Investing Guides",
      slug: "finance_guides",
      description: "Easy-to-follow guides on personal finance, investing, and money management",
      articleCount: "89 Articles",
      icon: "coins.svg",
      color: "#10B981"
    },
    {
      id: 3,
      name: "Business & Entrepreneurship Guides",
      slug: "business_guides",
      description: "Easy-to-follow guides on personal finance, investing, and money management",
      articleCount: "156 Articles",
      icon: "business.svg",
      color: "#F59E0B"
    },
    {
      id: 4,
      name: "Productivity & Work-Life Guides",
      slug: "productivity_guides",
      description: "Tips, hacks, and tutorials to improve productivity, remote work, and workflow",
      articleCount: "78 Articles",
      icon: "book.svg",
      color: "#EF4444"
    },
    {
      id: 5,
      name: "Software & Tools How-Tos",
      slug: "software_guides",
      description: "Tutorials for popular software, online tools, and platforms",
      articleCount: "63 Articles",
      icon: "gear.svg",
      color: "#8B5CF6"
    },
    {
      id: 6,
      name: "Career & Skills Development Guides",
      slug: "career_guides",
      description: "Guides on upskilling, career growth, certifications, and job search strategies",
      articleCount: "54 Articles",
      icon: "career.svg",
      color: "#06B6D4"
    }
  ];

  return (
    <section className={styles.techSubcategories555}>
      <div className="container">
        <div className={styles.sectionHeader555}>
          <h2 className={styles.sectionTitle555}>Explore Categories</h2>
          <p className={styles.sectionSubtitle555}>Dive deeper into specific Guides domains</p>
        </div>
        
        <div className={styles.categoriesGrid555}>
          {subcategories.map((category) => (
            <a 
              key={category.id} 
              href={`/tech/${category.slug}`}
              className={styles.categoryCard555}
            >
              <div 
                className={styles.categoryIcon555}
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={`/icons/${category.icon}`}
                  alt={category.name}
                  className={styles.svgIcon}
                />
              </div>
              
              <div className={styles.categoryContent555}>
                <h3 className={styles.categoryName555}>{category.name}</h3>
                <p className={styles.categoryDescription555}>{category.description}</p>
                <span className={styles.articleCount555}>{category.articleCount}</span>
              </div>
              
              <div className={styles.categoryArrow555}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidesSubcategories;