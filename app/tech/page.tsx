// app/tech/page.tsx
import React from 'react';
import TechHeader from '../../components/tech/TechHeader';
import FeaturedTechStory from '../../components/tech/FeaturedTechStory';
import TechArticlesGrid from '../../components/tech/TechArticlesGrid';
import TrendingInTech from '../../components/tech/TrendingInTech';
import TechSubcategories from '../../components/tech/TechSubcategories';
import styles from './tech.module.css';

export const metadata = {
  title: 'Technology & Latest Tech Trends | Daily Instruct',
  description: 'Stay updated with the latest technology news, AI developments, software updates, and tech innovations. Daily coverage of emerging tech trends.',
  keywords: 'technology news, tech trends, AI, software, hardware, innovation, gadgets, tech reviews',
};

const TechPage: React.FC = () => {
  return (
    <div className={styles.techPage}>
      <TechHeader />
      <FeaturedTechStory />
      <TechArticlesGrid />
      <TrendingInTech />
      <TechSubcategories />
    </div>
  );
};

export default TechPage;