export type UserRole = 'guest' | 'client' | 'freelancer' | 'agency' | 'admin' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  timezone: string;
  connects: number;
  walletBalance: number;
  escrowBalance: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface FreelancerProfile {
  userId: string;
  headline: string;
  title: string;
  overview: string;
  hourlyRate: number;
  fixedPreference: 'hourly' | 'fixed' | 'both';
  skills: string[];
  availability: 'full-time' | 'part-time' | 'as-needed';
  languages: { language: string; proficiency: string }[];
  location: string;
  address: string;
  totalEarned: number;
  jobSuccessScore: number;
  videoIntroUrl?: string;
  profileStrength: number; // percentage
  experiences: {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    badgeUrl?: string;
  }[];
  portfolio: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    technologies: string[];
    link?: string;
  }[];
}

export interface ClientProfile {
  userId: string;
  companyName: string;
  industry: string;
  companySize: string;
  description: string;
  website: string;
  location: string;
  paymentVerified: boolean;
  totalSpent: number;
  openJobsCount: number;
  completedJobsCount: number;
  avgRating: number;
}

export interface AgencyProfile {
  id: string;
  ownerId: string;
  name: string;
  logo: string;
  description: string;
  membersCount: number;
  freelancerIds: string[];
  totalEarnings: number;
  commissionRate: number; // e.g. 10%
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientLocation: string;
  clientRating: number;
  clientPaymentVerified: boolean;
  clientTotalSpent: number;
  title: string;
  description: string;
  jobType: 'hourly' | 'fixed';
  category: string;
  subcategory: string;
  skills: string[];
  budget: number; // hourly rate or total fixed budget
  hourlyRange?: { min: number; max: number };
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  duration: string;
  projectLength: string;
  visibility: 'public' | 'private' | 'invite';
  isFeatured: boolean;
  isUrgent: boolean;
  status: 'open' | 'paused' | 'closed' | 'filled';
  attachments: { name: string; url: string; size: string }[];
  screeningQuestions: string[];
  createdAt: string;
  proposalsCount: number;
  hiresCount: number;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in_escrow' | 'submitted' | 'approved' | 'released' | 'refunded';
  submissionNote?: string;
  submissionAttachment?: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerTitle: string;
  freelancerRating: number;
  freelancerJSS: number;
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  boostCredits: number; // spent connects to boost
  milestones?: Milestone[];
  answers?: { question: string; answer: string }[];
  status: 'submitted' | 'shortlisted' | 'interviewing' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export interface TimesheetEntry {
  id: string;
  contractId: string;
  date: string;
  hours: number;
  activityScore: number; // percentage 0-100
  notes: string;
  screenshotUrl?: string;
  isManual: boolean;
}

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  contractType: 'hourly' | 'fixed';
  rate: number;
  totalBudget: number;
  escrowBalance: number;
  totalPaid: number;
  status: 'active' | 'paused' | 'completed' | 'disputed' | 'cancelled';
  startDate: string;
  endDate?: string;
  milestones: Milestone[];
  timesheets: TimesheetEntry[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  attachments?: { name: string; url: string; type: 'file' | 'image' | 'voice' }[];
  voiceNoteUrl?: string;
  isRead: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [userId: string]: string };
  participantAvatars: { [userId: string]: string };
  jobTitle?: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: { [userId: string]: number };
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'escrow_funding' | 'escrow_release' | 'connects_purchase' | 'fee_deduction' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'Stripe' | 'PayPal' | 'Escrow Wallet' | 'Connects Store';
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  contractTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  disputedAmount: number;
  reason: string;
  clientClaim: string;
  freelancerResponse?: string;
  status: 'open' | 'under_review' | 'resolved';
  adminDecision?: string;
  refundClientAmount?: number;
  releaseFreelancerAmount?: number;
  createdAt: string;
}

export interface SkillTest {
  id: string;
  title: string;
  category: string;
  timeLimitMinutes: number;
  questionsCount: number;
  passingScore: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'proposal' | 'contract' | 'escrow' | 'message' | 'connects' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
