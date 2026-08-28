import { prisma } from './prisma';
import { serializeUser } from './auth';
import { serializeNotification } from './notifications';
import {
  serializeAgencyProfile,
  serializeClientProfile,
  serializeContract,
  serializeConversation,
  serializeDispute,
  serializeFreelancerProfile,
  serializeJob,
  serializeMessage,
  serializeProposal,
  serializeTransaction
} from './serialize';
import { toIso } from './ids';

export async function loadMarketplaceState(userId: string) {
  const [
    users,
    freelancerProfile,
    clientProfile,
    agencyProfile,
    jobs,
    proposals,
    contracts,
    conversations,
    messages,
    transactions,
    disputes,
    notifications,
    activityLogs,
    skillTests
  ] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.freelancerProfile.findFirst(),
    prisma.clientProfile.findFirst(),
    prisma.agencyProfile.findFirst(),
    prisma.job.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.proposal.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contract.findMany({
      include: { milestones: true, timesheets: { orderBy: { date: 'desc' } } },
      orderBy: { startDate: 'desc' }
    }),
    prisma.conversation.findMany({
      include: { participants: true },
      orderBy: { lastMessageTimestamp: 'desc' }
    }),
    prisma.message.findMany({ orderBy: { timestamp: 'asc' } }),
    prisma.walletTransaction.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.dispute.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.skillTest.findMany()
  ]);

  return {
    users: users.map(serializeUser),
    freelancerProfile: freelancerProfile ? serializeFreelancerProfile(freelancerProfile) : null,
    clientProfile: clientProfile ? serializeClientProfile(clientProfile) : null,
    agencyProfile: agencyProfile ? serializeAgencyProfile(agencyProfile) : null,
    jobs: jobs.map(serializeJob),
    proposals: proposals.map(serializeProposal),
    contracts: contracts.map(serializeContract),
    conversations: conversations.map(serializeConversation),
    messages: messages.map(serializeMessage),
    transactions: transactions.map(serializeTransaction),
    disputes: disputes.map(serializeDispute),
    notifications: notifications.map(serializeNotification),
    activityLogs: activityLogs.map(log => ({
      id: log.id,
      userId: log.userId,
      userName: log.userName,
      userRole: log.userRole,
      action: log.action,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: toIso(log.createdAt)
    })),
    skillTests
  };
}
