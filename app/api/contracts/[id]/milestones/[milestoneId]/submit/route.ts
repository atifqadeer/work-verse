import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeContract } from '@/lib/serialize';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    await logActivity(req, 'MILESTONE_SUBMITTED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { id, milestoneId } = await params;
    const body = await parseBody<{ submissionNote?: string; submissionAttachment?: string }>(req);

    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) return json({ error: 'Contract not found' }, 404);
    if (contract.freelancerId !== user.id && user.role !== 'admin') {
      return json({ error: 'Only the assigned freelancer can submit work' }, 403);
    }

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'submitted',
        submissionNote: body.submissionNote || 'Delivered milestone code artifact',
        submissionAttachment: body.submissionAttachment
      }
    });

    const updated = await prisma.contract.findUnique({
      where: { id },
      include: { milestones: true, timesheets: true }
    });

    await createLiveNotification({
      userId: contract.clientId,
      title: 'Milestone submitted for review',
      message: `${user.name} submitted work on "${contract.jobTitle}".`,
      type: 'contract',
      link: `/contracts/${contract.id}`
    });

    return json({ success: true, contract: serializeContract(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
