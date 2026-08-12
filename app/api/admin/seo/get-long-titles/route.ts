import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, slug, category, title');
      
    if (error) throw error;
    
    // Find articles with titles > 60 chars
    const flaggedArticles = (articles || [])
      .filter(a => a.title.length > 60)
      .map(a => ({
        id: a.id,
        slug: a.slug,
        category: a.category,
        currentTitle: a.title,
        length: a.title.length
      }));
      
    return NextResponse.json({ flagged: flaggedArticles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
