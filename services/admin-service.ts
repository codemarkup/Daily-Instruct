// /services/admin-service.ts
import { Article } from '@/lib/json-utils';

const API_BASE = '/api/admin';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type { Article };

export class AdminService {
  // Get all articles
  static async getAllArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${API_BASE}/articles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch articles');
      }
      
      return result.articles || [];
    } catch (error) {
      console.error('Error in getAllArticles:', error);
      throw error;
    }
  }

  // Get single article by slug
  static async getArticleBySlug(slug: string): Promise<{ article: Article; category: string }> {
    try {
      const response = await fetch(`${API_BASE}/articles/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Article not found');
      }
      
      return { article: result.article, category: result.category };
    } catch (error) {
      console.error('Error in getArticleBySlug:', error);
      throw error;
    }
  }

  // Create article
  static async createArticle(articleData: Omit<Article, 'id'> & { category: string }): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create article');
      }
      
      return result.article;
    } catch (error) {
      console.error('Error in createArticle:', error);
      throw error;
    }
  }

  // Update article
  static async updateArticle(slug: string, articleData: Partial<Article> & { category: string }): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE}/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update article');
      }
      
      return result.article;
    } catch (error) {
      console.error('Error in updateArticle:', error);
      throw error;
    }
  }

  // Delete article - FIXED VERSION
  static async deleteArticle(slug: string, category: string): Promise<void> {
    try {
      console.log(`AdminService.deleteArticle called with slug: ${slug}, category: ${category}`);
      
      // Normalize category to lowercase for URL
      const normalizedCategory = category.toLowerCase();
      
      const url = `${API_BASE}/articles/${slug}?category=${encodeURIComponent(normalizedCategory)}`;
      console.log(`Making DELETE request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      console.log(`DELETE response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('DELETE result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete article');
      }
      
    } catch (error) {
      console.error('Error in deleteArticle:', error);
      throw error;
    }
  }

  // Get homepage configuration
  static async getHomeArticles(): Promise<{
    featured: number[];
    topStories: number[];
    latest: number[];
    trending: number[];
  }> {
    try {
      const response = await fetch(`${API_BASE}/home-articles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch home articles');
      }
      
      return result.homeArticles || {
        featured: [],
        topStories: [],
        latest: [],
        trending: []
      };
    } catch (error) {
      console.error('Error in getHomeArticles:', error);
      throw error;
    }
  }

  // Update homepage configuration
  static async updateHomeArticles(updates: {
    featured?: number[];
    topStories?: number[];
    latest?: number[];
    trending?: number[];
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/home-articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update home articles');
      }
    } catch (error) {
      console.error('Error in updateHomeArticles:', error);
      throw error;
    }
  }
}