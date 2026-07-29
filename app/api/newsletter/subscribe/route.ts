import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

async function syncToBrevo(email: string) {
  if (!process.env.BREVO_API_KEY) return;
  
  const listIds = process.env.BREVO_LIST_ID ? [parseInt(process.env.BREVO_LIST_ID)] : [];
  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: listIds,
        updateEnabled: true
      })
    });
    
    if (!brevoRes.ok) {
      const brevoError = await brevoRes.json();
      console.error('Brevo sync error:', brevoError);
    }
  } catch (brevoErr) {
    console.error('Failed to communicate with Brevo:', brevoErr);
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const limit = 5;
    const windowMs = 60 * 1000;
    const now = Date.now();
    
    if (rateLimitMap.has(ip)) {
      const data = rateLimitMap.get(ip)!;
      if (now > data.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (data.count >= limit) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      } else {
        data.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }

    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, unsubscribed_at')
      .eq('email', email)
      .single();
      
    if (existing) {
      if (!existing.unsubscribed_at) {
        return NextResponse.json({ success: true });
      } else {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ unsubscribed_at: null })
          .eq('email', email);
          
        if (updateError) throw updateError;
        await syncToBrevo(email);
        return NextResponse.json({ success: true });
      }
    }
    
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        unsubscribe_token: uuidv4()
      });
      
    if (insertError) throw insertError;

    await syncToBrevo(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe route error:', error);
    return NextResponse.json({ error: 'Failed to subscribe due to internal error' }, { status: 500 });
  }
}
