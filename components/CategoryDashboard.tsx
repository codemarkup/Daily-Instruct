import React from 'react';
import Link from 'next/link';
import AdaptiveImage from '@/components/AdaptiveImage';
import { supabase } from '@/lib/supabase';

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
        {isLarge && <p className="article-desc" style={{ fontSize: '0.9rem', color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.description}</p>}
        <div className="article-date" style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 'auto' }}>
          {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </Link>
  );
};

export default async function CategoryDashboard({ categoryName, categoryTitle, categoryDescription }: { categoryName: string, categoryTitle: string, categoryDescription: string }) {

  // Fetch articles for this category using the specific flags
  const [
    { data: featuredData },
    { data: trendingData },
    { data: gridData }
  ] = await Promise.all([
    supabase.from('articles').select('*').eq('category', categoryName).eq('featured', true).order('featured_position', { ascending: true, nullsFirst: false }).order('date', { ascending: false }).order('id', { ascending: false }).limit(1),
    supabase.from('articles').select('*').eq('category', categoryName).eq('trending', true).order('featured_position', { ascending: true, nullsFirst: false }).order('date', { ascending: false }).order('id', { ascending: false }).limit(4),
    supabase.from('articles').select('*').eq('category', categoryName).eq('grid', true).order('featured_position', { ascending: true, nullsFirst: false }).order('date', { ascending: false }).order('id', { ascending: false }).limit(4)
  ]);

  const heroArticle = featuredData && featuredData.length > 0 ? featuredData[0] : null;
  const trendingArticles = trendingData || [];
  const latestArticles = gridData || [];

  return (
    <div style={{ background: 'var(--primary-white)', minHeight: '100vh', padding: '60px 20px', color: 'var(--primary-black)' }} className="category-page">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Category Header */}
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="category-header-title" style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-black)', letterSpacing: '-0.02em', textTransform: 'capitalize', fontFamily: 'var(--font-serif)' }}>
            {categoryTitle}
          </h1>
          <p className="category-header-desc" style={{ fontSize: '1.2rem', color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>
            {categoryDescription}
          </p>
        </header>


        {/* HERO SECTION */}
        {heroArticle && (
          <section style={{ marginBottom: '64px' }}>
            <Link href={`/articles/${heroArticle.slug}`} className="hero-container" style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '500px' }}>
              <AdaptiveImage src={heroArticle.image || '/images/default.png'} alt={heroArticle.title} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}></div>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }} className="hero-text-wrapper">
                <span style={{ background: 'var(--accent-gold)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'inline-block' }}>
                  Top Story
                </span>
                <h2 className="hero-title" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, color: 'var(--primary-white)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>{heroArticle.title}</h2>
                <p className="hero-description" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{heroArticle.description}</p>
              </div>
            </Link>
          </section>
        )}

        {/* LATEST SECTION */}
        {latestArticles.length > 0 && (
          <section style={{ marginBottom: trendingArticles.length > 0 ? '48px' : '0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-black)', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-200)', fontFamily: 'var(--font-serif)' }}>Latest in {categoryTitle}</h2>
            <div className="article-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {latestArticles.map(a => (
                <ArticleGridItem key={a.id} article={a} isLarge={true} />
              ))}
            </div>
          </section>
        )}

        {/* TRENDING SECTION */}
        {trendingArticles.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-black)', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-200)', fontFamily: 'var(--font-serif)' }}>Trending in {categoryTitle}</h2>
            <div className="article-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {trendingArticles.map(a => (
                <ArticleGridItem key={a.id} article={a} isLarge={true} />
              ))}
            </div>
          </section>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: var(--gray-300) !important; }
        
        @media (max-width: 768px) {
          .category-page { padding: 40px 16px !important; }
          .category-header-title { font-size: 2.5rem !important; }
          .hero-container { height: 400px !important; }
          .hero-text-wrapper { bottom: 24px !important; left: 24px !important; right: 24px !important; }
          .hero-title { font-size: 2rem !important; }
          .hero-description { font-size: 1rem !important; }
          .article-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }
        }
        
        @media (max-width: 480px) {
          .category-header-title { font-size: 2rem !important; }
          .category-header-desc { font-size: 1rem !important; }
          .hero-container { height: 350px !important; }
          .hero-title { font-size: 1.5rem !important; }
          .hero-description { display: none !important; }
          
          /* Aljazeera-style mobile list format */
          .article-card { 
            flex-direction: row-reverse !important; 
            align-items: flex-start !important;
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid var(--gray-200) !important;
            border-radius: 0 !important;
            padding: 16px 0 !important;
            gap: 12px !important;
          }
          .article-card:last-child { border-bottom: none !important; }
          .article-card .article-img-wrapper { 
            width: 100px !important; 
            height: 70px !important; 
            border-radius: 6px !important;
          }
          .article-card .article-meta, 
          .article-card .article-date,
          .article-card .article-desc {
            display: none !important;
          }
          .article-card .article-card-title {
            font-size: 1.05rem !important;
            font-weight: 500 !important;
            line-height: 1.35 !important;
            margin-bottom: 0 !important;
          }
          .article-card .article-content-wrapper {
            justify-content: flex-start !important;
          }
          .article-grid { 
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
