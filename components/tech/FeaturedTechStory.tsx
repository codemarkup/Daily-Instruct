"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedTechStory.module.css';

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

const FeaturedTechStory: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechArticles = async () => {
      try {
        console.log('🔄 FETCH STARTED: FeaturedTechStory');
        const response = await fetch('/api/github/articles?category=tech');
        console.log('📡 RESPONSE STATUS:', response.status);
        
        const data = await response.json();
        console.log('📊 DATA RECEIVED:', data);
        console.log('📈 ARTICLES COUNT:', data.articles?.length || 0);
        
        // Log each article to see featured status
        if (data.articles && data.articles.length > 0) {
          console.log('🔍 ALL ARTICLES:');
          data.articles.forEach((article: Article, index: number) => {
            console.log(`  ${index + 1}. ${article.title} - Featured: ${article.featured}`);
          });
        }
        
        setArticles(data.articles || []);
      } catch (error) {
        console.error('❌ ERROR fetching tech articles:', error);
      } finally {
        setLoading(false);
        console.log('✅ LOADING COMPLETE');
      }
    };
    
    fetchTechArticles();
  }, []);

  // Get the first featured article
  const featuredArticle = articles.find(article => article.featured);
  
  console.log('🎯 FEATURED ARTICLE FOUND:', featuredArticle?.title || 'NONE');

  if (loading) {
    console.log('⏳ SHOWING LOADING STATE');
    return (
      <section className={styles.featuredTechStory}>
        <div className="container">
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading featured story...</p>
          </div>
        </div>
      </section>
    );
  }

  // Debug: Check what we have
  console.log('📋 FINAL CHECK:');
  console.log('   Articles array length:', articles.length);
  console.log('   Featured article:', featuredArticle);
  console.log('   First article:', articles[0]);

  // If no featured article, show first article for debugging
  if (!featuredArticle) {
    console.log('⚠️ NO FEATURED ARTICLE FOUND, showing first article instead');
    if (articles.length > 0) {
      const firstArticle = articles[0];
      return (
        <section className={styles.featuredTechStory}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle}>
                <div className={styles.articleImage}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image}
                    priority
                  />
                  <div className={styles.categoryTag}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent}>
                  <h2 className={styles.articleTitle}>{firstArticle.title} (Fallback)</h2>
                  <p className={styles.articleDescription}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta}>
                    <span className={styles.author}>{firstArticle.author}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>{firstArticle.date}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.readTime}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton}>Read Full Analysis</button>
                </div>
              </article>
            </Link>
          </div>
        </section>
      );
    } else {
      console.log('❌ NO ARTICLES AT ALL');
      return null;
    }
  }

  console.log('✅ RENDERING FEATURED ARTICLE:', featuredArticle.title);
  
  return (
    <section className={styles.featuredTechStory}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle}>
            <div className={styles.articleImage}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image}
                priority
              />
              <div className={styles.categoryTag}>Featured</div>
            </div>
            
            <div className={styles.articleContent}>
              <h2 className={styles.articleTitle}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta}>
                <span className={styles.author}>{featuredArticle.author}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.date}>{featuredArticle.date}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedTechStory;