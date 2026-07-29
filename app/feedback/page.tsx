import React from "react";
import styles from "../legal-pages.module.css";

export const metadata = {
  title: "Feedback",
  description: "Share your feedback to help us improve Daily Instruct.",
};

export default function FeedbackPage() {
  return (
    <div className={styles.feedbackPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: "4rem" }}>
              Feedback
            </h1>
            <p className={styles.heroDescription}>
              Your feedback helps us improve Daily Instruct.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.feedbackContent}>
            <div className={styles.feedbackForm}>
              <h2>Share Your Feedback</h2>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Feedback Type</label>
                  <select>
                    <option>General Feedback</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>Content Suggestion</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Your Feedback</label>
                  <textarea
                    placeholder="Please share your feedback..."
                    rows={6}
                  ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
