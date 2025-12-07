"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import TechHeader from "@/components/tech/TechHeader";
import BusinessHeader from "@/components/business/BusinessHeader";
import MarketHeader from "@/components/markets/MarketHeader";
import GuidesHeader from "@/components/guides/GuidesHeader";
import styles from "./article.module.css";

interface ContentSection {
  type: 'paragraph' | 'heading' | 'quote';
  text: string;
  author?: string;
}

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
  content: ContentSection[];
}

interface ArticlesResponse {
  articles: Article[];
}

export default function ArticlePage() {
  const params = useParams();
  const articleSlug = params.articleSlug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL articles from GitHub
        const categories = ['tech', 'business', 'markets', 'guides'];
        let allArticles: Article[] = [];
        
        for (const cat of categories) {
          const filename = cat === 'markets' ? 'markets-articles.json' : `${cat}-articles.json`;
          try {
            const response = await fetch(
              `/api/github/articles?category=${cat}`, // Create this API route
              { cache: 'no-store' }
            );
            
            if (response.ok) {
              const data: ArticlesResponse = await response.json();
              allArticles = [...allArticles, ...data.articles];
            }
          } catch (error) {
            console.error(`Error fetching ${cat} articles:`, error);
          }
        }
        
        // Find current article
        const foundArticle = allArticles.find(a => a.slug === articleSlug);
        
        if (foundArticle) {
          setArticle(foundArticle);
          
          // Find related articles
          const related = allArticles
            .filter(a => a.category === foundArticle.category && 
                        a.specific === foundArticle.specific && 
                        a.id !== foundArticle.id)
            .slice(0, 3);
          setRelatedArticles(related);
        } else {
          // Article not found - you can redirect to 404
          console.error('Article not found:', articleSlug);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [articleSlug]);

  // Create API route first: /app/api/github/articles/route.ts
  async function fetchFromGitHub(category: string): Promise<ArticlesResponse> {
    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'codemarkup';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'Daily-Instruct';
    const filename = category === 'markets' ? 'markets-articles.json' : `${category}-articles.json`;
    
    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/data/${filename}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} articles`);
    }
    
    return await response.json();
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Article Not Found</h1>
        <p>The article you're looking for doesn't exist.</p>
        <Link href="/" className={styles.homeLink}>
          Go back home
        </Link>
      </div>
    );
  }

  // Determine which header to use
  const HeaderComponent = article.category === "Business" 
    ? BusinessHeader 
    : article.category === "Markets" 
    ? MarketHeader 
    : article.category === "Guides" 
    ? GuidesHeader 
    : TechHeader;

  return (
    <div className={styles.articlePage}>
      <HeaderComponent />
      
      {/* Article Hero Section */}
      <section className={styles.articleHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.articleMeta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.readTime}>{article.readTime}</span>
            </div>
            
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <p className={styles.articleExcerpt}>{article.description}</p>
            
            <div className={styles.authorInfo}>
              <div className={styles.authorDetails}>
                <span className={styles.authorName}>By {article.author}</span>
                <span className={styles.publishDate}>{article.date}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.heroImage}>
            <Image
              src={article.image}
              alt={article.title}
              width={800}
              height={450}
              className={styles.image}
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className={styles.articleContent}>
        <div className="container">
          <div className={styles.contentWrapper}>
            {article.content.map((section, index) => {
              if (section.type === "paragraph") {
                return (
                  <p key={index} className={styles.paragraph}>
                    {section.text}
                  </p>
                );
              } else if (section.type === "heading") {
                return (
                  <h2 key={index} className={styles.subheading}>
                    {section.text}
                  </h2>
                );
              } else if (section.type === "quote") {
                return (
                  <blockquote key={index} className={styles.quote}>
                    <p>{section.text}</p>
                    {section.author && (
                      <cite>— {section.author}</cite>
                    )}
                  </blockquote>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className={styles.relatedArticles}>
          <div className="container">
            <h2 className={styles.relatedTitle}>Related Articles</h2>
            <div className={styles.relatedGrid}>
              {relatedArticles.map((relatedArticle) => (
                <Link 
                  key={relatedArticle.id} 
                  href={`/articles/${relatedArticle.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImage}>
                    <Image
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      width={300}
                      height={200}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedCardTitle}>{relatedArticle.title}</h3>
                    <p className={styles.relatedCardDescription}>{relatedArticle.description}</p>
                    <div className={styles.relatedMeta}>
                      <span className={styles.relatedAuthor}>{relatedArticle.author}</span>
                      <span className={styles.relatedDate}>{relatedArticle.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}