import React from "react";
import AdaptiveImage from "@/components/AdaptiveImage";
import Link from "next/link";
import TechHeader from "@/components/tech/TechHeader";
import BusinessHeader from "@/components/business/BusinessHeader";
import MarketHeader from "@/components/markets/MarketHeader";
import GuidesHeader from "@/components/guides/GuidesHeader";
import styles from "./article.module.css";
import { Metadata } from "next";
import { findArticleBySlug, getAllArticles } from "@/lib/json-utils";

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
  keywords?: string;
  metaDescription?: string;
}

// =========== SSG PARAMS ===========
export async function generateStaticParams() {
  const articles = await getAllArticles();
  
  return articles.map((article) => ({
    articleSlug: article.slug,
  }));
}

// =========== ADD THIS SEO METADATA FUNCTION ===========
export async function generateMetadata({ params }: { 
  params: Promise<{ articleSlug: string }>
}): Promise<Metadata> {
  const { articleSlug } = await params;
  
  try {
    const result = await findArticleBySlug(articleSlug);
    
    if (!result || !result.article) {
      return {
        title: "Article Not Found",
        description: "The article you're looking for doesn't exist.",
      };
    }

    const article = result.article;
    
    return {
      title: article.metaDescription 
        ? `${article.title} - Daily Instruct` 
        : article.title,
      description: article.metaDescription || article.description.substring(0, 160),
      keywords: article.keywords || `${article.category}, ${article.specific}, tutorial`,
      
      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: article.title,
        description: article.metaDescription || article.description.substring(0, 160),
        images: [article.image],
        type: 'article',
        publishedTime: article.date,
        authors: [article.author],
      },
      
      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.metaDescription || article.description.substring(0, 160),
        images: [article.image],
      },
    };
  } catch (error) {
    return {
      title: "Error Loading Article",
      description: "There was an error loading this article.",
    };
  }
}

// =========== MAIN PAGE COMPONENT ===========
export const revalidate = 3600;

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ articleSlug: string }>
}) {
  const { articleSlug } = await params;
  
  try {
    // Fetch the article data
    const result = await findArticleBySlug(articleSlug);
    
    if (!result || !result.article) {
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

    const article = result.article;
    const category = result.category;

    // Fetch related articles
    let relatedArticles: Article[] = [];
    
    try {
      // Import the functions we need
      const { readJsonFile } = await import('@/lib/json-utils');
      
      const filename = `${category}-articles.json`;
      const data = await readJsonFile<{ articles: Article[] }>(filename);
      
      relatedArticles = data.articles
        .filter(a => 
          a.specific === article.specific && 
          a.id !== article.id
        )
        .slice(0, 3);
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }

    // Determine which header to use
    const HeaderComponent = article.category.toLowerCase() === "business" 
      ? BusinessHeader 
      : article.category.toLowerCase() === "markets" 
      ? MarketHeader 
      : article.category.toLowerCase() === "guides" 
      ? GuidesHeader 
      : TechHeader;

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "image": [article.image],
      "datePublished": new Date(article.date).toISOString(),
      "dateModified": new Date(article.date).toISOString(),
      "author": [{
          "@type": "Person",
          "name": article.author
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Daily Instruct",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.dailyinstruct.com/og-image.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.dailyinstruct.com/articles/${article.slug}`
      }
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.dailyinstruct.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.category,
          "item": `https://www.dailyinstruct.com/${article.category.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://www.dailyinstruct.com/articles/${article.slug}`
        }
      ]
    };

    return (
      <div className={styles.articlePage}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {/* <HeaderComponent /> */}
        
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
              <AdaptiveImage
                src={article.image}
                alt={article.title}
                width={800}
                height={450}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 800px"
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
                      <AdaptiveImage
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        width={300}
                        height={200}
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 300px"
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
    
  } catch (error) {
    console.error("Error loading article:", error);
    
    return (
      <div className={styles.errorContainer}>
        <h1>Error Loading Article</h1>
        <p>There was an error loading this article. Please try again later.</p>
        <Link href="/" className={styles.homeLink}>
          Go back home
        </Link>
      </div>
    );
  }
}