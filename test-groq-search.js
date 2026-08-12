const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) acc[parts[0].trim()] = parts.slice(1).join('=').trim();
  return acc;
}, {});

fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + env.GROQ_API_KEY,
  },
  body: JSON.stringify({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'user', content: 'What are the top 3 ranking articles for Gen Z social media trends in 2026?' }
    ],
    tools: [
      {
        type: 'browser_search'
      }
    ],
    temperature: 0.2
  })
}).then(r => r.json()).then(data => {
  console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
