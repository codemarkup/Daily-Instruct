import React from 'react';
import styles from './HeroSection.module.css';
import Image from 'next/image';
import Link from 'next/link';
import techArticlesData from '@/data/tech-articles.json';
import businessArticlesData from '@/data/business-articles.json';

const HeroSection: React.FC = () => {
  // Combine articles from both categories
  const allArticles = [
    ...techArticlesData.articles,
    ...businessArticlesData.articles
  ];
  
  // Get featured article for homepage (can be from either category)
  const featuredArticle = allArticles.find(article => article.homeFeatured);
  
  // Get top stories for homepage (limit to 4, can be from either category)
  const topStories = allArticles
    .filter(article => article.homeTopStory)
    .slice(0, 4);

  // Fallback if no featured article
  if (!featuredArticle) {
    return (
      <section className={styles.heroSection}>
        <div className="container">
          <p>No featured article found</p>
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
            
            <div className={styles.storiesList}>
              {topStories.map((story, index) => (
                <Link 
                  key={story.id} 
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;