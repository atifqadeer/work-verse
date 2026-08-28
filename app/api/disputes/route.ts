import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeDispute } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const disputes = await prisma.dispute.findMany({ orderBy: { createdAt: 'desc' } });
    return json(disputes.map(serializeDispute));
  } catch (error) {
    return errorResponse(error);
  }
}
