const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) acc[parts[0].trim()] = parts.slice(1).join('=').trim();
  return acc;
}, {});

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

const userContent = `CURRENT KEYWORDS: Fed rate hike, Federal Reserve, interest rates, economy

ARTICLE CONTENT:
The Federal Reserve hiked interest rates by 25 basis points today in a widely expected move. Chairman Powell stated that inflation remains elevated but is showing signs of cooling. The central bank emphasized that future decisions will be data-dependent, focusing on labor market strength and core CPI. Economists predict this may be the final hike of the current tightening cycle before a pause.`;

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + env.GROQ_API_KEY,
  },
  body: JSON.stringify({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    tools: [
      { type: 'browser_search' }
    ],
    temperature: 0.2
  })
}).then(r => r.json()).then(data => {
  console.log(JSON.stringify(data.choices[0].message, null, 2));
}).catch(console.error);
