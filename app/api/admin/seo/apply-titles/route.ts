import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { updates } = await request.json(); // Array of { id, newTitle }

    if (!updates || !updates.length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    for (const update of updates) {
      await supabase
        .from('articles')
        .update({ title: update.newTitle })
        .eq('id', update.id);
    }

    return NextResponse.json({ success: true, message: `Processed ${updates.length} title updates.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
