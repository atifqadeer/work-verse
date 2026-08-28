import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const tests = await prisma.skillTest.findMany();
    return json(tests);
  } catch (error) {
    return errorResponse(error);
  }
}
