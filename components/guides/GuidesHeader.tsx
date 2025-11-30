import React from 'react';
import styles from './GuidesHeader.module.css';

const GuidesHeader: React.FC = () => {
  return (
    <section className={styles.techHeader111}>
      <div className="container">
        <div className={styles.headerContent111}>
          <h1 className={styles.title111}>Guides</h1>
          <div className={styles.titleAccent111}></div>
          <p className={styles.subtitle111}>
            Latest insights in technology, innovation, and future trends.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuidesHeader;