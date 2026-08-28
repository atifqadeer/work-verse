import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeMessage } from '@/lib/serialize';
import { makeId } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'MESSAGE_SENT');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const body = await parseBody<{
      conversationId?: string;
      text?: string;
      voiceNoteUrl?: string;
      attachments?: unknown[];
    }>(req);

    const conversation = await prisma.conversation.findUnique({
      where: { id: body.conversationId || 'conv_1' },
      include: { participants: true }
    });
    if (!conversation) return json({ error: 'Conversation not found' }, 404);

    const message = await prisma.$transaction(async tx => {
      const created = await tx.message.create({
        data: {
          id: makeId('msg'),
          conversationId: conversation.id,
          senderId: user.id,
          senderName: user.name,
          senderAvatar: user.avatar,
          text: body.text || '',
          voiceNoteUrl: body.voiceNoteUrl,
          attachments: (body.attachments as Prisma.InputJsonValue | undefined) ?? undefined,
          isRead: false
        }
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessage: body.text || (body.voiceNoteUrl ? '🎙️ Voice note' : 'Attachment'),
          lastMessageTimestamp: created.timestamp
        }
      });

      await tx.conversationParticipant.updateMany({
        where: { conversationId: conversation.id, userId: { not: user.id } },
        data: { unreadCount: { increment: 1 } }
      });

      return created;
    });

    const recipients = conversation.participants.filter(p => p.userId !== user.id);
    await Promise.all(
      recipients.map(recipient =>
        createLiveNotification({
          userId: recipient.userId,
          title: `New message from ${user.name}`,
          message: body.text || 'Sent you an attachment',
          type: 'message'
        })
      )
    );

    return json(serializeMessage(message), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
