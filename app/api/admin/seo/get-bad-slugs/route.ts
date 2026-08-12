import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, slug, category, title');
      
    if (error) throw error;
    
    // Simple stop words for slug analysis
    const stopWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'of', 'in', 'is', 'are', 'was', 'were'];
    
    // Find articles with suboptimal slugs (too long, or contains stop words)
    const flaggedArticles = (articles || []).filter(a => {
      const words = a.slug.split('-');
      const hasStopWords = words.some((w: string) => stopWords.includes(w));
      const isTooLong = a.slug.length > 50;
      return hasStopWords || isTooLong;
    }).map(a => ({
      id: a.id,
      category: a.category,
      currentTitle: a.title,
      currentSlug: a.slug,
      reason: a.slug.length > 50 ? "Too long (>50 chars)" : "Contains stop words"
    }));
      
    return NextResponse.json({ flagged: flaggedArticles.slice(0, 20) }); // Limit to 20 for batch processing
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
