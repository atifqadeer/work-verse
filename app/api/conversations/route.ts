import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeConversation } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const conversations = await prisma.conversation.findMany({
      include: { participants: true },
      orderBy: { lastMessageTimestamp: 'desc' }
    });
    return json(conversations.map(serializeConversation));
  } catch (error) {
    return errorResponse(error);
  }
}
