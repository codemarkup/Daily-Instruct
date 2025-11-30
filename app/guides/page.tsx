import React from 'react';
import GuidesHeader from '../../components/guides/GuidesHeader';
import FeaturedGuidesStory from '../../components/guides/FeaturedGuidesStory';
import GuidesArticlesGrid from '../../components/guides/GuidesArticlesGrid';
import TrendingInGuides from '../../components/guides/TrendingInGuides';
import GuidesSubcategories from '../../components/guides/GuidesSubcategories';
// import GuidesNewsletter from '../../components/guides/GuidesNewsletter';
import styles from './guides.module.css';

const GuidesPage: React.FC = () => {
  return (
    <div className={styles.guidesPage}>
      <GuidesHeader />
      <FeaturedGuidesStory />
      <GuidesArticlesGrid/>
      <TrendingInGuides/>
      <GuidesSubcategories/>
      {/* <GuidesNewsletter/> */}
    </div>
  );
};

export default GuidesPage;