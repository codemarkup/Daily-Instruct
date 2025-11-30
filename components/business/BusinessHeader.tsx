import React from 'react';
import styles from './BusinessHeader.module.css';

const BusinessHeader: React.FC = () => {
  return (
    <section className={styles.techHeader11}>
      <div className="container">
        <div className={styles.headerContent11}>
          <h1 className={styles.title11}>Business</h1>
          <div className={styles.titleAccent11}></div>
          <p className={styles.subtitle11}>
            Latest insights in technology, innovation, and future trends.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BusinessHeader;