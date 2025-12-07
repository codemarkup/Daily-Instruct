// /app/api/admin/articles/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  readJsonFile, 
  writeJsonFile, 
  getCategoryFilename, 
  findArticleBySlug,
  Article 
} from '@/lib/json-utils';

// Helper to extract slug from URL (keep as backup)
function extractSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/api\/admin\/articles\/([^\/?]+)/);
  return match ? match[1] : null;
}

// GET: Get single article by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // Await params
    
    console.log('GET request URL:', request.url);
    console.log('GET params slug:', slug);
    
    if (!slug) {
      console.error('No slug found!');
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const result = await findArticleBySlug(slug);
    
    if (!result) {
      console.log('Article not found for slug:', slug);
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      article: result.article,
      category: result.category
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// DELETE: Delete article - SIMPLIFIED VERSION
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // Await params
    
    console.log('=== DELETE REQUEST ===');
    console.log('Request URL:', request.url);
    console.log('Slug from params:', slug);
    
    if (!slug) {
      console.error('ERROR: No slug found in URL');
      return NextResponse.json(
        { success: false, error: 'Slug parameter is missing from URL' },
        { status: 400 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    console.log('Category from query:', category);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category query parameter is required' },
        { status: 400 }
      );
    }
    
    const filename = getCategoryFilename(category);
    console.log('Looking in file:', filename);
    
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    console.log(`Found ${data.articles.length} articles`);
    
    // Find and delete
    const articleIndex = data.articles.findIndex(a => 
      a.slug.toLowerCase() === slug.toLowerCase()
    );
    
    if (articleIndex === -1) {
      console.log(`Article "${slug}" not found in ${filename}`);
      return NextResponse.json(
        { success: false, error: `Article "${slug}" not found` },
        { status: 404 }
      );
    }
    
    console.log(`Found article at index ${articleIndex}:`, data.articles[articleIndex]);
    
    // Remove the article
    data.articles.splice(articleIndex, 1);
    
    await writeJsonFile(filename, data);
    
    console.log(`SUCCESS: Article "${slug}" deleted`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

// PUT: Update article
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; // Await params
    
    console.log('PUT request URL:', request.url);
    console.log('Slug from params:', slug);
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is missing' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    const { category, ...articleUpdates } = updateData;
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required for update' },
        { status: 400 }
      );
    }
    
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    const articleIndex = data.articles.findIndex(a => a.slug === slug);
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }
    
    data.articles[articleIndex] = {
      ...data.articles[articleIndex],
      ...articleUpdates,
      id: data.articles[articleIndex].id,
      slug: data.articles[articleIndex].slug
    };
    
    await writeJsonFile(filename, data);
    
    return NextResponse.json({ 
      success: true, 
      article: data.articles[articleIndex],
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}