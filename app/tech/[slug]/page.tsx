"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TechHeader from "@/components/tech/TechHeader";
import styles from "@/components/tech/TechArticlesGrid.module.css";
import { use } from "react";

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

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  // Unwrap the Promise using React.use()
  const { slug } = use(params);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchTechArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=tech');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching tech articles for subcategory page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0 && slug) {
      const filtered = articles.filter((article) => {
        const articleSlug = article.specific
          .toLowerCase()
          .replace(/&/g, '')  
          .replace(/\s+/g, '-') 
          .replace(/[^\w-]/g, ''); 
        
        return articleSlug === slug;
      });
      setFilteredArticles(filtered);
    }
  }, [articles, slug]);

  // Format the title for display
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (loading) {
    return (
      <div>
        <TechHeader />
        <section className={styles.techArticlesGrid}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {formattedTitle} Articles
            </h2>
            <div className={styles.loadingPlaceholder}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading {formattedTitle} articles...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!slug) {
    return (
      <div>
        <TechHeader />
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>
      </div>
    );
  }

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
              {articles.length > 0 && (
                <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                  Available categories: {articles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </p>
              )}
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {filteredArticles.map((article) => (
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
                      <div className={styles.categoryTag}>{article.category}</div>
                      {article.trending && <div className={styles.trendingBadge}>Trending</div>}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}