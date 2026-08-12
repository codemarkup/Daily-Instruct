const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanOrphanedTrackerUpdates() {
  console.log("Fetching tracker updates...");
  const { data: updates, error: updatesError } = await supabase.from('tracker_updates').select('id, linked_article_id, content');
  if (updatesError) throw updatesError;

  const orphanedIds = [];
  for (const update of updates) {
    // If linked_article_id is null, it's an orphaned update from a deleted article
    // (since standalone updates don't exist in this app's logic)
    if (!update.linked_article_id) {
      orphanedIds.push(update.id);
      console.log(`Orphaned update found: [ID: ${update.id}] "${update.content}"`);
    }
  }

  if (orphanedIds.length > 0) {
    console.log(`Deleting ${orphanedIds.length} orphaned tracker updates...`);
    const { error: deleteError } = await supabase.from('tracker_updates').delete().in('id', orphanedIds);
    if (deleteError) throw deleteError;
    console.log("Orphaned updates deleted successfully.");
  } else {
    console.log("No orphaned tracker updates found.");
  }
}

cleanOrphanedTrackerUpdates().catch(console.error);
