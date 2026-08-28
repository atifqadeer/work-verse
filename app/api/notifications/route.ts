import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeNotification } from '@/lib/notifications';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    return json(notifications.map(serializeNotification));
  } catch (error) {
    return errorResponse(error);
  }
}
