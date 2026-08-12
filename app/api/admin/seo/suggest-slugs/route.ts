import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { articles } = await request.json(); // Array of { currentSlug, currentTitle }

    if (!articles || !articles.length) {
      return NextResponse.json({ error: "No articles provided" }, { status: 400 });
    }

    const systemPrompt = `You are an Technical SEO expert. 
Given a list of article titles and their current URL slugs, generate a new optimized slug for each.
An optimized slug should be short (under 40 chars if possible), use only lowercase letters and hyphens, and strip out all stop words (a, an, the, in, of, on, etc).
It must be descriptive enough to indicate the article topic.

Respond ONLY with a JSON object in this format:
{
  "results": [
    {
      "currentSlug": "the-original-slug-exactly-as-provided",
      "proposedSlug": "new-optimized-slug"
    }
  ]
}`;

    const userContent = JSON.stringify(articles);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq Error:", err);
      return NextResponse.json({ error: "AI processing failed." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
