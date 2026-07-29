import React from 'react';
import styles from '../legal-pages.module.css';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing your use of Daily Instruct services and content.',
};

export default function TermsOfServicePage() {
  const effectiveDate = 'December, 2024';
  
  return (
    <div className={styles.termsPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: '4rem' }}>Terms of Service</h1>
            <p className={styles.heroSubtitle} style={{ color: 'var(--accent-gold)' }}>Effective Date: {effectiveDate}</p>
            <p className={styles.heroDescription}>
              These Terms of Service govern your access to and use of Daily Instruct. 
              By accessing our services, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Daily Instruct, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service. If you do not 
                agree with any part of these terms, you must not use our services.
              </p>
            </div>


            <div className={styles.section}>
              <h2>2. Intellectual Property</h2>
              <p>
                All content on Daily Instruct, including articles, analysis, graphics, 
                and logos, is the property of Saad Capital Group or its licensors and 
                is protected by intellectual property laws. You may not reproduce, 
                distribute, or create derivative works without explicit permission.
              </p>
            </div>

  

            <div className={styles.section}>
              <h2>3. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or harmful code</li>
                <li>Attempt unauthorized access to our systems</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>4. Disclaimer of Warranties</h2>
              <p>
                Daily Instruct is provided "as is" without warranties of any kind. 
                We do not guarantee the accuracy, completeness, or reliability of 
                any content. Financial and investment decisions should not be based 
                solely on our content.
              </p>
            </div>

            <div className={styles.section}>
              <h2>5. Limitation of Liability</h2>
              <p>
                Saad Capital Group and its affiliates shall not be liable for any 
                indirect, incidental, or consequential damages arising from your use 
                of Daily Instruct.
              </p>
            </div>

            <div className={styles.section}>
              <h2>6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to Daily 
                Instruct at our sole discretion, without notice, for conduct that 
                we believe violates these terms or is harmful to other users.
              </p>
            </div>

            <div className={styles.section}>
              <h2>7. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with 
                the laws of the jurisdiction where Saad Capital Group is established, 
                without regard to its conflict of law provisions.
              </p>
            </div>

            <div className={styles.section}>
              <h2>8. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at 
                saadmehmood7741@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}