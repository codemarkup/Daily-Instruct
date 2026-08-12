const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) acc[parts[0].trim()] = parts.slice(1).join('=').trim();
  return acc;
}, {});

fetch('https://api.groq.com/openai/v1/models', {
  headers: { 'Authorization': 'Bearer ' + env.GROQ_API_KEY }
}).then(r => r.json()).then(data => console.log(data.data.map(m => m.id).join('\n'))).catch(console.error);
