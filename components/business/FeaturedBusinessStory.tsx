import React from 'react';
import { readJsonFile, Article } from '../../lib/json-utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedBusinessStory.module.css';


const FeaturedBusinessStory = async () => {
  let articles: Article[] = [];
  try {
    const data = await readJsonFile<{ articles: Article[] }>('business-articles.json');
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
        <section className={styles.featuredTechStory22}>
          <div className="container">
            <Link href={`/articles/${firstArticle.slug}`}>
              <article className={styles.featuredArticle22}>
                <div className={styles.articleImage22}>
                  <Image 
                    src={firstArticle.image}
                    alt={firstArticle.title}
                    width={800}
                    height={500}
                    className={styles.image22}
                    priority
                  />
                  <div className={styles.categoryTag22}>Featured (Fallback)</div>
                </div>
                
                <div className={styles.articleContent22}>
                  <h2 className={styles.articleTitle22}>{firstArticle.title}</h2>
                  <p className={styles.articleDescription22}>{firstArticle.description}</p>
                  
                  <div className={styles.articleMeta22}>
                    <span className={styles.author22}>{firstArticle.author}</span>
                    <span className={styles.separator22}>•</span>
                    <span className={styles.date22}>{firstArticle.date}</span>
                    <span className={styles.separator22}>•</span>
                    <span className={styles.readTime22}>{firstArticle.readTime}</span>
                  </div>
                  
                  <button className={styles.readButton22}>Read Full Analysis</button>
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
    <section className={styles.featuredTechStory22}>
      <div className="container">
        <Link href={`/articles/${featuredArticle.slug}`}>
          <article className={styles.featuredArticle22}>
            <div className={styles.articleImage22}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.image22}
                priority
              />
              <div className={styles.categoryTag22}>Featured</div>
            </div>
            
            <div className={styles.articleContent22}>
              <h2 className={styles.articleTitle22}>{featuredArticle.title}</h2>
              <p className={styles.articleDescription22}>{featuredArticle.description}</p>
              
              <div className={styles.articleMeta22}>
                <span className={styles.author22}>{featuredArticle.author}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.date22}>{featuredArticle.date}</span>
                <span className={styles.separator22}>•</span>
                <span className={styles.readTime22}>{featuredArticle.readTime}</span>
              </div>
              
              <button className={styles.readButton22}>Read Full Analysis</button>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedBusinessStory;