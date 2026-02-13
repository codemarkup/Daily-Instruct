"use client";

import React, { useEffect, useState } from "react";
import styles from "./LatestArticles.module.css";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  specific: string;
  trending: boolean;
  featured: boolean;
  topStory: boolean;
  grid: boolean;
  homeFeatured: boolean;
  homeLatest: boolean;
  homeTrending: boolean;
  homeTopStory: boolean;
  content: Array<{
    type: 'paragraph' | 'heading' | 'quote';
    text: string;
    author?: string;
  }>;
}

const LatestArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        // Fetch from all categories
        const [techRes, businessRes, marketRes, guidesRes] = await Promise.all([
          fetch('/api/github/articles?category=tech'),
          fetch('/api/github/articles?category=business'),
          fetch('/api/github/articles?category=markets'),
          fetch('/api/github/articles?category=guides')
        ]);

        const [techData, businessData, marketData, guidesData] = await Promise.all([
          techRes.json(),
          businessRes.json(),
          marketRes.json(),
          guidesRes.json()
        ]);

        // Combine all articles
        const allArticles = [
          ...(techData.articles || []),
          ...(businessData.articles || []),
          ...(marketData.articles || []),
          ...(guidesData.articles || [])
        ];

        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching latest articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  // FIXED: Added sorting by date (newest first)
  // FIXED: Added sorting by date (newest first)
  const latestArticles = articles
    .filter((article) => article.homeLatest)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .slice(0, 7); // 1 hero + 6 grid

  const heroArticle = latestArticles[0];
  const gridArticles = latestArticles.slice(1);

  if (loading) {
    return (
      <section className={styles.latestArticles}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

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
        <div className={styles.latestContent}>
          {/* Hero Article (Side-by-Side on Desktop) */}
          {heroArticle && (
            <Link href={`/articles/${heroArticle.slug}`} className={styles.heroLink}>
              <article className={styles.heroCard}>
                <div className={styles.heroImageWrapper}>
                  <Image
                    src={encodeURI(heroArticle.image.trim())}
                    alt={heroArticle.title}
                    fill
                    className={styles.heroImage}
                    priority
                  />
                  <div className={styles.heroBadge}>Featured Story</div>
                </div>
                <div className={styles.heroContent}>
                  <div className={styles.heroMetaTop}>
                    <span className={styles.heroCategory}>{heroArticle.category}</span>
                    <span className={styles.heroDate}>{heroArticle.date}</span>
                  </div>
                  <h3 className={styles.heroTitle}>{heroArticle.title}</h3>
                  <p className={styles.heroDescription}>{heroArticle.description}</p>
                  <div className={styles.heroFooter}>
                    <div className={styles.heroAuthor}>
                      <span>By {heroArticle.author}</span>
                    </div>
                    <span className={styles.readMoreLink}>Read Full Story <span className={styles.arrow}>→</span></span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Standard 3-Column Grid */}
          <div className={styles.articlesGrid}>
            {gridArticles.map((article) => (
              <Link
                key={`${article.category}-${article.id}`}
                href={`/articles/${article.slug}`}
                className={styles.articleLink}
              >
                <article className={styles.articleCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={encodeURI(article.image.trim())}
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
                      <span className={styles.cardDate}>{article.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
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