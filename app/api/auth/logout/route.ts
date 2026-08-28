import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { logActivity } from '@/lib/http';

export async function POST(req: NextRequest) {
  await logActivity(req, 'LOGOUT');
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
