"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedGuidesStory.module.css';

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

const FeaturedGuidesStory: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidesArticles = async () => {
      try {
        const response = await fetch('/api/github/articles?category=guides');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching guides articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuidesArticles();
  }, []);

  // Get the first featured article
  // Get the most recent featured article
const featuredArticles = articles.filter(article => article.featured);
const featuredArticle = featuredArticles.length > 0 
  ? featuredArticles.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
  : undefined;

  if (loading) {
    return (
      <section className={styles.featuredTechStory222}>
        <div className="container">
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading featured guide...</p>
          </div>
        </div>
      </section>
    );
  }

  // If no featured article, use the first one as fallback
  if (!featuredArticle) {
    if (articles.length > 0) {
      const firstArticle = articles.sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
)[0];
      return (
        <section className={styles.featuredTechStory222}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle222}>
                <div className={styles.articleImage222}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image222}
                    priority
                  />
                  <div className={styles.categoryTag222}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent222}>
                  <h2 className={styles.articleTitle222}>{firstArticle.title}</h2>
                  <p className={styles.articleDescription222}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta222}>
                    <span className={styles.author222}>{firstArticle.author}</span>
                    <span className={styles.separator222}>•</span>
                    <span className={styles.date222}>{firstArticle.date}</span>
                    <span className={styles.separator222}>•</span>
                    <span className={styles.readTime222}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton222}>Read Full Analysis</button>
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
    <section className={styles.featuredTechStory222}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle222}>
            <div className={styles.articleImage222}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image222}
                priority
              />
              <div className={styles.categoryTag222}>Featured</div>
            </div>
            
            <div className={styles.articleContent222}>
              <h2 className={styles.articleTitle222}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription222}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta222}>
                <span className={styles.author222}>{featuredArticle.author}</span>
                <span className={styles.separator222}>•</span>
                <span className={styles.date222}>{featuredArticle.date}</span>
                <span className={styles.separator222}>•</span>
                <span className={styles.readTime222}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton222}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedGuidesStory;