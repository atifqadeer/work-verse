import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import type { User, UserRole } from '@/src/types';
import { toIso, toNumber } from './ids';

export const SESSION_COOKIE = 'wv_user';

export function serializeUser(row: {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  timezone: string;
  connects: number;
  walletBalance: unknown;
  escrowBalance: unknown;
  rating: unknown;
  reviewsCount: number;
  createdAt: Date;
}): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    role: row.role as UserRole,
    isVerified: row.isVerified,
    twoFactorEnabled: row.twoFactorEnabled,
    timezone: row.timezone,
    connects: row.connects,
    walletBalance: toNumber(row.walletBalance),
    escrowBalance: toNumber(row.escrowBalance),
    rating: toNumber(row.rating),
    reviewsCount: row.reviewsCount,
    createdAt: toIso(row.createdAt).slice(0, 10)
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getRequestUser() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value || headerStore.get('x-user-id');
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export function setSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

export async function requireUser() {
  const user = await getRequestUser();
  if (!user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  return user;
}
