import { supabase } from './supabase';

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
  keywords?: string;
  metaDescription?: string;
}

export interface HomeArticles {
  homeArticles: {
    featured: number[];
    topStories: number[];
    latest: number[];
    trending: number[];
  };
}

function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString; // Fallback if it's not a valid ISO date
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return isoString;
  }
}

function formatArticleDate(article: any): any {
  if (!article) return article;
  return {
    ...article,
    date: formatDate(article.date)
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
  if (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
  return data.map(formatArticleDate) as Article[];
}

export async function findArticleBySlug(slug: string): Promise<{ article: Article; category: string } | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  const formattedData = formatArticleDate(data);
  return { article: formattedData as Article, category: data.category };
}

// Emulate readJsonFile for existing components
export async function readJsonFile<T>(filename: string): Promise<T> {
  if (filename === 'home-articles.json') {
    const { data } = await supabase.from('articles').select('id, homeFeatured, homeLatest, homeTrending, homeTopStory');
    if (!data) return { homeArticles: { featured: [], topStories: [], latest: [], trending: [] } } as T;
    
    return {
      homeArticles: {
        featured: data.filter(a => a.homeFeatured).map(a => a.id),
        topStories: data.filter(a => a.homeTopStory).map(a => a.id),
        latest: data.filter(a => a.homeLatest).map(a => a.id),
        trending: data.filter(a => a.homeTrending).map(a => a.id),
      }
    } as T;
  }
  
  // It's a category file like tech-articles.json
  const category = filename.replace('-articles.json', '');
  const { data } = await supabase.from('articles').select('*').eq('category', category).order('date', { ascending: false });
  
  return { articles: (data || []).map(formatArticleDate) } as T;
}

// Emulate writeJsonFile (only used by admin panel now)
export async function writeJsonFile<T>(filename: string, data: any): Promise<void> {
  if (filename === 'home-articles.json') {
    const { homeArticles } = data;
    // Reset all home flags
    await supabase.from('articles').update({ homeFeatured: false, homeLatest: false, homeTrending: false, homeTopStory: false }).neq('id', 0);
    
    // Set new flags
    if (homeArticles.featured?.length) await supabase.from('articles').update({ homeFeatured: true }).in('id', homeArticles.featured);
    if (homeArticles.topStories?.length) await supabase.from('articles').update({ homeTopStory: true }).in('id', homeArticles.topStories);
    if (homeArticles.latest?.length) await supabase.from('articles').update({ homeLatest: true }).in('id', homeArticles.latest);
    if (homeArticles.trending?.length) await supabase.from('articles').update({ homeTrending: true }).in('id', homeArticles.trending);
    return;
  }
}

export async function getNextArticleId(category: string): Promise<number> {
  const { data } = await supabase.from('articles').select('id').order('id', { ascending: false }).limit(1);
  return data && data.length > 0 ? data[0].id + 1 : 1;
}

function checkMojibake(text: string | null | undefined): void {
  if (!text) return;
  if (/Ã|Â|â/.test(text) || /(.)\1{19,}/.test(text)) {
    throw new Error("Validation Failed: Content contains mojibake encoding corruption or repeated junk sequences.");
  }
}

function validateArticleContent(article: Partial<Article>) {
  checkMojibake(article.title);
  checkMojibake(article.description);
  checkMojibake(article.author);
  if (article.content && Array.isArray(article.content)) {
    article.content.forEach(block => checkMojibake(block.text));
  }
}

export async function createArticle(articleData: any): Promise<Article> {
  const { trackers, ...dbData } = articleData;
  validateArticleContent(dbData);
  const { data, error } = await supabase.from('articles').insert([dbData]).select().single();
  if (error) throw error;
  
  if (trackers && Array.isArray(trackers) && trackers.length > 0) {
    const trackerUpdates = trackers.map((trackerId: any) => ({
      tracker_id: trackerId,
      content: data.title,
      linked_article_id: data.id,
      published_at: new Date().toISOString()
    }));
    await supabase.from('tracker_updates').insert(trackerUpdates);
  }
  
  return data as Article;
}

export async function updateArticle(slug: string, articleData: any): Promise<Article | null> {
  const { trackers, ...dbData } = articleData;
  validateArticleContent(dbData);
  const { data, error } = await supabase.from('articles').update(dbData).eq('slug', slug).select().single();
  if (error) return null;

  if (trackers && Array.isArray(trackers)) {
    const { data: existingUpdates } = await supabase.from('tracker_updates').select('tracker_id').eq('linked_article_id', data.id);
    const existingTrackerIds = (existingUpdates || []).map(u => u.tracker_id);
    
    const newTrackers = trackers.filter((id: any) => !existingTrackerIds.includes(id));
    if (newTrackers.length > 0) {
      const trackerUpdates = newTrackers.map((trackerId: any) => ({
        tracker_id: trackerId,
        content: data.title,
        linked_article_id: data.id,
        published_at: new Date().toISOString()
      }));
      await supabase.from('tracker_updates').insert(trackerUpdates);
    }
    
    const removedTrackers = existingTrackerIds.filter(id => !trackers.includes(id));
    if (removedTrackers.length > 0) {
      await supabase.from('tracker_updates').delete().eq('linked_article_id', data.id).in('tracker_id', removedTrackers);
    }
  }

  return data as Article;
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const { error } = await supabase.from('articles').delete().eq('slug', slug);
  return !error;
}

export function sanitizeInputText(text: string): string {
  if (!text) return text;
  return text
    .replace(/[\u2018\u2019]/g, "'")           
    .replace(/[\u201C\u201D]/g, '"')           
    .replace(/\u2013/g, '-')                   
    .replace(/\u2014/g, '--')                  
    .replace(/\u2026/g, '...')                 
    .replace(/\u00A0/g, ' ')                   
    .replace(/\u00E2\u20AC\u2122/g, "'")       
    .replace(/\u00E2\u20AC\u201D/g, '"')       
    .normalize('NFKD')                         
    .replace(/[\u0300-\u036f]/g, '');          
}

export function sanitizeArticle(article: Partial<Article>): Partial<Article> {
  const sanitized: Partial<Article> = { ...article };
  if (sanitized.title) sanitized.title = sanitizeInputText(sanitized.title);
  if (sanitized.description) sanitized.description = sanitizeInputText(sanitized.description);
  if (sanitized.keywords) sanitized.keywords = sanitizeInputText(sanitized.keywords);
  if (sanitized.metaDescription) sanitized.metaDescription = sanitizeInputText(sanitized.metaDescription);
  
  if (sanitized.content && Array.isArray(sanitized.content)) {
    sanitized.content = sanitized.content.map(block => ({
      ...block,
      text: sanitizeInputText(block.text),
      author: block.author ? sanitizeInputText(block.author) : undefined
    }));
  }
  return sanitized;
}

export class GitHubStorage {
  // Empty stub so existing imports don't break
}