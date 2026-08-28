import { NextRequest } from 'next/server';
import { getRequestUser, serializeUser, setSessionCookie } from '@/lib/auth';
import { loadMarketplaceState } from '@/lib/bootstrap';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req, 'BOOTSTRAP');
    const user = await getRequestUser();
    if (!user) return json({ error: 'No users seeded. Run npm run db:setup.' }, 500);
    const state = await loadMarketplaceState(user.id);
    const response = json({ currentUser: serializeUser(user), ...state });
    return setSessionCookie(response, user.id);
  } catch (error) {
    return errorResponse(error);
  }
}
