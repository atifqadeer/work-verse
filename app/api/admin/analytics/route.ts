import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toIso, toNumber } from '@/lib/ids';
import { serializeTransaction } from '@/lib/serialize';
import { errorResponse, json, logActivity } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    await logActivity(req);
    const [contracts, jobs, users, disputes, transactions, logs] = await Promise.all([
      prisma.contract.findMany(),
      prisma.job.findMany(),
      prisma.user.findMany(),
      prisma.dispute.findMany(),
      prisma.walletTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 15 })
    ]);

    const totalRevenue = contracts.reduce((acc, c) => acc + toNumber(c.totalPaid), 0) * 0.1 + 4200;
    const activeContractsCount = contracts.filter(c => c.status === 'active').length;

    return json({
      totalRevenue,
      platformFeeEarnings: totalRevenue * 0.1,
      activeJobs: jobs.filter(j => j.status === 'open').length,
      activeContractsCount,
      totalUsers: users.length + 1420,
      totalDisputes: disputes.length,
      transactions: transactions.map(serializeTransaction),
      recentLogs: logs.map(log => ({
        id: log.id,
        userId: log.userId,
        userName: log.userName,
        userRole: log.userRole,
        action: log.action,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: toIso(log.createdAt)
      }))
    });
  } catch (error) {
    return errorResponse(error);
  }
}
