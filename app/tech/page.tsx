"use client";

import React from 'react';
import TechHeader from '../../components/tech/TechHeader';
import FeaturedTechStory from '../../components/tech/FeaturedTechStory';
import TechArticlesGrid from '../../components/tech/TechArticlesGrid';
import TrendingInTech from '../../components/tech/TrendingInTech';
import TechSubcategories from '../../components/tech/TechSubcategories';
import styles from './tech.module.css';

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