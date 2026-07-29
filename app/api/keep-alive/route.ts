import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Perform a real query to keep Supabase instance active
    const { data, error } = await supabase.from('articles').select('id').limit(1);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
