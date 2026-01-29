// /lib/json-utils.ts - FIXED UTF-8 VERSION
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
        'Content-Type': 'application/json; charset=utf-8',
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

  // Read JSON file from GitHub with PROPER UTF-8 handling
  async readJSONFile(path: string): Promise<any> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      
      // FIXED: PROPER UTF-8 Base64 decoding
      const binaryString = atob(data.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const text = new TextDecoder('utf-8').decode(bytes);
      
      // Parse JSON and sanitize UTF-8 characters
      const parsed = JSON.parse(text);
      return this.sanitizeUTF8(parsed);
    } catch (error: any) {
      // If file doesn't exist, return default structure
      if (error.message.includes('404')) {
        return { articles: [] };
      }
      throw error;
    }
  }

  // Write JSON file to GitHub with PROPER UTF-8 handling
  async writeJSONFile(path: string, content: any, sha?: string): Promise<any> {
    // First sanitize the content to fix smart characters
    const sanitizedContent = this.sanitizeUTF8(content);
    
    // Stringify with proper UTF-8
    const fileContent = JSON.stringify(sanitizedContent, null, 2);
    
    // FIXED: Convert UTF-8 string to Base64 properly
    const bytes = new TextEncoder().encode(fileContent);
    const binaryString = String.fromCharCode(...bytes);
    const encodedContent = btoa(binaryString);

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

  // UTF-8 Sanitizer to fix smart quotes and special characters
  private sanitizeUTF8(obj: any): any {
    if (typeof obj === 'string') {
      // Fix the specific "â" sequence (0xE2 0x80 0x99 in UTF-8 bytes)
      let sanitized = obj
        .replace(/\u00E2\u20AC\u2122/g, "'")        // Fix "â" -> "'"
        .replace(/\u00E2\u20AC\u201D/g, '"')        // Fix other common sequences
        .replace(/\u00E2\u20AC\u201C/g, '"')
        .replace(/\u00E2\u20AC\u201C/g, '"')
        .replace(/\u00E2\u20AC\u201C/g, '"');
      
      // Also fix direct Unicode smart characters
      sanitized = sanitized
        .replace(/[\u2018\u2019]/g, "'")           // Smart single quotes ‘ ’
        .replace(/[\u201C\u201D]/g, '"')           // Smart double quotes " "
        .replace(/\u2013/g, '-')                   // En dash –
        .replace(/\u2014/g, '--')                  // Em dash —
        .replace(/\u2026/g, '...')                 // Ellipsis …
        .replace(/\u00A0/g, ' ')                   // Non-breaking space
        .normalize('NFKD')                         // Normalize Unicode
        .replace(/[\u0300-\u036f]/g, '');          // Remove combining diacritics
      
      return sanitized;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeUTF8(item));
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        result[key] = this.sanitizeUTF8(obj[key]);
      }
      return result;
    }
    
    return obj;
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
        // Ensure UTF-8 encoding when writing locally
        await fs.promises.writeFile(
          filePath, 
          JSON.stringify(data, null, 2), 
          { encoding: 'utf-8' }
        );
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

// UTF-8 sanitizer helper for frontend input
export function sanitizeInputText(text: string): string {
  if (!text) return text;
  
  // Convert smart characters to plain ASCII equivalents
  return text
    .replace(/[\u2018\u2019]/g, "'")           // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"')           // Smart double quotes
    .replace(/\u2013/g, '-')                   // En dash
    .replace(/\u2014/g, '--')                  // Em dash
    .replace(/\u2026/g, '...')                 // Ellipsis
    .replace(/\u00A0/g, ' ')                   // Non-breaking space
    .replace(/\u00E2\u20AC\u2122/g, "'")       // Fix "â" sequence
    .replace(/\u00E2\u20AC\u201D/g, '"')       // Other broken sequences
    .normalize('NFKD')                         // Normalize Unicode
    .replace(/[\u0300-\u036f]/g, '');          // Remove combining marks
}

// Utility function to sanitize an entire article object
export function sanitizeArticle(article: Partial<Article>): Partial<Article> {
  const sanitized: Partial<Article> = { ...article };
  
  // Sanitize all string fields
  if (sanitized.title) sanitized.title = sanitizeInputText(sanitized.title);
  if (sanitized.description) sanitized.description = sanitizeInputText(sanitized.description);
  if (sanitized.keywords) sanitized.keywords = sanitizeInputText(sanitized.keywords);
  if (sanitized.metaDescription) sanitized.metaDescription = sanitizeInputText(sanitized.metaDescription);
  
  // Sanitize content blocks
  if (sanitized.content && Array.isArray(sanitized.content)) {
    sanitized.content = sanitized.content.map(block => ({
      ...block,
      text: sanitizeInputText(block.text),
      author: block.author ? sanitizeInputText(block.author) : undefined
    }));
  }
  
  return sanitized;
}

export { GitHubStorage };