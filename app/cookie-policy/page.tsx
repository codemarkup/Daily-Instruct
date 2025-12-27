import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Cookie Policy - Daily Instruct',
  description: 'Learn about how Daily Instruct uses cookies and similar technologies to enhance your browsing experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className={styles.cookiePage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Cookie Policy</h1>
            <p className={styles.heroDescription}>
              This Cookie Policy explains how Daily Instruct uses cookies and 
              similar technologies to recognize you when you visit our website.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.cookieContent}>
            <div className={styles.section}>
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or 
                mobile device when you visit a website. Cookies are widely used 
                by website owners to make their websites work efficiently.
              </p>
            </div>

            <div className={styles.section}>
              <h2>How We Use Cookies</h2>
              <div className={styles.cookieTypes}>
                <div className={styles.cookieType}>
                  <h3>Essential Cookies</h3>
                  <p>Required for basic site functionality and security.</p>
                </div>
                <div className={styles.cookieType}>
                  <h3>Performance Cookies</h3>
                  <p>Help us understand how visitors interact with our site.</p>
                </div>
                <div className={styles.cookieType}>
                  <h3>Functional Cookies</h3>
                  <p>Enable enhanced functionality and personalization.</p>
                </div>
                <div className={styles.cookieType}>
                  <h3>Marketing Cookies</h3>
                  <p>Used to deliver relevant advertisements.</p>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Managing Cookies</h2>
              <p>
                You can control and/or delete cookies as you wish. You can delete 
                all cookies that are already on your computer and set most browsers 
                to prevent them from being placed.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Third-Party Cookies</h2>
              <p>
                We may also use various third-party cookies for analytics and 
                advertising purposes. These are subject to the respective privacy 
                policies of these third parties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}