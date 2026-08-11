import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, keyword } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    // Count original blocks
    const originalBlocks = content.split('\n').filter((line: string) => 
      line.trim().startsWith('HEADING:') || 
      line.trim().startsWith('PARAGRAPH:') || 
      line.trim().startsWith('QUOTE:')
    ).length;

    let seoInstruction = "";
    if (keyword) {
      seoInstruction = `ON-PAGE SEO CHECK (Target Keyword: "${keyword}"):
1. Confirm keyword/variant appears in first ~100 words.
2. Confirm at least one HEADING contains the keyword/variant.
3. Check for natural semantic/related-term coverage throughout.
4. Flag keyword stuffing if the term appears unnaturally often.
5. Confirm the first PARAGRAPH directly answers the core question implied by the headline/keyword.`;
    } else {
      seoInstruction = `ON-PAGE SEO CHECK (AUTO-DETECT KEYWORD):
You were not provided a target keyword. First, you MUST determine the primary target keyword or search phrase for this content (what a searcher would type into Google to find this specific article, e.g., "Gen Z social media trends"). 
Then, run the following checks against your detected keyword:
1. Confirm keyword/variant appears in first ~100 words.
2. Confirm at least one HEADING contains the keyword/variant.
3. Check for natural semantic/related-term coverage throughout.
4. Flag keyword stuffing if the term appears unnaturally often.
5. Confirm the first PARAGRAPH directly answers the core question implied by the headline/keyword.`;
    }

    const systemPrompt = `You are an expert Content Analyst and On-Page SEO Reviewer.
Your job is to take block-formatted content (HEADING:, PARAGRAPH:, QUOTE:) and optimize it by removing AI writing "tells" and checking SEO.

CRITICAL INSTRUCTION: You MUST preserve the EXACT SAME block format. 
If the input has 3 HEADINGs, 5 PARAGRAPHs, and 1 QUOTE in a specific order, your revised content MUST have exactly 3 HEADINGs, 5 PARAGRAPHs, and 1 QUOTE in that exact same order. Do not drop, add, merge, or reorder blocks.

CRITICAL EDITING MANDATE - SEPARATE FACTS FROM STYLE:
You must strictly separate your editing approach into two distinct behaviors:
1. **Style/Engagement/Structural Edits (ACTIVE REWRITE REQUIRED):** You must actively and aggressively rewrite prose to improve readability, rhythm, and engagement. Do NOT just flag style issues; FIX them. If a paragraph is dry, has hedge-stacking, or overuses em-dashes, you must meaningfully restructure the sentences. A single word swap is NOT acceptable. Give it genuine paragraph-level rewriting that makes it punchy and engaging.
2. **Factual/Specificity Edits (STAY CONSERVATIVE):** You must NEVER fabricate facts, statistics, names, studies, or quotes. If you feel a claim is vague and needs a specific number or example, you MUST leave the fact exactly as-is and flag it in the report as "NEEDS HUMAN INPUT: vague claim, add a real example/number here." Quotes must have clear, real attribution. Never invent a speaker.

THE ANALYSIS & REWRITE CHECKLIST:

1. **Vocabulary tells (reduce/replace):** delve, tapestry, pivotal, furthermore, moreover, in conclusion, it is worth noting, leverage (as verb), boasts, paramount, robust, seamless, unlock/unleash.
2. **Em-dash Overuse (CRITICAL REWRITE):** Any paragraph using em-dash parenthetical asides (" - " or " — ") more than once MUST have them rewritten into normal sentence structure (use commas, a period and new sentence, or restructure entirely). Do not just reduce frequency; actually rewrite the sentence to eliminate the crutch.
3. **Flat, Boring Prose:** Sentences that are technically correct but read as dry/listless (no rhythm variation, no concrete imagery, generic transitions) must be actively rewritten to be more direct, punchy, and readable, while preserving all factual content exactly as-is. 
4. **Hedge-phrase stacking:** Cut multiple qualifiers ("it's important to note," "generally speaking") to at most one per paragraph.
5. **Tricolon overuse:** Avoid repeating three-item lists.
6. **Uniform sentence cadence:** Vary sentence lengths drastically (mix very short sentences with longer ones).
7. **Predictable bullet-list formatting:** Convert to prose if a list isn't the clearest format.
8. **Generic opener + closer:** Replace generic openers with a direct answer to the core question. Cut generic summary closers.
9. **Hollow empathy openers:** ("Picture this...") - rewrite or cut these entirely.
10. **Safe non-opinions:** Flag paragraphs that hedge into saying nothing.

${seoInstruction}

OUTPUT FORMAT:
You MUST respond with a valid JSON object ONLY. Do not include markdown blocks like \`\`\`json around the response.
{
  "revisedContent": "HEADING: ...\\nPARAGRAPH: ...",
  "detectedKeyword": "${keyword ? keyword : "the-detected-keyword-here"}",
  "report": {
    "tellsFixed": [
      { "category": "Vocabulary", "count": 2, "description": "Removed 'delve' and 'seamless'" }
    ],
    "humanInputNeeded": [
      "PARAGRAPH 3: NEEDS HUMAN INPUT: vague claim, add a real example/number here."
    ],
    "seo": {
      "keywordInFirst100Words": true,
      "keywordInHeading": true,
      "topicalCompleteness": true,
      "keywordStuffing": false,
      "answerFirstOpening": true
    }
  }
}
`;

    const userContent = keyword ? `Target Keyword: ${keyword}\n\nContent:\n${content}` : `Content:\n${content}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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

    console.log("=== EXACT SYSTEM PROMPT SENT ===");
    console.log(systemPrompt);
    console.log("=== EXACT USER CONTENT SENT ===");
    console.log(userContent);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json({ error: "Failed to analyze content." }, { status: 500 });
    }

    const data = await response.json();
    console.log("=== RAW GROQ RESPONSE ===");
    console.log(data.choices[0].message.content);

    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse Groq JSON response", data.choices[0].message.content);
      return NextResponse.json({ error: "Invalid response from AI." }, { status: 500 });
    }

    // Server-side validation of blocks
    const revisedBlocks = (result.revisedContent || "").split('\n').filter((line: string) => 
      line.trim().startsWith('HEADING:') || 
      line.trim().startsWith('PARAGRAPH:') || 
      line.trim().startsWith('QUOTE:')
    ).length;

    // We must strictly enforce exact block counts so the frontend doesn't silently fallback
    if (revisedBlocks !== originalBlocks) {
      console.error(`Block mismatch: Original ${originalBlocks}, Revised ${revisedBlocks}`);
      return NextResponse.json({ 
        error: "AI returned a malformed response (block count mismatch). Please try again." 
      }, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Analyze content error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
