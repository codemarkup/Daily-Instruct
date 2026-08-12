import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { keywords, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const currentKeywordsStr = Array.isArray(keywords) && keywords.length > 0 
      ? keywords.join(', ') 
      : 'None provided';

    const systemPrompt = `You are an expert SEO Keyword Researcher and Content Strategist.
Your job is to analyze the user's provided article content and their currently entered SEO keywords (if any).
You MUST use your built-in browser_search tool to research what is ACTUALLY ranking for this topic right now on Google, and what real searchers are actually typing to find this kind of content.

Based on your REAL search results, you must evaluate the existing keywords and suggest the best overall set (3-5 recommended, max 10).

OUTPUT FORMAT:
You MUST respond with a valid JSON object ONLY. Do not use markdown blocks around the JSON.
{
  "researchSummary": "A brief 2-3 sentence summary of what you found in your search (e.g., 'The top ranking articles for this topic focus on X. Searchers are primarily looking for Y.'). Cite specific sources you found.",
  "existingKeywords": [
    {
      "keyword": "example keyword",
      "action": "Keep", 
      "reason": "Matches actual search intent found in [Source Name]."
    },
    {
      "keyword": "bad keyword",
      "action": "Replace",
      "reason": "Too broad/competitive for a small site, search results are dominated by Wikipedia."
    }
  ],
  "suggestedKeywords": [
    {
      "keyword": "new longtail keyword",
      "reason": "Lower competition, directly matches article content about Z, real search volume signal found."
    }
  ]
}

CRITICAL RULES:
1. Every claim about what's "ranking" or "searched" MUST trace back to something your browser_search tool actually returned. NEVER fabricate ranking/volume claims. If you cannot find enough data, say so in the reason.
2. The total combined set of kept + suggested keywords should not exceed 10. Recommend 3-5 ideally.
3. The "action" for existing keywords MUST be either "Keep" or "Replace".`;

    const userContent = `CURRENT KEYWORDS: ${currentKeywordsStr}\n\nARTICLE CONTENT:\n${content}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        tools: [
          { type: 'browser_search' }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API Error:", err);
      return NextResponse.json({ error: "Search tool failed or timed out." }, { status: 500 });
    }

    const data = await response.json();
    let result;
    try {
      let content = data.choices[0].message.content || "";
      if (content.includes('\`\`\`json')) {
        content = content.split('\`\`\`json')[1].split('\`\`\`')[0];
      } else if (content.includes('\`\`\`')) {
        content = content.split('\`\`\`')[1].split('\`\`\`')[0];
      }
      result = JSON.parse(content.trim());
    } catch (e) {
      console.error("Failed to parse JSON:", data.choices[0].message.content);
      return NextResponse.json({ error: "Invalid response from AI." }, { status: 500 });
    }

    // Pass the raw tool calls back so the UI can display them if needed
    result.toolCalls = data.choices[0].message.tool_calls || [];

    return NextResponse.json(result);

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
