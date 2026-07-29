import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { data, error } = await supabase
      .from('trackers')
      .select('*, updates:tracker_updates(*)')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    
    if (data.updates) {
      data.updates.sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const updateData = await request.json();
    
    // update updated_at
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('trackers')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { error } = await supabase
      .from('trackers')
      .delete()
      .eq('slug', slug);
      
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
