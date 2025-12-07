// /app/api/admin/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  readJsonFile, 
  writeJsonFile, 
  getCategoryFilename,
  Article 
} from '@/lib/json-utils';

// GET: Fetch all articles from all categories
export async function GET(request: NextRequest) {
  try {
    const categories = ['tech', 'business', 'markets', 'guides'];
    const allArticles: Article[] = [];

    for (const category of categories) {
      const filename = getCategoryFilename(category);
      const data = await readJsonFile<{ articles: Article[] }>(filename);
      
      // Add articles with their category
      const articlesWithCategory = data.articles.map(article => ({
        ...article,
        category // Ensure category is set
      }));
      
      allArticles.push(...articlesWithCategory);
    }

    // Add sorting options if needed
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'date';
    const order = searchParams.get('order') || 'desc';
    
    let sortedArticles = [...allArticles];
    
    if (sort === 'date') {
      sortedArticles.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sort === 'title') {
      sortedArticles.sort((a, b) => 
        order === 'desc' 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      articles: sortedArticles,
      total: sortedArticles.length
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST: Create new article
export async function POST(request: NextRequest) {
  try {
    const articleData: Omit<Article, 'id'> & { category: string } = await request.json();
    const { category, ...articleWithoutCategory } = articleData;
    
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    // Get next ID
    const nextId = data.articles.length > 0 
      ? Math.max(...data.articles.map(a => a.id)) + 1
      : 1;
    
    // Get current date in your format "Month DD, YYYY"
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create new article with all required fields
    const newArticle: Article = {
      id: nextId,
      slug: articleWithoutCategory.slug,
      title: articleWithoutCategory.title,
      description: articleWithoutCategory.description || '',
      author: articleWithoutCategory.author || 'Admin',
      date: articleWithoutCategory.date || currentDate,
      readTime: articleWithoutCategory.readTime || '5 min read',
      image: articleWithoutCategory.image || '/images/default.png',
      category: category,
      specific: articleWithoutCategory.specific || 'General',
      trending: articleWithoutCategory.trending || false,
      featured: articleWithoutCategory.featured || false,
      topStory: articleWithoutCategory.topStory || false,
      grid: articleWithoutCategory.grid || false,
      homeFeatured: articleWithoutCategory.homeFeatured || false,
      homeLatest: articleWithoutCategory.homeLatest || false,
      homeTrending: articleWithoutCategory.homeTrending || false,
      homeTopStory: articleWithoutCategory.homeTopStory || false,
      content: articleWithoutCategory.content || [
        {
          type: 'paragraph',
          text: articleWithoutCategory.description || 'Article content goes here.'
        }
      ]
    };
    
    console.log('Creating new article:', newArticle);
    
    data.articles.push(newArticle);
    await writeJsonFile(filename, data);
    
    return NextResponse.json({ 
      success: true, 
      article: newArticle,
      message: 'Article created successfully'
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}