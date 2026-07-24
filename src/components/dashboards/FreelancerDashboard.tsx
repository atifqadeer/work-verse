import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Proposal } from '../../types';
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  FileText,
  Briefcase,
  Layers,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const FreelancerDashboard: React.FC = () => {
  const {
    jobs,
    proposals,
    contracts,
    freelancerProfile,
    optimizeAIProfile,
    setSelectedJob,
    setIsJobDetailsOpen,
    setSelectedContract,
    setIsProposalModalOpen,
    setIsContractModalOpen,
    setIsSkillTestModalOpen,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [minBudget, setMinBudget] = useState<number>(0);
  const [isOptimizingAI, setIsOptimizingAI] = useState(false);
  const [aiOptimizationMessage, setAiOptimizationMessage] = useState<string | null>(null);

  // Filter Jobs
  const categories = ['All', 'Web, Mobile & Software Dev', 'Design & Creative', 'IT & Networking', 'AI & Data Science'];

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory !== 'All' && job.category !== selectedCategory) return false;
    if (selectedJobType !== 'all' && job.jobType !== selectedJobType) return false;
    if (selectedExperience !== 'all' && job.experienceLevel !== selectedExperience) return false;
    if (job.budget < minBudget) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.skills.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleAIOptimizeProfile = async () => {
    setIsOptimizingAI(true);
    setAiOptimizationMessage(null);
    try {
      const res = await optimizeAIProfile(freelancerProfile.headline, freelancerProfile.overview);
      setAiOptimizationMessage(`✨ AI optimized your profile! Strength increased to 98%. Added key keywords: ${res.suggestedSkillsToAdd?.join(', ')}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Health & AI Improver Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={freelancerProfile.portfolio[0]?.imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{freelancerProfile.headline}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-md font-mono border border-emerald-500/30 font-semibold">
                  Top Rated 99% JSS
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl line-clamp-1">{freelancerProfile.overview}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 font-mono">
                <span>Hourly Rate: ${freelancerProfile.hourlyRate}/hr</span>
                <span>•</span>
                <span>Earned: ${freelancerProfile.totalEarned.toLocaleString()}</span>
                <span>•</span>
                <span>Availability: {freelancerProfile.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center w-full sm:w-auto">
              <div className="text-xs text-slate-300">Profile Strength</div>
              <div className="text-lg font-black text-emerald-400">{freelancerProfile.profileStrength}%</div>
            </div>

            <button
              onClick={handleAIOptimizeProfile}
              disabled={isOptimizingAI}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>{isOptimizingAI ? 'Optimizing with Gemini...' : 'Enhance Profile with AI'}</span>
            </button>
          </div>
        </div>

        {aiOptimizationMessage && (
          <div className="mt-4 p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{aiOptimizationMessage}</span>
          </div>
        )}
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('find-work')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'find-work' ? 'bg-white text-emerald-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Find Work ({filteredJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-proposals')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'my-proposals' ? 'bg-white text-emerald-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Proposals ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-contracts')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'my-contracts' ? 'bg-white text-emerald-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active Contracts ({contracts.length})</span>
        </button>
      </div>

      {/* FIND WORK TAB CONTENT */}
      {activeTab === 'find-work' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <span className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Job Filters</span>
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedJobType('all');
                  setSelectedExperience('all');
                  setMinBudget(0);
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</label>
              <select
                value={selectedJobType}
                onChange={e => setSelectedJobType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Types (Hourly & Fixed)</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience Level</label>
              <select
                value={selectedExperience}
                onChange={e => setSelectedExperience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Experience Levels</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert Level</option>
              </select>
            </div>

            {/* Min Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Budget ($)</label>
              <input
                type="number"
                value={minBudget}
                onChange={e => setMinBudget(Number(e.target.value))}
                placeholder="e.g. 500"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Job Feed List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">No jobs match your current filters</h3>
                <p className="text-xs">Try broadening your search keywords or clearing category filters.</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all hover:shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.isFeatured && (
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-amber-200">
                            Featured
                          </span>
                        )}
                        {job.isUrgent && (
                          <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-rose-200">
                            Urgent
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">Posted {job.createdAt.split('T')[0]}</span>
                      </div>
                      <h3
                        onClick={() => {
                          setSelectedJob(job);
                          setIsJobDetailsOpen(true);
                        }}
                        className="text-lg font-bold text-slate-900 hover:text-emerald-700 cursor-pointer mt-1 hover:underline"
                      >
                        {job.title}
                      </h3>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-lg font-black text-emerald-700">
                        {job.jobType === 'fixed' ? `$${job.budget}` : `$${job.hourlyRange?.min || 50}-$${job.hourlyRange?.max || 90}/hr`}
                      </div>
                      <span className="text-[11px] text-slate-500 capitalize">{job.jobType} Price • {job.experienceLevel}</span>
                    </div>
                  </div>

                  <p
                    onClick={() => {
                      setSelectedJob(job);
                      setIsJobDetailsOpen(true);
                    }}
                    className="text-slate-600 text-xs leading-relaxed line-clamp-3 cursor-pointer hover:text-slate-800"
                  >
                    {job.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map(s => (
                      <span key={s} className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-md border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Client Info & Apply CTA */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{job.clientRating.toFixed(1)}</span>
                      </div>
                      {job.clientPaymentVerified && (
                        <div className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Payment Verified (${job.clientTotalSpent.toLocaleString()} spent)</span>
                        </div>
                      )}
                      <span>Proposals: {job.proposalsCount}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setIsProposalModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                    >
                      <span>Apply Now</span>
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MY PROPOSALS TAB CONTENT */}
      {activeTab === 'my-proposals' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Submitted Proposals ({proposals.length})</h2>
            <div className="space-y-4">
              {proposals.map(prop => (
                <div key={prop.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider">{prop.status}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{prop.jobId}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-700">${prop.bidAmount}</div>
                      <span className="text-[11px] text-slate-500">Est. Duration: {prop.estimatedDuration}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs whitespace-pre-line line-clamp-2">{prop.coverLetter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CONTRACTS TAB CONTENT */}
      {activeTab === 'my-contracts' && (
        <div className="space-y-4">
          {contracts.map(cnt => (
            <div key={cnt.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-mono px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    ACTIVE CONTRACT
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{cnt.jobTitle}</h3>
                  <p className="text-xs text-slate-500">Client: {cnt.clientName} • Started: {cnt.startDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-700">${cnt.totalBudget} Budget</div>
                  <div className="text-xs text-slate-500">${cnt.escrowBalance} in Escrow • ${cnt.totalPaid} Released</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedContract(cnt);
                    setIsContractModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Clock className="w-4 h-4" />
                  <span>Open Time Tracker & Milestones</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
