import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Contact Us - Daily Instruct',
  description: 'Get in touch with the Daily Instruct team for inquiries, partnerships, and support.',
};

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Contact Us</h1>
            <p className={styles.heroDescription}>
              We're here to help. Reach out to our team for any inquiries.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Contact Information</h2>
              <div className={styles.infoSection}>
                <h3>General Inquiries</h3>
                <p>
                  <a href="mailto:na350331@gmail.com" className={styles.emailLink}>
                    na350331@gmail.com
                  </a>
                </p>
              </div>
              <div className={styles.infoSection}>
                <h3>Editorial Team</h3>
                <p>
                  <a href="mailto:na350331@gmail.com" className={styles.emailLink}>
                    na350331@gmail.com
                  </a>
                </p>
              </div>
              
              {/* Direct Email Button Section */}
              <div className={styles.directEmailSection}>
                <h3>Quick Contact</h3>
                <p>Click below to email us directly</p>
                <a 
                  href="mailto:na350331@gmail.com?subject=Inquiry from Daily Instruct Website"
                  className={styles.directEmailButton}
                >
                  <span className={styles.emailIcon}>✉️</span>
                  Email Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}