const fs = require('fs');

async function testArticle(articleName, content) {
  console.log(`\n=== Testing Article: ${articleName} ===\n`);
  
  const keyword = ''; // Left empty to test auto-detection

  let seoInstruction = `ON-PAGE SEO CHECK (AUTO-DETECT KEYWORD):
You were not provided a target keyword. First, you MUST determine the primary target keyword or search phrase for this content (what a searcher would type into Google to find this specific article, e.g., "Gen Z social media trends"). 
Then, run the following checks against your detected keyword:
1. Confirm keyword/variant appears in first ~100 words.
2. Confirm at least one HEADING contains the keyword/variant.
3. Check for natural semantic/related-term coverage throughout.
4. Flag keyword stuffing if the term appears unnaturally often.
5. Confirm the first PARAGRAPH directly answers the core question implied by the headline/keyword.`;

  const systemPrompt = `You are an expert Content Analyst and On-Page SEO Reviewer.
Your job is to take block-formatted content (HEADING:, PARAGRAPH:, QUOTE:) and optimize it by removing AI writing "tells" and checking SEO.

CRITICAL INSTRUCTION: You MUST preserve the EXACT SAME block format. 
If the input has 3 HEADINGs, 5 PARAGRAPHs, and 1 QUOTE in a specific order, your revised content MUST have exactly 3 HEADINGs, 5 PARAGRAPHs, and 1 QUOTE in that exact same order. Do not drop, add, merge, or reorder blocks.

THE ANALYSIS CHECKLIST:

1. Vocabulary tells (reduce/replace): delve, tapestry, pivotal, furthermore, moreover, in conclusion, it is worth noting, leverage (as verb), boasts, paramount, robust, seamless, unlock/unleash.
2. Structural/style tells:
- Hedge-phrase stacking: Cut multiple qualifiers ("it's important to note," "generally speaking") to at most one per paragraph.
- Tricolon overuse: Avoid repeating three-item lists.
- Em-dash parenthetical asides: Reduce frequency if overused.
- Uniform sentence cadence: Vary sentence lengths.
- Predictable bullet-list formatting: Convert to prose if a list isn't the clearest format.
- Generic opener + closer: Replace generic openers with a direct answer to the core question. Cut generic summary closers.
- Hollow empathy openers: ("Picture this...") - flag these.
- Safe non-opinions: Flag paragraphs that hedge into saying nothing.

CRITICAL GUARDRAIL - DO NOT FABRICATE: When the checklist calls for adding specificity, you MUST flag it for the human to fill in. NEVER invent a statistic, quote, study, or specific detail. Mark these clearly in the report as "NEEDS HUMAN INPUT: vague claim, add a real example/number here."
Quotes MUST have a clear, real attribution. If unattributed, flag it. NEVER invent a speaker.

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

  const apiKey = 'YOUR_API_KEY_HERE';
  const userContent = `Content:\n${content}`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    
    if (!res.ok) {
      console.error("Error from API:", res.status, await res.text());
      return;
    }
    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    console.log("DETECTED KEYWORD:", result.detectedKeyword);
    console.log("SEO REPORT:", JSON.stringify(result.report.seo, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function run() {
  const article1 = `HEADING: Technical Outage Hits Deutsche Bank Online Banking - What Customers Need to Know Today
PARAGRAPH: Today, a major online banking outage affected Deutsche Bank and its affiliated brands Postbank and Norisbank, leaving many customers in Germany unable to access their accounts via web and mobile platforms. Reports began around late morning with users unable to log in, prompting widespread concern and a surge in related search queries such as online banking storung Deutsche Bank.
PARAGRAPH: According to official statements from Deutsche Bank, the outage was caused by a technical error that temporarily prevented customers from logging in to their online banking services. The bank confirmed that the issue was largely resolved by the afternoon, though some users may still experience intermittent access requiring repeated attempts to log in.`;

  const article2 = `HEADING: Inside the Crypto ATM Scam Surge - How Americans Are Losing Millions Without Realizing It
PARAGRAPH: Crypto ATMs were introduced as a shortcut into the digital currency world. With cash, a touchscreen, and minimal setup, users could buy cryptocurrency in minutes without navigating complex online exchanges. This ease of access helped crypto ATMs spread rapidly across the United States, appearing in gas stations, retail stores, and neighborhood shops.
PARAGRAPH: Federal investigators now say crypto ATM scams are one of the fastest-growing fraud categories in the country. According to law enforcement data, Americans lost more than 333 million dollars to Bitcoin ATM related scams in 2025.
HEADING: Why Crypto ATMs Are Ideal for Criminal Networks
PARAGRAPH: Crypto ATMs combine several features that make them attractive to fraud operations. Transactions are fast, difficult to trace across borders, and final once completed. Many machines still allow high-value deposits with limited identity verification compared to banks.`;

  await testArticle("Deutsche Bank Outage", article1);
  await testArticle("Crypto ATM Scam", article2);
}

run();
