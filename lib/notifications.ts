import { GitHubStorage } from './github-storage';

export interface Notification {
    id: string;
    text: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number; // For sorting
}

const NOTIFICATIONS_FILE = 'data/notifications.json';

// Helper to get relative time string (e.g., "5 min ago")
function getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString();
}

export async function getNotifications(): Promise<Notification[]> {
    try {
        let notifications: Notification[] = [];

        if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
            const githubStorage = new GitHubStorage();
            try {
                const data = await githubStorage.readJSONFile(NOTIFICATIONS_FILE);
                notifications = data.notifications || [];
            } catch (error) {
                // File might not exist yet
                notifications = [];
            }
        } else {
            const fs = await import('fs/promises');
            const path = await import('path');
            const filePath = path.join(process.cwd(), NOTIFICATIONS_FILE);

            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const data = JSON.parse(content);
                notifications = data.notifications || [];
            } catch (error) {
                notifications = [];
            }
        }

        // Sort by newest first and update relative time
        return notifications
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(n => ({
                ...n,
                time: getRelativeTime(n.timestamp)
            }))
            .slice(0, 20); // Keep last 20 notifications

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function logNotification(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    try {
        const timestamp = Date.now();
        const newNotification: Notification = {
            id: Math.random().toString(36).substring(2, 9),
            text,
            time: 'Just now',
            read: false,
            type,
            timestamp
        };

        let notifications: Notification[] = [];

        // READ existing
        if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
            const githubStorage = new GitHubStorage();
            let sha: string | null = null;

            try {
                const data = await githubStorage.readJSONFile(NOTIFICATIONS_FILE);
                notifications = data.notifications || [];
                sha = await githubStorage.getFileSHA(NOTIFICATIONS_FILE);
            } catch (error) {
                // File doesn't exist, start empty
            }

            // Add new
            notifications.unshift(newNotification);
            notifications = notifications.slice(0, 50); // Keep max 50 history

            // WRITE back
            await githubStorage.writeJSONFile(
                NOTIFICATIONS_FILE,
                { notifications },
                sha || undefined
            );

        } else {
            // Local Dev
            const fs = await import('fs/promises');
            const path = await import('path');
            const DATA_DIR = path.join(process.cwd(), 'data');
            const filePath = path.join(DATA_DIR, 'notifications.json');

            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const data = JSON.parse(content);
                notifications = data.notifications || [];
            } catch (error) {
                // File doesn't exist
            }

            notifications.unshift(newNotification);
            notifications = notifications.slice(0, 50);

            await fs.mkdir(DATA_DIR, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify({ notifications }, null, 2), 'utf-8');
        }

        return newNotification;

    } catch (error) {
        console.error('Error logging notification:', error);
    }
}

export async function markAllNotificationsAsRead() {
    try {
        let notifications: Notification[] = [];

        if (process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'production') {
            const githubStorage = new GitHubStorage();
            const sha = await githubStorage.getFileSHA(NOTIFICATIONS_FILE);
            const data = await githubStorage.readJSONFile(NOTIFICATIONS_FILE);

            notifications = (data.notifications || []).map((n: Notification) => ({ ...n, read: true }));

            await githubStorage.writeJSONFile(
                NOTIFICATIONS_FILE,
                { notifications },
                sha || undefined
            );
        } else {
            const fs = await import('fs/promises');
            const path = await import('path');
            const filePath = path.join(process.cwd(), NOTIFICATIONS_FILE);

            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);

            notifications = (data.notifications || []).map((n: Notification) => ({ ...n, read: true }));

            await fs.writeFile(filePath, JSON.stringify({ notifications }, null, 2), 'utf-8');
        }
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
}
