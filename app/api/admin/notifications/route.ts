import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markAllNotificationsAsRead } from '@/lib/notifications';

export async function GET() {
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (body.action === 'markRead') {
            await markAllNotificationsAsRead();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
