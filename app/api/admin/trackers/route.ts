import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('trackers')
      .select('*, updates:tracker_updates(*)')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Sort updates for each tracker
    const sortedData = data?.map(t => ({
      ...t,
      updates: t.updates?.sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()) || []
    })) || [];
    
    return NextResponse.json(sortedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const trackerData = await request.json();
    
    const { data, error } = await supabase
      .from('trackers')
      .insert([trackerData])
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
