import React from 'react';
import GuidesHeader from '../../components/guides/GuidesHeader';
import FeaturedGuidesStory from '../../components/guides/FeaturedGuidesStory';
import GuidesArticlesGrid from '../../components/guides/GuidesArticlesGrid';
import TrendingInGuides from '../../components/guides/TrendingInGuides';
import GuidesSubcategories from '../../components/guides/GuidesSubcategories';
// import GuidesNewsletter from '../../components/guides/GuidesNewsletter';
import styles from './guides.module.css';

// app/guides/page.tsx
export const metadata = {
  title: 'How-To Guides & Tutorials | Daily Instruct',
  description: 'Step-by-step tutorials, how-to guides, and practical advice on technology, business, productivity, and life skills.',
  keywords: 'how-to guides, tutorials, step-by-step, learning, skills, productivity, DIY',
};

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