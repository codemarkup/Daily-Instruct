// /lib/client/json-utils.ts - CLIENT-SIDE ONLY
// This only contains types and basic utilities that don't need fs

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  specific: string;
  trending: boolean;
  featured: boolean;
  topStory: boolean;
  grid: boolean;
  homeFeatured: boolean;
  homeLatest: boolean;
  homeTrending: boolean;
  homeTopStory: boolean;
  content: Array<{
    type: 'paragraph' | 'heading' | 'quote';
    text: string;
    author?: string;
  }>;
}

export interface HomeArticles {
  homeArticles: {
    featured: number[];
    topStories: number[];
    latest: number[];
    trending: number[];
  };
}

// Helper to get category filename (can be used on client)
export function getCategoryFilename(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  const categoryMap: Record<string, string> = {
    'tech': 'tech-articles.json',
    'business': 'business-articles.json',
    'market': 'markets-articles.json',
    'markets': 'markets-articles.json',
    'guides': 'guides-articles.json'
  };
  
  return categoryMap[lowerCategory] || `${lowerCategory}-articles.json`;
}