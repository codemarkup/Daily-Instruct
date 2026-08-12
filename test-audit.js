const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const parts = line.split('=');
  if (parts.length > 1) acc[parts[0].trim()] = parts.slice(1).join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: articles, error } = await supabase.from('articles').select('title, slug');
  if (error) throw error;
  
  const longTitles = articles.filter(a => a.title.length > 60).map(a => ({ title: a.title, length: a.title.length }));
  
  const stopWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'of', 'in', 'is', 'are', 'was', 'were'];
  
  const badSlugs = articles.filter(a => {
    const words = a.slug.split('-');
    const hasStopWords = words.some(w => stopWords.includes(w));
    const isTooLong = a.slug.length > 50;
    return hasStopWords || isTooLong;
  }).map(a => ({ slug: a.slug, reason: a.slug.length > 50 ? 'Too long' : 'Stop words' }));
  
  console.log("=== FLAGGED TITLES ===");
  console.log(JSON.stringify(longTitles.slice(0, 5), null, 2));
  
  console.log("\n=== FLAGGED SLUGS ===");
  console.log(JSON.stringify(badSlugs.slice(0, 5), null, 2));
}
run();
