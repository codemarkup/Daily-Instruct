const API_BASE = '/api/admin';

// UPDATE THIS INTERFACE - ADD THE SEO FIELDS
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
  // ADD THESE TWO SEO FIELDS:
  keywords?: string;
  metaDescription?: string;
}

export const AdminService = {
  async createArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    const response = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create article: ${error}`);
    }
    
    const data = await response.json();
    return data.article;
  },

  async getAllArticles(): Promise<Article[]> {
    return this.getArticles(); // Just calls getArticles()
  },

  async getArticles(category?: string): Promise<Article[]> {
    const url = category ? `${API_BASE}/articles?category=${category}` : `${API_BASE}/articles`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    return await response.json();
  },

  async updateArticle(slug: string, articleData: Partial<Article>): Promise<Article> {
    const response = await fetch(`${API_BASE}/articles?slug=${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update article: ${error}`);
    }
    
    const data = await response.json();
    return data.article;
  },

  async deleteArticle(slug: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/articles?slug=${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete article: ${error}`);
    }
    
    return await response.json();
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const articles = await this.getArticles();
      return articles.find(article => article.slug === slug) || null;
    } catch (error) {
      console.error('Error getting article by slug:', error);
      return null;
    }
  },

  async getCategories(): Promise<string[]> {
    return ['tech', 'business', 'markets', 'guides'];
  }
};