import { getAllArticles } from '@/lib/json-utils';
import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.dailyinstruct.com'; // ✅ Match canonical domain
  
  try {
    const articles = await getAllArticles();
    
    const articleUrls = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categoryUrls = ['tech', 'business', 'market', 'guides'].map(cat => ({
      url: `${baseUrl}/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    const { data: trackers } = await supabase.from('trackers').select('slug, updated_at');
    const trackerUrls = (trackers || []).map(tracker => ({
      url: `${baseUrl}/trackers/${tracker.slug}`,
      lastModified: new Date(tracker.updated_at),
      changeFrequency: 'hourly' as const,
      priority: 0.85,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/trackers`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      },
      ...categoryUrls,
      ...trackerUrls,
      ...articleUrls,
    ];
  } catch (error) {
    // Fallback if articles can't be fetched
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
