import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Interface for our analytics data structure
interface AnalyticsData {
    totalViews: Record<string, number>; // slug -> count
    dailyStats: Record<string, Record<string, number>>; // date (YYYY-MM-DD) -> { slug -> count }
    events: AnalyticsEvent[]; // Recent events log
}

interface AnalyticsEvent {
    id: string;
    timestamp: string;
    slug: string;
    visitorId: string;
    ip: string; // anonymized in real prod usually
    country: string;
    referrer?: string;
}

async function getAnalyticsData(): Promise<AnalyticsData> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        // Migration: Ensure events array exists
        if (!parsed.events) parsed.events = [];
        return parsed;
    } catch (error) {
        return {
            totalViews: {},
            dailyStats: {},
            events: []
        };
    }
}

async function saveAnalyticsData(data: AnalyticsData) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, visitorId, referrer } = body;

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // --- Geolocation & IP Logic ---
        // In local dev, these headers might be missing or ::1
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        let country = request.headers.get('x-vercel-ip-country') || 'Unknown';

        // Mock for Localhost to show user "Country" feature works
        if (ip.includes('127.0.0.1') || ip.includes('::1')) {
            country = 'Localhost';
        }

        const data = await getAnalyticsData();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const timestamp = new Date().toISOString();

        // 1. Update Aggregates (Existing Logic)
        data.totalViews[slug] = (data.totalViews[slug] || 0) + 1;
        if (!data.dailyStats[today]) data.dailyStats[today] = {};
        data.dailyStats[today][slug] = (data.dailyStats[today][slug] || 0) + 1;

        data.totalViews['_total'] = (data.totalViews['_total'] || 0) + 1;
        data.dailyStats[today]['_total'] = (data.dailyStats[today]['_total'] || 0) + 1;

        // 2. Add Detailed Event Log
        const newEvent: AnalyticsEvent = {
            id: crypto.randomUUID(),
            timestamp,
            slug,
            visitorId: visitorId || 'anonymous',
            ip,
            country,
            referrer
        };

        // Keep last 1000 events to prevent file bloat
        data.events.unshift(newEvent);
        if (data.events.length > 1000) {
            data.events = data.events.slice(0, 1000);
        }

        await saveAnalyticsData(data);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error logging view:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
