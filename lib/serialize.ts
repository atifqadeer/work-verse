import type {
  AgencyProfile,
  ClientProfile,
  Contract,
  Conversation,
  Dispute,
  FreelancerProfile,
  Job,
  Message,
  Proposal,
  TimesheetEntry,
  WalletTransaction
} from '@/src/types';
import { toIso, toNumber } from './ids';

export function serializeFreelancerProfile(row: any): FreelancerProfile {
  return {
    userId: row.userId,
    headline: row.headline,
    title: row.title,
    overview: row.overview,
    hourlyRate: toNumber(row.hourlyRate),
    fixedPreference: row.fixedPreference,
    skills: row.skills || [],
    availability: row.availability,
    languages: row.languages || [],
    location: row.location,
    address: row.address,
    totalEarned: toNumber(row.totalEarned),
    jobSuccessScore: row.jobSuccessScore,
    videoIntroUrl: row.videoIntroUrl || undefined,
    profileStrength: row.profileStrength,
    experiences: row.experiences || [],
    education: row.education || [],
    certifications: row.certifications || [],
    portfolio: row.portfolio || []
  };
}

export function serializeClientProfile(row: any): ClientProfile {
  return {
    userId: row.userId,
    companyName: row.companyName,
    industry: row.industry,
    companySize: row.companySize,
    description: row.description,
    website: row.website,
    location: row.location,
    paymentVerified: row.paymentVerified,
    totalSpent: toNumber(row.totalSpent),
    openJobsCount: row.openJobsCount,
    completedJobsCount: row.completedJobsCount,
    avgRating: toNumber(row.avgRating)
  };
}

export function serializeAgencyProfile(row: any): AgencyProfile {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    logo: row.logo,
    description: row.description,
    membersCount: row.membersCount,
    freelancerIds: row.freelancerIds || [],
    totalEarnings: toNumber(row.totalEarnings),
    commissionRate: toNumber(row.commissionRate)
  };
}

export function serializeJob(row: any): Job {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.clientName,
    clientLocation: row.clientLocation,
    clientRating: toNumber(row.clientRating),
    clientPaymentVerified: row.clientPaymentVerified,
    clientTotalSpent: toNumber(row.clientTotalSpent),
    title: row.title,
    description: row.description,
    jobType: row.jobType,
    category: row.category,
    subcategory: row.subcategory,
    skills: row.skills || [],
    budget: toNumber(row.budget),
    hourlyRange:
      row.hourlyMin != null
        ? { min: toNumber(row.hourlyMin), max: toNumber(row.hourlyMax) }
        : undefined,
    experienceLevel: row.experienceLevel,
    duration: row.duration,
    projectLength: row.projectLength,
    visibility: row.visibility,
    isFeatured: row.isFeatured,
    isUrgent: row.isUrgent,
    status: row.status,
    attachments: row.attachments || [],
    screeningQuestions: row.screeningQuestions || [],
    createdAt: toIso(row.createdAt),
    proposalsCount: row.proposalsCount,
    hiresCount: row.hiresCount
  };
}

export function serializeProposal(row: any): Proposal {
  return {
    id: row.id,
    jobId: row.jobId,
    freelancerId: row.freelancerId,
    freelancerName: row.freelancerName,
    freelancerAvatar: row.freelancerAvatar,
    freelancerTitle: row.freelancerTitle,
    freelancerRating: toNumber(row.freelancerRating),
    freelancerJSS: row.freelancerJSS,
    coverLetter: row.coverLetter,
    bidAmount: toNumber(row.bidAmount),
    estimatedDuration: row.estimatedDuration,
    boostCredits: row.boostCredits,
    milestones: row.milestones || [],
    answers: row.answers || [],
    status: row.status,
    createdAt: toIso(row.createdAt)
  };
}

export function serializeTimesheet(row: any): TimesheetEntry {
  return {
    id: row.id,
    contractId: row.contractId,
    date: row.date,
    hours: toNumber(row.hours),
    activityScore: row.activityScore,
    notes: row.notes,
    screenshotUrl: row.screenshotUrl || undefined,
    isManual: row.isManual
  };
}

export function serializeContract(row: any): Contract {
  return {
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.jobTitle,
    clientId: row.clientId,
    clientName: row.clientName,
    freelancerId: row.freelancerId,
    freelancerName: row.freelancerName,
    contractType: row.contractType,
    rate: toNumber(row.rate),
    totalBudget: toNumber(row.totalBudget),
    escrowBalance: toNumber(row.escrowBalance),
    totalPaid: toNumber(row.totalPaid),
    status: row.status,
    startDate: toIso(row.startDate).slice(0, 10),
    endDate: row.endDate ? toIso(row.endDate).slice(0, 10) : undefined,
    milestones: (row.milestones || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      amount: toNumber(m.amount),
      dueDate: m.dueDate,
      status: m.status,
      submissionNote: m.submissionNote || undefined,
      submissionAttachment: m.submissionAttachment || undefined
    })),
    timesheets: (row.timesheets || []).map(serializeTimesheet)
  };
}

export function serializeConversation(row: any): Conversation {
  const participants = row.participants || [];
  return {
    id: row.id,
    participantIds: participants.map((p: any) => p.userId),
    participantNames: Object.fromEntries(participants.map((p: any) => [p.userId, p.name])),
    participantAvatars: Object.fromEntries(participants.map((p: any) => [p.userId, p.avatar])),
    jobTitle: row.jobTitle || undefined,
    lastMessage: row.lastMessage || undefined,
    lastMessageTimestamp: row.lastMessageTimestamp ? toIso(row.lastMessageTimestamp) : undefined,
    unreadCount: Object.fromEntries(participants.map((p: any) => [p.userId, p.unreadCount || 0]))
  };
}

export function serializeMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    senderName: row.senderName,
    senderAvatar: row.senderAvatar,
    text: row.text,
    attachments: row.attachments || undefined,
    voiceNoteUrl: row.voiceNoteUrl || undefined,
    isRead: row.isRead,
    timestamp: toIso(row.timestamp)
  };
}

export function serializeTransaction(row: any): WalletTransaction {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    amount: toNumber(row.amount),
    status: row.status,
    paymentMethod: row.paymentMethod,
    description: row.description,
    referenceId: row.referenceId || undefined,
    createdAt: toIso(row.createdAt)
  };
}

export function serializeDispute(row: any): Dispute {
  return {
    id: row.id,
    contractId: row.contractId,
    contractTitle: row.contractTitle,
    clientId: row.clientId,
    clientName: row.clientName,
    freelancerId: row.freelancerId,
    freelancerName: row.freelancerName,
    disputedAmount: toNumber(row.disputedAmount),
    reason: row.reason,
    clientClaim: row.clientClaim,
    freelancerResponse: row.freelancerResponse || undefined,
    status: row.status,
    adminDecision: row.adminDecision || undefined,
    refundClientAmount: row.refundClientAmount != null ? toNumber(row.refundClientAmount) : undefined,
    releaseFreelancerAmount:
      row.releaseFreelancerAmount != null ? toNumber(row.releaseFreelancerAmount) : undefined,
    createdAt: toIso(row.createdAt)
  };
}
