import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const notification = acknowledgeNotification(params.id);

  if (!notification) {
    return NextResponse.json(
      { error: 'Notification not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    notification,
  });
}
