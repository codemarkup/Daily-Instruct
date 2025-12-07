import React from "react";
import marketArticlesData from "@/data/markets-articles.json";
import Image from "next/image";
import Link from "next/link"; // Don't forget to import Link!
import MarketHeader from "@/components/markets/MarketHeader";
import styles from "@/components/markets/MarketArticlesGrid.module.css";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MarketSubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug } = await params;
  
  if (!slug) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>;

  const marketArticles = marketArticlesData.articles;

  // Enhanced debug: Show all data
  console.log("=== MARKET SUBCATEGORY DEBUG ===");
  console.log("Requested slug:", slug);
  
  // Create a map of all possible slugs
  const articleSlugMap = marketArticles.map(article => {
    const articleSlug = article.specific
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    return {
      id: article.id,
      specific: article.specific,
      slug: articleSlug,
      matches: articleSlug === slug
    };
  });
  
  console.log("Article slug mapping:", articleSlugMap);
  console.log("Unique specifics:", [...new Set(marketArticles.map(a => a.specific))]);

  const filteredArticles = marketArticles.filter((article) => {
    const articleSlug = article.specific
      .toLowerCase()
      .replace(/&/g, 'and') // Handle "&" as "and"
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    
    return articleSlug === slug;
  });

  console.log("Filtered articles count:", filteredArticles.length);
  console.log("Filtered articles:", filteredArticles.map(a => ({ title: a.title, specific: a.specific })));

  // Format the title for display
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
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
                <strong>Requested Slug:</strong> {slug}
              </p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                <strong>Available Specifics:</strong> {[...new Set(marketArticles.map(a => a.specific))].join(', ')}
              </p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                <strong>Generated Slugs:</strong> {articleSlugMap
                  .filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i)
                  .map(item => item.slug)
                  .join(', ')}
              </p>
              <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                <strong>Example conversions:</strong>
                <ul style={{ textAlign: "left", marginTop: "0.5rem" }}>
                  {articleSlugMap.slice(0, 3).map(item => (
                    <li key={item.id}>"{item.specific}" → "{item.slug}"</li>
                  ))}
                </ul>
              </p>
            </div>
          ) : (
            <div className={styles.articlesGrid3}>
              {filteredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug}`}
                  className={styles.articleLink3}
                >
                  <article className={styles.articleCard3}>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}