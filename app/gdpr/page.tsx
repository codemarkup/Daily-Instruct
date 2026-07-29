import React from "react";
import styles from "../legal-pages.module.css";

export const metadata = {
  title: "GDPR Compliance",
  description:
    "Information about Daily Instruct compliance with the General Data Protection Regulation (GDPR).",
};

export default function GDPRPage() {
  return (
    <div className={styles.gdprPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: "60px" }}>
              GDPR Compliance
            </h1>
            <p className={styles.heroDescription}>
              Daily Instruct's commitment to GDPR compliance and data
              protection.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.gdprContent}>
            <div className={styles.complianceSection}>
              <h2>GDPR Compliance Statement</h2>
              <p>
                Daily Instruct, as part of Saad Capital Group, is fully
                committed to complying with the General Data Protection
                Regulation (GDPR). We have implemented comprehensive measures to
                ensure the protection of personal data for all EU citizens.
              </p>
            </div>

            <div className={styles.rightsSection}>
              <h2>Your GDPR Rights</h2>
              <ul>
                <li>
                  <strong>Right to Rectification:</strong> Request correction of
                  inaccurate data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your
                  personal data
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> Request
                  limitation of data processing
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Receive your data
                  in a portable format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to data processing
                  under certain conditions
                </li>
              </ul>
            </div>

            <div className={styles.contactSection}>
              <h2>Data Protection Officer</h2>
              <p>
                For GDPR-related inquiries, please contact our Data Protection
                Officer:
              </p>
              <p className={styles.contactInfo}>
                Email: saadmehmood7741@gmail.com
                <br />
                Response Time: Within 30 days
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
