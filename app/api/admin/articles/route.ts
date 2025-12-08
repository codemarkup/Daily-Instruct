// app/api/admin/articles/route.ts - UPDATED FOR GITHUB
import { NextRequest, NextResponse } from 'next/server';
import { GitHubStorage } from '@/lib/github-storage';
import { getCategoryFilename } from '@/lib/json-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Read from GitHub in production, from files in development
    if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
      const githubStorage = new GitHubStorage();
      const allArticles = [];
      
      const categories = ['tech', 'business', 'markets', 'guides'];
      for (const cat of categories) {
        if (category && cat !== category.toLowerCase()) continue;
        
        const filename = getCategoryFilename(cat);
        try {
          const data = await githubStorage.readJSONFile(`data/${filename}`);
          allArticles.push(...data.articles || []);
        } catch (error) {
          console.error(`Error reading ${filename}:`, error);
        }
      }
      
      return NextResponse.json(allArticles);
    } else {
      // Development: Read from local files
      const fs = await import('fs/promises');
      const path = await import('path');
      const DATA_DIRECTORY = path.join(process.cwd(), 'data');
      
      const allArticles = [];
      const categories = category ? [category] : ['tech', 'business', 'markets', 'guides'];
      
      for (const cat of categories) {
        const filename = getCategoryFilename(cat);
        const filePath = path.join(DATA_DIRECTORY, filename);
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          allArticles.push(...data.articles || []);
        } catch (error) {
          console.error(`Error reading ${filename}:`, error);
        }
      }
      
      return NextResponse.json(allArticles);
    }
    
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
    
    // Check if GitHub is configured (BEFORE validation)
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN missing in environment variables');
      return NextResponse.json(
        { 
          error: 'GitHub integration not configured',
          message: 'Please set GITHUB_TOKEN environment variable in Vercel'
        },
        { status: 500 }
      );
    }
    
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

    // ... rest of your existing code continues ...

    const category = articleData.category.toLowerCase();
    const filename = getCategoryFilename(category);
    
    let data: { articles: any[] };
    let sha: string | null = null;
    
    // READ: Get existing articles
    if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
      const githubStorage = new GitHubStorage();
      data = await githubStorage.readJSONFile(`data/${filename}`);
      sha = await githubStorage.getFileSHA(`data/${filename}`);
    } else {
      // Development: Read from local files
      const fs = await import('fs/promises');
      const path = await import('path');
      const DATA_DIRECTORY = path.join(process.cwd(), 'data');
      const filePath = path.join(DATA_DIRECTORY, filename);
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        data = JSON.parse(content);
      } catch (error) {
        data = { articles: [] };
      }
    }
    
    // Check if slug already exists
    if (data.articles.some((a: any) => a.slug === articleData.slug)) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Get next ID
    const nextId = data.articles.length > 0 
      ? Math.max(...data.articles.map((a: any) => a.id)) + 1 
      : 1;
    
    // Create article
    const article = {
      ...articleData,
      id: nextId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to array
    data.articles.push(article);
    
    // WRITE: Save back
    if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
      const githubStorage = new GitHubStorage();
      await githubStorage.writeJSONFile(`data/${filename}`, data, sha || undefined);
    } else {
      // Development: Write to local files
      const fs = await import('fs/promises');
      const path = await import('path');
      const DATA_DIRECTORY = path.join(process.cwd(), 'data');
      const filePath = path.join(DATA_DIRECTORY, filename);
      
      await fs.mkdir(DATA_DIRECTORY, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      article,
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
    const articleData = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Find which category the article belongs to
    let targetCategory: string | null = null;
    let targetFilename: string | null = null;
    let allArticles: any[] = [];
    
    const categories = ['tech', 'business', 'markets', 'guides'];
    
    for (const cat of categories) {
      const filename = getCategoryFilename(cat);
      let data: { articles: any[] };
      
      if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
        const githubStorage = new GitHubStorage();
        data = await githubStorage.readJSONFile(`data/${filename}`);
      } else {
        const fs = await import('fs/promises');
        const path = await import('path');
        const DATA_DIRECTORY = path.join(process.cwd(), 'data');
        const filePath = path.join(DATA_DIRECTORY, filename);
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          data = JSON.parse(content);
        } catch (error) {
          continue;
        }
      }
      
      const articleIndex = data.articles.findIndex((a: any) => a.slug === slug);
      if (articleIndex !== -1) {
        targetCategory = cat;
        targetFilename = filename;
        allArticles = data.articles;
        
        // Update article
        allArticles[articleIndex] = {
          ...allArticles[articleIndex],
          ...articleData,
          updatedAt: new Date().toISOString(),
        };
        break;
      }
    }
    
    if (!targetCategory || !targetFilename) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Save updated articles
    if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
      const githubStorage = new GitHubStorage();
      const sha = await githubStorage.getFileSHA(`data/${targetFilename}`);
      await githubStorage.writeJSONFile(`data/${targetFilename}`, { articles: allArticles }, sha || undefined);
    } else {
      const fs = await import('fs/promises');
      const path = await import('path');
      const DATA_DIRECTORY = path.join(process.cwd(), 'data');
      const filePath = path.join(DATA_DIRECTORY, targetFilename);
      
      await fs.writeFile(filePath, JSON.stringify({ articles: allArticles }, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      article: allArticles.find((a: any) => a.slug === slug),
      message: 'Article updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Find which category the article belongs to
    let targetCategory: string | null = null;
    let targetFilename: string | null = null;
    let allArticles: any[] = [];
    
    const categories = ['tech', 'business', 'markets', 'guides'];
    
    for (const cat of categories) {
      const filename = getCategoryFilename(cat);
      let data: { articles: any[] };
      
      if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
        const githubStorage = new GitHubStorage();
        data = await githubStorage.readJSONFile(`data/${filename}`);
      } else {
        const fs = await import('fs/promises');
        const path = await import('path');
        const DATA_DIRECTORY = path.join(process.cwd(), 'data');
        const filePath = path.join(DATA_DIRECTORY, filename);
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          data = JSON.parse(content);
        } catch (error) {
          continue;
        }
      }
      
      const articleIndex = data.articles.findIndex((a: any) => a.slug === slug);
      if (articleIndex !== -1) {
        targetCategory = cat;
        targetFilename = filename;
        allArticles = data.articles.filter((a: any) => a.slug !== slug);
        break;
      }
    }
    
    if (!targetCategory || !targetFilename) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Save updated articles (with deleted article removed)
    if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
      const githubStorage = new GitHubStorage();
      const sha = await githubStorage.getFileSHA(`data/${targetFilename}`);
      await githubStorage.writeJSONFile(`data/${targetFilename}`, { articles: allArticles }, sha || undefined);
    } else {
      const fs = await import('fs/promises');
      const path = await import('path');
      const DATA_DIRECTORY = path.join(process.cwd(), 'data');
      const filePath = path.join(DATA_DIRECTORY, targetFilename);
      
      await fs.writeFile(filePath, JSON.stringify({ articles: allArticles }, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article', details: error.message },
      { status: 500 }
    );
  }
}