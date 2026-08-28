import { PrismaClient } from '@prisma/client';
import {
  MOCK_USERS,
  MOCK_FREELANCER_PROFILE,
  MOCK_CLIENT_PROFILE,
  MOCK_AGENCY_PROFILE,
  MOCK_JOBS,
  MOCK_PROPOSALS,
  MOCK_CONTRACTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_TRANSACTIONS,
  MOCK_DISPUTES,
  MOCK_SKILL_TESTS,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITY_LOGS
} from '../src/lib/mockData';

const prisma = new PrismaClient();

function jsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? null));
}

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.timesheetEntry.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.job.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.skillTest.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.agencyProfile.deleteMany();
  await prisma.user.deleteMany();

  for (const user of MOCK_USERS) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: 'demo',
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        timezone: user.timezone,
        connects: user.connects,
        walletBalance: user.walletBalance,
        escrowBalance: user.escrowBalance,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        createdAt: new Date(user.createdAt)
      }
    });
  }

  const fp = MOCK_FREELANCER_PROFILE;
  await prisma.freelancerProfile.create({
    data: {
      userId: fp.userId,
      headline: fp.headline,
      title: fp.title,
      overview: fp.overview,
      hourlyRate: fp.hourlyRate,
      fixedPreference: fp.fixedPreference,
      skills: jsonValue(fp.skills),
      availability: fp.availability,
      languages: jsonValue(fp.languages),
      location: fp.location,
      address: fp.address,
      totalEarned: fp.totalEarned,
      jobSuccessScore: fp.jobSuccessScore,
      videoIntroUrl: fp.videoIntroUrl,
      profileStrength: fp.profileStrength,
      experiences: jsonValue(fp.experiences),
      education: jsonValue(fp.education),
      certifications: jsonValue(fp.certifications),
      portfolio: jsonValue(fp.portfolio)
    }
  });

  const cp = MOCK_CLIENT_PROFILE;
  await prisma.clientProfile.create({
    data: {
      userId: cp.userId,
      companyName: cp.companyName,
      industry: cp.industry,
      companySize: cp.companySize,
      description: cp.description,
      website: cp.website,
      location: cp.location,
      paymentVerified: cp.paymentVerified,
      totalSpent: cp.totalSpent,
      openJobsCount: cp.openJobsCount,
      completedJobsCount: cp.completedJobsCount,
      avgRating: cp.avgRating
    }
  });

  const ap = MOCK_AGENCY_PROFILE;
  await prisma.agencyProfile.create({
    data: {
      id: ap.id,
      ownerId: ap.ownerId,
      name: ap.name,
      logo: ap.logo,
      description: ap.description,
      membersCount: ap.membersCount,
      freelancerIds: jsonValue(ap.freelancerIds),
      totalEarnings: ap.totalEarnings,
      commissionRate: ap.commissionRate
    }
  });

  for (const job of MOCK_JOBS) {
    await prisma.job.create({
      data: {
        id: job.id,
        clientId: job.clientId,
        clientName: job.clientName,
        clientLocation: job.clientLocation,
        clientRating: job.clientRating,
        clientPaymentVerified: job.clientPaymentVerified,
        clientTotalSpent: job.clientTotalSpent,
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        category: job.category,
        subcategory: job.subcategory,
        skills: jsonValue(job.skills),
        budget: job.budget,
        hourlyMin: job.hourlyRange?.min,
        hourlyMax: job.hourlyRange?.max,
        experienceLevel: job.experienceLevel,
        duration: job.duration,
        projectLength: job.projectLength,
        visibility: job.visibility,
        isFeatured: job.isFeatured,
        isUrgent: job.isUrgent,
        status: job.status,
        attachments: jsonValue(job.attachments),
        screeningQuestions: jsonValue(job.screeningQuestions),
        createdAt: new Date(job.createdAt),
        proposalsCount: job.proposalsCount,
        hiresCount: job.hiresCount
      }
    });
  }

  for (const proposal of MOCK_PROPOSALS) {
    await prisma.proposal.create({
      data: {
        id: proposal.id,
        jobId: proposal.jobId,
        freelancerId: proposal.freelancerId,
        freelancerName: proposal.freelancerName,
        freelancerAvatar: proposal.freelancerAvatar,
        freelancerTitle: proposal.freelancerTitle,
        freelancerRating: proposal.freelancerRating,
        freelancerJSS: proposal.freelancerJSS,
        coverLetter: proposal.coverLetter,
        bidAmount: proposal.bidAmount,
        estimatedDuration: proposal.estimatedDuration,
        boostCredits: proposal.boostCredits,
        milestones: jsonValue(proposal.milestones || []),
        answers: jsonValue(proposal.answers || []),
        status: proposal.status,
        createdAt: new Date(proposal.createdAt)
      }
    });
  }

  for (const contract of MOCK_CONTRACTS) {
    await prisma.contract.create({
      data: {
        id: contract.id,
        jobId: contract.jobId,
        jobTitle: contract.jobTitle,
        clientId: contract.clientId,
        clientName: contract.clientName,
        freelancerId: contract.freelancerId,
        freelancerName: contract.freelancerName,
        contractType: contract.contractType,
        rate: contract.rate,
        totalBudget: contract.totalBudget,
        escrowBalance: contract.escrowBalance,
        totalPaid: contract.totalPaid,
        status: contract.status,
        startDate: new Date(contract.startDate),
        milestones: {
          create: contract.milestones.map(m => ({
            id: m.id,
            title: m.title,
            amount: m.amount,
            dueDate: m.dueDate,
            status: m.status,
            submissionNote: m.submissionNote,
            submissionAttachment: m.submissionAttachment
          }))
        },
        timesheets: {
          create: contract.timesheets.map(t => ({
            id: t.id,
            date: t.date,
            hours: t.hours,
            activityScore: t.activityScore,
            notes: t.notes,
            screenshotUrl: t.screenshotUrl,
            isManual: t.isManual
          }))
        }
      }
    });
  }

  for (const conv of MOCK_CONVERSATIONS) {
    await prisma.conversation.create({
      data: {
        id: conv.id,
        jobTitle: conv.jobTitle,
        lastMessage: conv.lastMessage,
        lastMessageTimestamp: conv.lastMessageTimestamp ? new Date(conv.lastMessageTimestamp) : null,
        participants: {
          create: conv.participantIds.map(userId => ({
            userId,
            name: conv.participantNames[userId],
            avatar: conv.participantAvatars[userId],
            unreadCount: conv.unreadCount[userId] || 0
          }))
        }
      }
    });
  }

  for (const message of MOCK_MESSAGES) {
    await prisma.message.create({
      data: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        text: message.text,
        attachments: message.attachments ? jsonValue(message.attachments) : undefined,
        voiceNoteUrl: message.voiceNoteUrl,
        isRead: message.isRead,
        timestamp: new Date(message.timestamp)
      }
    });
  }

  for (const tx of MOCK_TRANSACTIONS) {
    await prisma.walletTransaction.create({
      data: {
        id: tx.id,
        userId: tx.userId,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        paymentMethod: tx.paymentMethod,
        description: tx.description,
        referenceId: tx.referenceId,
        createdAt: new Date(tx.createdAt)
      }
    });
  }

  for (const dispute of MOCK_DISPUTES) {
    await prisma.dispute.create({
      data: {
        id: dispute.id,
        contractId: dispute.contractId,
        contractTitle: dispute.contractTitle,
        clientId: dispute.clientId,
        clientName: dispute.clientName,
        freelancerId: dispute.freelancerId,
        freelancerName: dispute.freelancerName,
        disputedAmount: dispute.disputedAmount,
        reason: dispute.reason,
        clientClaim: dispute.clientClaim,
        freelancerResponse: dispute.freelancerResponse,
        status: dispute.status,
        createdAt: new Date(dispute.createdAt)
      }
    });
  }

  for (const test of MOCK_SKILL_TESTS) {
    await prisma.skillTest.create({
      data: {
        id: test.id,
        title: test.title,
        category: test.category,
        timeLimitMinutes: test.timeLimitMinutes,
        questionsCount: test.questionsCount,
        passingScore: test.passingScore,
        questions: jsonValue(test.questions)
      }
    });
  }

  for (const notif of MOCK_NOTIFICATIONS) {
    await prisma.notification.create({
      data: {
        id: notif.id,
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        isRead: notif.isRead,
        createdAt: new Date(notif.createdAt),
        link: notif.link
      }
    });
  }

  for (const log of MOCK_ACTIVITY_LOGS) {
    await prisma.activityLog.create({
      data: {
        id: log.id,
        userId: log.userId,
        userName: log.userName,
        userRole: log.userRole,
        action: log.action,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: new Date(log.createdAt)
      }
    });
  }

  console.log('WorkVerse MySQL seed complete.');
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
