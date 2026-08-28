import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeUser, setSessionCookie } from '@/lib/auth';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import type { UserRole } from '@/src/types';

const LOGIN_ROLES: UserRole[] = ['freelancer', 'client', 'agency', 'admin', 'support', 'guest'];

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<{ email?: string; password?: string; role?: UserRole }>(req);
    const demoPassword = process.env.DEMO_PASSWORD || 'WorkVerse123!';
    const role = body.role;

    if (!role || !LOGIN_ROLES.includes(role)) {
      return json({ error: 'Select a valid role to sign in.' }, 400);
    }

    if (role !== 'guest') {
      if (!body.email) return json({ error: 'Email is required.' }, 400);
      if (!body.password) return json({ error: 'Password is required.' }, 400);
      if (body.password !== demoPassword) {
        return json({ error: 'Invalid password.' }, 401);
      }
    }

    const user =
      role === 'guest'
        ? await prisma.user.findFirst({ where: { role: 'guest' } })
        : await prisma.user.findFirst({
            where: {
              role,
              email: body.email!.trim()
            }
          });

    if (!user) {
      return json(
        {
          error: `No ${role} account exists for that email. Use the demo account shown for this role.`
        },
        404
      );
    }

    await logActivity(req, `LOGIN ${user.role}`);
    const response = json({ success: true, user: serializeUser(user) });
    return setSessionCookie(response, user.id);
  } catch (error) {
    return errorResponse(error);
  }
}
