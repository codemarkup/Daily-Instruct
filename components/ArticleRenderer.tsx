"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// Import styles from the original page module
// We'll need to make sure this path is correct relative to where we put this component
import styles from "@/app/articles/[articleSlug]/article.module.css";
import { Article } from "@/services/admin-service";

interface ArticleRendererProps {
    article: Article;
    relatedArticles?: Article[];
}

const ArticleRenderer: React.FC<ArticleRendererProps> = ({
    article,
    relatedArticles = []
}) => {
    return (
        <div className={styles.articlePage}>
            {/* Article Hero Section */}
            <section className={styles.articleHero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.articleMeta}>
                            <span className={styles.category}>{article.category}</span>
                            <span className={styles.readTime}>{article.readTime}</span>
                        </div>

                        <h1 className={styles.articleTitle}>{article.title}</h1>
                        <p className={styles.articleExcerpt}>{article.description}</p>

                        <div className={styles.authorInfo}>
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>By {article.author}</span>
                                <span className={styles.publishDate}>{article.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroImage}>
                        {article.image && (
                            <Image
                                src={encodeURI(article.image.trim())}
                                alt={article.title}
                                width={800}
                                height={450}
                                className={styles.image}
                                priority
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className={styles.articleContent}>
                <div className="container">
                    <div className={styles.contentWrapper}>
                        {article.content && article.content.map((section, index) => {
                            if (section.type === "paragraph") {
                                return (
                                    <p key={index} className={styles.paragraph}>
                                        {section.text}
                                    </p>
                                );
                            } else if (section.type === "heading") {
                                return (
                                    <h2 key={index} className={styles.subheading}>
                                        {section.text}
                                    </h2>
                                );
                            } else if (section.type === "quote") {
                                return (
                                    <blockquote key={index} className={styles.quote}>
                                        <p>{section.text}</p>
                                        {section.author && (
                                            <cite>— {section.author}</cite>
                                        )}
                                    </blockquote>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className={styles.relatedArticles}>
                    <div className="container">
                        <h2 className={styles.relatedTitle}>Related Articles</h2>
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/articles/${relatedArticle.slug}`}
                                    className={styles.relatedCard}
                                >
                                    <div className={styles.relatedImage}>
                                        <Image
                                            src={relatedArticle.image}
                                            alt={relatedArticle.title}
                                            width={300}
                                            height={200}
                                            className={styles.image}
                                        />
                                    </div>
                                    <div className={styles.relatedContent}>
                                        <h3 className={styles.relatedCardTitle}>{relatedArticle.title}</h3>
                                        <p className={styles.relatedCardDescription}>{relatedArticle.description}</p>
                                        <div className={styles.relatedMeta}>
                                            <span className={styles.relatedAuthor}>{relatedArticle.author}</span>
                                            <span className={styles.relatedDate}>{relatedArticle.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ArticleRenderer;
