import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedMarketStory.module.css';


const FeaturedMarketStory = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('markets-articles.json');
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
        <section className={styles.featuredTechStory1}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle1}>
                <div className={styles.articleImage1}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image1}
                    priority
                  />
                  <div className={styles.categoryTag1}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent1}>
                  <h2 className={styles.articleTitle1}>{firstArticle.title}</h2>
                  <p className={styles.articleDescription1}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta1}>
                    <span className={styles.author1}>{firstArticle.author}</span>
                    <span className={styles.separator1}>•</span>
                    <span className={styles.date1}>{firstArticle.date}</span>
                    <span className={styles.separator1}>•</span>
                    <span className={styles.readTime1}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton1}>Read Full Analysis</button>
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
    <section className={styles.featuredTechStory1}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle1}>
            <div className={styles.articleImage1}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image1}
                priority
              />
              <div className={styles.categoryTag1}>Featured</div>
            </div>
            
            <div className={styles.articleContent1}>
              <h2 className={styles.articleTitle1}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription1}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta1}>
                <span className={styles.author1}>{featuredArticle.author}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.date1}>{featuredArticle.date}</span>
                <span className={styles.separator1}>•</span>
                <span className={styles.readTime1}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton1}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedMarketStory;