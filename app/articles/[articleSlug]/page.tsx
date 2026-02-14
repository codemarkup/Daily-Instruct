import StructuredData from "@/components/StructuredData";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import TechHeader from "@/components/tech/TechHeader";
import BusinessHeader from "@/components/business/BusinessHeader";
import MarketHeader from "@/components/markets/MarketHeader";
import GuidesHeader from "@/components/guides/GuidesHeader";
import styles from "./article.module.css";
import { Metadata } from "next";
import { findArticleBySlug } from "@/lib/json-utils";
import ArticleRenderer from "@/components/ArticleRenderer";

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

// =========== ADD THIS SEO METADATA FUNCTION ===========
export async function generateMetadata({ params }: {
  params: Promise<{ articleSlug: string }>
}): Promise<Metadata> {
  const { articleSlug } = await params;

  try {
    const result = await findArticleBySlug(articleSlug);

    if (!result || !result.article) {
      return {
        title: "Article Not Found - Daily Instruct",
        description: "The article you're looking for doesn't exist.",
      };
    }

    const article = result.article;
    const url = `https://dailyinstruct.com/articles/${article.slug}`;

    return {
      title: article.metaDescription
        ? `${article.title} - Daily Instruct`
        : article.title,
      description: article.metaDescription || article.description.substring(0, 160),
      keywords: article.keywords || `${article.category}, ${article.specific}, tutorial`,
      alternates: {
        canonical: url,
      },
      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: article.title,
        description: article.metaDescription || article.description.substring(0, 160),
        images: [article.image],
        type: 'article',
        publishedTime: article.date,
        authors: [article.author],
        url: url,
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
      title: "Error Loading Article - Daily Instruct",
      description: "There was an error loading this article.",
    };
  }
}

// =========== MAIN PAGE COMPONENT ===========
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
      const { readJsonFile, getCategoryFilename } = await import('@/lib/json-utils');

      const filename = getCategoryFilename(category);
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

    return (
      <>
        <StructuredData
          headline={article.title}
          description={article.metaDescription || article.description}
          image={article.image}
          datePublished={article.date}
          author={article.author}
          slug={article.slug}
        />
        <ArticleRenderer article={article} relatedArticles={relatedArticles} />
      </>
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