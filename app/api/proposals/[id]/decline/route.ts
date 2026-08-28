import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeProposal } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req, 'PROPOSAL_DECLINED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return json({ error: 'Proposal not found' }, 404);

    const job = await prisma.job.findUnique({ where: { id: proposal.jobId } });
    if (!job) return json({ error: 'Job not found' }, 404);
    if (job.clientId !== user.id && user.role !== 'admin') {
      return json({ error: 'Forbidden' }, 403);
    }

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: 'rejected' }
    });

    await createLiveNotification({
      userId: proposal.freelancerId,
      title: 'Proposal not selected',
      message: `Your proposal for "${job.title}" was declined.`,
      type: 'proposal'
    });

    return json({ success: true, proposal: serializeProposal(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
