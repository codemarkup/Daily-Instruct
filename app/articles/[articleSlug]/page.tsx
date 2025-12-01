import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TechHeader from "@/components/tech/TechHeader";
import BusinessHeader from "@/components/business/BusinessHeader";
import MarketHeader from "@/components/markets/MarketHeader";
import GuidesHeader from "@/components/guides/GuidesHeader"; // Add GuidesHeader
import styles from "./article.module.css";

// Import JSON data from ALL categories
import techArticlesData from "@/data/tech-articles.json";
import businessArticlesData from "@/data/business-articles.json";
import marketArticlesData from "@/data/markets-articles.json";
import guidesArticlesData from "@/data/guides-articles.json"; // Add Guides data

interface ArticlePageProps {
  params: Promise<{ articleSlug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { articleSlug } = await params;

  // Search for article in ALL data sources
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles,
    ...marketArticlesData.articles,
    ...guidesArticlesData.articles // Add Guides articles
  ];
  const article = allArticles.find((article) => article.slug === articleSlug);

  if (!article) {
    notFound();
  }

  // Determine which header to use based on category
  const HeaderComponent = article.category === "Business" 
    ? BusinessHeader 
    : article.category === "Markets" 
    ? MarketHeader 
    : article.category === "Guides" 
    ? GuidesHeader 
    : TechHeader;

  // Find related articles from the same category and specific subcategory
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.specific === article.specific && a.id !== article.id)
    .slice(0, 3);

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

      {/* You can add your footer component here */}
    </div>
  );
}