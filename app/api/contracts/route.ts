import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeContract } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const contracts = await prisma.contract.findMany({
      include: { milestones: true, timesheets: { orderBy: { date: 'desc' } } },
      orderBy: { startDate: 'desc' }
    });
    return json(contracts.map(serializeContract));
  } catch (error) {
    return errorResponse(error);
  }
}
