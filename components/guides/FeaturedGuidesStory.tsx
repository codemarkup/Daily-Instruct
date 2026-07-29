import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedGuidesStory.module.css';


const FeaturedGuidesStory = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('guides-articles.json');
    articles = data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }


  // Get the first featured article
  // Get the most recent featured article
const featuredArticles = articles.filter(article => article.featured);
const featuredArticle = featuredArticles.length > 0 
  ? featuredArticles.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
  : undefined;

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