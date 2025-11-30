import React from "react";
import { guidesArticles } from "@/components/guides/GuidesArticlesGrid";
import Image from "next/image";
import GuidesHeader from "@/components/guides/GuidesHeader";
import styles from "@/components/guides/GuidesArticlesGrid.module.css";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidesSubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  const filteredArticles = guidesArticles.filter((article) => {
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
      <GuidesHeader />

      <section className={styles.techArticlesGrid333}>
        <div className="container">
          <h2 className={styles.sectionTitle333}>
            {formattedTitle} Guides
          </h2>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "2rem", padding: "2rem" }}>
              <p>No guides found in "{formattedTitle}" category.</p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                Slug: {slug} | Available: {guidesArticles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid333}>
              {filteredArticles.map((article) => (
                <article key={article.id} className={styles.articleCard333}>
                  <div className={styles.cardImage333}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className={styles.image333}
                    />
                    <div className={styles.categoryTag333}>{article.category}</div>
                    {article.trending && <div className={styles.trendingBadge333}>Trending</div>}
                  </div>

                  <div className={styles.cardContent333}>
                    <h3 className={styles.cardTitle333}>{article.title}</h3>
                    <p className={styles.cardDescription333}>{article.description}</p>

                    <div className={styles.cardMeta333}>
                      <span className={styles.cardAuthor333}>{article.author}</span>
                      <div className={styles.metaDetails333}>
                        <span className={styles.cardDate333}>{article.date}</span>
                        <span className={styles.cardReadTime333}>{article.readTime}</span>
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