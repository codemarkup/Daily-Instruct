import React from 'react';
import HeroSection from '../components/HeroSection';
import LatestArticles from '../components/LatestArticles';
import TrendingSection from '../components/TrendingSection';
import CategoriesSection from '../components/CategoriesSection';
import NewsletterSection from '../components/NewsletterSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <LatestArticles />
      <TrendingSection />
      <CategoriesSection />
      <NewsletterSection />
    </>
  );
};

export default HomePage;