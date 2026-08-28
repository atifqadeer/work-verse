import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeTimesheet } from '@/lib/serialize';
import { makeId } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await logActivity(req, 'TIMESHEET_ENTRY');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { id } = await params;
    const body = await parseBody<{
      hours?: number;
      notes?: string;
      activityScore?: number;
      screenshotUrl?: string;
      isManual?: boolean;
    }>(req);

    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) return json({ error: 'Contract not found' }, 404);
    if (contract.freelancerId !== user.id && user.role !== 'admin') {
      return json({ error: 'Only the assigned freelancer can log time' }, 403);
    }

    const entry = await prisma.timesheetEntry.create({
      data: {
        id: makeId('ts'),
        contractId: contract.id,
        date: new Date().toISOString().split('T')[0],
        hours: Number(body.hours) || 1,
        activityScore: Number(body.activityScore) || 90,
        notes: body.notes || 'Worked on milestone deliverables',
        screenshotUrl:
          body.screenshotUrl ||
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        isManual: !!body.isManual
      }
    });

    await createLiveNotification({
      userId: contract.clientId,
      title: 'Timesheet submitted',
      message: `${user.name} logged ${entry.hours} hours on "${contract.jobTitle}".`,
      type: 'contract',
      link: `/contracts/${contract.id}`
    });

    return json(serializeTimesheet(entry), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
