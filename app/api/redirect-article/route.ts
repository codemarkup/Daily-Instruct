import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.redirect(new URL('/', request.url));
  
  const { data } = await supabase.from('articles').select('slug').eq('id', id).single();
  
  if (data?.slug) {
    return NextResponse.redirect(new URL(`/articles/${data.slug}`, request.url));
  }
  
  return NextResponse.redirect(new URL('/', request.url));
}
