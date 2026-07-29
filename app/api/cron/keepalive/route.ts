import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a standard supabase client for backend operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
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

    // Perform a trivial read operation to keep the Supabase database awake
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Supabase keep-alive ping successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Keep-alive cron failed:', error);
    return NextResponse.json(
      { error: 'Keep-alive ping failed' },
      { status: 500 }
    );
  }
}
