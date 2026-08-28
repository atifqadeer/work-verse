import { NextRequest } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { markLiveNotificationRead } from '@/lib/notifications';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req);
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { id } = await params;
    await markLiveNotificationRead(user.id, id);
    return json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
