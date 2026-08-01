import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, createArticle, sanitizeArticle } from '@/lib/json-utils';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = supabase.from('articles').select('*').order('date', { ascending: false });
    
    if (category) {
      query = query.eq('category', category.toLowerCase());
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'description', 'category', 'specific'];
    for (const field of requiredFields) {
      if (!articleData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', articleData.slug)
      .single();
      
    if (existing) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create article
    const newArticleData = sanitizeArticle(articleData);
    const created = await createArticle(newArticleData as any);
    
    // Invalidate full site cache so new articles appear instantly on category and home pages
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      article: created,
      message: 'Article created successfully'
    });

  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create article',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    const updateData = await request.json();
    const { updateArticle } = await import('@/lib/json-utils');
    const newArticleData = sanitizeArticle(updateData);
    const updatedArticle = await updateArticle(slug, newArticleData);
    
    if (!updatedArticle) {
      return NextResponse.json({ success: false, error: 'Article not found or update failed' }, { status: 404 });
    }
    
    // Invalidate full site cache
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, article: updatedArticle, message: 'Article updated successfully' });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    
    const { deleteArticle, findArticleBySlug } = await import('@/lib/json-utils');
    
    // Fetch article first to get image URL for Cloudinary cleanup
    const existing = await findArticleBySlug(slug);
    
    if (existing?.article?.image?.includes('cloudinary.com')) {
      try {
        const imageUrl = existing.article.image;
        const parts = imageUrl.split('/upload/');
        
        if (parts.length > 1) {
          let path = parts[1];
          // Remove version string if present (e.g., v1723456789/)
          if (path.match(/^v\d+\//)) {
            path = path.substring(path.indexOf('/') + 1);
          }
          
          // Remove file extension to get exact public_id
          const lastDotIndex = path.lastIndexOf('.');
          const publicId = lastDotIndex !== -1 ? path.substring(0, lastDotIndex) : path;
          
          // Initialize Cloudinary
          const { v2: cloudinary } = await import('cloudinary');
          cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          
          // Delete from Cloudinary
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted Cloudinary media [${publicId}]:`, result);
        }
      } catch (cloudinaryError) {
        console.error('Failed to delete image from Cloudinary:', cloudinaryError);
        // Continue with article deletion even if image deletion fails
      }
    }
    
    const success = await deleteArticle(slug);
    
    if (!success) {
      return NextResponse.json({ success: false, error: `Article "${slug}" not found` }, { status: 404 });
    }
    
    // Invalidate full site cache
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, message: 'Article and associated media deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
  }
}