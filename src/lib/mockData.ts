import {
  User,
  FreelancerProfile,
  ClientProfile,
  AgencyProfile,
  Job,
  Proposal,
  Contract,
  Conversation,
  Message,
  WalletTransaction,
  Dispute,
  SkillTest,
  NotificationItem,
  ActivityLog
} from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_freelancer_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'freelancer',
    isVerified: true,
    twoFactorEnabled: true,
    timezone: 'PST (UTC-8)',
    connects: 80,
    walletBalance: 4250.00,
    escrowBalance: 1800.00,
    rating: 4.95,
    reviewsCount: 38,
    createdAt: '2023-01-15'
  },
  {
    id: 'usr_client_1',
    name: 'Marcus Vance',
    email: 'm.vance@techhorizon.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'client',
    isVerified: true,
    twoFactorEnabled: true,
    timezone: 'EST (UTC-5)',
    connects: 200,
    walletBalance: 12500.00,
    escrowBalance: 3200.00,
    rating: 4.90,
    reviewsCount: 19,
    createdAt: '2022-08-10'
  },
  {
    id: 'usr_agency_1',
    name: 'Apex Digital Studio',
    email: 'contact@apexdigital.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'agency',
    isVerified: true,
    twoFactorEnabled: true,
    timezone: 'GMT (UTC+0)',
    connects: 350,
    walletBalance: 28400.00,
    escrowBalance: 8500.00,
    rating: 5.0,
    reviewsCount: 64,
    createdAt: '2021-11-01'
  },
  {
    id: 'usr_admin_1',
    name: 'Elena Rostova (Super Admin)',
    email: 'admin@workverse.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    isVerified: true,
    twoFactorEnabled: true,
    timezone: 'UTC',
    connects: 9999,
    walletBalance: 154200.00,
    escrowBalance: 45000.00,
    rating: 5.0,
    reviewsCount: 120,
    createdAt: '2020-01-01'
  },
  {
    id: 'usr_support_1',
    name: 'Alex Rivera (Support Specialist)',
    email: 'support.alex@workverse.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'support',
    isVerified: true,
    twoFactorEnabled: false,
    timezone: 'EST (UTC-5)',
    connects: 500,
    walletBalance: 0,
    escrowBalance: 0,
    rating: 4.9,
    reviewsCount: 15,
    createdAt: '2023-05-10'
  },
  {
    id: 'usr_guest_1',
    name: 'Guest Explorer',
    email: 'guest@workverse.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'guest',
    isVerified: false,
    twoFactorEnabled: false,
    timezone: 'UTC',
    connects: 10,
    walletBalance: 0,
    escrowBalance: 0,
    rating: 0,
    reviewsCount: 0,
    createdAt: '2026-07-01'
  }
];

export const MOCK_FREELANCER_PROFILE: FreelancerProfile = {
  userId: 'usr_freelancer_1',
  headline: 'Senior Full Stack & AI Solutions Architect',
  title: 'Full Stack Engineer & LLM Specialist',
  overview: '8+ years crafting scalable Web & Cloud architectures with React, Node.js, Python, and Generative AI SDKs. Proven track record of delivering high-throughput SaaS platforms, real-time engines, and enterprise integrations.',
  hourlyRate: 85.00,
  fixedPreference: 'both',
  skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Generative AI', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'REST API', 'GraphQL'],
  availability: 'full-time',
  languages: [
    { language: 'English', proficiency: 'Native / Fluent' },
    { language: 'Mandarin', proficiency: 'Conversational' }
  ],
  location: 'San Francisco, CA, USA',
  address: '500 Howard Street, Suite 400',
  totalEarned: 148200.00,
  jobSuccessScore: 99,
  videoIntroUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  profileStrength: 95,
  experiences: [
    {
      id: 'exp_1',
      title: 'Lead Frontend Architect',
      company: 'CloudScale Technologies',
      startDate: '2021-03',
      endDate: '2023-12',
      current: false,
      description: 'Architected micro-frontend systems supporting 2M+ active users. Optimized bundle sizes by 42% and reduced initial page loads.'
    },
    {
      id: 'exp_2',
      title: 'Full Stack Engineer',
      company: 'Veloce AI Labs',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Built real-time analytics streaming services with Node.js WebSockets and React dashboards.'
    }
  ],
  education: [
    {
      id: 'edu_1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Artificial Intelligence',
      startYear: '2014',
      endYear: '2018'
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023-04',
      badgeUrl: 'https://img.shields.io/badge/AWS-Certified-orange?style=flat-square'
    },
    {
      id: 'cert_2',
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud Platform',
      issueDate: '2024-01',
      badgeUrl: 'https://img.shields.io/badge/GCP-Architect-blue?style=flat-square'
    }
  ],
  portfolio: [
    {
      id: 'port_1',
      title: 'AI Driven Analytics Platform',
      description: 'Built an enterprise business intelligence dashboard with custom Gemini LLM data summarization.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      category: 'Web Development',
      technologies: ['React', 'TypeScript', 'Node.js', 'Recharts', 'Tailwind CSS'],
      link: 'https://example.com/demo-analytics'
    },
    {
      id: 'port_2',
      title: 'Real-time Collaborative Canvas',
      description: 'Multi-user interactive whiteboard with zero-latency WebSocket sync.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      category: 'Full Stack',
      technologies: ['React', 'WebSockets', 'Canvas API', 'Redis'],
      link: 'https://example.com/canvas-demo'
    }
  ]
};

export const MOCK_CLIENT_PROFILE: ClientProfile = {
  userId: 'usr_client_1',
  companyName: 'TechHorizon Ventures',
  industry: 'Enterprise Software & AI Solutions',
  companySize: '51-200 Employees',
  description: 'Building next-generation cloud automation and intelligent developer toolkits.',
  website: 'https://techhorizon.io',
  location: 'Austin, TX, USA',
  paymentVerified: true,
  totalSpent: 92400.00,
  openJobsCount: 3,
  completedJobsCount: 14,
  avgRating: 4.90
};

export const MOCK_AGENCY_PROFILE: AgencyProfile = {
  id: 'agency_1',
  ownerId: 'usr_agency_1',
  name: 'Apex Digital Studio',
  logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  description: 'Full-service digital engineering, UI/UX design, and AI application development agency.',
  membersCount: 12,
  freelancerIds: ['usr_freelancer_1'],
  totalEarnings: 340000.00,
  commissionRate: 10
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job_1',
    clientId: 'usr_client_1',
    clientName: 'TechHorizon Ventures',
    clientLocation: 'Austin, TX, USA',
    clientRating: 4.9,
    clientPaymentVerified: true,
    clientTotalSpent: 92400.00,
    title: 'Full Stack React & Node.js Developer for AI SaaS Platform',
    description: 'We are seeking an expert Full Stack Engineer to lead the client dashboard build for our AI analytics SaaS platform. Requirements include React 19, Tailwind CSS, TypeScript, Express API backend, and clean integration with Gemini AI models. Must have experience with real-time WebSockets and complex data visualization charts.',
    jobType: 'fixed',
    category: 'Web, Mobile & Software Dev',
    subcategory: 'Full Stack Development',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Generative AI', 'Tailwind CSS'],
    budget: 3500,
    experienceLevel: 'expert',
    duration: '1 to 3 months',
    projectLength: '1 to 3 months',
    visibility: 'public',
    isFeatured: true,
    isUrgent: true,
    status: 'open',
    attachments: [{ name: 'Project_Architecture.pdf', url: '#', size: '2.4 MB' }],
    screeningQuestions: [
      'Have you previously built apps integrating Generative AI APIs?',
      'Please link to 2 production Web apps you architected using React & TypeScript.'
    ],
    createdAt: '2026-07-22T10:00:00Z',
    proposalsCount: 8,
    hiresCount: 0
  },
  {
    id: 'job_2',
    clientId: 'usr_client_1',
    clientName: 'TechHorizon Ventures',
    clientLocation: 'Austin, TX, USA',
    clientRating: 4.9,
    clientPaymentVerified: true,
    clientTotalSpent: 92400.00,
    title: 'Senior UI/UX Designer for Freelance Marketplace Mobile App',
    description: 'Design comprehensive high-fidelity Figma mockups and design token system for a cross-platform freelance marketplace app. Includes client post job workflow, freelancer bid modal, milestone contract view, and escrow wallet screens.',
    jobType: 'hourly',
    category: 'Design & Creative',
    subcategory: 'UI/UX Design',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    budget: 75,
    hourlyRange: { min: 60, max: 90 },
    experienceLevel: 'expert',
    duration: 'Less than 1 month',
    projectLength: '1 to 3 months',
    visibility: 'public',
    isFeatured: false,
    isUrgent: false,
    status: 'open',
    attachments: [],
    screeningQuestions: [
      'Share a link to your Figma design system case study.'
    ],
    createdAt: '2026-07-23T14:30:00Z',
    proposalsCount: 14,
    hiresCount: 1
  },
  {
    id: 'job_3',
    clientId: 'usr_client_1',
    clientName: 'TechHorizon Ventures',
    clientLocation: 'Austin, TX, USA',
    clientRating: 4.9,
    clientPaymentVerified: true,
    clientTotalSpent: 92400.00,
    title: 'Postgres & Redis Infrastructure Optimization & Security Audit',
    description: 'Audit our database index strategy, slow query logs, connection pools, and configure Redis caching layers for sub-10ms query performance.',
    jobType: 'fixed',
    category: 'IT & Networking',
    subcategory: 'Database Administration',
    skills: ['PostgreSQL', 'Redis', 'Database Security', 'Performance Tuning', 'Docker'],
    budget: 2000,
    experienceLevel: 'intermediate',
    duration: 'Less than 1 month',
    projectLength: 'Less than 1 month',
    visibility: 'public',
    isFeatured: false,
    isUrgent: false,
    status: 'open',
    attachments: [],
    screeningQuestions: [],
    createdAt: '2026-07-20T08:15:00Z',
    proposalsCount: 5,
    hiresCount: 0
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop_1',
    jobId: 'job_1',
    freelancerId: 'usr_freelancer_1',
    freelancerName: 'Sarah Chen',
    freelancerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    freelancerTitle: 'Senior Full Stack & AI Specialist',
    freelancerRating: 4.95,
    freelancerJSS: 99,
    coverLetter: 'Hi Marcus,\n\nI review your request for a Full Stack React & Node.js AI SaaS Platform. I have architected similar Generative AI powered dashboards with real-time streaming, high-density charts, and robust Express backends.\n\nMy proposed approach:\n1. Milestone 1 ($1,000): Setup modular architecture, Express API, and authentication.\n2. Milestone 2 ($1,500): Core client dashboard, job management, and AI prompt helper.\n3. Milestone 3 ($1,000): Escrow wallet, real-time chat, and polish.\n\nLooking forward to speaking in detail!',
    bidAmount: 3500,
    estimatedDuration: '1 month',
    boostCredits: 4,
    milestones: [
      { id: 'm_1', title: 'Architecture & Express Backend API', amount: 1000, dueDate: '2026-08-05', status: 'pending' },
      { id: 'm_2', title: 'Dashboard & AI Assistant Module', amount: 1500, dueDate: '2026-08-20', status: 'pending' },
      { id: 'm_3', title: 'Real-time Chat & Wallet Escrow', amount: 1000, dueDate: '2026-08-31', status: 'pending' }
    ],
    answers: [
      { question: 'Have you previously built apps integrating Generative AI APIs?', answer: 'Yes, I built 4 production apps with @google/genai SDK on Node/Express servers.' }
    ],
    status: 'shortlisted',
    createdAt: '2026-07-22T12:00:00Z'
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'cnt_1',
    jobId: 'job_1',
    jobTitle: 'Full Stack React & Node.js Developer for AI SaaS Platform',
    clientId: 'usr_client_1',
    clientName: 'TechHorizon Ventures',
    freelancerId: 'usr_freelancer_1',
    freelancerName: 'Sarah Chen',
    contractType: 'fixed',
    rate: 3500,
    totalBudget: 3500,
    escrowBalance: 1000,
    totalPaid: 1500,
    status: 'active',
    startDate: '2026-07-10',
    milestones: [
      {
        id: 'cnt_m1',
        title: 'Phase 1: REST API & Database Models',
        amount: 1500,
        dueDate: '2026-07-20',
        status: 'approved',
        submissionNote: 'Completed database schemas, Express router endpoints, and authentication middleware.',
        submissionAttachment: 'https://example.com/phase1_code.zip'
      },
      {
        id: 'cnt_m2',
        title: 'Phase 2: Client Dashboard & AI Engines',
        amount: 1000,
        dueDate: '2026-08-01',
        status: 'submitted',
        submissionNote: 'Delivered initial React client views, AI Job & Proposal generator API handlers, and contract tracking drawer.',
        submissionAttachment: 'https://example.com/phase2_review.zip'
      },
      {
        id: 'cnt_m3',
        title: 'Phase 3: Realtime Chat, Wallet Escrow & Production Polish',
        amount: 1000,
        dueDate: '2026-08-15',
        status: 'in_escrow'
      }
    ],
    timesheets: [
      {
        id: 'ts_1',
        contractId: 'cnt_1',
        date: '2026-07-22',
        hours: 6.5,
        activityScore: 94,
        notes: 'Implemented AI proposal generator and Gemini server-side routing',
        screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        isManual: false
      }
    ]
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantIds: ['usr_client_1', 'usr_freelancer_1'],
    participantNames: {
      usr_client_1: 'Marcus Vance',
      usr_freelancer_1: 'Sarah Chen'
    },
    participantAvatars: {
      usr_client_1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      usr_freelancer_1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    jobTitle: 'Full Stack React & Node.js Developer for AI SaaS Platform',
    lastMessage: 'I reviewed Phase 2 submission. Looking great! Releasing milestone 1 funds now.',
    lastMessageTimestamp: '2026-07-24T03:45:00Z',
    unreadCount: { usr_freelancer_1: 1, usr_client_1: 0 }
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'usr_freelancer_1',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    text: 'Hi Marcus! I have submitted Phase 2 milestone for your review. Attached all frontend dashboard build code and API endpoints.',
    isRead: true,
    timestamp: '2026-07-24T02:15:00Z'
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'usr_client_1',
    senderName: 'Marcus Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'I reviewed Phase 2 submission. Looking great! Releasing milestone 1 funds now.',
    isRead: false,
    timestamp: '2026-07-24T03:45:00Z'
  }
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_101',
    userId: 'usr_freelancer_1',
    type: 'escrow_release',
    amount: 1500.00,
    status: 'completed',
    paymentMethod: 'Escrow Wallet',
    description: 'Milestone 1 Payment Released - Job #job_1',
    referenceId: 'cnt_m1',
    createdAt: '2026-07-21T16:20:00Z'
  },
  {
    id: 'tx_102',
    userId: 'usr_freelancer_1',
    type: 'connects_purchase',
    amount: -15.00,
    status: 'completed',
    paymentMethod: 'Connects Store',
    description: 'Purchased 20 Connects Bundle',
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'tx_103',
    userId: 'usr_client_1',
    type: 'deposit',
    amount: 5000.00,
    status: 'completed',
    paymentMethod: 'Stripe',
    description: 'Wallet Deposit via Visa **** 4242',
    createdAt: '2026-07-01T11:30:00Z'
  }
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    contractId: 'cnt_old_99',
    contractTitle: 'Mobile App Refactoring & GraphQL Upgrade',
    clientId: 'usr_client_1',
    clientName: 'Marcus Vance',
    freelancerId: 'usr_freelancer_1',
    freelancerName: 'Sarah Chen',
    disputedAmount: 850.00,
    reason: 'Deliverable missing offline sync unit tests',
    clientClaim: 'The contractor delivered the GraphQL queries but omitted offline local sync unit tests requested in milestone specifications.',
    freelancerResponse: 'Offline sync tests were contingent on client providing sandbox credentials which were delivered 5 days late.',
    status: 'under_review',
    createdAt: '2026-07-22T09:00:00Z'
  }
];

export const MOCK_SKILL_TESTS: SkillTest[] = [
  {
    id: 'test_react',
    title: 'React 19 & Modern Hooks Proficiency',
    category: 'Frontend Engineering',
    timeLimitMinutes: 10,
    questionsCount: 3,
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'Which React hook should be preferred to manage side-effects synchronized with external systems?',
        options: ['useState', 'useLayoutEffect', 'useEffect', 'useCallback'],
        correctOptionIndex: 2
      },
      {
        id: 'q2',
        question: 'What is the primary benefit of React Server Components or Memoization in large trees?',
        options: ['Reduces browser bundle size & avoids unnecessary DOM re-renders', 'Encrypts user passwords', 'Styles CSS flexbox', 'Disables TypeScript checking'],
        correctOptionIndex: 0
      },
      {
        id: 'q3',
        question: 'How do you pass non-primitive props to useEffect without triggering infinite re-renders?',
        options: ['Ignore dependencies', 'Memoize with useMemo/useCallback or pull primitive properties', 'Call forceUpdate()', 'Use inline object literals'],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 'test_node',
    title: 'Node.js & Express REST Security Standard',
    category: 'Backend Engineering',
    timeLimitMinutes: 10,
    questionsCount: 3,
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'Where should sensitive secret keys (e.g., GEMINI_API_KEY) be initialized and accessed in a full-stack web app?',
        options: ['On the browser in window.env', 'In public GitHub repositories', 'On the server via process.env in server-side routes', 'Inside React inline JSX'],
        correctOptionIndex: 2
      },
      {
        id: 'q2',
        question: 'Which middleware is essential to protect Express REST endpoints against Cross-Site Request Forgery & Rate Overload?',
        options: ['express.static', 'Helmet & Express Rate Limiters', 'Body Parser only', 'Console log'],
        correctOptionIndex: 1
      },
      {
        id: 'q3',
        question: 'How should unhandled rejections in async Express route handlers be handled safely?',
        options: ['Crash the node process immediately without logs', 'Wrap with try/catch or express async error middleware', 'Return HTTP 200 with empty body', 'Disable promises'],
        correctOptionIndex: 1
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_freelancer_1',
    title: 'Milestone 1 Approved!',
    message: 'Marcus Vance approved milestone "Phase 1: REST API & Database Models" and released $1,500.00 to your wallet.',
    type: 'escrow',
    isRead: false,
    createdAt: '2026-07-24T03:45:00Z',
    link: '/contracts/cnt_1'
  },
  {
    id: 'notif_2',
    userId: 'usr_freelancer_1',
    title: 'Proposal Shortlisted',
    message: 'Your proposal for "Full Stack React & Node.js Developer for AI SaaS Platform" was shortlisted by TechHorizon Ventures.',
    type: 'proposal',
    isRead: true,
    createdAt: '2026-07-22T14:10:00Z'
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    userId: 'usr_client_1',
    userName: 'Marcus Vance',
    userRole: 'client',
    action: 'POST_JOB_CREATED (Job #job_1)',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-07-22T10:00:00Z'
  },
  {
    id: 'act_2',
    userId: 'usr_freelancer_1',
    userName: 'Sarah Chen',
    userRole: 'freelancer',
    action: 'PROPOSAL_SUBMITTED (Job #job_1, 4 Boost Connects)',
    ipAddress: '172.56.21.9',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-07-22T12:00:00Z'
  },
  {
    id: 'act_3',
    userId: 'usr_admin_1',
    userName: 'Elena Rostova',
    userRole: 'admin',
    action: 'SECURITY_AUDIT_LOG_EXPORT',
    ipAddress: '10.0.0.1',
    userAgent: 'WorkVerse Admin CLI 2.4.0',
    createdAt: '2026-07-24T01:00:00Z'
  }
];
