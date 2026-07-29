import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedTechStory.module.css';


const FeaturedTechStory = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('tech-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Get the most recent featured article
  const featuredArticles = articles.filter(article => article.featured);
  
  // Debug: Check featured articles and their dates
  console.log('📅 FEATURED ARTICLES WITH DATES:');
  featuredArticles.forEach((article, index) => {
    const parsedDate = new Date(article.date);
    console.log(`${index + 1}. "${article.title}"`);
    console.log(`   Date string: "${article.date}"`);
    console.log(`   Parsed date: ${parsedDate}`);
    console.log(`   Valid date: ${!isNaN(parsedDate.getTime())}`);
    console.log(`   Timestamp: ${parsedDate.getTime()}`);
  });
  
  // Safe date sorting function
  const sortByDate = (a: Article, b: Article) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    const timeA = dateA.getTime();
    const timeB = dateB.getTime();
    
    // Check if dates are valid
    const isValidA = !isNaN(timeA);
    const isValidB = !isNaN(timeB);
    
    if (!isValidA && !isValidB) return 0;
    if (!isValidA) return 1; // Invalid dates go to end
    if (!isValidB) return -1; // Valid dates go first
    
    return timeB - timeA; // Newest first (descending)
  };
  
  const featuredArticle = featuredArticles.length > 0 
    ? featuredArticles.sort(sortByDate)[0]
    : undefined;
  
  console.log('🎯 FEATURED ARTICLE FOUND:', featuredArticle?.title || 'NONE');
  if (featuredArticle) {
    console.log('📅 SELECTED ARTICLE DATE:', featuredArticle.date);
    console.log('📅 PARSED DATE:', new Date(featuredArticle.date));
  }

  // Debug: Check what we have
  console.log('📋 FINAL CHECK:');
  console.log('   Articles array length:', articles.length);
  console.log('   Featured article:', featuredArticle);
  console.log('   First article:', articles[0]);

  // If no featured article, show most recent article for debugging
  if (!featuredArticle) {
    console.log('⚠️ NO FEATURED ARTICLE FOUND, showing most recent article instead');
    if (articles.length > 0) {
      const recentArticle = articles.sort(sortByDate)[0];
      return (
        <section className={styles.featuredTechStory}>
          <div className="container">
            <Link href={`/articles/${recentArticle.slug}`}>
              <article className={styles.featuredArticle}>
                <div className={styles.articleImage}>
                  <Image 
                    src={recentArticle.image}
                    alt={recentArticle.title}
                    width={800}
                    height={500}
                    className={styles.image}
                    priority
                  />
                  <div className={styles.categoryTag}>Featured (Fallback - Most Recent)</div>
                </div>
                
                <div className={styles.articleContent}>
                  <h2 className={styles.articleTitle}>{recentArticle.title} (Fallback - Most Recent)</h2>
                  <p className={styles.articleDescription}>{recentArticle.description}</p>
                  
                  <div className={styles.articleMeta}>
                    <span className={styles.author}>{recentArticle.author}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>{recentArticle.date}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.readTime}>{recentArticle.readTime}</span>
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