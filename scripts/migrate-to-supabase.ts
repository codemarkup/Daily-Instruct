// scripts/migrate-to-supabase.ts
// Run this with ts-node: npx ts-node scripts/migrate-to-supabase.ts

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env vars from .env.local manually for the script
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("🚀 Starting migration to Supabase...");
  
  const dataDir = path.join(process.cwd(), 'data');
  const files = [
    'tech-articles.json',
    'business-articles.json',
    'markets-articles.json',
    'guides-articles.json'
  ];

  let totalMigrated = 0;
  let totalFailed = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const articles = data.articles || [];

      console.log(`\n📂 Processing ${file} (${articles.length} articles)`);

      for (const article of articles) {
        // Map fields to match Supabase schema exactly
        const payload = {
          slug: article.slug,
          title: article.title,
          description: article.description,
          author: article.author,
          date: new Date(article.date).toISOString(), // Ensure strict ISO format
          readTime: article.readTime,
          image: article.image,
          category: article.category,
          specific: article.specific || null,
          trending: article.trending || false,
          featured: article.featured || false,
          topStory: article.topStory || false,
          grid: article.grid || false,
          homeFeatured: article.homeFeatured || false,
          homeLatest: article.homeLatest || false,
          homeTrending: article.homeTrending || false,
          homeTopStory: article.homeTopStory || false,
          content: article.content || [],
          keywords: article.keywords || null,
          metaDescription: article.metaDescription || null
        };

        // Insert or update (upsert) based on slug
        const { data: result, error } = await supabase
          .from('articles')
          .upsert(payload, { onConflict: 'slug' })
          .select('id')
          .single();

        if (error) {
          console.error(`❌ Failed to migrate ${article.slug}: ${error.message}`);
          totalFailed++;
        } else {
          console.log(`✅ Migrated: ${article.slug} -> DB ID: ${result.id}`);
          totalMigrated++;
        }
      }
    } catch (e: any) {
      console.error(`❌ Error parsing ${file}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Migration Complete!`);
  console.log(`✅ Successfully migrated: ${totalMigrated}`);
  if (totalFailed > 0) {
    console.log(`❌ Failed: ${totalFailed}`);
  }
}

main();
