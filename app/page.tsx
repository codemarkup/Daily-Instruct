import React from 'react';
import Link from 'next/link';
import AdaptiveImage from '@/components/AdaptiveImage';
import { supabase } from '@/lib/supabase';
import { TrackerTimelinePreview } from '@/components/TrackerTimelinePreview';
import NewsletterSignup from '@/components/NewsletterSignup';

export const revalidate = 60;

// Reusable article card for grids
const ArticleGridItem = ({ article, isLarge = false }: { article: any, isLarge?: boolean }) => {
  return (
    <Link href={`/articles/${article.slug}`} className={`article-card hover-lift ${isLarge ? 'is-large' : 'is-small'}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: isLarge ? 'column' : 'row', gap: '16px', background: 'var(--secondary-white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
      <div className="article-img-wrapper" style={{ position: 'relative', width: isLarge ? '100%' : '120px', height: isLarge ? '200px' : '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <AdaptiveImage src={article.image || '/images/default.png'} alt={article.title} fill sizes={isLarge ? "(max-width: 992px) 100vw, 50vw" : "120px"} style={{ objectFit: 'cover' }} />
      </div>
      <div className="article-content-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
        <div className="article-meta" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>{article.content_type || 'Article'}</div>
        <h3 className="article-card-title" style={{ fontSize: isLarge ? '1.3rem' : '1rem', color: 'var(--primary-black)', fontWeight: 600, lineHeight: 1.3, marginBottom: '8px' }}>{article.title}</h3>
        {isLarge && <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.description}</p>}
        <div className="article-date" style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 'auto' }}>
          {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </Link>
  );
};

export default async function HomePage() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch data concurrently
  const [
    { data: featuredArticles },
    { data: config },
    { data: categoriesData },
    { data: trackers },
    { data: trendingStats },
    { data: latestArticlesData }
  ] = await Promise.all([
    supabase.from('articles').select('*').eq('featured', true).order('featured_position', { ascending: true, nullsFirst: false }),
    supabase.from('homepage_config').select('*').eq('id', 1).single(),
    supabase.from('articles').select('*').in('category', ['tech', 'business', 'geopolitics', 'market', 'guides']).order('date', { ascending: false }),
    supabase.from('trackers').select('*, updates:tracker_updates(id, content, published_at, linked_article_id)').eq('status', 'active').order('priority', { ascending: false }).order('updated_at', { ascending: false }),
    supabase.from('daily_page_stats').select('path, views').gte('date', sevenDaysAgo.toISOString().split('T')[0]).like('path', '/articles/%'),
    supabase.from('articles').select('*').order('date', { ascending: false }).limit(10)
  ]);

  const featured = featuredArticles || [];
  const heroArticle = featured.length > 0 ? featured[0] : null;
  const sidebarArticles = featured.slice(1, 5);
  const trendingTags = config?.trending_tags || [];
  
  // Group categories
  const topCategoriesList = ['tech', 'business', 'geopolitics'];
  const bottomCategoriesList = ['market', 'guides'];
  
  const categorized = [...topCategoriesList, ...bottomCategoriesList].reduce((acc, cat) => {
    acc[cat] = categoriesData?.filter(a => a.category === cat).slice(0, 4) || [];
    return acc;
  }, {} as Record<string, any[]>);

  // Trending Now Logic
  let trendingSlugs: string[] = [];
  let viewCountsMap: Record<string, number> = {};
  
  if (trendingStats && trendingStats.length > 0) {
    // Sum views by slug
    viewCountsMap = trendingStats.reduce((acc: any, stat: any) => {
      const slug = stat.path.replace('/articles/', '');
      acc[slug] = (acc[slug] || 0) + stat.views;
      return acc;
    }, {});
    
    // Sort and get top 6
    trendingSlugs = Object.entries(viewCountsMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 6)
      .map(([slug]) => slug);
  }
  
  let trendingArticles = [];
  if (trendingSlugs.length > 0) {
    const { data: trendingData } = await supabase
      .from('articles')
      .select('*')
      .in('slug', trendingSlugs);
      
    if (trendingData) {
      trendingArticles = trendingSlugs.map(slug => trendingData.find(a => a.slug === slug)).filter(Boolean);
    }
  }
  
  // Fallback if not enough data
  if (trendingArticles.length < 6) {
    trendingArticles = latestArticlesData?.slice(0, 6) || [];
  }

  const latestFeed = latestArticlesData || [];

  const formatViews = (views: number) => {
    if (views >= 1000) return (views / 1000).toFixed(1) + 'k reads this week';
    return views + ' reads this week';
  };

  const renderCategoryGrids = (categories: string[]) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '64px' }} className="category-grids">
        {categories.map(cat => {
          const articles = categorized[cat];
          if (!articles || articles.length === 0) return null;
          
          const catHero = articles[0];
          const catOthers = articles.slice(1);
          
          return (
            <section key={cat}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-black)', textTransform: 'capitalize', fontFamily: 'var(--font-serif)' }}>{cat}</h2>
                <Link href={`/${cat}`} style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>See all</Link>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ArticleGridItem article={catHero} isLarge={true} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {catOthers.map(a => (
                    <ArticleGridItem key={a.id} article={a} isLarge={false} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--primary-white)', minHeight: '100vh', padding: '40px 20px', color: 'var(--primary-black)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TOP SECTION: Hero + Right Rail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', marginBottom: '40px' }} className="hero-dashboard-layout">
          
          {/* MAIN COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* HERO */}
            {heroArticle && (
              <Link href={`/articles/${heroArticle.slug}`} className="hero-container" style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
                <AdaptiveImage src={heroArticle.image || '/images/default.png'} alt={heroArticle.title} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}></div>
                <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }}>
                  <span style={{ background: 'var(--accent-gold)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'inline-block' }}>
                    Top Story
                  </span>
                  <h1 className="hero-title" style={{ fontWeight: 700, lineHeight: 1.1, color: 'var(--primary-white)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>{heroArticle.title}</h1>
                  <p className="hero-description" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '800px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{heroArticle.description}</p>
                </div>
              </Link>
            )}

            {/* ACTIVE SITUATION TRACKERS SLOT */}
            {trackers && trackers.length > 0 && (
              <section style={{ background: 'var(--secondary-white)', border: '1px solid var(--gray-200)', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-black)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)', margin: 0 }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)', animation: 'pulse 2s infinite' }}></span>
                    Live Situation {trackers.length === 1 ? 'Tracker' : 'Trackers'}
                  </h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {trackers.slice(0, trackers.length > 1 ? 2 : 1).map((tracker: any) => {
                    const updateDate = new Date(tracker.updated_at);
                    
                    return (
                      <div key={tracker.id} style={{ background: 'var(--primary-white)', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '16px', transition: 'all 0.2s' }} className="hover-lift">
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase' }}>{tracker.category}</span>
                          <span>Updated {updateDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {updateDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                        <Link href={`/trackers/${tracker.slug}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-black)', marginBottom: '4px', lineHeight: 1.3 }}>{tracker.title}</h3>
                        </Link>
                        
                        <TrackerTimelinePreview tracker={tracker} />
                      </div>
                    );
                  })}
                </div>
                {trackers.length > 1 && (
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Link href="/trackers" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>View all trackers →</Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <div style={{ background: 'var(--secondary-white)', borderRadius: '24px', padding: '32px', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>Must Read</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {sidebarArticles.map((article, idx) => (
                <Link href={`/articles/${article.slug}`} key={article.id} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 600, marginRight: '8px' }}>{String(idx + 2).padStart(2, '0')}</span>
                    {article.category.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-black)', lineHeight: 1.4, transition: 'color 0.2s' }} className="hover-gold">{article.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* TRENDING TAGS ROW */}
        {trendingTags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', overflowX: 'auto', paddingBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Trending Topics</span>
            {trendingTags.map((tag: any, i: number) => (
              <Link href={tag.link} key={i} style={{ textDecoration: 'none', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                # {tag.label}
              </Link>
            ))}
          </div>
        )}

        {/* TOP CATEGORY GRIDS (Tech, Business, Geopolitics) */}
        {renderCategoryGrids(topCategoriesList)}

        {/* TRENDING NOW */}
        {trendingArticles.length > 0 && (
          <section className="trending-now-section" style={{ marginBottom: '64px', background: 'var(--secondary-white)', padding: '32px', borderRadius: '24px', border: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-black)', fontFamily: 'var(--font-serif)' }}>Trending Now</h2>
            </div>
            <div className="trending-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {trendingArticles.map(article => {
                const views = viewCountsMap[article.slug];
                return (
                  <Link href={`/articles/${article.slug}`} key={article.id} className="hover-lift" style={{ display: 'block', textDecoration: 'none', background: 'var(--primary-white)', padding: '20px', borderRadius: '16px', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>{article.category}</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-black)', lineHeight: 1.4, marginBottom: '12px' }}>{article.title}</h3>
                    {views && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)', marginRight: '6px', verticalAlign: 'middle' }}></span>
                        {formatViews(views)}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* LATEST FEED */}
        {latestFeed.length > 0 && (
          <section className="latest-feed-section" style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-black)', fontFamily: 'var(--font-serif)' }}>Latest</h2>
            </div>
            <div className="latest-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {latestFeed.map((article: any) => (
                <ArticleGridItem key={article.id} article={article} isLarge={false} />
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM CATEGORY GRIDS (Markets, Guides) */}
        {renderCategoryGrids(bottomCategoriesList)}

        {/* NEWSLETTER SIGNUP */}
        <NewsletterSignup />

      </div>
      
      {/* Basic responsive layout injection */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-container { height: 500px; }
        .hero-title { font-size: 3rem; }
        .hero-description { font-size: 1.2rem; }
        
        @media (max-width: 992px) {
          .hero-dashboard-layout { grid-template-columns: 1fr !important; }
          .category-grids { grid-template-columns: 1fr !important; }
        }
        
        @media (max-width: 768px) {
          .hero-container { height: 400px; }
          .hero-title { font-size: 2rem; }
          .hero-description { font-size: 1rem; }
        }
        
        @media (max-width: 480px) {
          .hero-container { height: 350px; }
          .hero-title { font-size: 1.5rem; }
          .hero-description { display: none !important; /* Hide description on very small screens to save space */ }
          
          .trending-now-section {
            padding: 20px !important;
          }
          .trending-grid, .latest-grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Aljazeera-style mobile list format */
          .article-card.is-small { 
            flex-direction: row-reverse !important; 
            align-items: flex-start !important;
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid var(--gray-200) !important;
            border-radius: 0 !important;
            padding: 16px 0 !important;
            gap: 12px !important;
          }
          .article-card.is-small:last-child {
            border-bottom: none !important;
          }
          .article-card.is-small .article-img-wrapper { 
            width: 100px !important; 
            height: 70px !important; 
            border-radius: 6px !important;
          }
          .article-card.is-small .article-meta, 
          .article-card.is-small .article-date {
            display: none !important;
          }
          .article-card.is-small .article-card-title {
            font-size: 1.05rem !important;
            font-weight: 500 !important;
            line-height: 1.35 !important;
            margin-bottom: 0 !important;
          }
          .article-card.is-small .article-content-wrapper {
            justify-content: flex-start !important;
          }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .hover-gold:hover { color: var(--accent-gold) !important; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: var(--gray-300) !important; }
      `}} />
    </div>
  );
}