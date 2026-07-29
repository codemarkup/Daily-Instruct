import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTracker(slug: string) {
  const { data: tracker, error } = await supabase
    .from('trackers')
    .select('*, updates:tracker_updates(*, articles(*))')
    .eq('slug', slug)
    .single();

  if (error || !tracker) return null;

  if (tracker.updates) {
    tracker.updates.sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  return tracker;
}

// Ensure statically generated for all known trackers
export async function generateStaticParams() {
  const { data } = await supabase.from('trackers').select('slug');
  return (data || []).map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tracker = await getTracker(slug);

  if (!tracker) return { title: 'Tracker Not Found' };

  return {
    title: `${tracker.title} - Situation Tracker | Daily Instruct`,
    description: tracker.summary,
    openGraph: {
      title: tracker.title,
      description: tracker.summary,
      images: [tracker.cover_image_url],
      type: 'article',
      modifiedTime: tracker.updated_at,
    },
  };
}

export default async function TrackerPage({ params }: Props) {
  const { slug } = await params;
  const tracker = await getTracker(slug);

  if (!tracker) notFound();

  // Tag-based revalidation via next config (using fetch options if possible, 
  // but Next 15 App router caches based on the fetch call).
  // In Next.js app router, the fetch API accepts `next: { tags: ['tracker:slug'] }`.
  // Since we use the supabase client directly, we rely on the global path revalidation or layout revalidation.
  // We will let the API /api/revalidate handle the path `revalidatePath('/trackers/[slug]')`.

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": tracker.title,
    "description": tracker.summary,
    "image": tracker.cover_image_url,
    "datePublished": tracker.created_at,
    "dateModified": tracker.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Daily Instruct"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div style={{ background: 'var(--primary-white)', minHeight: '100vh', padding: '40px 20px', color: 'var(--primary-black)' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Tracker Header */}
          <header style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Situation Tracker
              </span>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {tracker.category}
              </span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>
              {tracker.title}
            </h1>

            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--gray-600)', marginBottom: '32px' }}>
              {tracker.summary}
            </p>

            <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(135deg, var(--gray-800), var(--primary-black))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tracker.cover_image_url?.trim() ? (
                <img 
                  src={tracker.cover_image_url.startsWith('http') || tracker.cover_image_url.startsWith('/') ? tracker.cover_image_url : `/${tracker.cover_image_url}`} 
                  alt={tracker.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ color: 'var(--gray-400)', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '2px' }}>{tracker.title}</span>
              )}
            </div>
          </header>

          {/* Timeline Grid */}
          <div className="timeline-grid">

            {tracker.updates?.filter((u: any) => u.articles).length === 0 ? (
              <p style={{ color: 'var(--gray-500)', fontStyle: 'italic', padding: '24px 0' }}>No updates posted yet.</p>
            ) : (
              tracker.updates?.filter((u: any) => u.articles).map((update: any, index: number) => {
                const date = new Date(update.published_at);
                const isLatest = index === 0;

                return (
                  <div key={update.id} style={{ position: 'relative', paddingLeft: '32px' }} className="timeline-entry">
                    {/* Vertical line connecting to next item in this column */}
                    <div className="timeline-line" style={{
                      position: 'absolute',
                      left: isLatest ? '5px' : '6px',
                      top: isLatest ? '20px' : '16px',
                      bottom: '-48px',
                      width: '2px',
                      background: isLatest
                        ? 'linear-gradient(to bottom, #ef4444 0%, var(--gray-200) 40%, transparent 100%)'
                        : 'linear-gradient(to bottom, var(--gray-200) 0%, var(--gray-200) 70%, transparent 100%)',
                      opacity: 0.8,
                      zIndex: 0
                    }}></div>

                    {/* Dynamic Dot */}
                    <div style={{
                      position: 'absolute',
                      left: isLatest ? '-1px' : '0',
                      top: isLatest ? '8px' : '10px',
                      width: isLatest ? '14px' : '12px',
                      height: isLatest ? '14px' : '12px',
                      borderRadius: '50%',
                      background: isLatest ? '#ef4444' : 'var(--primary-white)',
                      border: isLatest ? 'none' : '2px solid var(--gray-300)',
                      boxShadow: isLatest ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none',
                      animation: isLatest ? 'pulse 2s infinite' : 'none',
                      zIndex: 2
                    }}></div>

                    {/* Timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: isLatest ? 700 : 600, color: isLatest ? '#ef4444' : 'var(--gray-500)' }}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {isLatest && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          LATEST
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: update.source_note ? '16px' : '0' }}>
                      <Link href={`/articles/${update.articles.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="timeline-article-card hover-lift group">
                        {/* Rich Article Card */}
                        <div style={{
                          background: 'var(--primary-white)',
                          border: '1px solid var(--gray-200)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                          transition: 'all 0.3s ease',
                        }}>
                          {/* Article Image */}
                          <div style={{ position: 'relative', width: '100%', height: '220px', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {update.articles.image?.trim() ? (
                              <img 
                                src={update.articles.image} 
                                alt={update.articles.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem', fontWeight: 600 }}>ARTICLE LINK</span>
                            )}
                          </div>
                          
                          {/* Article Details */}
                          <div style={{ padding: '24px' }}>
                            <div style={{ 
                              fontSize: '1.25rem', 
                              lineHeight: 1.4, 
                              color: 'var(--primary-black)', 
                              fontWeight: 700,
                              marginBottom: '12px',
                              transition: 'color 0.2s ease',
                            }} className="hover-gold-text">
                              {update.articles.title}
                            </div>
                            <p style={{ 
                              fontSize: '1rem', 
                              color: 'var(--gray-600)', 
                              lineHeight: 1.6,
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden'
                            }}>
                              {update.articles.description}
                            </p>
                            <div style={{ marginTop: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                              Read Article →
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Source Note */}
                    {update.source_note && (
                      <div style={{ fontSize: '0.95rem', color: 'var(--gray-500)', fontStyle: 'italic', borderLeft: '3px solid var(--gray-200)', paddingLeft: '16px', marginTop: '16px' }}>
                        {update.source_note}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </article>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .timeline-link:hover .hover-gold-text, .timeline-article-card:hover .hover-gold-text {
          color: var(--accent-gold) !important;
        }
        .hover-gold-text:hover {
          color: var(--accent-gold) !important;
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px 32px;
        }
        @media (min-width: 768px) {
          .timeline-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}} />
    </>
  );
}
