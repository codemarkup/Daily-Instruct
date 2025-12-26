import { getAllArticles } from '@/lib/json-utils';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://daily-instruct.vercel.app';
  
  try {
    const articles = await getAllArticles();
    
    const articleUrls = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/articles`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
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