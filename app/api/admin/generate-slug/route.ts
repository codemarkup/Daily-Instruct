import { NextResponse } from 'next/server';
import { deterministicGenerateSlug } from '@/lib/slug-generator';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function isSlugUnique(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('slug', slug)
    .limit(1);
    
  if (error) {
    console.error("Supabase error checking slug uniqueness:", error);
    return true; // Fallback to assuming unique if error
  }
  return data.length === 0;
}

export async function POST(req: Request) {
  try {
    const { title, paragraph } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let generatedSlug = "";

    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: `You are an SEO expert. Your job is to extract the core searchable topic from a news article title and first paragraph. 
                RULES:
                - Return exactly 3 to 5 words.
                - Total length must be under 70 characters.
                - Lowercase, separated by spaces.
                - DO NOT include stop words (a, the, and, of, etc.) unless removing one destroys meaning.
                - DO NOT include clickbait filler ("what this means", "suddenly").
                - DO NOT include the year unless it's date-anchored.
                - DO NOT summarize. Extract the core searchable topic.
                - OUTPUT NOTHING ELSE.`
              },
              {
                role: 'user',
                content: `Title: ${title}\nParagraph: ${paragraph || ""}`
              }
            ],
            temperature: 0.1,
            max_tokens: 20
          })
        });

        if (response.ok) {
          const data = await response.json();
          generatedSlug = data.choices[0].message.content.trim();
        }
      } catch (e) {
        console.error("LLM Error:", e);
      }
    }

    // Deterministic fallback/sanitization
    let sanitizedSlug = deterministicGenerateSlug(generatedSlug || title);

    // Uniqueness check
    let unique = await isSlugUnique(sanitizedSlug);
    let attempts = 0;
    
    // If not unique, we need to add more words from the title to differentiate, not just -2
    if (!unique) {
      const titleWords = title.toLowerCase().replace(/[^\w\s-]/g, "").split(/\s+/).filter((w: string) => w.length > 0);
      const slugWords = sanitizedSlug.split('-');
      
      // Find words in title that are not in the slug
      const unusedWords = titleWords.filter((w: string) => !slugWords.includes(w));
      
      while (!unique && attempts < 3 && unusedWords.length > 0) {
        const nextWord = unusedWords.shift();
        sanitizedSlug = `${sanitizedSlug}-${nextWord}`;
        
        // Truncate to 70 chars again
        if (sanitizedSlug.length > 70) {
          sanitizedSlug = sanitizedSlug.substring(0, 70);
          const lastHyphen = sanitizedSlug.lastIndexOf('-');
          if (lastHyphen > 0) sanitizedSlug = sanitizedSlug.substring(0, lastHyphen);
        }
        
        unique = await isSlugUnique(sanitizedSlug);
        attempts++;
      }
      
      // Absolute fallback if we STILL aren't unique (very rare)
      if (!unique) {
        sanitizedSlug = `${sanitizedSlug}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    return NextResponse.json({ 
      slug: sanitizedSlug, 
      usedLLM: !!apiKey && !!generatedSlug 
    });

  } catch (error: any) {
    console.error("Slug generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
