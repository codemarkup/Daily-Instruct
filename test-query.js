const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('articles')
    .select('*');
    
  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("ARTICLES:", JSON.stringify(data, null, 2));
  }
}

run();
