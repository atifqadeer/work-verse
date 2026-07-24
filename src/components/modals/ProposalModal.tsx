import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Send, Coins, Zap, CheckCircle2 } from 'lucide-react';

export const ProposalModal: React.FC = () => {
  const {
    isProposalModalOpen,
    setIsProposalModalOpen,
    selectedJob,
    submitProposal,
    generateAIProposal,
    currentUser
  } = useApp();

  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(selectedJob?.budget || 1000);
  const [estimatedDuration, setEstimatedDuration] = useState('1 month');
  const [boostCredits, setBoostCredits] = useState(4);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  if (!isProposalModalOpen || !selectedJob) return null;

  const handleAIGenerateCoverLetter = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await generateAIProposal(selectedJob.title, selectedJob.description);
      if (res.coverLetter) setCoverLetter(res.coverLetter);
      if (res.recommendedBid) setBidAmount(res.recommendedBid);
      if (res.matchScore) setMatchScore(res.matchScore);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProposal({
      jobId: selectedJob.id,
      coverLetter,
      bidAmount,
      estimatedDuration,
      boostCredits
    });
    setIsProposalModalOpen(false);
  };

  const requiredConnects = 6 + boostCredits;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              <span>Submit Proposal for "{selectedJob.title}"</span>
            </h2>
            <p className="text-xs text-slate-500">Budget: ${selectedJob.budget} • Required Connects: {requiredConnects}</p>
          </div>
          <button onClick={() => setIsProposalModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* AI Cover Letter Generator */}
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Gemini AI Proposal Generator</span>
            </span>

            {matchScore && (
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[11px] px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Match Score: {matchScore}%
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            Draft a tailored cover letter based on job specifications and your bio.
          </p>

          <button
            type="button"
            onClick={handleAIGenerateCoverLetter}
            disabled={isGeneratingAI}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>{isGeneratingAI ? 'Drafting Cover Letter...' : 'Generate Personalized Cover Letter'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Your Bid Amount ($)</label>
              <input
                type="number"
                required
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-emerald-700 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estimated Duration</label>
              <select
                value={estimatedDuration}
                onChange={e => setEstimatedDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="Less than 1 week">Less than 1 week</option>
                <option value="1 to 2 weeks">1 to 2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="1 to 3 months">1 to 3 months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Cover Letter</label>
            <textarea
              rows={6}
              required
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Explain why you are the best fit for this project..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {/* Boost Proposal Connects Option */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>Boost Proposal Rank</span>
            </label>
            <p className="text-[11px] text-slate-500">Spend additional connects to pin your proposal at the top of the client review list.</p>
            
            <div className="flex gap-2 pt-1">
              {[0, 2, 4, 8].map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setBoostCredits(c)}
                  className={`flex-1 py-1.5 rounded-lg font-mono font-bold text-xs border transition-colors ${
                    boostCredits === c ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  +{c} Connects
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available: {currentUser.connects} Connects</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsProposalModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Proposal ({requiredConnects} Connects)</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
