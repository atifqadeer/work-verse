import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getRequestUser } from './auth';
import { makeId } from './ids';

export async function logActivity(req: NextRequest, action?: string) {
  try {
    const user = await getRequestUser();
    if (!user) return;

    await prisma.activityLog.create({
      data: {
        id: makeId('act'),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: action || `${req.method} ${new URL(req.url).pathname}`,
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'Browser'
      }
    });
  } catch (error) {
    console.error('Activity log failed', error);
  }
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(error: unknown, fallback = 'Request failed') {
  const err = error as { status?: number; message?: string; code?: string };
  if (err.code === 'P1000' || err.message?.includes('Authentication failed against database server')) {
    return json(
      {
        error:
          'MySQL login failed. XAMPP root uses an empty password. Restart npm run dev after setting DATABASE_URL="mysql://root:@127.0.0.1:3306/workverse" in .env.'
      },
      503
    );
  }
  const status = err.status || 500;
  return json({ error: err.message || fallback }, status);
}

export async function parseBody<T>(req: NextRequest): Promise<T> {
  return (await req.json()) as T;
}
