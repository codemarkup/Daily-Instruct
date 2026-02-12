"use client";

import React, { useEffect, useState } from 'react';
import styles from './TrendingSection.module.css';
import Image from 'next/image';
import Link from 'next/link';

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

const TrendingSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
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

        const allArticles = [
          ...(techData.articles || []),
          ...(businessData.articles || []),
          ...(marketData.articles || []),
          ...(guidesData.articles || [])
        ];

        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  const trendingArticles = articles
    .filter(article => article.homeTrending)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Duplicate for infinite scroll
  const marqueeArticles = [...trendingArticles, ...trendingArticles];

  if (loading) {
    return (
      <section className={styles.trendingSection}>
        <div className={styles.loadingPlaceholder}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return null; // Hide if no trending articles
  }

  return (
    <section className={styles.trendingSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending Now</h2>
          <p className={styles.sectionSubtitle}>Most Popular Stories</p>
        </div>

        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {marqueeArticles.map((article, index) => (
              <Link
                key={`${article.category}-${article.id}-${index}`}
                href={`/articles/${article.slug}`}
                className={styles.trendingLink}
              >
                <article className={styles.trendingCard}>
                  <div className={styles.cardImage}>
                    <Image
                      src={encodeURI(article.image.trim())}
                      alt={article.title}
                      fill
                      className={styles.image}
                    />
                    <span className={styles.trendingNumber}>
                      {index < 10 ? `0${(index % 10) + 1}` : (index % 10) + 1}
                    </span>
                  </div>

                  <div className={styles.cardContent}>
                    <span className={styles.cardCategory}>{article.category}</span>
                    <h3 className={styles.cardTitle}>{article.title}</h3>

                    <div className={styles.cardMeta}>
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;