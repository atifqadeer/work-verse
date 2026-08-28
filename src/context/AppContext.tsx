'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
import { subscribeToLiveNotifications } from '../lib/live-notifications';
import { isFirebaseLiveEnabled } from '../lib/firebase-client';
import { ROLE_HOME_TAB } from '../lib/roles';

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  isAuthenticated: boolean;
  authChecked: boolean;
  loginIntentRole: UserRole;
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
  isBootstrapping: boolean;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedContract: Contract | null;
  setSelectedContract: (contract: Contract | null) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;

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

  loginUser: (email: string, role: UserRole, password: string) => Promise<string | null>;
  loginAsGuest: () => Promise<void>;
  logoutUser: () => Promise<void>;
  goToLogin: (role?: UserRole) => void;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  submitProposal: (proposalData: Partial<Proposal>) => Promise<void>;
  acceptProposal: (proposalId: string) => Promise<void>;
  declineProposal: (proposalId: string) => Promise<void>;
  releaseMilestoneEscrow: (contractId: string, milestoneId: string) => Promise<void>;
  submitMilestone: (contractId: string, milestoneId: string, note: string) => Promise<void>;
  sendMessage: (text: string, voiceNoteUrl?: string) => Promise<void>;
  buyConnects: (amount: number, price: number) => Promise<void>;
  resolveDispute: (disputeId: string, decision: string, refundClient: number, releaseFreelancer: number) => Promise<void>;
  addTimeTrackerEntry: (contractId: string, hours: number, notes: string) => Promise<void>;
  markNotificationRead: (id: string) => void;

  generateAIJobDescription: (prompt: string, category: string, experience: string) => Promise<any>;
  generateAIProposal: (jobTitle: string, jobDesc: string) => Promise<any>;
  optimizeAIProfile: (headline: string, overview: string) => Promise<any>;
  checkAIScam: (text: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function authHeaders(user: User): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-id': user.id,
    'x-user-name': user.name,
    'x-user-role': user.role
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginIntentRole, setLoginIntentRole] = useState<UserRole>('freelancer');
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
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const [activeTab, setActiveTab] = useState<string>('guest-explore');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);

  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSkillTestModalOpen, setIsSkillTestModalOpen] = useState(false);
  const [isScamGuardModalOpen, setIsScamGuardModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);

  const currentUser = users.find(u => u.role === currentRole) || users[0];
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const applyBootstrap = useCallback((data: any) => {
    if (Array.isArray(data.users) && data.users.length) setUsers(data.users);
    if (data.freelancerProfile) setFreelancerProfile(data.freelancerProfile);
    if (data.clientProfile) setClientProfile(data.clientProfile);
    if (data.agencyProfile) setAgencyProfile(data.agencyProfile);
    if (Array.isArray(data.jobs)) setJobs(data.jobs);
    if (Array.isArray(data.proposals)) setProposals(data.proposals);
    if (Array.isArray(data.contracts)) setContracts(data.contracts);
    if (Array.isArray(data.conversations)) {
      setConversations(data.conversations);
      setActiveConversation((prev: Conversation | null) => {
        if (prev) return data.conversations.find((c: Conversation) => c.id === prev.id) || data.conversations[0] || null;
        return data.conversations[0] || null;
      });
    }
    if (Array.isArray(data.messages)) setMessages(data.messages);
    if (Array.isArray(data.transactions)) setTransactions(data.transactions);
    if (Array.isArray(data.disputes)) setDisputes(data.disputes);
    if (Array.isArray(data.notifications)) setNotifications(data.notifications);
    if (Array.isArray(data.activityLogs)) setActivityLogs(data.activityLogs);
    if (data.currentUser?.role) setCurrentRole(data.currentUser.role);
  }, []);

  const refreshBootstrap = useCallback(async (userOverride?: User) => {
    const actor = userOverride || currentUserRef.current;
    try {
      const res = await fetch('/api/bootstrap', {
        headers: authHeaders(actor),
        credentials: 'include'
      });
      if (!res.ok) return;
      const data = await res.json();
      applyBootstrap(data);
    } catch (err) {
      console.error('Bootstrap failed, using local mock data', err);
    } finally {
      setIsBootstrapping(false);
    }
  }, [applyBootstrap]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsAuthenticated(true);
            setCurrentRole(data.user.role);
            setActiveTab(ROLE_HOME_TAB[data.user.role as UserRole]);
            await refreshBootstrap(data.user);
            setAuthChecked(true);
            return;
          }
        }
      } catch (err) {
        console.error('Session restore failed', err);
      }
      setIsBootstrapping(false);
      setAuthChecked(true);
    };

    restoreSession();
  }, [refreshBootstrap]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    if (isFirebaseLiveEnabled()) {
      return subscribeToLiveNotifications(currentUser.id, items => {
        setNotifications(items);
      });
    }

    const interval = window.setInterval(async () => {
      try {
        const res = await fetch('/api/notifications', {
          headers: authHeaders(currentUser),
          credentials: 'include'
        });
        if (res.ok) setNotifications(await res.json());
      } catch {
        // keep existing notifications if polling fails
      }
    }, 8000);

    return () => window.clearInterval(interval);
  }, [isAuthenticated, currentUser.id]);

  const applyRoleTab = (role: UserRole) => {
    setActiveTab(ROLE_HOME_TAB[role]);
  };

  const goToLogin = (role?: UserRole) => {
    if (role) setLoginIntentRole(role);
    void logoutUser();
  };

  const setRole = async (role: UserRole) => {
    goToLogin(role);
  };

  const loginUser = async (email: string, role: UserRole, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, role, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return data.error || 'Login failed';
    }
    setIsAuthenticated(true);
    setCurrentRole(data.user.role);
    applyRoleTab(data.user.role);
    await refreshBootstrap(data.user);
    return null;
  };

  const loginAsGuest = async () => {
    const error = await loginUser('guest@workverse.com', 'guest', 'WorkVerse123!');
    if (error) console.error(error);
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout failed', err);
    }
    setIsAuthenticated(false);
    setCurrentRole('guest');
    setActiveTab('guest-explore');
    setNotifications([]);
  };

  const createJob = async (jobData: Partial<Job>) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify(jobData)
      });
      const newJob = await res.json();
      if (!res.ok) {
        alert(newJob.error || 'Failed to create job');
        return;
      }
      setJobs(prev => [newJob, ...prev]);
    } catch (err) {
      console.error('Error creating job', err);
    }
  };

  const submitProposal = async (proposalData: Partial<Proposal>) => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify(proposalData)
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit proposal');
        return;
      }

      const newProp = await res.json();
      setProposals(prev => [newProp, ...prev]);
      const cost = 6 + (proposalData.boostCredits || 0);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, connects: Math.max(0, u.connects - cost) } : u));
      setJobs(prev => prev.map(j => j.id === proposalData.jobId ? { ...j, proposalsCount: j.proposalsCount + 1 } : j));
    } catch (err) {
      console.error('Error submitting proposal', err);
    }
  };

  const acceptProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to accept proposal');
        return;
      }
      setProposals(prev => prev.map(p => p.id === proposalId ? data.proposal : p));
      if (data.contract) setContracts(prev => [data.contract, ...prev.filter(c => c.id !== data.contract.id)]);
      await refreshBootstrap();
    } catch (err) {
      console.error('Error accepting proposal', err);
    }
  };

  const declineProposal = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/decline`, {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to decline proposal');
        return;
      }
      setProposals(prev => prev.map(p => p.id === proposalId ? data.proposal : p));
    } catch (err) {
      console.error('Error declining proposal', err);
    }
  };

  const releaseMilestoneEscrow = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/escrow/release`, {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({ milestoneId })
      });
      const data = await res.json();
      if (data.success) {
        setContracts(prev => prev.map(c => c.id === contractId ? data.contract : c));
        if (selectedContract?.id === contractId) setSelectedContract(data.contract);
        await refreshBootstrap();
      }
    } catch (err) {
      console.error('Error releasing escrow', err);
    }
  };

  const submitMilestone = async (contractId: string, milestoneId: string, note: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/submit`, {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({ submissionNote: note })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to submit milestone');
        return;
      }
      if (data.contract) {
        setContracts(prev => prev.map(c => c.id === contractId ? data.contract : c));
        setSelectedContract(data.contract);
      }
    } catch (err) {
      console.error('Error submitting milestone', err);
    }
  };

  const sendMessage = async (text: string, voiceNoteUrl?: string) => {
    if (!activeConversation) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({
          conversationId: activeConversation.id,
          text,
          voiceNoteUrl
        })
      });
      const newMsg = await res.json();
      if (!res.ok) return;
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
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({ connectsAmount: amount, price })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, connects: data.newConnects, walletBalance: data.newBalance } : u));
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error buying connects', err);
    }
  };

  const resolveDispute = async (disputeId: string, decision: string, refundClient: number, releaseFreelancer: number) => {
    try {
      const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: authHeaders(currentUser),
        credentials: 'include',
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
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({ hours, notes, activityScore: 92, isManual: false })
      });
      const entry = await res.json();
      if (!res.ok) return;
      setContracts(prev => prev.map(c => c.id === contractId ? { ...c, timesheets: [entry, ...c.timesheets] } : c));
      if (selectedContract?.id === contractId) {
        setSelectedContract(prev => prev ? { ...prev, timesheets: [entry, ...prev.timesheets] } : prev);
      }
    } catch (err) {
      console.error('Error logging time', err);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: authHeaders(currentUser),
      credentials: 'include'
    }).catch(() => undefined);
  };

  const generateAIJobDescription = async (prompt: string, category: string, experience: string) => {
    const res = await fetch('/api/ai/job-generator', {
      method: 'POST',
      headers: authHeaders(currentUser),
      credentials: 'include',
      body: JSON.stringify({ prompt, category, experienceLevel: experience })
    });
    return res.json();
  };

  const generateAIProposal = async (jobTitle: string, jobDesc: string) => {
    const res = await fetch('/api/ai/proposal-generator', {
      method: 'POST',
      headers: authHeaders(currentUser),
      credentials: 'include',
      body: JSON.stringify({ jobTitle, jobDescription: jobDesc, freelancerProfile: freelancerProfile.overview })
    });
    return res.json();
  };

  const optimizeAIProfile = async (headline: string, overview: string) => {
    const res = await fetch('/api/ai/profile-optimizer', {
      method: 'POST',
      headers: authHeaders(currentUser),
      credentials: 'include',
      body: JSON.stringify({ headline, overview, skills: freelancerProfile.skills })
    });
    const data = await res.json();
    if (data.improvedHeadline) {
      const nextSkills = Array.from(new Set([...freelancerProfile.skills, ...(data.suggestedSkillsToAdd || [])]));
      setFreelancerProfile(prev => ({
        ...prev,
        headline: data.improvedHeadline,
        overview: data.improvedOverview,
        skills: nextSkills,
        profileStrength: 98
      }));
      fetch('/api/profile/freelancer', {
        method: 'PATCH',
        headers: authHeaders(currentUser),
        credentials: 'include',
        body: JSON.stringify({
          headline: data.improvedHeadline,
          overview: data.improvedOverview,
          skills: nextSkills,
          profileStrength: 98
        })
      }).catch(() => undefined);
    }
    return data;
  };

  const checkAIScam = async (text: string) => {
    const res = await fetch('/api/ai/scam-checker', {
      method: 'POST',
      headers: authHeaders(currentUser),
      credentials: 'include',
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
        isAuthenticated,
        authChecked,
        loginIntentRole,
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
        isBootstrapping,
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
        loginUser,
        loginAsGuest,
        logoutUser,
        goToLogin,
        createJob,
        submitProposal,
        acceptProposal,
        declineProposal,
        releaseMilestoneEscrow,
        submitMilestone,
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
