import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { serializeUser } from '@/lib/auth';
import { serializeFreelancerProfile } from '@/lib/serialize';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const profile = await prisma.freelancerProfile.findFirst();
    const user = profile ? await prisma.user.findUnique({ where: { id: profile.userId } }) : null;
    return json({
      user: user ? serializeUser(user) : null,
      profile: profile ? serializeFreelancerProfile(profile) : null
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await logActivity(req, 'UPDATE_FREELANCER_PROFILE');
    const body = await parseBody<{
      headline?: string;
      overview?: string;
      skills?: string[];
      profileStrength?: number;
    }>(req);
    const existing = await prisma.freelancerProfile.findFirst();
    if (!existing) return json({ error: 'Profile not found' }, 404);

    const updated = await prisma.freelancerProfile.update({
      where: { userId: existing.userId },
      data: {
        headline: body.headline ?? existing.headline,
        overview: body.overview ?? existing.overview,
        skills: (body.skills ?? existing.skills ?? []) as Prisma.InputJsonValue,
        profileStrength: body.profileStrength ?? existing.profileStrength
      }
    });

    return json(serializeFreelancerProfile(updated));
  } catch (error) {
    return errorResponse(error);
  }
}
