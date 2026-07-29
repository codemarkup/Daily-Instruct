"use client";

import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing! Check your inbox soon.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <section style={{ 
      background: 'var(--secondary-white)', 
      border: '1px solid var(--gray-200)', 
      borderRadius: '24px', 
      padding: '48px 24px',
      marginTop: '64px',
      textAlign: 'center'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 480px) {
          .newsletter-row { flex-direction: column !important; }
          .newsletter-row button { width: 100%; }
        }
      `}} />
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-black)', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
        Stay Ahead of the Curve
      </h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto 32px' }}>
        Get our top stories, analysis, and breaking updates delivered straight to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '450px', margin: '0 auto', flexDirection: 'column' }}>
        <div className="newsletter-row" style={{ display: 'flex', gap: '12px', flexDirection: 'row' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={status === 'loading'}
            style={{ 
              flex: 1, 
              padding: '14px 20px', 
              borderRadius: '8px', 
              border: '1px solid var(--gray-300)',
              fontSize: '1rem',
              outline: 'none',
              background: 'var(--primary-white)'
            }}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            style={{ 
              padding: '14px 28px', 
              background: 'var(--primary-black)', 
              color: '#fff', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 600, 
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
              whiteSpace: 'nowrap'
            }}
            className="hover-lift"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {message && (
          <div style={{ 
            fontSize: '0.9rem', 
            color: status === 'success' ? '#10B981' : '#EF4444', 
            marginTop: '8px',
            fontWeight: 500
          }}>
            {message}
          </div>
        )}
      </form>
    </section>
  );
}
