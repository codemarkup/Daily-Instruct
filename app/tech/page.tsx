import React from 'react';
import TechHeader from '../../components/tech/TechHeader';
import FeaturedTechStory from '../../components/tech/FeaturedTechStory';
import TechArticlesGrid from '../../components/tech/TechArticlesGrid';
import TrendingInTech from '../../components/tech/TrendingInTech';
import TechSubcategories from '../../components/tech/TechSubcategories';
// import TechNewsletter from '../../components/tech/TechNewsletter';
import styles from './tech.module.css';

const TechPage: React.FC = () => {
  return (
    <div className={styles.techPage}>
      <TechHeader />
      <FeaturedTechStory />
      <TechArticlesGrid />
      <TrendingInTech />
      <TechSubcategories />
      {/* <TechNewsletter /> */}
    </div>
  );
};

export default TechPage;