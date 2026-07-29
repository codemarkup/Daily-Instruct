import React from 'react';
import Link from 'next/link';

export const TrackerTimelinePreview = ({ tracker }: { tracker: any }) => {
  const updates = tracker.updates 
    ? [...tracker.updates]
        .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()) 
    : [];
  const topUpdates = updates.slice(0, 4);

  if (topUpdates.length === 0) {
    return (
      <div style={{ marginTop: '8px' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--gray-600)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tracker.summary}</p>
        <div style={{ marginTop: '16px' }}>
          <Link href={`/trackers/${tracker.slug}`} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all updates <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date().toDateString();

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Sleeker vertical line with gradient fade */}
        <div style={{ position: 'absolute', left: '7px', top: '12px', bottom: '12px', width: '2px', background: 'linear-gradient(to bottom, #ef4444 0%, var(--gray-200) 40%, var(--gray-200) 100%)', opacity: 0.8 }}></div>
        
        {topUpdates.map((update: any, idx: number) => {
          const date = new Date(update.published_at);
          const isToday = date.toDateString() === today;
          const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const dateStr = isToday ? timeStr : `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
          
          const isLatest = idx === 0;

          return (
            <div key={update.id || idx} style={{ position: 'relative', paddingBottom: idx === topUpdates.length - 1 ? '0' : '28px' }} className="timeline-entry">
              {/* Dynamic Dot */}
              <div style={{ 
                position: 'absolute', 
                left: '-28px', 
                top: isLatest ? '5px' : '7px', 
                width: isLatest ? '12px' : '10px', 
                height: isLatest ? '12px' : '10px', 
                borderRadius: '50%', 
                background: isLatest ? '#ef4444' : 'var(--primary-white)', 
                border: isLatest ? 'none' : '2px solid var(--gray-300)',
                boxShadow: isLatest ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
                animation: isLatest ? 'pulse 2s infinite' : 'none',
                zIndex: 2
              }}></div>
              
              {/* Timestamp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: isLatest ? 700 : 600, color: isLatest ? '#ef4444' : 'var(--gray-500)' }}>
                  {dateStr}
                </span>
              </div>
              
              {/* Content */}
              {update.linked_article_id ? (
                <Link href={`/api/redirect-article?id=${update.linked_article_id}`} style={{ textDecoration: 'none', display: 'block' }} className="timeline-link group">
                  <div style={{ 
                    fontSize: '1.05rem', 
                    lineHeight: 1.4, 
                    color: 'var(--primary-black)', 
                    fontWeight: isLatest ? 700 : 600,
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    transition: 'color 0.2s ease',
                  }} className="hover-gold-text">
                    {update.content}
                  </div>
                </Link>
              ) : (
                <div style={{ 
                  fontSize: '1rem', 
                  lineHeight: 1.5, 
                  color: isLatest ? 'var(--primary-black)' : 'var(--secondary-black)', 
                  fontWeight: isLatest ? 500 : 400,
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden' 
                }}>
                  {update.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--gray-200)' }}>
        <Link href={`/trackers/${tracker.slug}`} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-black)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="hover-gold-text">
          View full timeline
          <span style={{ color: 'var(--accent-gold)' }}>→</span>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .timeline-link:hover .hover-gold-text {
          color: var(--accent-gold) !important;
        }
        .hover-gold-text:hover {
          color: var(--accent-gold) !important;
        }
      `}} />
    </div>
  );
};
