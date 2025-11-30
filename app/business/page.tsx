import React from 'react';
import BusinessHeader from '../../components/business/BusinessHeader';
import FeaturedBusinessStory from '../../components/business/FeaturedBusinessStory';
import BusinessArticlesGrid from '../../components/business/BusinessArticlesGrid';
import TrendingInBusiness from '../../components/business/TrendingInBusiness';
import BusinessSubcategories from '../../components/business/BusinessSubcategories';
// import BusinessNewsLetter from '../../components/business/BusinessNewsLetter';
import styles from './business.module.css';

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