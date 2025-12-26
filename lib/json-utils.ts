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
  // SEO FIELDS ADDED ↓
  keywords?: string;           // For SEO meta keywords
  metaDescription?: string;    // Custom meta description
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

// Read JSON file - ALWAYS use GitHub API, fallback to local only in development
export async function readJsonFile<T>(filename: string): Promise<T> {
  const githubStorage = new GitHubStorage();
  
  try {
    const data = await githubStorage.readJSONFile(`data/${filename}`);
    return data as T;
  } catch (error: any) {
    console.error(`GitHub read failed for ${filename}:`, error);
    
    // Only fallback to local file system in development
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const DATA_DIRECTORY = path.join(process.cwd(), 'data');
        const filePath = path.join(DATA_DIRECTORY, filename);
        
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
      } catch (fsError) {
        console.error(`Local file read also failed for ${filename}:`, fsError);
      }
    }
    
    // Return empty/default structure if file doesn't exist
    if (filename.includes('home')) {
      return { homeArticles: { featured: [], topStories: [], latest: [], trending: [] } } as T;
    }
    return { articles: [] } as T;
  }
}

// Write JSON file - ALWAYS use GitHub API, fallback to local only in development
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const githubStorage = new GitHubStorage();
  
  try {
    const sha = await githubStorage.getFileSHA(`data/${filename}`);
    await githubStorage.writeJSONFile(`data/${filename}`, data, sha || undefined);
    console.log(`Successfully wrote ${filename} to GitHub`);
  } catch (error: any) {
    console.error(`GitHub write failed for ${filename}:`, error);
    
    // Only fallback to local file system in development
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const DATA_DIRECTORY = path.join(process.cwd(), 'data');
        const filePath = path.join(DATA_DIRECTORY, filename);
        
        await fs.promises.mkdir(DATA_DIRECTORY, { recursive: true });
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Successfully wrote ${filename} to local file system`);
        return;
      } catch (fsError: any) {
        console.error(`Local file write also failed for ${filename}:`, fsError);
        throw new Error(`Failed to save file both on GitHub and locally: ${fsError.message}`);
      }
    }
    
    // In production/Vercel, throw the GitHub error
    throw new Error(`Failed to save article to GitHub: ${error.message}`);
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
  
  console.log(`Creating article in ${filename} for category: ${category}`);
  
  // Read existing articles
  const data = await readJsonFile<{ articles: Article[] }>(filename);
  console.log(`Existing articles count: ${data.articles.length}`);
  
  // Get next ID
  const nextId = data.articles.length > 0 
    ? Math.max(...data.articles.map(a => a.id)) + 1 
    : 1;
  
  console.log(`Next article ID: ${nextId}`);
  
  // Create article with ID
  const article: Article = {
    ...articleData,
    id: nextId
  };
  
  // Add to array
  data.articles.push(article);
  console.log(`Added article, total articles now: ${data.articles.length}`);
  
  // Write back to file
  await writeJsonFile(filename, data);
  console.log(`Successfully created article: ${article.slug}`);
  
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
        ...articleData,
        id: data.articles[index].id, // Preserve original ID
        slug: data.articles[index].slug // Preserve original slug
      };
      
      // Write back to file
      await writeJsonFile(filename, data);
      
      return data.articles[index];
    }
  }
  
  return null;
}

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