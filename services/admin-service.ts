// services/admin-service.ts
import * as jsonUtils from '@/lib/json-utils';

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

export const AdminService = {
  async createArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    try {
      // Use the jsonUtils.createArticle function
      const article = await jsonUtils.createArticle(articleData);
      return article;
    } catch (error: any) {
      console.error('Error in createArticle:', error);
      throw new Error(`Failed to create article: ${error.message}`);
    }
  },

  async getArticles(category?: string): Promise<Article[]> {
    try {
      if (category) {
        const filename = jsonUtils.getCategoryFilename(category);
        const data = await jsonUtils.readJsonFile<{ articles: Article[] }>(filename);
        return data.articles;
      } else {
        return await jsonUtils.getAllArticles();
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  },

  async updateArticle(slug: string, articleData: Partial<Article>): Promise<Article | null> {
    try {
      return await jsonUtils.updateArticle(slug, articleData);
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  },

  async deleteArticle(slug: string): Promise<boolean> {
    try {
      return await jsonUtils.deleteArticle(slug);
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const result = await jsonUtils.findArticleBySlug(slug);
      return result?.article || null;
    } catch (error) {
      console.error('Error getting article by slug:', error);
      return null;
    }
  },

  async getCategories(): Promise<string[]> {
    return ['tech', 'business', 'markets', 'guides'];
  }
};