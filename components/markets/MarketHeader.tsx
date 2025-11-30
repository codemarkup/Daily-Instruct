import React from 'react';
import styles from './MarketHeader.module.css';

const MarketHeader: React.FC = () => {
  return (
    <section className={styles.techHeader2}>
      <div className="container">
        <div className={styles.headerContent2}>
          <h1 className={styles.title2}>Markets</h1>
          <div className={styles.titleAccent2}></div>
          <p className={styles.subtitle2}>
            Latest insights in financial markets, investments, and economic trends. {/* Updated */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketHeader;