"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BusinessHeader from "@/components/business/BusinessHeader";
import styles from "@/components/business/BusinessArticlesGrid.module.css";
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

export default function BusinessSubcategoryPage({ params }: SubcategoryPageProps) {
  // Unwrap the Promise using React.use()
  const { slug } = use(params);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchBusinessArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=business');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching business articles for subcategory page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessArticles();
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
        <BusinessHeader />
        <section className={styles.techArticlesGrid33}>
          <div className="container">
            <h2 className={styles.sectionTitle33}>
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
        <BusinessHeader />
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Slug not found</p>
      </div>
    );
  }

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
              {articles.length > 0 && (
                <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>
                  Available categories: {articles.map(a => a.specific).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                </p>
              )}
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
                      {Boolean(article.trending) && <div className={styles.trendingBadge33}>Trending</div>}
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