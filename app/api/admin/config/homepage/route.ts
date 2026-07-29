import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('homepage_config')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
    
    return NextResponse.json(data || { id: 1, trending_tags: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const configData = await request.json();
    
    const { data, error } = await supabase
      .from('homepage_config')
      .upsert({ id: 1, ...configData })
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
