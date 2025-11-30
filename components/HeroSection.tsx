import React from 'react';
import styles from './HeroSection.module.css';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const featuredArticle = {
    title: "The Future of Artificial Intelligence in Enterprise Solutions",
    category: "Tech",
    description: "How AI is transforming business operations and creating new opportunities for growth in the modern enterprise landscape.",
    author: "Sarah Chen",
    date: "March 15, 2024",
    readTime: "8 min read",
    image: "/images/hero/featured.png"
  };

  const topStories = [
    {
      title: "Quantum Computing Breakthrough Announced",
      category: "Science",
      author: "Dr. Michael Torres",
      date: "March 14, 2024"
    },
    {
      title: "Global Markets React to New Economic Policies",
      category: "Markets",
      author: "James Wilson",
      date: "March 14, 2024"
    },
    {
      title: "Startup Funding Trends in 2024",
      category: "Startups",
      author: "Emma Rodriguez",
      date: "March 13, 2024"
    },
    {
      title: "Sustainable Business Practices That Drive Profit",
      category: "Business",
      author: "Lisa Park",
      date: "March 13, 2024"
    }
  ];

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Main Featured Article */}
          <div className={styles.featuredArticle}>
            <div className={styles.articleImage}>
              <Image 
                src={featuredArticle.image}
                alt={featuredArticle.title}
                width={800}
                height={500}
                className={styles.articleImg}
                priority // Important for above-the-fold images
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
          </div>

          {/* Top Stories Sidebar */}
          <div className={styles.topStories}>
            <h3 className={styles.storiesTitle}>Top Stories</h3>
            
            <div className={styles.storiesList}>
              {topStories.map((story, index) => (
                <div key={index} className={styles.storyCard}>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;