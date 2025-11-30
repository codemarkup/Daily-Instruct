"use client";

import React, { useState } from 'react';
import styles from './TechNewsletter.module.css';

const TechNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tech newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className={styles.techNewsletter}>
      <div className="container">
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Stay Ahead in Tech</h2>
            <p className={styles.newsletterDescription}>
              Get the latest technology insights, breakthrough research, and innovation 
              trends delivered directly to your inbox. Join 50,000+ tech professionals.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </div>
              
              <p className={styles.newsletterNote}>
                No spam. Unsubscribe at any time. Read our{' '}
                <a href="/privacy" className={styles.privacyLink}>Privacy Policy</a>.
              </p>
            </form>
          </div>
          
          <div className={styles.newsletterGraphic}>
            <div className={styles.graphicElement}>
              <div className={styles.circuitPattern}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechNewsletter;