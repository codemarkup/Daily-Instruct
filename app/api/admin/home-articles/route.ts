// /app/api/admin/home-articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile, HomeArticles } from '@/lib/json-utils';

// GET: Get current homepage configuration
export async function GET() {
  try {
    const homeData = await readJsonFile<HomeArticles>('home-articles.json');
    return NextResponse.json({ 
      success: true, 
      homeArticles: homeData.homeArticles 
    });
  } catch (error) {
    console.error('Error fetching home articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home articles' },
      { status: 500 }
    );
  }
}

// POST: Update homepage configuration
export async function POST(request: NextRequest) {
  try {
    const updates = await request.json();
    const currentData = await readJsonFile<HomeArticles>('home-articles.json');
    
    const updatedHomeArticles = {
      homeArticles: {
        ...currentData.homeArticles,
        ...updates
      }
    };
    
    await writeJsonFile('home-articles.json', updatedHomeArticles);
    
    return NextResponse.json({ 
      success: true, 
      homeArticles: updatedHomeArticles.homeArticles,
      message: 'Homepage configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating home articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update home articles' },
      { status: 500 }
    );
  }
}