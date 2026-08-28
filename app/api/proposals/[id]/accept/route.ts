import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeContract, serializeProposal } from '@/lib/serialize';
import { makeId, toNumber } from '@/lib/ids';
import { errorResponse, json, logActivity } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req, 'PROPOSAL_ACCEPTED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const { id } = await params;
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return json({ error: 'Proposal not found' }, 404);

    const job = await prisma.job.findUnique({ where: { id: proposal.jobId } });
    if (!job) return json({ error: 'Job not found' }, 404);
    if (job.clientId !== user.id && user.role !== 'admin') {
      return json({ error: 'Only the hiring client can accept this proposal' }, 403);
    }

    const bid = toNumber(proposal.bidAmount);
    if (toNumber(user.walletBalance) < bid) {
      return json({ error: 'Insufficient wallet balance to fund escrow' }, 400);
    }

    const milestones = Array.isArray(proposal.milestones) ? (proposal.milestones as any[]) : [];
    const contractId = makeId('cnt');

    const result = await prisma.$transaction(async tx => {
      const contract = await tx.contract.create({
        data: {
          id: contractId,
          jobId: job.id,
          jobTitle: job.title,
          clientId: job.clientId,
          clientName: job.clientName,
          freelancerId: proposal.freelancerId,
          freelancerName: proposal.freelancerName,
          contractType: job.jobType,
          rate: bid,
          totalBudget: bid,
          escrowBalance: bid,
          totalPaid: 0,
          status: 'active',
          startDate: new Date(),
          milestones: {
            create: (milestones.length
              ? milestones
              : [{ title: 'Project delivery', amount: bid, dueDate: new Date().toISOString().slice(0, 10) }]
            ).map((m: any, index: number) => ({
              id: m.id || makeId(`cnt_m${index + 1}`),
              title: m.title || `Milestone ${index + 1}`,
              amount: Number(m.amount) || bid,
              dueDate: m.dueDate || new Date().toISOString().slice(0, 10),
              status: 'in_escrow'
            }))
          }
        },
        include: { milestones: true, timesheets: true }
      });

      await tx.proposal.update({ where: { id: proposal.id }, data: { status: 'accepted' } });
      await tx.job.update({
        where: { id: job.id },
        data: { status: 'filled', hiresCount: { increment: 1 } }
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { decrement: bid },
          escrowBalance: { increment: bid }
        }
      });
      await tx.walletTransaction.create({
        data: {
          id: makeId('tx'),
          userId: user.id,
          type: 'escrow_funding',
          amount: -bid,
          status: 'completed',
          paymentMethod: 'Escrow Wallet',
          description: `Funded escrow for "${job.title}"`,
          referenceId: contract.id
        }
      });

      const existingConv = await tx.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: job.clientId } } },
            { participants: { some: { userId: proposal.freelancerId } } }
          ]
        }
      });

      if (!existingConv) {
        const freelancer = await tx.user.findUnique({ where: { id: proposal.freelancerId } });
        await tx.conversation.create({
          data: {
            id: makeId('conv'),
            jobTitle: job.title,
            lastMessage: 'Contract started. Let us align on the first milestone.',
            lastMessageTimestamp: new Date(),
            participants: {
              create: [
                { userId: user.id, name: user.name, avatar: user.avatar, unreadCount: 0 },
                {
                  userId: proposal.freelancerId,
                  name: freelancer?.name || proposal.freelancerName,
                  avatar: freelancer?.avatar || proposal.freelancerAvatar,
                  unreadCount: 1
                }
              ]
            }
          }
        });
      }

      return contract;
    });

    await createLiveNotification({
      userId: proposal.freelancerId,
      title: 'Proposal accepted!',
      message: `${user.name} hired you for "${job.title}" and funded $${bid.toFixed(2)} into escrow.`,
      type: 'contract',
      link: `/contracts/${result.id}`
    });

    return json({
      success: true,
      proposal: serializeProposal({ ...proposal, status: 'accepted' }),
      contract: serializeContract(result)
    });
  } catch (error) {
    return errorResponse(error);
  }
}
