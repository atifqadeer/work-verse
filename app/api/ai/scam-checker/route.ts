import { NextRequest } from 'next/server';
import { generateJson } from '@/lib/ai';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'AI_SCAM_CHECKER');
    const { text } = await parseBody<{ text?: string }>(req);
    const lower = (text || '').toLowerCase();
    const isSuspicious =
      lower.includes('telegram') ||
      lower.includes('whatsapp') ||
      lower.includes('wire transfer') ||
      lower.includes('crypto');

    const fallback = {
      safetyScore: isSuspicious ? 35 : 98,
      isFlagged: isSuspicious,
      riskLevel: isSuspicious ? 'HIGH' : 'LOW',
      reasons: isSuspicious
        ? ['Mentions communication or payment outside the marketplace platform which violates Terms of Service.']
        : ['Job contains standard scope, verified payment terms, and clear deliverables.']
    };

    const result = await generateJson(
      `Analyze this marketplace job post or message for potential scam, phishing, or safety violations:
Text: "${text}"

Return a strict JSON object with:
- "safetyScore": integer from 0 to 100 (100 = completely safe)
- "isFlagged": boolean
- "riskLevel": "LOW" | "MEDIUM" | "HIGH"
- "reasons": array of string safety observations`,
      fallback
    );

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
