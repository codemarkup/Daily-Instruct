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
        // Fetch from all categories
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

        // Combine all articles
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

  // Get featured article for homepage (can be from any category)
  const featuredArticle = articles.find(article => article.homeFeatured);
  
  // Get top stories for homepage (limit to 4, sorted by date - latest first)
  const topStories = articles
    .filter(article => article.homeTopStory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
    .slice(0, 4);

  if (loading) {
    return (
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.featuredArticle}>
              <div className={styles.loadingPlaceholder}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading featured article...</p>
              </div>
            </div>
            <div className={styles.topStories}>
              <h3 className={styles.storiesTitle}>Top Stories</h3>
              <div className={styles.loadingPlaceholder}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading top stories...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback if no featured article
  if (!featuredArticle) {
    return (
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.featuredArticle}>
              <div className={styles.noArticles}>
                <p>No featured article found</p>
                <Link href="/all-articles" className={styles.browseBtn}>
                  Browse All Articles
                </Link>
              </div>
            </div>
            <div className={styles.topStories}>
              <h3 className={styles.storiesTitle}>Top Stories</h3>
              {topStories.length > 0 ? (
                <div className={styles.storiesList}>
                  {topStories.map((story, index) => (
                    <Link 
                      key={`${story.category}-${story.id}`} 
                      href={`/articles/${story.slug}`}
                      className={styles.storyLink}
                    >
                      <div className={styles.storyCard}>
                        <div className={styles.storyNumber}>{(index + 1).toString().padStart(2, '0')}</div>
                        
                        <div className={styles.storyContent}>
                          <span className={styles.storyCategory}>{story.category}</span>
                          <h4 className={styles.storyTitle}>{story.title}</h4>
                          <div className={styles.storyMeta}>
                            <span className={styles.storyAuthor}>{story.author}</span>
                            <span className={styles.storyDate}>{story.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.noArticles}>
                  <p>No top stories available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Main Featured Article */}
          <div className={styles.featuredArticle}>
            <Link href={`/articles/${featuredArticle.slug}`} className={styles.featuredLink}>
              <div className={styles.articleImage}>
                <Image 
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  width={800}
                  height={500}
                  className={styles.articleImg}
                  priority
                />
                <div className={styles.categoryTag}>{featuredArticle.category}</div>
              </div>
              
              <div className={styles.articleContent}>
                <h1 className={styles.articleTitle}>{featuredArticle.title}</h1>
                <p className={styles.articleDescription}>{featuredArticle.description}</p>
                
                <div className={styles.articleMeta}>
                  <span className={styles.author}>{featuredArticle.author}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.date}>{featuredArticle.date}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.readTime}>{featuredArticle.readTime}</span>
                </div>
                
                <button className={styles.readArticleBtn}>Read Article</button>
              </div>
            </Link>
          </div>

          {/* Top Stories Sidebar */}
          <div className={styles.topStories}>
            <h3 className={styles.storiesTitle}>Top Stories</h3>
            
            {topStories.length > 0 ? (
              <div className={styles.storiesList}>
                {topStories.map((story, index) => (
                  <Link 
                    key={`${story.category}-${story.id}`} 
                    href={`/articles/${story.slug}`}
                    className={styles.storyLink}
                  >
                    <div className={styles.storyCard}>
                      <div className={styles.storyNumber}>{(index + 1).toString().padStart(2, '0')}</div>
                      
                      <div className={styles.storyContent}>
                        <span className={styles.storyCategory}>{story.category}</span>
                        <h4 className={styles.storyTitle}>{story.title}</h4>
                        <div className={styles.storyMeta}>
                          <span className={styles.storyAuthor}>{story.author}</span>
                          <span className={styles.storyDate}>{story.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noArticles}>
                <p>No top stories available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;