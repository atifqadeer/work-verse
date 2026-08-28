import { NextRequest } from 'next/server';
import { generateJson } from '@/lib/ai';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'AI_PROPOSAL_GENERATOR');
    const { jobTitle, jobDescription, freelancerProfile } = await parseBody<{
      jobTitle?: string;
      jobDescription?: string;
      freelancerProfile?: string;
    }>(req);

    const fallback = {
      coverLetter: `Hi,\n\nI read your job post for "${jobTitle}" with great interest. With 8+ years of full-stack engineering experience delivering scalable SaaS platforms using React, TypeScript, and Node.js, I am confident I can exceed your expectations.\n\nMy proposed strategy:\n1. Modular architecture & API integration\n2. Real-time updates & clean UI/UX styling\n3. Rapid turnaround with milestone demos.\n\nI would love to discuss your technical requirements on a quick call!`,
      recommendedBid: 3200,
      suggestedDuration: '3 weeks',
      matchScore: 96
    };

    const result = await generateJson(
      `You are an elite freelance proposal consultant. Draft a compelling proposal for:
Title: "${jobTitle}"
Description: "${jobDescription}"
Freelancer Bio: "${freelancerProfile || 'Full Stack Engineer with 8+ years experience in React, Node, Generative AI'}"

Return a strict JSON object with:
- "coverLetter": structured, persuasive proposal text with clear milestones
- "recommendedBid": suggested bid amount in USD
- "suggestedDuration": time estimate like "2 weeks"
- "matchScore": integer from 80 to 99 indicating match percentage`,
      fallback
    );

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
