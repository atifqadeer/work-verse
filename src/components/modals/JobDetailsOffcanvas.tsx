import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Share2,
  Heart,
  ExternalLink,
  CheckCircle2,
  Star,
  Clock,
  DollarSign,
  Briefcase,
  Zap,
  ShieldCheck,
  Building2,
  MapPin,
  Globe,
  Award,
  Users,
  MessageSquare,
  Bot,
  AlertTriangle,
  Sparkles,
  Bookmark
} from 'lucide-react';

export const JobDetailsOffcanvas: React.FC = () => {
  const {
    selectedJob,
    setSelectedJob,
    isJobDetailsOpen,
    setIsJobDetailsOpen,
    setIsProposalModalOpen,
    currentUser,
    setIsScamGuardModalOpen,
    checkAIScam
  } = useApp();

  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scamResult, setScamResult] = useState<any>(null);
  const [isScanningScam, setIsScanningScam] = useState(false);

  if (!isJobDetailsOpen || !selectedJob) return null;

  const handleClose = () => {
    setIsJobDetailsOpen(false);
  };

  const handleApply = () => {
    // Open proposal modal for the selected job
    setIsProposalModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunScamCheck = async () => {
    setIsScanningScam(true);
    try {
      const res = await checkAIScam(`${selectedJob.title}\n${selectedJob.description}`);
      setScamResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningScam(false);
    }
  };

  const requiredConnects = 6;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16">
        {/* Offcanvas Drawer Panel */}
        <div className="w-screen max-w-3xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Close</span>
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-mono">Job ID: #{selectedJob.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copy job link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={handleApply}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <span>Apply Now</span>
                <Zap className="w-4 h-4 text-amber-300 fill-current" />
              </button>
            </div>
          </div>

          {/* Drawer Body Grid */}
          <div className="p-6 space-y-8 flex-1">
            
            {/* Category & Post Date */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  {selectedJob.category}
                </span>
                {selectedJob.isFeatured && (
                  <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                    Featured
                  </span>
                )}
                {selectedJob.isUrgent && (
                  <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
                    Urgent Need
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Posted {selectedJob.createdAt ? selectedJob.createdAt.split('T')[0] : 'Today'} • Worldwide
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 leading-snug">
                {selectedJob.title}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Client: {selectedJob.clientName}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{selectedJob.clientLocation}</span>
              </p>
            </div>

            {/* Key Job Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>{selectedJob.jobType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}</span>
                </div>
                <div className="text-lg font-black text-emerald-700 font-mono">
                  {selectedJob.jobType === 'fixed'
                    ? `$${selectedJob.budget}`
                    : `$${selectedJob.hourlyRange?.min || 50}-$${selectedJob.hourlyRange?.max || 90}/hr`}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Experience</span>
                </div>
                <div className="text-sm font-bold text-slate-900 capitalize">
                  {selectedJob.experienceLevel} Level
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Scope / Time</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  1 to 3 months
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Connects</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {requiredConnects} Required
                </div>
              </div>
            </div>

            {/* Split Content: Main Job Details & Right Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
              
              {/* Main Content (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Job Description
                  </h2>
                  <div className="text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                    {selectedJob.description}
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Skills & Expertise Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity on this job */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Activity on this Job
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Proposals</span>
                      <span className="text-sm font-bold text-slate-900">{selectedJob.proposalsCount} submitted</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Last viewed by client</span>
                      <span className="text-sm font-bold text-slate-900">15 minutes ago</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Interviewing</span>
                      <span className="text-sm font-bold text-indigo-700">1 candidate</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Invites Sent</span>
                      <span className="text-sm font-bold text-slate-900">0</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block">Unanswered Invites</span>
                      <span className="text-sm font-bold text-slate-900">0</span>
                    </div>
                  </div>
                </div>

                {/* Client History & Feedback */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Client's Recent Feedback & Reviews
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">Full-Stack SaaS Platform Architecture</span>
                        <span className="text-emerald-700 font-bold">$4,500.00</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-slate-600 ml-1">5.00</span>
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        "Great client! Clear milestone specs, prompt responses, and instant escrow releases."
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">UI/UX Design for Mobile App</span>
                        <span className="text-emerald-700 font-bold">$1,800.00</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-slate-600 ml-1">5.00</span>
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        "Pleasure to work with. Very professional communication."
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar Actions Column (Right 1 col) */}
              <div className="space-y-6">
                
                {/* Apply Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <button
                    onClick={handleApply}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <span>Submit a Proposal</span>
                    <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  </button>

                  <div className="text-[11px] text-slate-500 space-y-1 text-center font-mono">
                    <p>Required Connects: <span className="font-bold text-slate-900">{requiredConnects}</span></p>
                    <p>Available Balance: <span className="font-bold text-emerald-700">{currentUser.connects} Connects</span></p>
                  </div>
                </div>

                {/* AI Scam Inspector Card */}
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>AI Scam Inspector</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verify job safety against phishing, off-platform payment traps, or fraudulent client patterns.
                  </p>

                  <button
                    onClick={handleRunScamCheck}
                    disabled={isScanningScam}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
                    <span>{isScanningScam ? 'Scanning with Gemini...' : 'Analyze Job Safety'}</span>
                  </button>

                  {scamResult && (
                    <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                      scamResult.isFlagged ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="font-bold flex items-center gap-1">
                        {scamResult.isFlagged ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>Score: {scamResult.safetyScore}/100 ({scamResult.riskLevel} Risk)</span>
                      </div>
                      <p className="text-[11px] leading-tight">{scamResult.recommendation}</p>
                    </div>
                  )}
                </div>

                {/* About the Client Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    About the Client
                  </h3>

                  <div className="space-y-3 text-xs">
                    
                    {/* Payment Verification */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {selectedJob.clientPaymentVerified ? 'Payment Method Verified' : 'Payment Method Unverified'}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="font-bold text-slate-900">{selectedJob.clientRating.toFixed(1)} of 5 stars</span>
                      <span className="text-slate-500 text-[11px]">(28 reviews)</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedJob.clientLocation}</span>
                    </div>

                    {/* Spend Stats */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>${selectedJob.clientTotalSpent.toLocaleString()} total spent</span>
                    </div>

                    {/* Hire stats */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>24 hires, 2 active contracts</span>
                    </div>

                    {/* Company info */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Software Company • 10-50 employees</span>
                    </div>

                    {/* Member since */}
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Member since May 2021</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
