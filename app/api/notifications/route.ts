import { NextRequest, NextResponse } from 'next/server';
import {
  getPendingNotifications,
  getAllNotifications,
  getNotificationCounts,
} from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter'); // 'pending' | 'all'

  const notifications =
    filter === 'all' ? getAllNotifications() : getPendingNotifications();
  const counts = getNotificationCounts();

  return NextResponse.json({
    success: true,
    notifications,
    counts,
  });
}
