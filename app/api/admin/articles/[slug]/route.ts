// /app/api/admin/articles/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  readJsonFile, 
  writeJsonFile, 
  getCategoryFilename, 
  findArticleBySlug,
  Article 
} from '@/lib/json-utils';

// Type-safe way to handle Next.js 15 params
async function getParams(context: any): Promise<{ slug: string }> {
  return context.params;
}

// GET: Get single article by slug
export async function GET(request: NextRequest, context: any) {
  const params = await getParams(context);
  const slug = params.slug;

  try {
    console.log('GET request URL:', request.url);
    console.log('GET params slug:', slug);
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const result = await findArticleBySlug(slug);
    
    if (!result) {
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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// DELETE: Delete article
export async function DELETE(request: NextRequest, context: any) {
  const params = await getParams(context);
  const slug = params.slug;

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category query parameter is required' },
        { status: 400 }
      );
    }
    
    const filename = getCategoryFilename(category);
    const data = await readJsonFile<{ articles: Article[] }>(filename);
    
    const articleIndex = data.articles.findIndex(a => 
      a.slug.toLowerCase() === slug.toLowerCase()
    );
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Article "${slug}" not found` },
        { status: 404 }
      );
    }
    
    data.articles.splice(articleIndex, 1);
    await writeJsonFile(filename, data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

// PUT: Update article
export async function PUT(request: NextRequest, context: any) {
  const params = await getParams(context);
  const slug = params.slug;

  try {
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
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}