import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Community',
  description: 'Join the Daily Instruct community of professionals, enthusiasts, and experts.',
};

export default function CommunityPage() {
  return (
    <div className={styles.communityPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Community</h1>
            <p className={styles.heroDescription}>
              Connect with professionals and enthusiasts in technology and business.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.communityContent}>
            <div className={styles.forumPreview}>
              <h2>Discussion Forums</h2>
              <p>Join conversations on trending topics:</p>
              <div className={styles.forumTopics}>
                <div className={styles.topic}>AI & Machine Learning</div>
                <div className={styles.topic}>Crypto & Blockchain</div>
                <div className={styles.topic}>Startup Funding</div>
                <div className={styles.topic}>Market Analysis</div>
              </div>
            </div>

            <div className={styles.eventsSection}>
              <h2>Upcoming Events</h2>
              <div className={styles.eventsList}>
                <div className={styles.event}>
                  <h3>Web3 Investment Strategies</h3>
                  <span className={styles.date}>January 15, 2025</span>
                </div>
                <div className={styles.event}>
                  <h3>AI in Business Summit</h3>
                  <span className={styles.date}>February 10, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}