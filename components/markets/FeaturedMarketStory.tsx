"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedMarketStory.module.css';

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

const FeaturedMarketStory: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=markets');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching market articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketArticles();
  }, []);

  // Get the first featured article
  const featuredArticle = articles.find(article => Boolean(article.featured));

  if (loading) {
    return (
      <section className={styles.featuredTechStory1}>
        <div className="container">
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading featured market story...</p>
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
        <section className={styles.featuredTechStory1}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle1}>
                <div className={styles.articleImage1}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image1}
                    priority
                  />
                  <div className={styles.categoryTag1}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent1}>
                  <h2 className={styles.articleTitle1}>{firstArticle.title}</h2>
                  <p className={styles.articleDescription1}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta1}>
                    <span className={styles.author1}>{firstArticle.author}</span>
                    <span className={styles.separator1}>•</span>
                    <span className={styles.date1}>{firstArticle.date}</span>
                    <span className={styles.separator1}>•</span>
                    <span className={styles.readTime1}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton1}>Read Full Analysis</button>
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
    <section className={styles.featuredTechStory1}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle1}>
            <div className={styles.articleImage1}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image1}
                priority
              />
              <div className={styles.categoryTag1}>Featured</div>
            </div>
            
            <div className={styles.articleContent1}>
              <h2 className={styles.articleTitle1}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription1}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta1}>
                <span className={styles.author1}>{featuredArticle.author}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.date1}>{featuredArticle.date}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.readTime1}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton1}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedMarketStory;