import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { updates } = await request.json(); // Array of { oldSlug, newSlug }

    if (!updates || !updates.length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    for (const update of updates) {
      // 1. Insert redirect into slug_redirects table
      const { error: redirectError } = await supabase
        .from('slug_redirects')
        .upsert({ 
          old_slug: update.oldSlug, 
          new_slug: update.newSlug 
        }, { onConflict: 'old_slug' });
        
      if (redirectError) {
        console.error("Redirect insert error:", redirectError);
        continue;
      }

      // 2. Update the actual article slug
      await supabase
        .from('articles')
        .update({ slug: update.newSlug })
        .eq('slug', update.oldSlug);
    }

    return NextResponse.json({ success: true, message: `Processed ${updates.length} slug redirects.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
