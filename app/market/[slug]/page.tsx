import React from "react";
import { marketArticles } from "@/components/markets/MarketArticlesGrid";
import Image from "next/image";
import MarketHeader from "@/components/markets/MarketHeader";
import styles from "@/components/markets/MarketArticlesGrid.module.css";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MarketSubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  // Add debugging to see what's happening
  console.log("🔍 Market Slug:", slug);
  console.log("🔍 All market articles:", marketArticles.map(a => ({ id: a.id, specific: a.specific })));

  const filteredArticles = marketArticles.filter((article) => {
    const articleSlug = article.specific
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    console.log(`🔍 Comparing: "${articleSlug}" === "${slug}"`);
    return articleSlug === slug;
  });

  console.log("🔍 Filtered articles:", filteredArticles);

  // Format the title for display
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
      {/* This should now work since MarketHeader exists */}
      <MarketHeader />

      <section className={styles.techArticlesGrid3}>
        <div className="container">
          <h2 className={styles.sectionTitle3}>
            {formattedTitle} Articles
          </h2>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "2rem", padding: "2rem" }}>
              <p>No articles found in "{formattedTitle}" category.</p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                Slug: {slug} | Available categories: {marketArticles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                Available slugs: {marketArticles.map(a => 
                  a.specific.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                ).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid3}>
              {filteredArticles.map((article) => (
                <article key={article.id} className={styles.articleCard3}>
                  <div className={styles.cardImage3}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={250}
                      className={styles.image3}
                    />
                    <div className={styles.categoryTag3}>{article.category}</div>
                    {article.trending && <div className={styles.trendingBadge3}>Trending</div>}
                  </div>

                  <div className={styles.cardContent3}>
                    <h3 className={styles.cardTitle3}>{article.title}</h3>
                    <p className={styles.cardDescription3}>{article.description}</p>

                    <div className={styles.cardMeta3}>
                      <span className={styles.cardAuthor3}>{article.author}</span>
                      <div className={styles.metaDetails3}>
                        <span className={styles.cardDate3}>{article.date}</span>
                        <span className={styles.cardReadTime3}>{article.readTime}</span>
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