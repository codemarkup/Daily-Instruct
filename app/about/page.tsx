import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Daily Instruct, an explainers-and-analysis site from Saad Capital Group covering tech, business, markets, and global affairs.",
};

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About Daily Instruct</h1>
            <p className={styles.heroSubtitle}>
              Durable explainers and deep analysis across technology, business, markets, and global affairs. A Saad Capital Group venture.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
<section className={styles.missionSection}>
  <div className="container">
    <div className={styles.missionGrid}>
      <div className={styles.missionContent}>
        <h2 className={styles.sectionTitle}>Our Mission</h2>
        <p className={styles.missionText}>
          At Daily Instruct, we provide durable context on why major stories are happening and what they mean. Our mission is to empower professionals to navigate the rapidly evolving landscape of technology, business, markets, and global affairs through in-depth analysis and ongoing situation trackers.
        </p>
        <p className={styles.missionText}>
          Backed by <strong>Saad Capital Group</strong>, we combine deep domain expertise to go beyond breaking news, offering the analytical framework needed to understand the complexities of today's markets and international developments.
        </p>
      </div>
      <div className={styles.missionImage}>
        <img
          src="/images/leadership/mission.png"
          alt="Daily Instruct mission - empowering professionals with insights"
          className={styles.missionPhoto}
          loading="lazy"
        />
      </div>
    </div>
  </div>
</section>

      {/* Leadership Section */}
      <section className={styles.leadershipSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Leadership</h2>
          <div className={styles.leadershipGrid}>
            {/* Saad - Founder & CEO */}
            <div className={styles.leaderCard}>
              <div className={styles.leaderImage}>
                <img
                  src="/images/leadership/saad.png"
                  alt="Saad - Founder & CEO of Daily Instruct"
                  className={styles.leaderPhoto}
                  loading="lazy"
                />
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Saad</h3>
                <p className={styles.leaderTitle}>
                  Founder & CEO, Saad Capital Group
                </p>
                <p className={styles.leaderBio}>
                  With over a decade of experience in forex, crypto trading, and
                  blockchain technology, Saad leads strategic vision at Daily
                  Instruct. His expertise in financial markets and emerging
                  technologies forms the foundation of our analytical framework.
                </p>
              </div>
            </div>

            {/* Rana Umer - Co-Founder */}
            <div className={styles.leaderCard}>
              <div className={styles.leaderImage}>
                <img
                  src="/images/leadership/rana.jpg"
                  alt="Rana Umer - Co-Founder & Chief Content Officer of Daily Instruct"
                  className={styles.leaderPhoto}
                  loading="lazy"
                />
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Rana Umer</h3>
                <p className={styles.leaderTitle}>
                  Co-Founder & Chief Content Officer
                </p>
                <p className={styles.leaderBio}>
                  As an established YouTube creator and content strategist, Umer
                  brings digital media expertise to Daily Instruct. His
                  understanding of audience engagement and content distribution
                  ensures our insights reach and resonate with professionals
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💡</div>
              <h3 className={styles.valueTitle}>Expert Insight</h3>
              <p className={styles.valueDescription}>
                We provide analysis grounded in real-world experience and deep
                market understanding.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <h3 className={styles.valueTitle}>Timely Intelligence</h3>
              <p className={styles.valueDescription}>
                Our content helps you stay ahead with timely analysis of
                emerging trends and opportunities.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3 className={styles.valueTitle}>Actionable Advice</h3>
              <p className={styles.valueDescription}>
                We deliver practical insights that can be immediately applied to
                business and investment decisions.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌍</div>
              <h3 className={styles.valueTitle}>Global Perspective</h3>
              <p className={styles.valueDescription}>
                Our analysis considers global markets, technologies, and
                business trends across continents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}