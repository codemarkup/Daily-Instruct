'use client';

import React, { useState } from 'react';
import styles from '../legal-pages.module.css';

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is Daily Instruct?',
      answer: 'Daily Instruct is an educational blogging platform that provides daily tutorials, how-to guides, and informative articles on various topics including technology, lifestyle, productivity, and learning resources.'
    },
    {
      question: 'Is Daily Instruct free to use?',
      answer: 'Yes, Daily Instruct is completely free! All our educational content, tutorials, and articles are available without any subscription fees or paywalls.'
    },
    {
      question: 'How often is new content published?',
      answer: 'We publish new educational content daily, with fresh tutorials, guides, and articles covering a wide range of topics to help you learn something new every day.'
    },
    {
      question: 'Can I contribute content to Daily Instruct?',
      answer: 'Yes! We welcome guest contributors and subject matter experts.'
    },
    {
      question: 'How can I search for specific topics?',
      answer: 'Use the search bar at the top of any page to find articles by keywords. You can also browse by categories through our topic sections or use the tag system to find related content.'
    },
    {
      question: 'Is the content suitable for all ages?',
      answer: 'Absolutely. Daily Instruct maintains family-friendly, educational content suitable for readers of all ages. We do not publish adult or inappropriate material.'
    },
    {
      question: 'Can I share articles with others?',
      answer: 'Yes! We encourage sharing our educational content.'
    },
    {
      question: 'Do you have a newsletter?',
      answer: 'We are working on it.'
    },
    {
      question: 'How can I contact the editorial team?',
      answer: 'For editorial inquiries, article suggestions, or content-related questions, please email us at na350331@gmail.com.'
    },
    {
      question: 'Can I use your content for educational purposes?',
      answer: 'Yes, our content can be used for personal and educational purposes. We encourage teachers, students, and lifelong learners to use our materials. Please provide proper attribution when sharing.'
    },
    {
      question: 'How do I report an error in an article?',
      answer: 'If you find any errors or outdated information in our articles, please contact us at saadmehmood7741@gmail.com with the article title and details about the correction needed.'
    },
    {
      question: 'Do you have mobile-friendly access?',
      answer: 'Yes, Daily Instruct is fully responsive and works perfectly on all devices including smartphones, tablets, and desktop computers. You can also save our site as a PWA for quick access.'
    }
  ];

  return (
    <div className={styles.faqPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle} style={{ marginTop: '2rem' }}>
              Frequently Asked Questions
            </h1>
            <p className={styles.heroDescription}>
              Find answers to common questions about Daily Instruct and how to make the most of our educational platform.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.faqContent}>
            <div className={styles.faqSection}>
              <h2>Common Questions</h2>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
                  >
                    <button 
                      className={styles.faqQuestion}
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={activeIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className={styles.questionIcon}>?</span>
                      <span className={styles.questionText}>{faq.question}</span>
                      <span className={styles.arrowIcon}>
                        {activeIndex === index ? '▲' : '▼'}
                      </span>
                    </button>
                    <div 
                      id={`faq-answer-${index}`}
                      className={styles.faqAnswer}
                      role="region"
                      aria-hidden={activeIndex !== index}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.supportSection}>
              <h2>Still Need Help?</h2>
              <div className={styles.supportGrid}>
                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>📧</div>
                  <h3>Email Support</h3>
                  <p>For general inquiries and support</p>
                  <a href="mailto:na350331@gmail.com" className={styles.supportLink}>
                    na350331@gmail.com
                  </a>
                </div>
                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>✏️</div>
                  <h3>Editorial Team</h3>
                  <p>For content-related questions</p>
                  <a href="mailto:na350331@gmail.com" className={styles.supportLink}>
                    na350331@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}