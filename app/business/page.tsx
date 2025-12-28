import React from 'react';
import BusinessHeader from '../../components/business/BusinessHeader';
import FeaturedBusinessStory from '../../components/business/FeaturedBusinessStory';
import BusinessArticlesGrid from '../../components/business/BusinessArticlesGrid';
import TrendingInBusiness from '../../components/business/TrendingInBusiness';
import BusinessSubcategories from '../../components/business/BusinessSubcategories';
// import BusinessNewsLetter from '../../components/business/BusinessNewsLetter';
import styles from './business.module.css';

// app/business/page.tsx
export const metadata = {
  title: 'Business News & Entrepreneurship | Daily Instruct',
  description: 'Latest business news, entrepreneurship tips, startup advice, and market analysis. Learn business strategies and leadership skills.',
  keywords: 'business news, entrepreneurship, startups, finance, leadership, marketing, management',
};

const BusinessPage: React.FC = () => {
  return (
    <div className={styles.businessPage}>
      <BusinessHeader />
      <FeaturedBusinessStory />
      <BusinessArticlesGrid/>
      <TrendingInBusiness/>
      <BusinessSubcategories/>
      {/* <BusinessNewsLetter/> */}
    </div>
  );
};

export default BusinessPage;