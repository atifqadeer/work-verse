import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeUser, setSessionCookie } from '@/lib/auth';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import type { UserRole } from '@/src/types';

export async function POST(req: NextRequest) {
  try {
    const { role } = await parseBody<{ role: UserRole }>(req);
    const user = await prisma.user.findFirst({ where: { role } });
    if (!user) return json({ error: 'Role persona not found' }, 404);
    await logActivity(req, `SWITCH_ROLE ${role}`);
    const response = json({ success: true, user: serializeUser(user) });
    return setSessionCookie(response, user.id);
  } catch (error) {
    return errorResponse(error);
  }
}
