// In-memory notification store for VersaCraft
// In production, replace with a database (e.g., Prisma + PostgreSQL)

export type NotificationType = 'new_booking' | 'email_failed' | 'booking_cancelled';
export type NotificationStatus = 'pending' | 'acknowledged';

export interface Notification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  metadata: Record<string, string>;
  createdAt: string;
  acknowledgedAt?: string;
}

// In-memory store (resets on server restart)
const notifications: Notification[] = [];

export function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  metadata: Record<string, string> = {}
): Notification {
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    status: 'pending',
    title,
    message,
    metadata,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  return notification;
}

export function getPendingNotifications(): Notification[] {
  return notifications
    .filter((n) => n.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllNotifications(): Notification[] {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function acknowledgeNotification(id: string): Notification | null {
  const notification = notifications.find((n) => n.id === id);
  if (!notification) return null;
  notification.status = 'acknowledged';
  notification.acknowledgedAt = new Date().toISOString();
  return notification;
}

export function getNotificationCounts(): { pending: number; total: number } {
  return {
    pending: notifications.filter((n) => n.status === 'pending').length,
    total: notifications.length,
  };
}
