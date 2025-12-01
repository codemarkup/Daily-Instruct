import React from "react";
import businessArticlesData from "@/data/business-articles.json"; // Import from JSON instead
import Image from "next/image";
import Link from "next/link"; // Don't forget to import Link
import BusinessHeader from "@/components/business/BusinessHeader";
import styles from "@/components/business/BusinessArticlesGrid.module.css";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessSubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  // Use businessArticlesData.articles instead of businessArticles
  const businessArticles = businessArticlesData.articles;

  const filteredArticles = businessArticles.filter((article) => {
    const articleSlug = article.specific
      .toLowerCase()
      .replace(/&/g, '')  
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]/g, ''); 
    
    return articleSlug === slug;
  });

  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
      <BusinessHeader />

      <section className={styles.techArticlesGrid33}>
        <div className="container">
          <h2 className={styles.sectionTitle33}>
            {formattedTitle} Articles
          </h2>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "2rem", padding: "2rem" }}>
              <p>No articles found in "{formattedTitle}" category.</p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                Slug: {slug} | Available: {businessArticles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid33}>
              {filteredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className={styles.articleLink33}
                >
                  <article className={styles.articleCard33}>
                    <div className={styles.cardImage33}>
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={250}
                        className={styles.image33}
                      />
                      <div className={styles.categoryTag33}>{article.category}</div>
                      {article.trending && <div className={styles.trendingBadge33}>Trending</div>}
                    </div>

                    <div className={styles.cardContent33}>
                      <h3 className={styles.cardTitle33}>{article.title}</h3>
                      <p className={styles.cardDescription33}>{article.description}</p>

                      <div className={styles.cardMeta33}>
                        <span className={styles.cardAuthor33}>{article.author}</span>
                        <div className={styles.metaDetails33}>
                          <span className={styles.cardDate33}>{article.date}</span>
                          <span className={styles.cardReadTime33}>{article.readTime}</span>
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