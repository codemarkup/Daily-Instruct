import React from "react";
import { techArticles } from "@/components/tech/TechArticlesGrid";
import Image from "next/image";
import TechHeader from "@/components/tech/TechHeader";
import styles from "@/components/tech/TechArticlesGrid.module.css";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  const filteredArticles = techArticles.filter((article) => {
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
                Slug: {slug} | Available: {techArticles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {filteredArticles.map((article) => (
                <article key={article.id} className={styles.articleCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className={styles.image}
                    />
                    <div className={styles.categoryTag}>{article.category}</div>
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}