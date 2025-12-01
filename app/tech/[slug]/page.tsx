import React from "react";
import Image from "next/image";
import Link from "next/link";
import TechHeader from "@/components/tech/TechHeader";
import styles from "@/components/tech/TechArticlesGrid.module.css";

// Import from JSON instead of the component
import techArticlesData from "@/data/tech-articles.json";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  // Use the articles from JSON data
  const filteredArticles = techArticlesData.articles.filter((article) => {
    const articleSlug = article.specific
      .toLowerCase()
      .replace(/&/g, '')  
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]/g, ''); 
    
    return articleSlug === slug;
  });

  // Format the title for display
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
      <TechHeader />

      <section className={styles.techArticlesGrid}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {formattedTitle} Articles
          </h2>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "2rem", padding: "2rem" }}>
              <p>No articles found in "{formattedTitle}" category.</p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                Slug: {slug} | Available: {techArticlesData.articles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {filteredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className={styles.articleLink}
                >
                  <article className={styles.articleCard}>
                    <div className={styles.cardImage}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={250}
                        className={styles.image}
                      />
                      <div className={styles.categoryTag}>{article.category}</div>
                      {article.trending && <div className={styles.trendingBadge}>Trending</div>}
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{article.title}</h3>
                      <p className={styles.cardDescription}>{article.description}</p>

                      <div className={styles.cardMeta}>
                        <span className={styles.cardAuthor}>{article.author}</span>
                        <div className={styles.metaDetails}>
                          <span className={styles.cardDate}>{article.date}</span>
                          <span className={styles.cardReadTime}>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}