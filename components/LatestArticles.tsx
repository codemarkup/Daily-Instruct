import React from "react";
import styles from "./LatestArticles.module.css";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles, Article } from "../lib/json-utils";

const LatestArticles = async () => {
  let articles: Article[] = [];
  try {
    articles = await getAllArticles();
  } catch (error) {
    console.error('Error fetching latest articles:', error);
  }

  const latestArticles = articles
    .filter((article) => article.homeLatest)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .slice(0, 6); // Show 6 latest articles

  if (latestArticles.length === 0) {
    return (
      <section className={styles.latestArticles}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <div className={styles.noArticles}>
            <p>No articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.latestArticles}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Latest Articles</h2>
        <div className={styles.articlesGrid}>
          {latestArticles.map((article) => (
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
                  
                  {/* Mobile-only meta - shown only on mobile */}
                  <div className={styles.mobileMeta}>
                    <div className={styles.mobileAuthor}>{article.author}</div>
                    <div className={styles.mobileDate}>{article.date}</div>
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