import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeJob } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req);
    const { id } = await params;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return json({ error: 'Job not found' }, 404);
    return json(serializeJob(job));
  } catch (error) {
    return errorResponse(error);
  }
}
