const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) acc[parts[0].trim()] = parts.slice(1).join('=').trim();
  return acc;
}, {});

const keyword = 'Gen Z social media trends';
const content = `HEADING: The Silent Revolution: Why Gen Z Is Ditching Instagram for Anonymous Campus Apps
PARAGRAPH: Something remarkable is happening on college campuses across the United States in 2026. While Instagram and TikTok continue to dominate global download charts, a quieter revolution is taking place in dorm rooms from Stanford to Harvard, and increasingly across universities in the United Kingdom and beyond. Students are abandoning the polished, performance-driven social media that defined the 2010s and early 2020s in favour of something radically different: anonymity. At the center of this seismic shift stands Fizz — an anonymous social app — that has quietly become what its CEO calls the biggest college social platform since Facebook itself.
HEADING: From Pandemic Frustration to Campus Domination
PARAGRAPH: The story of Fizz begins not with a Silicon Valley brainstorming session, but with two Stanford students trapped in their dorm rooms during the pandemic. Teddy Solomon and Ashton Cofer — who were frustrated by the limitations of existing group chats and the performative nature of mainstream social media — wanted to create something fundamentally different. What started as a solution to connect isolated college students during remote learning has exploded into a cultural phenomenon operating on 240 college campuses and 60 high schools across the United States. The app has raised an impressive 41.5 million dollars in funding, signaling that investors believe this is not just another flash-in-the-pan social experiment, but a genuine paradigm shift in how young people want to connect online.`;

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

ON-PAGE SEO CHECK (Target Keyword: "${keyword}"):
1. Confirm keyword/variant appears in first ~100 words.
2. Confirm at least one HEADING contains the keyword/variant.
3. Check for natural semantic/related-term coverage throughout.
4. Flag keyword stuffing if the term appears unnaturally often.
5. Confirm the first PARAGRAPH directly answers the core question implied by the headline/keyword.

OUTPUT FORMAT:
You MUST respond with a valid JSON object ONLY. Do not include markdown blocks like \`\`\`json around the response.
{
  "revisedContent": "HEADING: ...\\nPARAGRAPH: ...",
  "detectedKeyword": "${keyword}",
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
}`;

const userContent = `Target Keyword: ${keyword}\n\nContent:\n${content}`;

console.log('=== EXACT SYSTEM PROMPT SENT ===\n' + systemPrompt);
console.log('\n=== EXACT USER CONTENT SENT ===\n' + userContent);

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + env.GROQ_API_KEY,
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  })
}).then(r => r.json()).then(data => {
  console.log('\n=== RAW GROQ RESPONSE ===\n' + data.choices[0].message.content);
}).catch(console.error);
