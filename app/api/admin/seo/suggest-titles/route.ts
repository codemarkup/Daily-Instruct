import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { titles } = await request.json(); // Array of strings

    if (!titles || !titles.length) {
      return NextResponse.json({ error: "No titles provided" }, { status: 400 });
    }

    const systemPrompt = `You are an SEO expert. 
Given a list of article titles that are too long (over 60 characters), rewrite each title to be UNDER 60 characters while maintaining the core meaning and clickability.
DO NOT use clickbait. Keep it professional.

Respond ONLY with a JSON object in this format:
{
  "results": [
    {
      "original": "The original title exactly as provided",
      "suggested": "The new shortened title (under 60 chars)"
    }
  ]
}`;

    const userContent = JSON.stringify(titles);

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
        temperature: 0.3,
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
