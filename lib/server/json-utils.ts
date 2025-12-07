// /lib/server/json-utils.ts - SERVER-SIDE ONLY
import fs from 'fs';
import path from 'path';

const DATA_DIRECTORY = path.join(process.cwd(), 'data');

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

// Helper to get category filename
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

// Read JSON file - SERVER SIDE ONLY
export async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIRECTORY, filename);
  
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    // Return empty/default structure if file doesn't exist
    if (filename.includes('home')) {
      return { homeArticles: { featured: [], topStories: [], latest: [], trending: [] } } as T;
    }
    return { articles: [] } as T;
  }
}

// Write JSON file - SERVER SIDE ONLY
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIRECTORY, filename);
  
  try {
    // Ensure directory exists
    await fs.promises.mkdir(DATA_DIRECTORY, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Get all articles from all categories
export async function getAllArticles(): Promise<Article[]> {
  const categories = ['tech', 'business', 'markets', 'guides'];
  const allArticles: Article[] = [];

  for (const category of categories) {
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    if (data.articles.length > 0) {
      const firstCategory = data.articles[0].category;
      const articlesWithCategory = data.articles.map(article => ({
        ...article,
        category: article.category || firstCategory
      }));
      
      allArticles.push(...articlesWithCategory);
    }
  }

  return allArticles;
}

// Find article by slug
export async function findArticleBySlug(slug: string): Promise<{ article: Article; category: string } | null> {
  const categories = ['tech', 'business', 'markets', 'guides'];

  for (const category of categories) {
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    const article = data.articles.find(a => a.slug === slug);
    if (article) {
      return { article, category };
    }
  }

  return null;
}

// Get next available ID for a category
export async function getNextArticleId(category: string): Promise<number> {
  const filename = getCategoryFilename(category);
  const data = await readJsonFile<{ articles: Article[] }>(filename);
  
  if (data.articles.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...data.articles.map(article => article.id));
  return maxId + 1;
}