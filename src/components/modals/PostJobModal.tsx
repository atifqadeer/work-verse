import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export const PostJobModal: React.FC = () => {
  const { isPostJobModalOpen, setIsPostJobModalOpen, createJob, generateAIJobDescription } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web, Mobile & Software Dev');
  const [jobType, setJobType] = useState<'fixed' | 'hourly'>('fixed');
  const [budget, setBudget] = useState(1500);
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'intermediate' | 'expert'>('expert');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isPostJobModalOpen) return null;

  const handleAIGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const res = await generateAIJobDescription(prompt, category, experienceLevel);
      if (res.title) setTitle(res.title);
      if (res.description) setDescription(res.description);
      if (res.suggestedSkills) setSkills(res.suggestedSkills);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob({
      title,
      description,
      category,
      jobType,
      budget,
      experienceLevel,
      skills,
      isFeatured: true
    });
    setIsPostJobModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Post a New Job Opportunity</span>
            </h2>
            <p className="text-xs text-slate-500">Describe your project requirements or use Gemini AI to generate a complete spec.</p>
          </div>
          <button onClick={() => setIsPostJobModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* AI Generator Assist Box */}
        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
          <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Prompt Brief Generator</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Need a full stack React & Express developer to build an AI analytics dashboard..."
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating || !prompt}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Drafting...' : 'Auto-Generate'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer for SaaS AI Engine"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="Web, Mobile & Software Dev">Web, Mobile & Software Dev</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="IT & Networking">IT & Networking</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Job Type & Budget ($)</label>
              <div className="flex gap-2">
                <select
                  value={jobType}
                  onChange={e => setJobType(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Description</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detail deliverables, stack requirements, and timeline..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(false)}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Job to Marketplace</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
