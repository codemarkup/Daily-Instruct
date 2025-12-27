import React from "react";
import styles from "./page.module.css";

export const metadata = {
  title: "Privacy Policy - Daily Instruct",
  description:
    "Learn how Daily Instruct collects, uses, and protects your personal information in accordance with global privacy standards.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "December, 2024";

  return (
    <div className={styles.privacyPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <p className={styles.heroSubtitle}>Last Updated: {lastUpdated}</p>
            <p className={styles.heroDescription}>
              At Daily Instruct, we are committed to protecting your privacy and
              being transparent about how we collect, use, and safeguard your
              information. This Privacy Policy outlines our practices in
              compliance with global standards including GDPR, CCPA, and other
              regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.contentWrapper}>
            {/* Table of Contents */}
            <div className={styles.tableOfContents}>
              <h3 className={styles.tocTitle}>Contents</h3>
              <ul className={styles.tocList}>
                <li>
                  <a href="#your-rights">Your Rights & Choices</a>
                </li>
                <li>
                  <a href="#cookies">Cookies & Tracking</a>
                </li>
                <li>
                  <a href="#children">Children's Privacy</a>
                </li>
                <li>
                  <a href="#changes">Policy Changes</a>
                </li>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
              </ul>
            </div>

            {/* Policy Content */}
            <div className={styles.policyContent}>
              <section id="data-sharing" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>1. Legal Requirements</h2>
                <p>
                  We may disclose information when required by law, to protect
                  our rights, or in connection with:
                </p>
                <ul className={styles.policyList}>
                  <li>Compliance with legal obligations</li>
                  <li>Protection against legal liability</li>
                  <li>Prevention of fraud or security issues</li>
                  <li>
                    Protection of safety and rights of users or the public
                  </li>
                </ul>
              </section>

              <section id="data-security" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>2. Data Security</h2>
                <p>
                  We implement industry-standard security measures including:
                </p>
                <ul className={styles.policyList}>
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>
                    Secure server infrastructure with regular security updates
                  </li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </section>

              <section id="your-rights" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>
                  3.. Your Rights & Choices
                </h2>
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                <div className={styles.rightsGrid}>
                  <div className={styles.rightCard}>
                    <h4>Correction</h4>
                    <p>Request correction of inaccurate or incomplete data</p>
                  </div>
                </div>
                <p>
                  To exercise your rights, contact us at{" "}
                  <a href="mailto:privacy@dailyinstruct.com">
                    na350331@gmail.com
                  </a>
                </p>
              </section>

              <section id="cookies" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>
                  4. Cookies & Tracking Technologies
                </h2>
                <p>We use cookies and similar technologies for:</p>
                <ul className={styles.policyList}>
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic
                    functionality
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Analytics and
                    performance monitoring
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Personalization and
                    preferences
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Advertising and
                    targeting (with consent)
                  </li>
                </ul>
                <p>
                  You can manage cookie preferences through your browser
                  settings. Note that disabling certain cookies may affect
                  functionality.
                </p>
              </section>

              <section id="children" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>5. Children's Privacy</h2>
                <p>
                  Age-Appropriate Content Daily Instruct does not publish, host,
                  or distribute content that is inappropriate for users under 18
                  years of age. Our platform is dedicated exclusively to
                  educational and informative material suitable for general
                  audiences. We maintain strict content guidelines to ensure all
                  published material is appropriate for viewers of all ages. Our
                  editorial team reviews all content to verify it meets our
                  family-friendly standards and does not contain adult,
                  explicit, or age-restricted material.
                </p>
              </section>

              <section id="changes" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>
                  6. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify
                  you of significant changes.
                </p>
              </section>

              <section id="contact" className={styles.policySection}>
                <h2 className={styles.sectionTitle}>7. Contact Us</h2>
                <p>For privacy-related inquiries, please contact:</p>
                <div className={styles.contactInfo}>
                  <p>
                    <strong>Data Protection Officer</strong>
                  </p>
                  <p>Saad Capital Group</p>
                  <p>
                    Email:{" "}
                    <a href="na350331@gmail.com">
                      na350331@gmail.com
                    </a>
                  </p>
                  <p>Response Time: Within 30 days</p>
                </div>
                <p className={styles.complianceNote}>
                  This policy complies with GDPR, CCPA, LGPD, and other global
                  privacy regulations. Saad Capital Group is committed to
                  maintaining the highest standards of data protection.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
