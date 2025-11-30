"use client";

import React, { useState } from "react";
import styles from "./MarketNewsLetter.module.css";

const MarketNewsLetter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Market newsletter subscription:", email);
    setEmail("");
  };

  return (
    <section className={styles.techNewsletter4}>
      <div className="container">
        <div className={styles.newsletterContainer4}>
          <div className={styles.newsletterContent4}>
            <h2 className={styles.newsletterTitle4}>Stay Ahead in Market</h2>
            <p className={styles.newsletterDescription4}>
              Get the latest technology insights, breakthrough research, and
              innovation trends delivered directly to your inbox. Join 50,000+
              tech professionals.
            </p>

            <form onSubmit={handleSubmit} className={styles.newsletterForm4}>
              <div className={styles.inputGroup4}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput4}
                  required
                />
                <button type="submit" className={styles.subscribeBtn4}>
                  Subscribe
                </button>
              </div>

              <p className={styles.newsletterNote4}>
                No spam. Unsubscribe at any time. Read our{" "}
                <a href="/privacy" className={styles.privacyLink4}>
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>

          <div className={styles.newsletterGraphic4}>
            <div className={styles.graphicElement4}>
              <div className={styles.circuitPattern4}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketNewsLetter;
