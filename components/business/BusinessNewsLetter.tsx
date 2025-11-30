"use client";

import React, { useState } from 'react';
import styles from './BusinessNewsLetter.module.css';

const BusinessNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Business newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className={styles.techNewsletter66}>
      <div className="container">
        <div className={styles.newsletterContainer66}>
          <div className={styles.newsletterContent66}>
            <h2 className={styles.newsletterTitle66}>Stay Ahead in Business</h2>
            <p className={styles.newsletterDescription66}>
              Get the latest technology insights, breakthrough research, and innovation 
              trends delivered directly to your inbox. Join 50,000+ tech professionals.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.newsletterForm66}>
              <div className={styles.inputGroup66}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput66}
                  required
                />
                <button type="submit" className={styles.subscribeBtn66}>
                  Subscribe
                </button>
              </div>
              
              <p className={styles.newsletterNote66}>
                No spam. Unsubscribe at any time. Read our{' '}
                <a href="/privacy" className={styles.privacyLink66}>Privacy Policy</a>.
              </p>
            </form>
          </div>
          
          <div className={styles.newsletterGraphic66}>
            <div className={styles.graphicElement66}>
              <div className={styles.circuitPattern66}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessNewsletter;