import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Users,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  Zap
} from 'lucide-react';

export const GuestDashboard: React.FC = () => {
  const { jobs, setSelectedJob, setIsJobDetailsOpen, setRole } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Next-Gen AI Powered Freelance Marketplace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Find Top Talent & Build High-Impact Projects with{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Escrow Protection
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Connect with vetted developers, UI designers, and AI specialists. Built-in Gemini AI cover letters, milestone escrow wallets, and real-time messaging.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setRole('freelancer')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <span>Explore as Freelancer</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRole('client')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <span>Post a Job as Client</span>
            <Briefcase className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-2xl font-black text-emerald-700">$150M+</div>
          <div className="text-xs text-slate-500 mt-1">Total Paid to Freelancers</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-2xl font-black text-indigo-700">99.4%</div>
          <div className="text-xs text-slate-500 mt-1">Milestone Completion Rate</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-2xl font-black text-purple-700">100%</div>
          <div className="text-xs text-slate-500 mt-1">AI Scam Guard Security</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-2xl font-black text-amber-600">4.9 / 5</div>
          <div className="text-xs text-slate-500 mt-1">Average Client Rating</div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Featured Open Marketplace Opportunities</h2>
          <button onClick={() => setRole('freelancer')} className="text-emerald-700 text-xs font-bold hover:underline">
            View All ({jobs.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.slice(0, 2).map(j => (
            <div key={j.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{j.category}</span>
                <span className="text-base font-bold text-emerald-700">${j.budget}</span>
              </div>
              <h3
                onClick={() => {
                  setSelectedJob(j);
                  setIsJobDetailsOpen(true);
                }}
                className="font-bold text-slate-900 text-base hover:text-emerald-700 cursor-pointer hover:underline"
              >
                {j.title}
              </h3>
              <p
                onClick={() => {
                  setSelectedJob(j);
                  setIsJobDetailsOpen(true);
                }}
                className="text-slate-600 text-xs line-clamp-2 cursor-pointer"
              >
                {j.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>{j.clientName} ({j.clientLocation})</span>
                <button
                  onClick={() => {
                    setSelectedJob(j);
                    setIsJobDetailsOpen(true);
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
