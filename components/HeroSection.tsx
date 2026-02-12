"use client";

import React, { useEffect, useState } from 'react';
import styles from './HeroSection.module.css';
import Image from 'next/image';
import Link from 'next/link';

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

const HeroSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const [techRes, businessRes, marketRes, guidesRes] = await Promise.all([
          fetch('/api/github/articles?category=tech'),
          fetch('/api/github/articles?category=business'),
          fetch('/api/github/articles?category=markets'),
          fetch('/api/github/articles?category=guides')
        ]);

        const [techData, businessData, marketData, guidesData] = await Promise.all([
          techRes.json(),
          businessRes.json(),
          marketRes.json(),
          guidesRes.json()
        ]);

        const allArticles = [
          ...(techData.articles || []),
          ...(businessData.articles || []),
          ...(marketData.articles || []),
          ...(guidesData.articles || [])
        ];

        setArticles(allArticles);
      } catch (error) {
        console.error('Error fetching hero articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  const featuredArticles = articles.filter(article => article.homeFeatured);
  const featuredArticle = featuredArticles.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const topStories = articles
    .filter(article => article.homeTopStory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Limit to 3 for the bento sidebar

  if (loading) {
    return (
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticle) {
    return (
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.noArticles}>
            <p>No featured article found</p>
            <Link href="/all-articles" className={styles.browseBtn}>
              Browse All Articles
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>

          {/* LEFT: MAIN FEATURED ARTICLE (BENTO LARGE) */}
          <Link href={`/articles/${featuredArticle.slug}`} className={styles.featuredLink}>
            <div className={styles.featuredArticle}>
              <div className={styles.featuredImageContainer}>
                <Image
                  src={encodeURI(featuredArticle.image.trim())}
                  alt={featuredArticle.title}
                  fill
                  className={styles.featuredImg}
                  priority
                />
              </div>

              <div className={styles.featuredContent}>
                <span className={styles.categoryBadge}>{featuredArticle.category}</span>
                <h1 className={styles.featuredTitle}>{featuredArticle.title}</h1>
                <p className={styles.featuredDesc}>{featuredArticle.description}</p>

                <button className={styles.readMoreBtn}>
                  Read Story
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </Link>

          {/* RIGHT: TOP STORIES SIDEBAR */}
          <div className={styles.topStories}>
            <div className={styles.storiesHeader}>
              <span className={styles.sectionLabel}>Top Stories</span>
              <div className={styles.sectionLine}></div>
            </div>

            <div className={styles.storiesList}>
              {topStories.map((story) => (
                <Link
                  key={`${story.category}-${story.id}`}
                  href={`/articles/${story.slug}`}
                  className={styles.storyLink}
                >
                  <div className={styles.storyCard}>
                    <div className={styles.storyThumbnail}>
                      <Image
                        src={encodeURI(story.image.trim())}
                        alt={story.title}
                        fill
                        className={styles.storyThumbImg}
                      />
                    </div>
                    <div className={styles.storyContent}>
                      <span className={styles.storyCategory}>{story.category}</span>
                      <h4 className={styles.storyTitle}>{story.title}</h4>
                      <div className={styles.storyMeta}>
                        <span>{story.author}</span>
                        <span>•</span>
                        <span>{story.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {topStories.length === 0 && (
              <div className={styles.noArticles}>No top stories</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;