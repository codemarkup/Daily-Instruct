// /lib/json-utils.ts
interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

class GitHubStorage {
  private owner = process.env.GITHUB_OWNER || 'codemarkup';
  private repo = process.env.GITHUB_REPO || 'Daily-Instruct';
  private token = process.env.GITHUB_TOKEN;
  private baseURL = 'https://api.github.com';

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`GitHub API error (${response.status}):`, error);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // Read JSON file from GitHub
  async readJSONFile(path: string): Promise<any> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      
      // Decode base64 content
      const content = atob(data.content.replace(/\n/g, ''));
      return JSON.parse(content);
    } catch (error: any) {
      // If file doesn't exist, return default structure
      if (error.message.includes('404')) {
        return { articles: [] };
      }
      throw error;
    }
  }

  // Write JSON file to GitHub
  async writeJSONFile(path: string, content: any, sha?: string): Promise<any> {
    const fileContent = JSON.stringify(content, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

    const payload: any = {
      message: `Update ${path}`,
      content: encodedContent,
      committer: {
        name: 'Daily Instruct Admin',
        email: 'admin@dailyinstruct.com',
      },
      branch: 'main',
    };

    if (sha) {
      payload.sha = sha;
    }

    return this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Get file SHA (needed for updates)
  async getFileSHA(path: string): Promise<string | null> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      return data.sha;
    } catch {
      return null;
    }
  }
}

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

// Use GitHub storage if token exists, otherwise fallback to local files
const githubStorage = new GitHubStorage();

// Read JSON file
export async function readJsonFile<T>(filename: string): Promise<T> {
  // If we have GitHub token and we're not in development, use GitHub
  if (process.env.GITHUB_TOKEN && process.env.NODE_ENV !== 'development') {
    try {
      const data = await githubStorage.readJSONFile(`data/${filename}`);
      return data as T;
    } catch (error) {
      console.error(`GitHub read failed for ${filename}, using fallback:`, error);
      // Fall through to local file system
    }
  }
  
  // Fallback to local file system
  const fs = await import('fs');
  const path = await import('path');
  const DATA_DIRECTORY = path.join(process.cwd(), 'data');
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

// Write JSON file
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  // If we have GitHub token and we're not in development, use GitHub
  if (process.env.GITHUB_TOKEN && process.env.NODE_ENV !== 'development') {
    try {
      const sha = await githubStorage.getFileSHA(`data/${filename}`);
      await githubStorage.writeJSONFile(`data/${filename}`, data, sha || undefined);
      return;
    } catch (error) {
      console.error(`GitHub write failed for ${filename}, using fallback:`, error);
      // Fall through to local file system
    }
  }
  
  // Fallback to local file system
  const fs = await import('fs');
  const path = await import('path');
  const DATA_DIRECTORY = path.join(process.cwd(), 'data');
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

// Create article
export async function createArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
  const category = articleData.category.toLowerCase();
  const filename = getCategoryFilename(category);
  
  // Read existing articles
  const data = await readJsonFile<{ articles: Article[] }>(filename);
  
  // Get next ID
  const nextId = data.articles.length > 0 
    ? Math.max(...data.articles.map(a => a.id)) + 1 
    : 1;
  
  // Create article with ID
  const article: Article = {
    ...articleData,
    id: nextId
  };
  
  // Add to array
  data.articles.push(article);
  
  // Write back to file
  await writeJsonFile(filename, data);
  
  return article;
}

// Update article
export async function updateArticle(slug: string, articleData: Partial<Article>): Promise<Article | null> {
  const categories = ['tech', 'business', 'markets', 'guides'];
  
  for (const category of categories) {
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    const index = data.articles.findIndex(a => a.slug === slug);
    if (index !== -1) {
      // Update article
      data.articles[index] = {
        ...data.articles[index],
        ...articleData
      };
      
      // Write back to file
      await writeJsonFile(filename, data);
      
      return data.articles[index];
    }
  }
  
  return null;
}

// Delete article
export async function deleteArticle(slug: string): Promise<boolean> {
  const categories = ['tech', 'business', 'markets', 'guides'];
  
  for (const category of categories) {
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    const initialLength = data.articles.length;
    data.articles = data.articles.filter(a => a.slug !== slug);
    
    if (data.articles.length !== initialLength) {
      // Article was found and removed
      await writeJsonFile(filename, data);
      return true;
    }
  }
  
  return false;
}