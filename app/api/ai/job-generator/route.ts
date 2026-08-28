import { NextRequest } from 'next/server';
import { generateJson } from '@/lib/ai';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'AI_JOB_GENERATOR');
    const { prompt, category, experienceLevel } = await parseBody<{
      prompt?: string;
      category?: string;
      experienceLevel?: string;
    }>(req);

    const fallback = {
      title: `Senior ${category || 'Software'} Specialist for High-Impact SaaS Build`,
      description: `We are looking for a skilled professional to handle: ${prompt || 'Full stack development and cloud infrastructure'}. Requirements include clean architecture, comprehensive test coverage, responsive design, and weekly progress updates.`,
      suggestedSkills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'API Integration']
    };

    const result = await generateJson(
      `You are an expert recruitment copywriter. Generate a high-converting freelance job posting based on this brief: "${prompt}". Category: "${category || 'Web Development'}", Experience Level: "${experienceLevel || 'Expert'}".
Return a strict JSON object with:
- "title": a clear, attractive job title
- "description": detailed job description covering Responsibilities, Requirements, and Deliverables
- "suggestedSkills": array of 5 relevant technical skills`,
      fallback
    );

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
