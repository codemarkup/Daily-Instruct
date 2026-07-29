import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const updateData = await request.json();
    
    // Also update the tracker's updated_at timestamp
    if (updateData.tracker_id) {
      await supabase
        .from('trackers')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', updateData.tracker_id);
    }
    
    const { data, error } = await supabase
      .from('tracker_updates')
      .insert([updateData])
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
