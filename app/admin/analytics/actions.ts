'use server';

import { createClient } from '@supabase/supabase-js';
import { getAllArticles } from '@/lib/json-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getLiveSessionsCount() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { count, error } = await supabase
    .from('live_sessions')
    .select('hash', { count: 'exact', head: true })
    .gte('last_seen', fiveMinutesAgo);
    
  if (error) {
    console.error('Error fetching live sessions:', error);
    return 0;
  }
  
  return count || 0;
}

export async function getAnalyticsData(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Overview Totals
  const { data: totalsData } = await supabase
    .from('daily_page_stats')
    .select('views, unique_visitors')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  let totalViews = 0;
  let totalUniques = 0;
  
  if (totalsData) {
    totalViews = totalsData.reduce((sum, row) => sum + row.views, 0);
    totalUniques = totalsData.reduce((sum, row) => sum + row.unique_visitors, 0);
  }

  // Today Totals
  const { data: todayData } = await supabase
    .from('daily_page_stats')
    .select('views, unique_visitors')
    .eq('day', todayStr);
    
  const todayViews = todayData ? todayData.reduce((sum, row) => sum + row.views, 0) : 0;
  const todayUniques = todayData ? todayData.reduce((sum, row) => sum + row.unique_visitors, 0) : 0;

  // 2. Traffic over time chart data
  const { data: chartDataRaw } = await supabase
    .from('daily_page_stats')
    .select('day, views')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  const chartMap = new Map<string, number>();
  if (chartDataRaw) {
    for (const row of chartDataRaw) {
      chartMap.set(row.day, (chartMap.get(row.day) || 0) + row.views);
    }
  }
  
  // Fill in missing days with 0
  const chartData = [];
  for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split('T')[0];
    chartData.push({
      date: dayStr,
      views: chartMap.get(dayStr) || 0
    });
  }

  // 3. Top Content
  const { data: topContentRaw } = await supabase
    .from('daily_page_stats')
    .select('path, views, unique_visitors')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  const contentMap = new Map<string, { views: number, uniques: number }>();
  if (topContentRaw) {
    for (const row of topContentRaw) {
      const current = contentMap.get(row.path) || { views: 0, uniques: 0 };
      contentMap.set(row.path, {
        views: current.views + row.views,
        uniques: current.uniques + row.unique_visitors
      });
    }
  }
  
  // Try to join with articles/trackers by matching slugs
  const allArticles = await getAllArticles();
  // If we had tracker service, we'd fetch trackers too. For now assume articles cover it.
  
  const topContent = Array.from(contentMap.entries())
    .map(([path, stats]) => {
      let title = path;
      let category = 'Unknown';
      
      const slug = path.split('/').pop() || '';
      const articleMatch = allArticles.find(a => a.slug === slug);
      if (articleMatch) {
        title = articleMatch.title;
        category = articleMatch.category;
      }
      
      return {
        path,
        title,
        category,
        views: stats.views,
        uniques: stats.uniques
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 4. Referrers
  const { data: referrersRaw } = await supabase
    .from('daily_referrer_stats')
    .select('referrer_domain, views')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  const referrerMap = new Map<string, number>();
  if (referrersRaw) {
    for (const row of referrersRaw) {
      const domain = row.referrer_domain || 'Direct / None';
      referrerMap.set(domain, (referrerMap.get(domain) || 0) + row.views);
    }
  }
  
  const topReferrers = Array.from(referrerMap.entries())
    .map(([domain, views]) => ({ domain, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // 5. Geographies
  const { data: geoRaw } = await supabase
    .from('daily_geo_stats')
    .select('country, views')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  const geoMap = new Map<string, number>();
  if (geoRaw) {
    for (const row of geoRaw) {
      const country = row.country || 'Unknown';
      geoMap.set(country, (geoMap.get(country) || 0) + row.views);
    }
  }
  
  const topCountries = Array.from(geoMap.entries())
    .map(([country, views]) => ({ country, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // 6. Devices
  const { data: deviceRaw } = await supabase
    .from('daily_device_stats')
    .select('device_type, views')
    .gte('day', startDateStr)
    .lte('day', todayStr);
    
  const deviceMap = new Map<string, number>();
  if (deviceRaw) {
    for (const row of deviceRaw) {
      const device = row.device_type || 'unknown';
      deviceMap.set(device, (deviceMap.get(device) || 0) + row.views);
    }
  }
  
  const devices = Array.from(deviceMap.entries())
    .map(([device, views]) => ({ device, views }))
    .sort((a, b) => b.views - a.views);

  return {
    totalViews,
    totalUniques,
    todayViews,
    todayUniques,
    chartData,
    topContent,
    topReferrers,
    topCountries,
    devices
  };
}
