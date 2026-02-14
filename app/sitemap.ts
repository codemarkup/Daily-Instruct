import { getAllArticles } from '@/lib/json-utils';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dailyinstruct.com';

  // 1. Static Pages (Priority 0.6 - 1.0)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // 2. Category Pages (Priority 0.9)
  const categories = ['tech', 'business', 'markets', 'guides'];
  const categoryRoutes = categories.map(category => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 3. Articles (Priority 0.8)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getAllArticles();
    articleRoutes = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating article sitemap:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
