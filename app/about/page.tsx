import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'About Us - Daily Instruct',
  description: 'Learn about Daily Instruct, a premium publication from Saad Capital Group delivering expert insights on technology, business, and innovation.',
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
              Premium insights from the intersection of technology, business, and innovation.
              A Saad Capital Group venture.
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
                At Daily Instruct, we're committed to delivering actionable insights and 
                in-depth analysis that empower professionals, entrepreneurs, and innovators 
                to navigate the rapidly evolving landscape of technology and business.
              </p>
              <p className={styles.missionText}>
                Founded under the visionary leadership of <strong>Saad Capital Group</strong>, 
                we combine financial expertise with technological insight to provide 
                unparalleled coverage of markets, emerging technologies, and business strategies.
              </p>
            </div>
            <div className={styles.missionImage}>
              <div className={styles.imagePlaceholder}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className={styles.leadershipSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Leadership</h2>
          <div className={styles.leadershipGrid}>
            <div className={styles.leaderCard}>
              <div className={styles.leaderImage}>
                <div className={styles.imagePlaceholder}></div>
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Saad</h3>
                <p className={styles.leaderTitle}>Founder & CEO, Saad Capital Group</p>
                <p className={styles.leaderBio}>
                  With over a decade of experience in forex, crypto trading, and blockchain 
                  technology, Saad leads strategic vision at Daily Instruct. His expertise 
                  in financial markets and emerging technologies forms the foundation of 
                  our analytical framework.
                </p>
              </div>
            </div>
            
            <div className={styles.leaderCard}>
              <div className={styles.leaderImage}>
                <div className={styles.imagePlaceholder}></div>
              </div>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Rana Umer</h3>
                <p className={styles.leaderTitle}>Co-Founder & Chief Content Officer</p>
                <p className={styles.leaderBio}>
                  As an established YouTube creator and content strategist, Umer brings 
                  digital media expertise to Daily Instruct. His understanding of audience 
                  engagement and content distribution ensures our insights reach and 
                  resonate with professionals worldwide.
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
                Our content helps you stay ahead with timely analysis of emerging 
                trends and opportunities.
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
                Our analysis considers global markets, technologies, and business 
                trends across continents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}