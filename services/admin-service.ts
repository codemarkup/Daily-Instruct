// /services/admin-service.ts - FIXED UTF-8 VERSION
const API_BASE = '/api/hq';

// UPDATE THIS INTERFACE - ADD THE SEO FIELDS
export interface Article {
  id: number;
  slug: string;
  title: string;
  content_type?: 'article' | 'opinion' | 'explainer';
  featured_position?: number;
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
  trackers?: string[];
}

export interface Tracker {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url: string;
  status: 'active' | 'resolved';
  category: string;
  priority?: number;
  created_at?: string;
  updated_at?: string;
  updates?: TrackerUpdate[];
}

export interface TrackerUpdate {
  id?: string;
  tracker_id: string;
  published_at: string;
  content: string;
  source_note?: string;
  linked_article_id?: number;
}

export interface HomepageConfig {
  id: number;
  trending_tags: Array<{ label: string; link: string }>;
}

// UTF-8 Sanitizer function to fix smart quotes and special characters
function sanitizeArticleData(articleData: any): any {
  const sanitizeText = (text: string): string => {
    if (!text || typeof text !== 'string') return text || '';
    
    // First fix the specific "â" sequence that appears in your output
    let sanitized = text
      .replace(/\u00E2\u20AC\u2122/g, "'")        // Fix "â" -> "'"
      .replace(/\u00E2\u20AC\u201D/g, '"')        // Fix other common broken UTF-8 sequences
      .replace(/\u00E2\u20AC\u201C/g, '"')
      .replace(/\u00E2\u20AC\u201C/g, '"');
    
    // Fix smart characters from Word/Google Docs
    sanitized = sanitized
      .replace(/[\u2018\u2019]/g, "'")           // Smart single quotes ‘ ’
      .replace(/[\u201C\u201D]/g, '"')           // Smart double quotes " "
      .replace(/\u2013/g, '-')                   // En dash –
      .replace(/\u2014/g, '--')                  // Em dash —
      .replace(/\u2026/g, '...')                 // Ellipsis …
      .replace(/\u00A0/g, ' ')                   // Non-breaking space
      .replace(/\u00AD/g, '')                    // Soft hyphen
      .replace(/\u200B/g, '')                    // Zero-width space
      .replace(/\uFEFF/g, '');                   // Zero-width no-break space
    
    // Normalize Unicode and remove combining marks
    sanitized = sanitized
      .normalize('NFKD')                         // Normalize Unicode
      .replace(/[\u0300-\u036f]/g, '');          // Remove combining diacritics
    
    return sanitized;
  };

  // Create a deep copy to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(articleData));
  
  // Sanitize all top-level string fields
  const stringFields = [
    'title', 'description', 'keywords', 'metaDescription', 
    'author', 'date', 'readTime', 'slug', 'specific'
  ];
  
  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field]);
    }
  });
  
  // Sanitize content blocks (nested structure)
  if (sanitized.content && Array.isArray(sanitized.content)) {
    sanitized.content = sanitized.content.map((block: any) => ({
      ...block,
      text: block.text ? sanitizeText(block.text) : '',
      author: block.author ? sanitizeText(block.author) : undefined
    }));
  }
  
  return sanitized;
}

// Test function to verify sanitization
function testSanitization() {
  const testCases = [
    { input: "Meta's AI Strategy", expected: "Meta's AI Strategy" },
    { input: "Microsoft's Cloud Growth", expected: "Microsoft's Cloud Growth" },
    { input: "Google's AI Ambitions", expected: "Google's AI Ambitions" },
    { input: "Apple's New iPhone", expected: "Apple's New iPhone" },
    { input: "Tesla's Electric Future", expected: "Tesla's Electric Future" },
    { input: "Meta's – Special Dash", expected: "Meta's -- Special Dash" },
    { input: "AI's… Future Prospects", expected: "AI's... Future Prospects" },
    { input: "Data’s importance", expected: "Data's importance" },
    { input: "Company's “mission”", expected: "Company's \"mission\"" },
  ];
  
  console.log('UTF-8 Sanitization Test Results:');
  testCases.forEach((test, i) => {
    const result = sanitizeArticleData({ title: test.input }).title;
    const passed = result === test.expected;
    console.log(`Test ${i + 1}: ${passed ? '✓' : '✗'} "${test.input}" → "${result}"`);
    if (!passed) console.log(`  Expected: "${test.expected}"`);
  });
}

// Optional: Run test in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Test on page load in development
  setTimeout(testSanitization, 1000);
}

export const AdminService = {
  // UTF-8 Sanitizer (export for use elsewhere if needed)
  sanitizeArticleData,
  
  // Real-time Notifications
  addNotification(text: string) {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('admin_notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      const newNotification = {
        id: Date.now(),
        text,
        timestamp: Date.now(),
        read: false
      };
      
      const updated = [newNotification, ...notifications].slice(0, 50);
      localStorage.setItem('admin_notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('admin_notifications_updated'));
    } catch (e) {
      console.error("Failed to add notification", e);
    }
  },
  
  async createArticle(articleData: Omit<Article, 'id'>): Promise<Article> {
    console.log('Original article data:', JSON.stringify(articleData).substring(0, 200));
    
    // SANITIZE UTF-8 CHARACTERS BEFORE SENDING
    const sanitizedData = sanitizeArticleData(articleData);
    console.log('Sanitized article data:', JSON.stringify(sanitizedData).substring(0, 200));
    
    const response = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8', // FIXED: Added charset
        'Accept': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(sanitizedData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create article: ${error}`);
    }
    
    const data = await response.json();
    console.log('Article created successfully:', data.article?.slug);
    this.addNotification(`Published new article: "${sanitizedData.title}"`);
    return data.article;
  },

  async getAllArticles(): Promise<Article[]> {
    return this.getArticles(); // Just calls getArticles()
  },

  async getArticles(category?: string): Promise<Article[]> {
    const url = category ? `${API_BASE}/articles?category=${category}` : `${API_BASE}/articles`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json; charset=utf-8' // FIXED: Added charset
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    
    // Parse response with UTF-8 handling
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse articles JSON:', error);
      throw new Error('Invalid response format from server');
    }
  },

  async updateArticle(slug: string, articleData: Partial<Article>): Promise<Article> {
    console.log('Original update data:', JSON.stringify(articleData).substring(0, 200));
    
    // SANITIZE UTF-8 CHARACTERS BEFORE SENDING
    const sanitizedData = sanitizeArticleData(articleData);
    console.log('Sanitized update data:', JSON.stringify(sanitizedData).substring(0, 200));
    
    const response = await fetch(`${API_BASE}/articles?slug=${slug}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8', // FIXED: Added charset
        'Accept': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(sanitizedData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update article: ${error}`);
    }
    
    const data = await response.json();
    console.log('Article updated successfully:', data.article?.slug);
    this.addNotification(`Updated article: "${sanitizedData.title}"`);
    return data.article;
  },

  async deleteArticle(slug: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/articles?slug=${slug}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json; charset=utf-8' // FIXED: Added charset
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete article: ${error}`);
    }
    
    console.log('Article deleted successfully:', slug);
    this.addNotification(`Deleted article: /${slug}`);
    return await response.json();
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const articles = await this.getArticles();
      const article = articles.find(article => article.slug === slug) || null;
      
      if (article) {
        console.log(`Found article: ${slug}, title: "${article.title.substring(0, 50)}..."`);
      }
      
      return article;
    } catch (error) {
      console.error('Error getting article by slug:', error);
      return null;
    }
  },

  async getCategories(): Promise<string[]> {
    return ['tech', 'business', 'markets', 'guides'];
  },

  // Helper method to check for UTF-8 issues
  async checkArticleEncoding(slug: string): Promise<void> {
    try {
      const article = await this.getArticleBySlug(slug);
      if (!article) {
        console.log(`Article ${slug} not found`);
        return;
      }
      
      console.log(`=== UTF-8 Check for ${slug} ===`);
      console.log(`Title: "${article.title}"`);
      
      // Check for problematic sequences
      const checkText = (text: string, label: string) => {
        if (!text) return;
        
        // Check for the "â" sequence
        if (text.includes('\u00E2\u20AC\u2122')) {
          console.log(`⚠️  ${label} contains "â" sequence`);
        }
        
        // Check for smart quotes
        if (/[\u2018\u2019\u201C\u201D]/.test(text)) {
          console.log(`⚠️  ${label} contains smart quotes`);
        }
        
        // Check for other special characters
        if (/[\u2013\u2014\u2026]/.test(text)) {
          console.log(`⚠️  ${label} contains special dashes/ellipsis`);
        }
        
        // Show character codes for first 100 chars
        console.log(`${label} char codes:`, 
          Array.from(text.substring(0, 100))
            .map(c => c.charCodeAt(0).toString(16))
            .join(' ')
        );
      };
      
      checkText(article.title, 'Title');
      checkText(article.description, 'Description');
      
      if (article.content && article.content.length > 0) {
        checkText(article.content[0].text, 'First content block');
      }
      
    } catch (error) {
      console.error('Error checking article encoding:', error);
    }
  },
  
  // ================== TRACKERS API ==================
  
  async getAllTrackers(): Promise<Tracker[]> {
    const res = await fetch(`${API_BASE}/trackers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch trackers');
    return res.json();
  },

  async getTracker(slug: string): Promise<Tracker> {
    const res = await fetch(`${API_BASE}/trackers/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch tracker');
    return res.json();
  },

  async createTracker(tracker: Partial<Tracker>): Promise<Tracker> {
    const res = await fetch(`${API_BASE}/trackers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tracker),
    });
    if (!res.ok) throw new Error('Failed to create tracker');
    return res.json();
  },

  async updateTracker(slug: string, tracker: Partial<Tracker>): Promise<Tracker> {
    const res = await fetch(`${API_BASE}/trackers/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tracker),
    });
    if (!res.ok) throw new Error('Failed to update tracker');
    return res.json();
  },

  async deleteTracker(slug: string): Promise<void> {
    const res = await fetch(`${API_BASE}/trackers/${slug}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete tracker');
    this.addNotification(`Deleted tracker: ${slug}`);
  },

  async createTrackerUpdate(update: Partial<TrackerUpdate>): Promise<TrackerUpdate> {
    const res = await fetch(`${API_BASE}/trackers/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('Failed to create tracker update');
    
    this.addNotification(`Added update to tracker`);
    return res.json();
  },

  async getHomepageConfig(): Promise<HomepageConfig> {
    const res = await fetch(`${API_BASE}/config/homepage`, { cache: 'no-store' });
    if (!res.ok) return { id: 1, trending_tags: [] };
    return res.json();
  },

  async updateHomepageConfig(config: Partial<HomepageConfig>): Promise<HomepageConfig> {
    const res = await fetch(`${API_BASE}/config/homepage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update homepage config');
    return res.json();
  }
};