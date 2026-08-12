import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a standard supabase client for backend operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // Basic shared-secret authorization to prevent random pings
    const authHeader = request.headers.get('authorization');
    const CRON_SECRET = process.env.CRON_SECRET || 'fallback-cron-secret-change-me';

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // 1. Delete visitor_hashes older than 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

    const { error: hashesError, count: hashesDeleted } = await supabase
      .from('visitor_hashes')
      .delete({ count: 'exact' })
      .lt('day', twoDaysAgoStr);

    if (hashesError) throw hashesError;

    // 2. Delete live_sessions older than 10 minutes
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    
    const { error: sessionsError, count: sessionsDeleted } = await supabase
      .from('live_sessions')
      .delete({ count: 'exact' })
      .lt('last_seen', tenMinutesAgo);

    if (sessionsError) throw sessionsError;
    
    // 3. Clear old rate limits
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString();
    await supabase.from('rate_limits').delete().lt('window_start', twoMinutesAgo);

    return NextResponse.json({
      success: true,
      message: 'Analytics cleanup completed',
      details: {
        hashesDeleted: hashesDeleted || 0,
        sessionsDeleted: sessionsDeleted || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics cleanup cron failed:', error);
    return NextResponse.json(
      { error: 'Analytics cleanup failed' },
      { status: 500 }
    );
  }
}
