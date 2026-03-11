'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, AlertCircle, Calendar, Mail, Loader2, RefreshCw } from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_booking' | 'email_failed' | 'booking_cancelled';
  status: 'pending' | 'acknowledged';
  title: string;
  message: string;
  metadata: Record<string, string>;
  createdAt: string;
  acknowledgedAt?: string;
}

interface NotificationCounts {
  pending: number;
  total: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counts, setCounts] = useState<NotificationCounts>({ pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?filter=${filter}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setCounts(data.counts);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAcknowledge = async (id: string) => {
    setAcknowledging(id);
    try {
      const res = await fetch(`/api/notifications/${id}/acknowledge`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await fetchNotifications();
      }
    } catch {
      // silently fail
    } finally {
      setAcknowledging(null);
    }
  };

  const typeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'email_failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'booking_cancelled':
        return <Mail className="w-5 h-5 text-orange-500" />;
    }
  };

  const typeBadgeColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_booking':
        return 'bg-blue-100 text-blue-800';
      case 'email_failed':
        return 'bg-red-100 text-red-800';
      case 'booking_cancelled':
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7" />
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {counts.pending > 0 && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-sm font-medium rounded-full">
              {counts.pending}
            </span>
          )}
        </div>
        <button
          onClick={fetchNotifications}
          disabled={loading}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({counts.total})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No {filter === 'pending' ? 'pending ' : ''}notifications</p>
          <p className="text-sm mt-1">
            {filter === 'pending'
              ? "You're all caught up!"
              : 'Notifications will appear here when bookings come in.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                notification.status === 'pending' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeBadgeColor(notification.type)}`}
                    >
                      {notification.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  {notification.metadata.clientEmail && (
                    <p className="text-xs text-gray-500 mt-1">
                      Contact: {notification.metadata.clientEmail}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                    {notification.acknowledgedAt && (
                      <> &middot; Acknowledged {new Date(notification.acknowledgedAt).toLocaleString()}</>
                    )}
                  </p>
                </div>
                {notification.status === 'pending' && (
                  <button
                    onClick={() => handleAcknowledge(notification.id)}
                    disabled={acknowledging === notification.id}
                    className="px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 flex-shrink-0"
                  >
                    {acknowledging === notification.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Acknowledge'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
