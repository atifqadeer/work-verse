import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeUser } from '@/lib/auth';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    return json(users.map(serializeUser));
  } catch (error) {
    return errorResponse(error);
  }
}
