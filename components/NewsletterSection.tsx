"use client";

import React, { useState } from 'react';
import styles from './NewsletterSection.module.css';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
    // Add your newsletter logic here
  };

  return (
    <section className={styles.newsletterSection}>
      <div className="container">
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>Stay Informed</h2>
            <p className={styles.newsletterDescription}>
              Get the latest insights, analysis, and breaking news delivered directly to your inbox. 
              Join thousands of professionals who trust DailyInstruct.
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
            <div className={styles.graphicElement}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;