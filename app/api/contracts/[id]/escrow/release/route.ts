import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeContract } from '@/lib/serialize';
import { makeId, toNumber } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req, 'ESCROW_RELEASE');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const { id } = await params;
    const { milestoneId } = await parseBody<{ milestoneId: string }>(req);

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { milestones: true, timesheets: true }
    });
    if (!contract) return json({ error: 'Contract not found' }, 404);
    if (contract.clientId !== user.id && user.role !== 'admin') {
      return json({ error: 'Only the client can release escrow' }, 403);
    }

    const milestone = contract.milestones.find(m => m.id === milestoneId);
    if (!milestone) return json({ error: 'Milestone not found' }, 404);

    const amount = toNumber(milestone.amount);

    const updated = await prisma.$transaction(async tx => {
      await tx.milestone.update({
        where: { id: milestone.id },
        data: { status: 'approved' }
      });
      const next = await tx.contract.update({
        where: { id: contract.id },
        data: {
          escrowBalance: { decrement: amount },
          totalPaid: { increment: amount }
        },
        include: { milestones: true, timesheets: true }
      });
      await tx.user.update({
        where: { id: contract.freelancerId },
        data: { walletBalance: { increment: amount } }
      });
      await tx.user.update({
        where: { id: contract.clientId },
        data: { escrowBalance: { decrement: amount } }
      });
      await tx.walletTransaction.create({
        data: {
          id: makeId('tx'),
          userId: contract.freelancerId,
          type: 'escrow_release',
          amount,
          status: 'completed',
          paymentMethod: 'Escrow Wallet',
          description: `Escrow released for "${milestone.title}" on ${contract.jobTitle}`,
          referenceId: milestone.id
        }
      });
      return next;
    });

    await createLiveNotification({
      userId: contract.freelancerId,
      title: 'Milestone Funds Released!',
      message: `$${amount.toFixed(2)} was released to your wallet for "${milestone.title}".`,
      type: 'escrow',
      link: `/contracts/${contract.id}`
    });

    return json({ success: true, contract: serializeContract(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
