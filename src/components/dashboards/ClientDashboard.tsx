import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Proposal } from '../../types';
import {
  PlusCircle,
  Briefcase,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Star,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  Eye,
  FileText
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    jobs,
    proposals,
    contracts,
    clientProfile,
    freelancerProfile,
    setIsPostJobModalOpen,
    setSelectedJob,
    setIsJobDetailsOpen,
    setIsProposalModalOpen,
    setSelectedContract,
    setIsContractModalOpen,
    releaseMilestoneEscrow,
    activeTab,
    setActiveTab
  } = useApp();

  const [activeJobFilter, setActiveJobFilter] = useState<'open' | 'closed' | 'all'>('open');
  const [selectedProposalForReview, setSelectedProposalForReview] = useState<Proposal | null>(null);

  const clientJobs = jobs.filter(j => j.clientId === 'usr_client_1');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Client Company Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-md font-mono border border-indigo-500/30 uppercase tracking-wider font-semibold">
                Enterprise Client Account
              </span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Method Verified</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{clientProfile.companyName}</h1>
            <p className="text-slate-300 text-xs mt-1">{clientProfile.industry} • {clientProfile.location} • {clientProfile.companySize}</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center flex-1 sm:flex-none">
              <div className="text-[11px] text-slate-300">Total Spent</div>
              <div className="text-lg font-black text-emerald-400">${clientProfile.totalSpent.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center flex-1 sm:flex-none">
              <div className="text-[11px] text-slate-300">Open Jobs</div>
              <div className="text-lg font-black text-indigo-400">{clientJobs.length}</div>
            </div>

            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('client-jobs')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'client-jobs' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Posted Jobs ({clientJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('talent-search')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'talent-search' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Find & Invite Talent</span>
        </button>

        <button
          onClick={() => setActiveTab('my-contracts')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'my-contracts' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Contracts ({contracts.length})</span>
        </button>
      </div>

      {/* MY POSTED JOBS TAB */}
      {activeTab === 'client-jobs' && (
        <div className="space-y-6">
          {clientJobs.map(job => {
            const jobProposals = proposals.filter(p => p.jobId === job.id);

            return (
              <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono border border-emerald-200">
                      {job.status}
                    </span>
                    <h3
                      onClick={() => {
                        setSelectedJob(job);
                        setIsJobDetailsOpen(true);
                      }}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-700 cursor-pointer mt-1 hover:underline"
                    >
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500">{job.category} • Budget: ${job.budget} • {job.jobType}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-200">
                      {jobProposals.length} Proposals Received
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs line-clamp-2">{job.description}</p>

                {/* Received Proposals Accordion / List */}
                {jobProposals.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Received Proposals for this job</span>
                    </h4>

                    {jobProposals.map(prop => (
                      <div key={prop.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img src={prop.freelancerAvatar} alt={prop.freelancerName} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{prop.freelancerName}</span>
                              <span className="text-amber-500 text-xs flex items-center font-semibold">
                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                {prop.freelancerRating} ({prop.freelancerJSS}% JSS)
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{prop.freelancerTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-700">${prop.bidAmount}</div>
                            <span className="text-[10px] text-slate-500">{prop.estimatedDuration}</span>
                          </div>

                          <button
                            onClick={() => setSelectedProposalForReview(prop)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-xs"
                          >
                            Review & Hire
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TALENT SEARCH TAB */}
      {activeTab === 'talent-search' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900">Top Rated Freelancers & Agency Talent</h2>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={freelancerProfile.portfolio[0]?.imageUrl} alt="Freelancer" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Sarah Chen</h3>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-200 font-semibold">
                    VERIFIED EXPERT
                  </span>
                </div>
                <p className="text-xs text-slate-600">{freelancerProfile.headline}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>${freelancerProfile.hourlyRate}/hr</span>
                  <span>•</span>
                  <span>{freelancerProfile.jobSuccessScore}% Job Success</span>
                  <span>•</span>
                  <span>{freelancerProfile.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invite to Job</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE CONTRACTS TAB */}
      {activeTab === 'my-contracts' && (
        <div className="space-y-4">
          {contracts.map(cnt => (
            <div key={cnt.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-mono px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                    CONTRACT IN PROGRESS
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{cnt.jobTitle}</h3>
                  <p className="text-xs text-slate-500">Freelancer: {cnt.freelancerName} • Total Budget: ${cnt.totalBudget}</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-emerald-700">${cnt.escrowBalance} in Escrow</div>
                  <div className="text-xs text-slate-500">${cnt.totalPaid} Released</div>
                </div>
              </div>

              {/* Milestones list for Client Escrow Release */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestone Escrow Approval</h4>
                {cnt.milestones.map(m => (
                  <div key={m.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{m.title}</span>
                      <p className="text-slate-500 text-[11px]">${m.amount} • Due {m.dueDate}</p>
                      {m.submissionNote && (
                        <p className="text-emerald-700 text-[11px] italic mt-0.5 font-medium">Note: {m.submissionNote}</p>
                      )}
                    </div>

                    <div>
                      {m.status === 'submitted' ? (
                        <button
                          onClick={() => releaseMilestoneEscrow(cnt.id, m.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Release ${m.amount}</span>
                        </button>
                      ) : m.status === 'approved' ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Released
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">In Escrow (${m.amount})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROPOSAL REVIEW MODAL */}
      {selectedProposalForReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Review Proposal from {selectedProposalForReview.freelancerName}</h3>
              <button onClick={() => setSelectedProposalForReview(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                <div>
                  <span className="text-slate-500">Bid Amount:</span>
                  <span className="text-emerald-700 font-bold ml-1 text-sm">${selectedProposalForReview.bidAmount}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-slate-800 font-semibold ml-1">{selectedProposalForReview.estimatedDuration}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-semibold uppercase">Cover Letter:</label>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line mt-1 text-slate-800">
                  {selectedProposalForReview.coverLetter}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProposalForReview(null)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  alert(`Contract created and funded into Escrow for $${selectedProposalForReview.bidAmount}!`);
                  setSelectedProposalForReview(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Fund Escrow (${selectedProposalForReview.bidAmount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
