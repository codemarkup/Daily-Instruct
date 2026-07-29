import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase admin client (Service Role) to bypass RLS for writing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Basic comprehensive bot/crawler regex
const BOT_REGEX = /bot|crawler|spider|crawling|slurp|facebookexternalhit|whatsapp|google-read-aloud|googlebot|bingbot|yandex|duckduckbot|baiduspider|archive.org_bot|vercel-cron|vercelbot/i;

function getDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Same-origin check
    const origin = req.headers.get('origin') || '';
    const host = req.headers.get('host') || '';
    
    // In production, enforce origin matches host or our actual domain
    if (process.env.NODE_ENV === 'production') {
      if (!origin.includes('dailyinstruct.com') && !host.includes('dailyinstruct.com')) {
        return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
      }
    }

    // 2. Bot filtering
    const userAgent = req.headers.get('user-agent') || '';
    if (!userAgent || BOT_REGEX.test(userAgent)) {
      return new NextResponse(null, { status: 204 }); // Ignore silently
    }

    // 3. Extract request details
    let path = '/';
    try {
      const body = await req.json();
      path = body.path || '/';
    } catch (e) {
      // Ignored
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const referrer = req.headers.get('referer') || '';
    let referrerDomain = null;
    try {
      if (referrer && !referrer.includes(host)) {
        referrerDomain = new URL(referrer).hostname;
      }
    } catch(e) {}

    const country = req.headers.get('x-vercel-ip-country') || 'Localhost';
    const deviceType = getDeviceType(userAgent);

    // 4. Rate Limiting (Lightweight Postgres)
    // Create an ephemeral IP hash specifically for rate-limiting
    const rlHash = crypto.createHash('sha256').update(ip + (process.env.ANALYTICS_SALT || 'salt')).digest('hex');
    
    // Fetch current rate limit record
    const { data: rlData } = await supabase.from('rate_limits').select('*').eq('ip_hash', rlHash).single();
    
    const now = new Date();
    if (rlData) {
      const windowStart = new Date(rlData.window_start);
      // Reset window every 1 minute
      if (now.getTime() - windowStart.getTime() > 60000) {
        await supabase.from('rate_limits').upsert({ ip_hash: rlHash, requests: 1, window_start: now.toISOString() });
      } else {
        if (rlData.requests > 30) {
          return new NextResponse(null, { status: 429 }); // Too many requests
        }
        await supabase.from('rate_limits').update({ requests: rlData.requests + 1 }).eq('ip_hash', rlHash);
      }
    } else {
      await supabase.from('rate_limits').insert({ ip_hash: rlHash, requests: 1, window_start: now.toISOString() });
    }

    // 5. Derive secure, non-reversible same-day visitor hash
    const today = new Date().toISOString().split('T')[0];
    const visitorHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${today}-${process.env.ANALYTICS_SALT || 'salt'}`)
      .digest('hex');

    // 6. Write to database (Batch/Transaction simulation using parallel promises where possible)
    
    // Check uniqueness for today
    const { data: existingHash } = await supabase
      .from('visitor_hashes')
      .select('id')
      .eq('day', today)
      .eq('hash', visitorHash)
      .eq('path', path)
      .single();

    const isUnique = !existingHash;

    if (isUnique) {
      await supabase.from('visitor_hashes').insert({ day: today, hash: visitorHash, path });
    }

    // Prepare upsert for daily_page_stats via RPC if we had it, but we can use standard upsert if we select first, 
    // OR Supabase handles it if we do an RPC. Since we want to increment, it's safest to write an RPC.
    // However, without RPC, we can just do a read-then-write or use Postgres ON CONFLICT DO UPDATE.
    // Supabase allows calling an RPC for atomic increments, but we can also just let a cron compute totals or do read-write.
    // Wait, Supabase REST API doesn't support increment directly on Upsert without an RPC. 
    // Let's implement the Postgres function in our migration for atomic tracking.
    
    // I will call an RPC function `track_analytics_event` which does everything atomically.
    await supabase.rpc('track_analytics_event', {
      p_day: today,
      p_path: path,
      p_is_unique: isUnique,
      p_referrer: referrerDomain,
      p_country: country,
      p_device: deviceType,
      p_hash: visitorHash
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
