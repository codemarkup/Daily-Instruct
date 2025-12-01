import React from "react";
import styles from "./LatestArticles.module.css";
import Image from "next/image";
import Link from "next/link";
import techArticlesData from "@/data/tech-articles.json";
import businessArticlesData from "@/data/business-articles.json";
import marketArticlesData from "@/data/markets-articles.json"; // Add these
import guidesArticlesData from "@/data/guides-articles.json"; // Add these

const LatestArticles: React.FC = () => {
  // Combine articles from ALL categories
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles,
    ...marketArticlesData.articles, // Add these
    ...guidesArticlesData.articles  // Add these
  ];

  const latestArticles = allArticles
    .filter((article) => article.homeLatest)
    .slice(0, 6); // Show 6 latest articles

  return (
    <section className={styles.latestArticles}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Latest Articles</h2>
        <div className={styles.articlesGrid}>
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
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
                  <div className={styles.cardCategory}>{article.category}</div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardDescription}>
                    {article.description}
                  </p>

                  <div className={styles.cardMeta}>
                    <span className={styles.cardAuthor}>{article.author}</span>
                    <div className={styles.metaDetails}>
                      <span className={styles.cardDate}>{article.date}</span>
                      <span className={styles.cardReadTime}>
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        <div className={styles.loadMoreContainer}>
          <Link href="/all-articles" className={styles.loadMoreBtn}>
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;