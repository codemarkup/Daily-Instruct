import React from "react";
import styles from "../legal-pages.module.css";

export const metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimer regarding the content and information provided on Daily Instruct.",
};

export default function DisclaimerPage() {
  return (
    <div className={styles.disclaimerPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: "4rem" }}>
              Disclaimer
            </h1>
            <p className={styles.heroDescription}>
              Important information regarding the nature of our content and
              services.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.disclaimerContent}>
            <div className={styles.warningBox}>
              <h3>⚠️ Important Notice</h3>
              <p>
                The content on Daily Instruct is for informational purposes only
                and should not be considered financial, investment, or
                professional advice.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Financial Content Disclaimer</h2>
              <p>
                All investment and trading information provided on Daily
                Instruct is for educational purposes only. We are not financial
                advisors and do not provide personalized investment advice.
              </p>
              <p className={styles.important}>
                Past performance does not guarantee future results. Always
                conduct your own research and consult with qualified financial
                professionals before making investment decisions.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Accuracy of Information</h2>
              <p>
                While we strive to provide accurate and up-to-date information,
                we cannot guarantee the completeness or accuracy of all content.
                The financial and technology sectors change rapidly, and
                information may become outdated.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Third-Party Links</h2>
              <p>
                Daily Instruct may contain links to third-party websites. We are
                not responsible for the content, accuracy, or practices of these
                external sites.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Limitation of Liability</h2>
              <p>
                Saad Capital Group and Daily Instruct shall not be liable for
                any errors, omissions, or any losses, injuries, or damages
                arising from the use of our content.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Professional Advice</h2>
              <p>
                Always seek the advice of qualified professionals regarding your
                specific circumstances. Do not disregard professional advice or
                delay seeking it because of something you have read on Daily
                Instruct.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
