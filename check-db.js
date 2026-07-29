const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log("Fetching trackers...");
  const { data: trackers } = await supabase.from('trackers').select('id, title, summary, status').order('updated_at', { ascending: false });
  console.log("Trackers:", JSON.stringify(trackers, null, 2));

  console.log("Fetching updates for first tracker...");
  if (trackers && trackers.length > 0) {
    const { data: updates } = await supabase.from('tracker_updates').select('*').eq('tracker_id', trackers[0].id);
    console.log("Updates:", JSON.stringify(updates, null, 2));
  }
}

check().catch(console.error);
