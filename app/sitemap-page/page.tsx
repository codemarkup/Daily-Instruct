import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Sitemap',
  description: 'Complete sitemap of Daily Instruct website structure and pages.',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Pages',
      pages: ['Home', 'Tech', 'Business', 'Markets', 'Guides', 'Search'],
    },
    {
      title: 'Company',
      pages: ['About Us', 'Contact', 'Press'],
    },
    {
      title: 'Legal',
      pages: ['Privacy Policy', 'Terms of Service', 'GDPR', 'Disclaimer'],
    },
    {
      title: 'Support',
      pages: ['FAQs', 'Feedback'],
    },
  ];

  return (
    <div className={styles.sitemapPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: '4rem' }}>Sitemap</h1>
            <p className={styles.heroDescription}>
              Complete directory of Daily Instruct website pages.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.sitemapContent}>
            {sections.map((section, index) => (
              <div key={index} className={styles.sitemapSection}>
                <h2>{section.title}</h2>
                <ul className={styles.pageList}>
                  {section.pages.map((page, pageIndex) => {
                    // Handle special cases for page URLs
                    let pageUrl = page.toLowerCase().replace(/\s+/g, '-');
                    if (page === 'Home') pageUrl = '/';
                    if (page === 'Search') pageUrl = '/search';
                    if (page === 'GDPR') pageUrl = '/gdpr';
                    if (page === 'FAQs') pageUrl = '/help-center';
                    
                    return (
                      <li key={pageIndex}>
                        <a href={pageUrl}>
                          {page}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}