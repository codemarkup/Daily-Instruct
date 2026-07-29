import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { TrackerTimelinePreview } from '@/components/TrackerTimelinePreview';

export const metadata: Metadata = {
  title: 'Situation Trackers - Daily Instruct',
  description: 'Live updates and evergreen explainers on major geopolitical, tech, and business situations.',
};

export const revalidate = 60; // fallback revalidation

async function getTrackers() {
  const { data, error } = await supabase
    .from('trackers')
    .select('*, updates:tracker_updates(id, content, published_at, linked_article_id)')
    .eq('status', 'active')
    .order('priority', { ascending: false })
    .order('updated_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export default async function TrackersIndexPage() {
  const trackers = await getTrackers();
  
  return (
    <div className="trackers-page" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: 'var(--primary-white)' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-black)', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>Situation Trackers</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>
          Ongoing coverage and essential context on the world's most critical stories.
        </p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {trackers.map(tracker => (
          <div key={tracker.id}>
            <article style={{ background: 'var(--secondary-white)', border: '1px solid var(--gray-200)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s' }} 
                     className="tracker-card hover-lift">
              <Link href={`/trackers/${tracker.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                  <Image 
                    src={tracker.cover_image_url?.trim() ? (tracker.cover_image_url.startsWith('http') || tracker.cover_image_url.startsWith('/') ? tracker.cover_image_url : `/${tracker.cover_image_url}`) : '/images/default.png'} 
                    alt={tracker.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tracker.category}
                  </div>
                </div>
              </Link>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}></span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    Updated {new Date(tracker.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <Link href={`/trackers/${tracker.slug}`} style={{ textDecoration: 'none' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary-black)', marginBottom: '4px', lineHeight: 1.3 }}>{tracker.title}</h2>
                </Link>
                
                <TrackerTimelinePreview tracker={tracker} />
              </div>
            </article>
          </div>
        ))}
      </div>
      
      {trackers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
          <p>No active trackers at this time.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: var(--gray-300) !important; }
      `}} />
    </div>
  );
}
