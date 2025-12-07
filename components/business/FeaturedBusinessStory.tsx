"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedBusinessStory.module.css';

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

const FeaturedBusinessStory: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=business');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching business articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessArticles();
  }, []);

  // Get the first featured article
  const featuredArticle = articles.find(article => Boolean(article.featured));

  if (loading) {
    return (
      <section className={styles.featuredTechStory22}>
        <div className="container">
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading featured business story...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    if (articles.length > 0) {
      const firstArticle = articles[0];
      return (
        <section className={styles.featuredTechStory22}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle22}>
                <div className={styles.articleImage22}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image22}
                    priority
                  />
                  <div className={styles.categoryTag22}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent22}>
                  <h2 className={styles.articleTitle22}>{firstArticle.title}</h2>
                  <p className={styles.articleDescription22}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta22}>
                    <span className={styles.author22}>{firstArticle.author}</span>
                    <span className={styles.separator22}>•</span>
                    <span className={styles.date22}>{firstArticle.date}</span>
                    <span className={styles.separator22}>•</span>
                    <span className={styles.readTime22}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton22}>Read Full Analysis</button>
                </div>
              </article>
            </Link>
          </div>
        </section>
      );
    } else {
      return null; // or you can return a fallback component
    }
  }

  return (
    <section className={styles.featuredTechStory22}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle22}>
            <div className={styles.articleImage22}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image22}
                priority
              />
              <div className={styles.categoryTag22}>Featured</div>
            </div>
            
            <div className={styles.articleContent22}>
              <h2 className={styles.articleTitle22}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription22}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta22}>
                <span className={styles.author22}>{featuredArticle.author}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.date22}>{featuredArticle.date}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.readTime22}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton22}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedBusinessStory;