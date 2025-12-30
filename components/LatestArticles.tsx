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

  const latestArticles = articles
    .filter((article) => article.homeLatest)
    .slice(0, 6); // Show 6 latest articles

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