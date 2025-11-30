import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.footerLogo}>
              <span className={styles.logoSerif}>Daily</span>
              <span className={styles.logoSans}>Instruct</span>
            </div>
            <p className={styles.footerDescription}>
              Premium insights and analysis on technology, business, and innovation. 
              Trusted by professionals worldwide.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Categories</h4>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.footerLink}>Technology</a></li>
                <li><a href="#" className={styles.footerLink}>Business</a></li>
                <li><a href="#" className={styles.footerLink}>Startups</a></li>
                <li><a href="#" className={styles.footerLink}>Markets</a></li>
                <li><a href="#" className={styles.footerLink}>Science</a></li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Company</h4>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.footerLink}>About Us</a></li>
                <li><a href="#" className={styles.footerLink}>Careers</a></li>
                <li><a href="#" className={styles.footerLink}>Contact</a></li>
                <li><a href="#" className={styles.footerLink}>Press</a></li>
                <li><a href="#" className={styles.footerLink}>Partners</a></li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Legal</h4>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
                <li><a href="#" className={styles.footerLink}>Terms of Service</a></li>
                <li><a href="#" className={styles.footerLink}>Cookie Policy</a></li>
                <li><a href="#" className={styles.footerLink}>GDPR</a></li>
                <li><a href="#" className={styles.footerLink}>Disclaimer</a></li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Support</h4>
              <ul className={styles.linkList}>
                <li><a href="#" className={styles.footerLink}>Help Center</a></li>
                <li><a href="#" className={styles.footerLink}>Community</a></li>
                <li><a href="#" className={styles.footerLink}>Newsletter</a></li>
                <li><a href="#" className={styles.footerLink}>Feedback</a></li>
                <li><a href="#" className={styles.footerLink}>Status</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {currentYear} DailyInstruct. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy</a>
            <a href="#" className={styles.legalLink}>Terms</a>
            <a href="#" className={styles.legalLink}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;