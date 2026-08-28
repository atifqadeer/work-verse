import { json } from '@/lib/http';
import { getSessionUser, serializeUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return json({ user: null });
  return json({ user: serializeUser(user) });
}
