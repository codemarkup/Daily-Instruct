"use client";

import React, { useState } from 'react';
import styles from './GuidesNewsletter.module.css';

const GuidesNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tech newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className={styles.techNewsletter666}>
      <div className="container">
        <div className={styles.newsletterContainer666}>
          <div className={styles.newsletterContent666}>
            <h2 className={styles.newsletterTitle666}>Stay Ahead in Guides</h2>
            <p className={styles.newsletterDescription666}>
              Get the latest technology insights, breakthrough research, and innovation 
              trends delivered directly to your inbox. Join 50,000+ tech professionals.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.newsletterForm666}>
              <div className={styles.inputGroup666}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput666}
                  required
                />
                <button type="submit" className={styles.subscribeBtn666}>
                  Subscribe
                </button>
              </div>
              
              <p className={styles.newsletterNote666}>
                No spam. Unsubscribe at any time. Read our{' '}
                <a href="/privacy" className={styles.privacyLink666}>Privacy Policy</a>.
              </p>
            </form>
          </div>
          
          <div className={styles.newsletterGraphic666}>
            <div className={styles.graphicElement666}>
              <div className={styles.circuitPattern666}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidesNewsletter;