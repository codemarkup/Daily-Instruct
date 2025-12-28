import React from 'react';
import FeaturedMarketStory from '../../components/markets/FeaturedMarketStory';
import MarketArticlesGrid from '../../components/markets/MarketArticlesGrid';
import TrendingInMarket from '../../components/markets/TrendingInMarket';
import MarketSubcategories from '../../components/markets/MarketSubcategories';
import styles from './market.module.css';
import MarketHeader from '../../components/markets/MarketHeader';
// import MarketNewsLetter from '../../components/markets/MarketNewsLetter';

// app/market/page.tsx
export const metadata = {
  title: 'Market Analysis & Financial Insights | Daily Instruct',
  description: 'Stock market updates, cryptocurrency news, investment strategies, and economic analysis. Make informed financial decisions.',
  keywords: 'stock market, cryptocurrency, investing, finance, trading, economics, investment tips',
};

const MarketPage: React.FC = () => {
  return (
    <div className={styles.marketPage}>
      <MarketHeader />
      <FeaturedMarketStory />
      <MarketArticlesGrid/>
      <TrendingInMarket/>
      <MarketSubcategories/>
      {/* <MarketNewsLetter/> */}
    </div>
  );
};

export default MarketPage;