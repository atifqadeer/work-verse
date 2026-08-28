import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeDispute } from '@/lib/serialize';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req, 'DISPUTE_RESOLVED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    if (user.role !== 'admin' && user.role !== 'support') {
      return json({ error: 'Only admin or support can resolve disputes' }, 403);
    }

    const { id } = await params;
    const body = await parseBody<{
      decision?: string;
      refundClientAmount?: number;
      releaseFreelancerAmount?: number;
    }>(req);

    const dispute = await prisma.dispute.findUnique({ where: { id } });
    if (!dispute) return json({ error: 'Dispute not found' }, 404);

    const refund = Number(body.refundClientAmount) || 0;
    const release = Number(body.releaseFreelancerAmount) || 0;

    const updated = await prisma.$transaction(async tx => {
      const next = await tx.dispute.update({
        where: { id },
        data: {
          status: 'resolved',
          adminDecision: body.decision,
          refundClientAmount: refund,
          releaseFreelancerAmount: release
        }
      });

      if (refund > 0) {
        await tx.user.update({
          where: { id: dispute.clientId },
          data: { walletBalance: { increment: refund } }
        });
      }
      if (release > 0) {
        await tx.user.update({
          where: { id: dispute.freelancerId },
          data: { walletBalance: { increment: release } }
        });
      }

      return next;
    });

    await Promise.all([
      createLiveNotification({
        userId: dispute.clientId,
        title: 'Dispute resolved',
        message: body.decision || 'An admin resolved your dispute.',
        type: 'system'
      }),
      createLiveNotification({
        userId: dispute.freelancerId,
        title: 'Dispute resolved',
        message: body.decision || 'An admin resolved your dispute.',
        type: 'system'
      })
    ]);

    return json({ success: true, dispute: serializeDispute(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
