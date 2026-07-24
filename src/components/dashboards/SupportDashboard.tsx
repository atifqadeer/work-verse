import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, ShieldAlert, Bot, CheckCircle2, Search, UserCheck } from 'lucide-react';

export const SupportDashboard: React.FC = () => {
  const { setIsScamGuardModalOpen } = useApp();

  const tickets = [
    {
      id: 'tick_101',
      user: 'Marcus Vance (Client)',
      subject: 'Question on Escrow Hold Duration',
      status: 'open',
      priority: 'normal',
      date: '2026-07-24'
    },
    {
      id: 'tick_102',
      user: 'Sarah Chen (Freelancer)',
      subject: 'Verified Badge Certification Request',
      status: 'in_progress',
      priority: 'high',
      date: '2026-07-23'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Support Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded font-mono border border-amber-500/30 uppercase tracking-wider font-semibold">
              SUPPORT STAFF QUEUE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Customer Success & Platform Safety</h1>
          <p className="text-slate-300 text-xs mt-1">Resolve user tickets, inspect flagged jobs, and approve identity verifications.</p>
        </div>

        <button
          onClick={() => setIsScamGuardModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md"
        >
          <Bot className="w-4 h-4 text-amber-100" />
          <span>Launch AI Scam Inspector</span>
        </button>
      </div>

      {/* Ticket List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Active Support Tickets ({tickets.length})</h2>

        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-700 font-bold">#{t.id}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{t.subject}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Submitted by {t.user} • {t.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded font-mono uppercase">
                  {t.status}
                </span>
                <button
                  onClick={() => alert(`Ticket #${t.id} resolved!`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-xs"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
