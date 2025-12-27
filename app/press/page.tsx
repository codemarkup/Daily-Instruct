import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Press - Daily Instruct',
  description: 'Press resources, media kit, and news about Daily Instruct.',
};

export default function PressPage() {
  return (
    <div className={styles.pressPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Press Room</h1>
            <p className={styles.heroDescription}>
              Media resources and information about Daily Instruct.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.pressContent}>

            <div className={styles.pressReleases}>
              <h2>Latest Press Releases</h2>
              <div className={styles.releaseList}>
                <div className={styles.release}>
                  <h3>Daily Instruct Launches Premium Analytics Platform</h3>
                  <span className={styles.date}>December 15, 2024</span>
                </div>
                <div className={styles.release}>
                  <h3>Saad Capital Group Expands Media Division</h3>
                  <span className={styles.date}>November 30, 2024</span>
                </div>
              </div>
            </div>

            <div className={styles.pressContact}>
              <h2>Press Contact</h2>
              <p>
                For media inquiries, please contact our press team at 
                na350331@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}