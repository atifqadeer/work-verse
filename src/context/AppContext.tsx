import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Job,
  Proposal,
  Contract,
  Conversation,
  Message,
  WalletTransaction,
  Dispute,
  NotificationItem,
  FreelancerProfile,
  ClientProfile,
  AgencyProfile,
  ActivityLog
} from '../types';
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
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITY_LOGS
} from '../lib/mockData';

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  freelancerProfile: FreelancerProfile;
  clientProfile: ClientProfile;
  agencyProfile: AgencyProfile;
  jobs: Job[];
  proposals: Proposal[];
  contracts: Contract[];
  conversations: Conversation[];
  messages: Message[];
  transactions: WalletTransaction[];
  disputes: Dispute[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  
  // Active Navigation Tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Selected Items for Modals
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedContract: Contract | null;
  setSelectedContract: (contract: Contract | null) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;

  // Modal Open States
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;
  isProposalModalOpen: boolean;
  setIsProposalModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isContractModalOpen: boolean;
  setIsContractModalOpen: (open: boolean) => void;
  isSkillTestModalOpen: boolean;
  setIsSkillTestModalOpen: (open: boolean) => void;
  isScamGuardModalOpen: boolean;
  setIsScamGuardModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isJobDetailsOpen: boolean;
  setIsJobDetailsOpen: (open: boolean) => void;

  // Actions
  createJob: (jobData: Partial<Job>) => Promise<void>;
  submitProposal: (proposalData: Partial<Proposal>) => Promise<void>;
  releaseMilestoneEscrow: (contractId: string, milestoneId: string) => Promise<void>;
  sendMessage: (text: string, voiceNoteUrl?: string) => Promise<void>;
  buyConnects: (amount: number, price: number) => Promise<void>;
  resolveDispute: (disputeId: string, decision: string, refundClient: number, releaseFreelancer: number) => Promise<void>;
  addTimeTrackerEntry: (contractId: string, hours: number, notes: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  
  // AI Actions
  generateAIJobDescription: (prompt: string, category: string, experience: string) => Promise<any>;
  generateAIProposal: (jobTitle: string, jobDesc: string) => Promise<any>;
  optimizeAIProfile: (headline: string, overview: string) => Promise<any>;
  checkAIScam: (text: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('freelancer');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile>(MOCK_FREELANCER_PROFILE);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(MOCK_CLIENT_PROFILE);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(MOCK_AGENCY_PROFILE);
  
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);

  const [activeTab, setActiveTab] = useState<string>('find-work');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);

  // Modals
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSkillTestModalOpen, setIsSkillTestModalOpen] = useState(false);
  const [isScamGuardModalOpen, setIsScamGuardModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  // Map user to currentRole
  const currentUser = users.find(u => u.role === currentRole) || users[0];

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'client') setActiveTab('client-jobs');
    else if (role === 'freelancer') setActiveTab('find-work');
    else if (role === 'agency') setActiveTab('agency-overview');
    else if (role === 'admin') setActiveTab('admin-analytics');
    else if (role === 'support') setActiveTab('support-tickets');
    else setActiveTab('guest-explore');
  };

  // Actions
  const createJob = async (jobData: Partial<Job>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify(jobData)
      });
      const newJob = await res.json();
      setJobs(prev => [newJob, ...prev]);
    } catch (err) {
      console.error('Error creating job', err);
    }
  };

  const submitProposal = async (proposalData: Partial<Proposal>) => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify(proposalData)
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit proposal');
        return;
      }

      const newProp = await res.json();
      setProposals(prev => [newProp, ...prev]);

      // Deduct connects locally
      const cost = 6 + (proposalData.boostCredits || 0);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, connects: Math.max(0, u.connects - cost) } : u));
      
      // Update job proposal count
      setJobs(prev => prev.map(j => j.id === proposalData.jobId ? { ...j, proposalsCount: j.proposalsCount + 1 } : j));
    } catch (err) {
      console.error('Error submitting proposal', err);
    }
  };

  const releaseMilestoneEscrow = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/escrow/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ milestoneId })
      });
      const data = await res.json();
      if (data.success) {
        setContracts(prev => prev.map(c => c.id === contractId ? data.contract : c));
        // Refresh wallet
        setUsers(prev => prev.map(u => u.role === 'freelancer' ? { ...u, walletBalance: u.walletBalance + 1000 } : u));
      }
    } catch (err) {
      console.error('Error releasing escrow', err);
    }
  };

  const sendMessage = async (text: string, voiceNoteUrl?: string) => {
    if (!activeConversation) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text,
          voiceNoteUrl
        })
      });
      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
      setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, lastMessage: text || 'Voice Note', lastMessageTimestamp: newMsg.timestamp } : c));
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  const buyConnects = async (amount: number, price: number) => {
    try {
      const res = await fetch('/api/connects/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ connectsAmount: amount, price })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, connects: data.newConnects, walletBalance: data.newBalance } : u));
      }
    } catch (err) {
      console.error('Error buying connects', err);
    }
  };

  const resolveDispute = async (disputeId: string, decision: string, refundClient: number, releaseFreelancer: number) => {
    try {
      const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ decision, refundClientAmount: refundClient, releaseFreelancerAmount: releaseFreelancer })
      });
      const data = await res.json();
      if (data.success) {
        setDisputes(prev => prev.map(d => d.id === disputeId ? data.dispute : d));
      }
    } catch (err) {
      console.error('Error resolving dispute', err);
    }
  };

  const addTimeTrackerEntry = async (contractId: string, hours: number, notes: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/timesheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({ hours, notes, activityScore: 92, isManual: false })
      });
      const entry = await res.json();
      setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [entry, ...c.timesheets] } : c));
    } catch (err) {
      console.error('Error logging time', err);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // AI Helpers
  const generateAIJobDescription = async (prompt: string, category: string, experience: string) => {
    const res = await fetch('/api/ai/job-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, category, experienceLevel: experience })
    });
    return res.json();
  };

  const generateAIProposal = async (jobTitle: string, jobDesc: string) => {
    const res = await fetch('/api/ai/proposal-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, jobDescription: jobDesc, freelancerProfile: freelancerProfile.overview })
    });
    return res.json();
  };

  const optimizeAIProfile = async (headline: string, overview: string) => {
    const res = await fetch('/api/ai/profile-optimizer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headline, overview, skills: freelancerProfile.skills })
    });
    const data = await res.json();
    if (data.improvedHeadline) {
      setFreelancerProfile(prev => ({
        ...prev,
        headline: data.improvedHeadline,
        overview: data.improvedOverview,
        skills: Array.from(new Set([...prev.skills, ...(data.suggestedSkillsToAdd || [])])),
        profileStrength: 98
      }));
    }
    return data;
  };

  const checkAIScam = async (text: string) => {
    const res = await fetch('/api/ai/scam-checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentUser,
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
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedJob,
        setSelectedJob,
        selectedContract,
        setSelectedContract,
        activeConversation,
        setActiveConversation,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        isProposalModalOpen,
        setIsProposalModalOpen,
        isChatOpen,
        setIsChatOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isContractModalOpen,
        setIsContractModalOpen,
        isSkillTestModalOpen,
        setIsSkillTestModalOpen,
        isScamGuardModalOpen,
        setIsScamGuardModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isJobDetailsOpen,
        setIsJobDetailsOpen,
        createJob,
        submitProposal,
        releaseMilestoneEscrow,
        sendMessage,
        buyConnects,
        resolveDispute,
        addTimeTrackerEntry,
        markNotificationRead,
        generateAIJobDescription,
        generateAIProposal,
        optimizeAIProfile,
        checkAIScam
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
