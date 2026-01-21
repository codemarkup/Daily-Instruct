import { NextRequest, NextResponse } from 'next/server';

// Simple cache implementation
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cleanup old cache entries periodically
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      searchCache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const limit = searchParams.get('limit') || '8';
  
  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      { 
        message: 'Search query is required and should be at least 2 characters',
        results: [],
        total: 0
      },
      { status: 400 }
    );
  }

  // Create cache key
  const cacheKey = `${q.toLowerCase().trim()}:${limit}`;
  
  // Check cache first
  const cachedResult = searchCache.get(cacheKey);
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
    return NextResponse.json({
      ...cachedResult.data,
      cached: true,
      timestamp: cachedResult.timestamp
    });
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

    // Perform search with ranking
    const searchResults = performRankedSearch(allArticles, q, parseInt(limit));

    const responseData = {
      query: q,
      total: searchResults.length,
      results: searchResults,
      cached: false,
      timestamp: Date.now()
    };

    // Cache the results
    searchCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    // Cleanup old cache entries (every 10th request)
    if (Math.random() < 0.1) {
      cleanupCache();
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error', 
        error: String(error),
        results: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

function performRankedSearch(articles: any[], query: string, limit: number) {
  const searchQuery = query.toLowerCase().trim();
  const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 1);
  
  if (searchWords.length === 0) {
    return [];
  }

  // FIXED: First, filter articles that actually contain search words
  const relevantArticles = articles.filter(article => {
    const title = (article.title || '').toLowerCase();
    const description = (article.description || '').toLowerCase();
    const author = (article.author || '').toLowerCase();
    const category = (article.category || '').toLowerCase();
    const specific = (article.specific || '').toLowerCase();
    
    // Check if any search word appears in any field
    return searchWords.some(word => 
      title.includes(word) ||
      description.includes(word) ||
      author.includes(word) ||
      category.includes(word) ||
      specific.includes(word)
    );
  });

  if (relevantArticles.length === 0) {
    return [];
  }

  // Score and rank only relevant articles
  const scoredArticles = relevantArticles.map(article => {
    let score = 0;
    const title = (article.title || '').toLowerCase();
    const description = (article.description || '').toLowerCase();
    const author = (article.author || '').toLowerCase();
    const category = (article.category || '').toLowerCase();
    const specific = (article.specific || '').toLowerCase();
    
    // Track where matches were found for debugging/ranking
    const matchDetails = {
      title: false,
      description: false,
      author: false,
      category: false,
      specific: false,
      exactTitle: false,
      exactCategory: false
    };

    // Check each search word
    searchWords.forEach(word => {
      // Exact title match (highest priority)
      if (title === searchQuery) {
        score += 30;
        matchDetails.exactTitle = true;
      }
      
      // Title contains exact word
      if (title.includes(word)) {
        score += 15;
        matchDetails.title = true;
      }
      
      // Title starts with word (even higher relevance)
      if (title.startsWith(word)) {
        score += 20;
      }
      
      // Description contains word
      if (description.includes(word)) {
        score += 8;
        matchDetails.description = true;
      }
      
      // Exact category match
      if (category === word) {
        score += 25;
        matchDetails.exactCategory = true;
      }
      
      // Category contains word
      if (category.includes(word)) {
        score += 12;
        matchDetails.category = true;
      }
      
      // Author contains word
      if (author.includes(word)) {
        score += 5;
        matchDetails.author = true;
      }
      
      // Specific/tags field contains word
      if (specific.includes(word)) {
        score += 10;
        matchDetails.specific = true;
      }
      
      // Partial word matching for better recall
      if (word.length > 3) {
        const partialMatch = word.substring(0, word.length - 1);
        if (title.includes(partialMatch)) score += 5;
        if (description.includes(partialMatch)) score += 3;
        if (category.includes(partialMatch)) score += 7;
      }
    });

    // Multi-word match bonus
    if (searchWords.length > 1) {
      let matchedCount = 0;
      
      // Check how many search words appear in title
      const titleWords = (title || '').split(/\s+/).filter((w: string) => w.length > 0);
      
      searchWords.forEach(word => {
        if (titleWords.some((titleWord: string) => titleWord.includes(word))) {
          matchedCount++;
        }
      });
      
      // Bonus for matching multiple words in title
      if (matchedCount === searchWords.length) {
        score += 25; // All search words appear in title
      } else if (matchedCount >= 2) {
        score += 10 * matchedCount; // Multiple words in title
      }
    }

    // Trending article bonus
    if (article.trending) {
      score += 15;
    }

    // Recency bonus (assuming date format: "Month Day, Year")
    try {
      if (article.date) {
        const articleDate = new Date(article.date);
        const currentDate = new Date();
        const daysOld = (currentDate.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysOld < 7) {
          score += 10; // Less than a week old
        } else if (daysOld < 30) {
          score += 5; // Less than a month old
        }
      }
    } catch (e) {
      // Date parsing failed, ignore recency bonus
    }

    return {
      ...article,
      score,
      matchDetails
    };
  });

  // Filter out irrelevant articles and sort by score
  return scoredArticles
    .filter(article => article.score > 0) // This should now work correctly
    .sort((a, b) => b.score - a.score) // Descending order
    .slice(0, limit)
    .map(({ score, matchDetails, ...article }) => article); // Remove scoring data from final result
}