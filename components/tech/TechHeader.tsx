import React from 'react';
import styles from './TechHeader.module.css';

const TechHeader: React.FC = () => {
  return (
    <section className={styles.techHeader}>
      <div className="container">
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Tech</h1>
          <div className={styles.titleAccent}></div>
          <p className={styles.subtitle}>
            Latest insights in technology, innovation, and future trends.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechHeader;