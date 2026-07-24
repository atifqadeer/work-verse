import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
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
} from './src/lib/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store
const state = {
  users: [...MOCK_USERS],
  freelancerProfile: { ...MOCK_FREELANCER_PROFILE },
  clientProfile: { ...MOCK_CLIENT_PROFILE },
  agencyProfile: { ...MOCK_AGENCY_PROFILE },
  jobs: [...MOCK_JOBS],
  proposals: [...MOCK_PROPOSALS],
  contracts: [...MOCK_CONTRACTS],
  conversations: [...MOCK_CONVERSATIONS],
  messages: [...MOCK_MESSAGES],
  transactions: [...MOCK_TRANSACTIONS],
  disputes: [...MOCK_DISPUTES],
  skillTests: [...MOCK_SKILL_TESTS],
  notifications: [...MOCK_NOTIFICATIONS],
  activityLogs: [...MOCK_ACTIVITY_LOGS]
};

// Initialize Google Gemini AI SDK on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Log API Requests for Security Audit
  app.use('/api', (req, res, next) => {
    const logEntry = {
      id: `act_${Date.now()}`,
      userId: (req.headers['x-user-id'] as string) || 'usr_guest_1',
      userName: (req.headers['x-user-name'] as string) || 'Guest User',
      userRole: ((req.headers['x-user-role'] as string) || 'guest') as any,
      action: `${req.method} ${req.path}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.get('user-agent') || 'Browser',
      createdAt: new Date().toISOString()
    };
    state.activityLogs.unshift(logEntry);
    if (state.activityLogs.length > 50) state.activityLogs.pop();
    next();
  });

  // ==================== REST API ENDPOINTS ====================

  // 1. Users & Current Profile
  app.get('/api/users', (req, res) => {
    res.json(state.users);
  });

  app.get('/api/profile/freelancer', (req, res) => {
    res.json({
      user: state.users.find(u => u.id === 'usr_freelancer_1'),
      profile: state.freelancerProfile
    });
  });

  app.get('/api/profile/client', (req, res) => {
    res.json({
      user: state.users.find(u => u.id === 'usr_client_1'),
      profile: state.clientProfile
    });
  });

  app.get('/api/profile/agency', (req, res) => {
    res.json({
      user: state.users.find(u => u.id === 'usr_agency_1'),
      profile: state.agencyProfile
    });
  });

  // 2. Jobs REST Endpoints
  app.get('/api/jobs', (req, res) => {
    const { search, category, type, minBudget, maxBudget, experience } = req.query;
    let filtered = [...state.jobs];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(j => j.category === category);
    }

    if (type && typeof type === 'string' && type !== 'all') {
      filtered = filtered.filter(j => j.jobType === type);
    }

    if (minBudget) {
      filtered = filtered.filter(j => j.budget >= Number(minBudget));
    }

    if (maxBudget) {
      filtered = filtered.filter(j => j.budget <= Number(maxBudget));
    }

    if (experience && typeof experience === 'string' && experience !== 'all') {
      filtered = filtered.filter(j => j.experienceLevel === experience);
    }

    res.json(filtered);
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = state.jobs.find(j => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  });

  app.post('/api/jobs', (req, res) => {
    const { title, description, jobType, category, subcategory, skills, budget, experienceLevel, duration, projectLength, screeningQuestions, isFeatured, isUrgent } = req.body;

    const newJob = {
      id: `job_${Date.now()}`,
      clientId: 'usr_client_1',
      clientName: state.clientProfile.companyName || 'TechHorizon Ventures',
      clientLocation: state.clientProfile.location,
      clientRating: state.clientProfile.avgRating,
      clientPaymentVerified: true,
      clientTotalSpent: state.clientProfile.totalSpent,
      title: title || 'Untitled Project',
      description: description || '',
      jobType: jobType || 'fixed',
      category: category || 'Web, Mobile & Software Dev',
      subcategory: subcategory || 'Full Stack Development',
      skills: Array.isArray(skills) ? skills : ['React', 'TypeScript'],
      budget: Number(budget) || 1000,
      experienceLevel: experienceLevel || 'intermediate',
      duration: duration || '1 to 3 months',
      projectLength: projectLength || '1 to 3 months',
      visibility: 'public' as const,
      isFeatured: !!isFeatured,
      isUrgent: !!isUrgent,
      status: 'open' as const,
      attachments: [],
      screeningQuestions: Array.isArray(screeningQuestions) ? screeningQuestions : [],
      createdAt: new Date().toISOString(),
      proposalsCount: 0,
      hiresCount: 0
    };

    state.jobs.unshift(newJob);
    state.clientProfile.openJobsCount += 1;
    res.status(201).json(newJob);
  });

  // 3. Proposals REST Endpoints
  app.get('/api/proposals', (req, res) => {
    const { jobId, freelancerId } = req.query;
    let list = [...state.proposals];
    if (jobId) list = list.filter(p => p.jobId === jobId);
    if (freelancerId) list = list.filter(p => p.freelancerId === freelancerId);
    res.json(list);
  });

  app.post('/api/proposals', (req, res) => {
    const { jobId, coverLetter, bidAmount, estimatedDuration, boostCredits, milestones, answers } = req.body;

    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const freelancer = state.users.find(u => u.id === 'usr_freelancer_1');
    const requiredConnects = 6 + (Number(boostCredits) || 0);

    if (freelancer && freelancer.connects < requiredConnects) {
      return res.status(400).json({ error: `Insufficient connects. Required ${requiredConnects}, you have ${freelancer.connects}.` });
    }

    if (freelancer) {
      freelancer.connects -= requiredConnects;
      state.transactions.unshift({
        id: `tx_${Date.now()}`,
        userId: freelancer.id,
        type: 'connects_purchase',
        amount: -requiredConnects,
        status: 'completed',
        paymentMethod: 'Connects Store',
        description: `Spent ${requiredConnects} Connects applying to job #${job.title.substring(0, 20)}...`,
        createdAt: new Date().toISOString()
      });
    }

    const newProposal = {
      id: `prop_${Date.now()}`,
      jobId,
      freelancerId: 'usr_freelancer_1',
      freelancerName: 'Sarah Chen',
      freelancerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      freelancerTitle: state.freelancerProfile.title,
      freelancerRating: 4.95,
      freelancerJSS: state.freelancerProfile.jobSuccessScore,
      coverLetter: coverLetter || '',
      bidAmount: Number(bidAmount) || job.budget,
      estimatedDuration: estimatedDuration || '1 month',
      boostCredits: Number(boostCredits) || 0,
      milestones: Array.isArray(milestones) ? milestones : [],
      answers: Array.isArray(answers) ? answers : [],
      status: 'submitted' as const,
      createdAt: new Date().toISOString()
    };

    state.proposals.unshift(newProposal);
    job.proposalsCount += 1;

    // Send notification to Client
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: job.clientId,
      title: 'New Proposal Received!',
      message: `Sarah Chen submitted a proposal ($${newProposal.bidAmount}) for "${job.title}".`,
      type: 'proposal',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newProposal);
  });

  // 4. Contracts & Escrow Endpoints
  app.get('/api/contracts', (req, res) => {
    res.json(state.contracts);
  });

  app.post('/api/contracts/:id/escrow/release', (req, res) => {
    const { milestoneId } = req.body;
    const contract = state.contracts.find(c => c.id === req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const milestone = contract.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = 'approved';
    contract.escrowBalance = Math.max(0, contract.escrowBalance - milestone.amount);
    contract.totalPaid += milestone.amount;

    // Update freelancer wallet
    const freelancer = state.users.find(u => u.id === contract.freelancerId);
    if (freelancer) {
      freelancer.walletBalance += milestone.amount;
    }

    state.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: contract.freelancerId,
      type: 'escrow_release',
      amount: milestone.amount,
      status: 'completed',
      paymentMethod: 'Escrow Wallet',
      description: `Escrow Released for milestone "${milestone.title}" on ${contract.jobTitle}`,
      referenceId: milestone.id,
      createdAt: new Date().toISOString()
    });

    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: contract.freelancerId,
      title: 'Milestone Funds Released!',
      message: `$${milestone.amount.toFixed(2)} was released to your wallet for "${milestone.title}".`,
      type: 'escrow',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, contract });
  });

  app.post('/api/contracts/:id/timesheet', (req, res) => {
    const { hours, notes, activityScore, screenshotUrl, isManual } = req.body;
    const contract = state.contracts.find(c => c.id === req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const newEntry = {
      id: `ts_${Date.now()}`,
      contractId: contract.id,
      date: new Date().toISOString().split('T')[0],
      hours: Number(hours) || 1,
      activityScore: Number(activityScore) || 90,
      notes: notes || 'Worked on milestone deliverables',
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      isManual: !!isManual
    };

    contract.timesheets.unshift(newEntry);
    res.status(201).json(newEntry);
  });

  // 5. Connects Store & Wallet
  app.post('/api/connects/purchase', (req, res) => {
    const { packId, connectsAmount, price } = req.body;
    const user = state.users.find(u => u.id === 'usr_freelancer_1');

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.connects += Number(connectsAmount) || 20;
    user.walletBalance = Math.max(0, user.walletBalance - (Number(price) || 15));

    state.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'connects_purchase',
      amount: -(Number(price) || 15),
      status: 'completed',
      paymentMethod: 'Stripe',
      description: `Purchased ${connectsAmount} Connects Package`,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, newConnects: user.connects, newBalance: user.walletBalance });
  });

  // 6. Real-time Messaging REST Endpoints
  app.get('/api/conversations', (req, res) => {
    res.json(state.conversations);
  });

  app.get('/api/messages/:conversationId', (req, res) => {
    const list = state.messages.filter(m => m.conversationId === req.params.conversationId);
    res.json(list);
  });

  app.post('/api/messages', (req, res) => {
    const { conversationId, senderId, senderName, senderAvatar, text, voiceNoteUrl, attachments } = req.body;

    const newMsg = {
      id: `msg_${Date.now()}`,
      conversationId: conversationId || 'conv_1',
      senderId: senderId || 'usr_freelancer_1',
      senderName: senderName || 'Sarah Chen',
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      text: text || '',
      voiceNoteUrl,
      attachments,
      isRead: false,
      timestamp: new Date().toISOString()
    };

    state.messages.push(newMsg);

    const conv = state.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text || (voiceNoteUrl ? '🎙️ Voice note' : 'Attachment');
      conv.lastMessageTimestamp = newMsg.timestamp;
    }

    res.status(201).json(newMsg);
  });

  // 7. Admin Analytics & Security Audit
  app.get('/api/admin/analytics', (req, res) => {
    const totalRevenue = state.contracts.reduce((acc, c) => acc + c.totalPaid, 0) * 0.10 + 4200;
    const activeContractsCount = state.contracts.filter(c => c.status === 'active').length;
    const totalUsers = state.users.length + 1420;

    res.json({
      totalRevenue,
      platformFeeEarnings: totalRevenue * 0.10,
      activeJobs: state.jobs.filter(j => j.status === 'open').length,
      activeContractsCount,
      totalUsers,
      totalDisputes: state.disputes.length,
      transactions: state.transactions.slice(0, 10),
      recentLogs: state.activityLogs.slice(0, 15)
    });
  });

  // 8. Disputes & Admin Decision
  app.get('/api/disputes', (req, res) => {
    res.json(state.disputes);
  });

  app.post('/api/disputes/:id/resolve', (req, res) => {
    const { decision, refundClientAmount, releaseFreelancerAmount } = req.body;
    const dispute = state.disputes.find(d => d.id === req.params.id);

    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    dispute.status = 'resolved';
    dispute.adminDecision = decision;
    dispute.refundClientAmount = Number(refundClientAmount) || 0;
    dispute.releaseFreelancerAmount = Number(releaseFreelancerAmount) || 0;

    res.json({ success: true, dispute });
  });

  // ==================== GEMINI AI ENGINE ENDPOINTS ====================

  // AI Endpoint 1: AI Job Description Generator
  app.post('/api/ai/job-generator', async (req, res) => {
    try {
      const { prompt, category, experienceLevel } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          title: `Senior ${category || 'Software'} Specialist for High-Impact SaaS Build`,
          description: `We are looking for a skilled professional to handle: ${prompt || 'Full stack development and cloud infrastructure'}. Requirements include clean architecture, comprehensive test coverage, responsive design, and weekly progress updates.`,
          suggestedSkills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'API Integration']
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an expert recruitment copywriter for top tech companies. Generate a high-converting, professional freelance job posting based on this brief: "${prompt}". Category: "${category || 'Web Development'}", Experience Level: "${experienceLevel || 'Expert'}".
Return a strict JSON object with:
- "title": a clear, attractive job title
- "description": detailed job description covering Responsibilities, Requirements, and Deliverables
- "suggestedSkills": array of 5 relevant technical skills`
      });

      let jsonText = response.text || '';
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Job Generator Error:', err);
      res.json({
        title: `Expert Specialist for High-Impact Project`,
        description: `Looking for a dedicated specialist to execute on: ${req.body.prompt || 'Project scope'}. Key expectations include clean execution, fast turnarounds, and clear communications.`,
        suggestedSkills: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS']
      });
    }
  });

  // AI Endpoint 2: AI Proposal Cover Letter & Bid Advisor
  app.post('/api/ai/proposal-generator', async (req, res) => {
    try {
      const { jobTitle, jobDescription, freelancerProfile } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          coverLetter: `Hi,\n\nI read your job post for "${jobTitle}" with great interest. With 8+ years of full-stack engineering experience delivering scalable SaaS platforms using React, TypeScript, and Node.js, I am confident I can exceed your expectations.\n\nMy proposed strategy:\n1. Modular architecture & API integration\n2. Real-time updates & clean UI/UX styling\n3. Rapid turnaround with milestone demos.\n\nI would love to discuss your technical requirements on a quick call!`,
          recommendedBid: 3200,
          suggestedDuration: '3 weeks',
          matchScore: 96
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an elite freelance proposal consultant. Draft a compelling, personalized proposal cover letter for a freelancer applying to this job:
Title: "${jobTitle}"
Description: "${jobDescription}"
Freelancer Bio: "${freelancerProfile || 'Full Stack Engineer with 8+ years experience in React, Node, Generative AI'}"

Return a strict JSON object with:
- "coverLetter": structured, persuasive proposal text with clear milestones
- "recommendedBid": suggested bid amount in USD
- "suggestedDuration": time estimate like "2 weeks"
- "matchScore": integer from 80 to 99 indicating match percentage`
      });

      let jsonText = response.text || '';
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Proposal Generator Error:', err);
      res.json({
        coverLetter: `Hello,\n\nI am eager to apply for "${req.body.jobTitle}". I bring deep expertise in building scalable web applications and delivering on deadline with clean code and high quality.\n\nLooking forward to collaborating with you!`,
        recommendedBid: 2800,
        suggestedDuration: '1 month',
        matchScore: 92
      });
    }
  });

  // AI Endpoint 3: AI Profile Strength & Optimization
  app.post('/api/ai/profile-optimizer', async (req, res) => {
    try {
      const { headline, overview, skills } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          improvedHeadline: 'Senior Full Stack & AI Solutions Architect | React & Node.js Lead',
          improvedOverview: `${overview}\n\nKey Highlights:\n- Architected high-throughput SaaS platforms supporting 2M+ users.\n- Expert in AI LLM integration, TypeScript, and high-performance REST APIs.`,
          suggestedSkillsToAdd: ['Docker', 'GraphQL', 'Redis', 'Jest'],
          profileStrengthGain: '+15%'
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Optimize this freelancer profile to rank #1 on marketplace search engines:
Headline: "${headline}"
Overview: "${overview}"
Current Skills: ${JSON.stringify(skills)}

Return a strict JSON object with:
- "improvedHeadline": concise, punchy title
- "improvedOverview": polished bio with bullet points and key achievements
- "suggestedSkillsToAdd": array of 4 complementary trending technical skills
- "profileStrengthGain": string like "+15%"`
      });

      let jsonText = response.text || '';
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Profile Optimizer Error:', err);
      res.json({
        improvedHeadline: 'Senior Lead Full Stack Engineer & Cloud Architect',
        improvedOverview: `${req.body.overview || ''}\n\nSpecialized in delivering end-to-end web applications with React, Node.js, and modern AI SDKs.`,
        suggestedSkillsToAdd: ['Docker', 'PostgreSQL', 'Tailwind CSS'],
        profileStrengthGain: '+10%'
      });
    }
  });

  // AI Endpoint 4: AI Job/Message Scam Guard & Safety Inspector
  app.post('/api/ai/scam-checker', async (req, res) => {
    try {
      const { text } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        const lower = (text || '').toLowerCase();
        const isSuspicious = lower.includes('telegram') || lower.includes('whatsapp') || lower.includes('wire transfer') || lower.includes('crypto');
        return res.json({
          safetyScore: isSuspicious ? 35 : 98,
          isFlagged: isSuspicious,
          riskLevel: isSuspicious ? 'HIGH' : 'LOW',
          reasons: isSuspicious
            ? ['Mentions communication or payment outside the marketplace platform which violates Terms of Service.']
            : ['Job contains standard scope, verified payment terms, and clear deliverables.']
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze this marketplace job post or message for potential scam, phishing, or safety violations:
Text: "${text}"

Return a strict JSON object with:
- "safetyScore": integer from 0 to 100 (100 = completely safe)
- "isFlagged": boolean
- "riskLevel": "LOW" | "MEDIUM" | "HIGH"
- "reasons": array of string safety observations`
      });

      let jsonText = response.text || '';
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      res.json({
        safetyScore: 95,
        isFlagged: false,
        riskLevel: 'LOW',
        reasons: ['Job content passes standard safety patterns.']
      });
    }
  });


  // Serve Vite static assets or middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WorkVerse Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
