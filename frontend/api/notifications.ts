// Notifications API functions
// Functions to call the backend notifications endpoints

import { get, patch } from './client';

// List notifications
// If unread is true, only return unread notifications
export async function listNotifications(unread?: boolean): Promise<any> {
    let endpoint = '/notifications';

    if (unread) {
        endpoint += '?unread=true';
    }

    return get(endpoint);
}

// Mark a notification as read
export async function markAsRead(notificationId: string): Promise<any> {
    return patch(`/notifications/${notificationId}/read`, {});
}
