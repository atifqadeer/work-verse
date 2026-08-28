import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { serializeJob } from '@/lib/serialize';
import { makeId, toNumber } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const experience = searchParams.get('experience');

    const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
    const filtered = jobs.filter(job => {
      if (search) {
        const haystack = `${job.title} ${job.description} ${JSON.stringify(job.skills)}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (category && category !== 'All' && job.category !== category) return false;
      if (type && type !== 'all' && job.jobType !== type) return false;
      if (minBudget && toNumber(job.budget) < Number(minBudget)) return false;
      if (maxBudget && toNumber(job.budget) > Number(maxBudget)) return false;
      if (experience && experience !== 'all' && job.experienceLevel !== experience) return false;
      return true;
    });

    return json(filtered.map(serializeJob));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'POST_JOB_CREATED');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);
    if (user.role !== 'client' && user.role !== 'admin') {
      return json({ error: 'Only clients can post jobs' }, 403);
    }

    const body = await parseBody<{
      title?: string;
      description?: string;
      jobType?: 'hourly' | 'fixed';
      category?: string;
      subcategory?: string;
      skills?: string[];
      budget?: number;
      experienceLevel?: string;
      duration?: string;
      projectLength?: string;
      screeningQuestions?: string[];
      isFeatured?: boolean;
      isUrgent?: boolean;
    }>(req);

    const clientProfile = await prisma.clientProfile.findUnique({ where: { userId: user.id } });

    const job = await prisma.job.create({
      data: {
        id: makeId('job'),
        clientId: user.id,
        clientName: clientProfile?.companyName || user.name,
        clientLocation: clientProfile?.location || 'Remote',
        clientRating: clientProfile?.avgRating || 5,
        clientPaymentVerified: clientProfile?.paymentVerified ?? true,
        clientTotalSpent: clientProfile?.totalSpent || 0,
        title: body.title || 'Untitled Project',
        description: body.description || '',
        jobType: body.jobType || 'fixed',
        category: body.category || 'Web, Mobile & Software Dev',
        subcategory: body.subcategory || 'Full Stack Development',
        skills: Array.isArray(body.skills) ? body.skills : ['React', 'TypeScript'],
        budget: Number(body.budget) || 1000,
        experienceLevel: body.experienceLevel || 'intermediate',
        duration: body.duration || '1 to 3 months',
        projectLength: body.projectLength || '1 to 3 months',
        visibility: 'public',
        isFeatured: !!body.isFeatured,
        isUrgent: !!body.isUrgent,
        status: 'open',
        attachments: [],
        screeningQuestions: Array.isArray(body.screeningQuestions) ? body.screeningQuestions : []
      }
    });

    if (clientProfile) {
      await prisma.clientProfile.update({
        where: { userId: user.id },
        data: { openJobsCount: { increment: 1 } }
      });
    }

    await createLiveNotification({
      userId: user.id,
      title: 'Job published',
      message: `"${job.title}" is now live and visible to freelancers.`,
      type: 'system',
      link: `/jobs/${job.id}`
    });

    return json(serializeJob(job), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
