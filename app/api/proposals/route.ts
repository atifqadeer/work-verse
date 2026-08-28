import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeProposal } from '@/lib/serialize';
import { makeId, toNumber } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const freelancerId = searchParams.get('freelancerId');

    const proposals = await prisma.proposal.findMany({
      where: {
        ...(jobId ? { jobId } : {}),
        ...(freelancerId ? { freelancerId } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    return json(proposals.map(serializeProposal));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'PROPOSAL_SUBMITTED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    if (user.role !== 'freelancer' && user.role !== 'agency' && user.role !== 'admin') {
      return json({ error: 'Only freelancers can submit proposals' }, 403);
    }

    const body = await parseBody<{
      jobId: string;
      coverLetter?: string;
      bidAmount?: number;
      estimatedDuration?: string;
      boostCredits?: number;
      milestones?: unknown[];
      answers?: unknown[];
    }>(req);

    const job = await prisma.job.findUnique({ where: { id: body.jobId } });
    if (!job) return json({ error: 'Job not found' }, 404);

    const requiredConnects = 6 + (Number(body.boostCredits) || 0);
    if (user.connects < requiredConnects) {
      return json(
        { error: `Insufficient connects. Required ${requiredConnects}, you have ${user.connects}.` },
        400
      );
    }

    const profile = await prisma.freelancerProfile.findUnique({ where: { userId: user.id } });

    const [proposal] = await prisma.$transaction([
      prisma.proposal.create({
        data: {
          id: makeId('prop'),
          jobId: job.id,
          freelancerId: user.id,
          freelancerName: user.name,
          freelancerAvatar: user.avatar,
          freelancerTitle: profile?.title || 'Freelancer',
          freelancerRating: user.rating,
          freelancerJSS: profile?.jobSuccessScore || 90,
          coverLetter: body.coverLetter || '',
          bidAmount: Number(body.bidAmount) || toNumber(job.budget),
          estimatedDuration: body.estimatedDuration || '1 month',
          boostCredits: Number(body.boostCredits) || 0,
          milestones: (Array.isArray(body.milestones) ? body.milestones : []) as Prisma.InputJsonValue,
          answers: (Array.isArray(body.answers) ? body.answers : []) as Prisma.InputJsonValue,
          status: 'submitted'
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { connects: { decrement: requiredConnects } }
      }),
      prisma.job.update({
        where: { id: job.id },
        data: { proposalsCount: { increment: 1 } }
      }),
      prisma.walletTransaction.create({
        data: {
          id: makeId('tx'),
          userId: user.id,
          type: 'connects_purchase',
          amount: -requiredConnects,
          status: 'completed',
          paymentMethod: 'Connects Store',
          description: `Spent ${requiredConnects} Connects applying to "${job.title.slice(0, 40)}"`
        }
      })
    ]);

    await createLiveNotification({
      userId: job.clientId,
      title: 'New Proposal Received!',
      message: `${user.name} submitted a proposal ($${Number(proposal.bidAmount)}) for "${job.title}".`,
      type: 'proposal',
      link: `/jobs/${job.id}`
    });

    return json(serializeProposal(proposal), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
