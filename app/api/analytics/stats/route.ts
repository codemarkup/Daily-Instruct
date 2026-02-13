import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');

export async function GET(request: NextRequest) {
    try {
        // Check for auth (optional, but good for admin data)
        // For now, we'll allow it as it's read-only and used by the dashboard

        const dataContent = await fs.readFile(DATA_FILE, 'utf-8').catch(() => null);

        if (!dataContent) {
            return NextResponse.json({
                totalViews: 0,
                viewsToday: 0,
                history: [],
                topPages: []
            });
        }

        const data = JSON.parse(dataContent);
        const today = new Date().toISOString().split('T')[0];

        // Get last 7 days history
        const history = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dayViews = data.dailyStats[dateStr]?.['_total'] || 0;
            history.push({ date: dateStr, views: dayViews });
        }

        // Get Top Pages (All Time)
        const topPages = Object.entries(data.totalViews)
            .filter(([slug]) => slug !== '_total')
            .map(([slug, views]) => ({ slug, views: Number(views) }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);

        return NextResponse.json({
            totalViews: data.totalViews['_total'] || 0,
            viewsToday: data.dailyStats[today]?.['_total'] || 0,
            history,
            topPages,
            events: data.events || []
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
