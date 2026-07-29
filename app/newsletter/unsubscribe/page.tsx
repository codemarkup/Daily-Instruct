import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function UnsubscribePage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  let success = false;
  let message = 'Invalid or missing unsubscribe token.';

  if (token) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
      .select('email')
      .single();

    if (!error && data) {
      success = true;
      message = `You have been successfully unsubscribed (${data.email}).`;
    }
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--primary-white)' }}>
      <div style={{ background: 'var(--secondary-white)', padding: '40px', borderRadius: '16px', border: '1px solid var(--gray-200)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '16px', color: 'var(--primary-black)' }}>
          {success ? 'Unsubscribed' : 'Error'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--gray-600)', marginBottom: '32px' }}>
          {message}
        </p>
        <Link href="/" style={{ padding: '12px 24px', background: 'var(--primary-black)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, display: 'inline-block' }} className="hover-lift">
          Return to Homepage
        </Link>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
      `}} />
    </div>
  );
}
