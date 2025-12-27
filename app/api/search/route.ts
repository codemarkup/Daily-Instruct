import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const limit = searchParams.get('limit') || '5';
  
  if (!q) {
    return NextResponse.json(
      { message: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    // Dynamically import your data files
    const [techData, businessData, marketData, guidesData] = await Promise.all([
      import('@/data/tech-articles.json'),
      import('@/data/business-articles.json'),
      import('@/data/markets-articles.json'),
      import('@/data/guides-articles.json')
    ]);

    // Combine all articles
    const allArticles = [
      ...techData.articles,
      ...businessData.articles,
      ...marketData.articles,
      ...guidesData.articles
    ];

    // Filter articles based on search query
    const searchQuery = q.toLowerCase();
    
    let results = allArticles.filter(article => {
      const searchableText = `
        ${article.title.toLowerCase()}
        ${article.description.toLowerCase()}
        ${article.author.toLowerCase()}
        ${article.category.toLowerCase()}
        ${article.specific?.toLowerCase() || ''}
      `;
      
      return searchableText.includes(searchQuery);
    });

    // Apply limit
    const resultLimit = parseInt(limit);
    results = results.slice(0, resultLimit);

    return NextResponse.json({
      query: q,
      total: results.length,
      results
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}