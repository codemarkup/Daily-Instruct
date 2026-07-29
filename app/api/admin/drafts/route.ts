import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      // If table doesn't exist, just return empty array
      if (error.code === '42P01') {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const draft = await request.json();
    
    // Check if draft already exists via draft_id (which could be the slug)
    const { data: existing } = await supabase
      .from('drafts')
      .select('id')
      .eq('draft_id', draft.draft_id)
      .single();

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('drafts')
        .update({
          article_data: draft.article_data,
          updated_at: new Date().toISOString()
        })
        .eq('draft_id', draft.draft_id)
        .select();

      if (error) throw error;
      return NextResponse.json(data?.[0]);
    } else {
      // Insert
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          draft_id: draft.draft_id,
          article_data: draft.article_data,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return NextResponse.json(data?.[0]);
    }
  } catch (error: any) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const draft_id = searchParams.get('id');

    if (!draft_id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('draft_id', draft_id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting draft:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
