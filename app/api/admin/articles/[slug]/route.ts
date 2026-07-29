import { NextRequest, NextResponse } from 'next/server';
import { 
  findArticleBySlug,
  updateArticle,
  deleteArticle,
  sanitizeArticle,
  Article 
} from '@/lib/json-utils';

async function getParams(context: any): Promise<{ slug: string }> {
  return context.params;
}

// GET: Get single article by slug
export async function GET(request: NextRequest, context: any) {
  const params = await getParams(context);
  const slug = params.slug;

  try {
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
    const success = await deleteArticle(slug);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: `Article "${slug}" not found` },
        { status: 404 }
      );
    }
    
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
    
    const newArticleData = sanitizeArticle(updateData);
    const updatedArticle = await updateArticle(slug, newArticleData);
    
    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      article: updatedArticle,
      message: 'Article updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update article', details: error.message },
      { status: 500 }
    );
  }
}