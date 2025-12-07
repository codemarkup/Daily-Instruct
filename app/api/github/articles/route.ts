import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'tech';
    
    const owner = process.env.GITHUB_OWNER || 'codemarkup';
    const repo = process.env.GITHUB_REPO || 'Daily-Instruct'; 
    
    const filename = category === 'markets' ? 'markets-articles.json' : `${category}-articles.json`;
    
    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/data/${filename}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      // Fallback to local file for development
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs/promises');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'data', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(content));
      }
      
      return NextResponse.json(
        { articles: [] },
        { status: 200 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { articles: [] },
      { status: 200 }
    );
  }
}