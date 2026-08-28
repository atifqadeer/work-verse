import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeMessage } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await logActivity(req);
    const { conversationId } = await params;
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' }
    });
    return json(messages.map(serializeMessage));
  } catch (error) {
    return errorResponse(error);
  }
}
