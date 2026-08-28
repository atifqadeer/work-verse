import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeUser } from '@/lib/auth';
import { serializeAgencyProfile } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const profile = await prisma.agencyProfile.findFirst();
    const user = profile ? await prisma.user.findUnique({ where: { id: profile.ownerId } }) : null;
    return json({
      user: user ? serializeUser(user) : null,
      profile: profile ? serializeAgencyProfile(profile) : null
    });
  } catch (error) {
    return errorResponse(error);
  }
}
