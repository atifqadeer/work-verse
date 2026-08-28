import { NextRequest } from 'next/server';
import { generateJson } from '@/lib/ai';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'AI_PROFILE_OPTIMIZER');
    const { headline, overview, skills } = await parseBody<{
      headline?: string;
      overview?: string;
      skills?: string[];
    }>(req);

    const fallback = {
      improvedHeadline: 'Senior Full Stack & AI Solutions Architect | React & Node.js Lead',
      improvedOverview: `${overview || ''}\n\nKey Highlights:\n- Architected high-throughput SaaS platforms supporting 2M+ users.\n- Expert in AI LLM integration, TypeScript, and high-performance REST APIs.`,
      suggestedSkillsToAdd: ['Docker', 'GraphQL', 'Redis', 'Jest'],
      profileStrengthGain: '+15%'
    };

    const result = await generateJson(
      `Optimize this freelancer profile to rank #1 on marketplace search engines:
Headline: "${headline}"
Overview: "${overview}"
Current Skills: ${JSON.stringify(skills)}

Return a strict JSON object with:
- "improvedHeadline": concise, punchy title
- "improvedOverview": polished bio with bullet points and key achievements
- "suggestedSkillsToAdd": array of 4 complementary trending technical skills
- "profileStrengthGain": string like "+15%"`,
      fallback
    );

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
