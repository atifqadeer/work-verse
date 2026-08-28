import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestUser, serializeUser } from '@/lib/auth';
import { makeId } from '@/lib/ids';
import { errorResponse, json, logActivity, parseBody } from '@/lib/http';
import { createLiveNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    await logActivity(req, 'CONNECTS_PURCHASE');
    const user = await getRequestUser();
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const body = await parseBody<{ connectsAmount?: number; price?: number }>(req);
    const connectsAmount = Number(body.connectsAmount) || 20;
    const price = Number(body.price) || 15;

    if (Number(user.walletBalance) < price) {
      return json({ error: 'Insufficient wallet balance' }, 400);
    }

    const updated = await prisma.$transaction(async tx => {
      const nextUser = await tx.user.update({
        where: { id: user.id },
        data: {
          connects: { increment: connectsAmount },
          walletBalance: { decrement: price }
        }
      });
      await tx.walletTransaction.create({
        data: {
          id: makeId('tx'),
          userId: user.id,
          type: 'connects_purchase',
          amount: -price,
          status: 'completed',
          paymentMethod: 'Stripe',
          description: `Purchased ${connectsAmount} Connects Package`
        }
      });
      return nextUser;
    });

    await createLiveNotification({
      userId: user.id,
      title: 'Connects added',
      message: `${connectsAmount} connects were added to your account.`,
      type: 'connects'
    });

    return json({
      success: true,
      newConnects: updated.connects,
      newBalance: Number(updated.walletBalance),
      user: serializeUser(updated)
    });
  } catch (error) {
    return errorResponse(error);
  }
}
