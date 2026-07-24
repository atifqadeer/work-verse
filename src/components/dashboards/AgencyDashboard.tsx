import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Users, DollarSign, Percent, PlusCircle, ShieldCheck, UserPlus, FileText } from 'lucide-react';

export const AgencyDashboard: React.FC = () => {
  const { agencyProfile, freelancerProfile } = useApp();
  const [invitedEmail, setInvitedEmail] = useState('');
  const [commissionRate, setCommissionRate] = useState(agencyProfile.commissionRate);

  const agencyFreelancers = [
    {
      id: 'f1',
      name: 'Sarah Chen',
      title: 'Senior Full Stack Architect',
      rating: 4.95,
      hourlyRate: 85,
      totalEarned: 148200,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'f2',
      name: 'David Miller',
      title: 'UI/UX Design Specialist',
      rating: 4.88,
      hourlyRate: 70,
      totalEarned: 89000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Agency Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-4">
          <img src={agencyProfile.logo} alt={agencyProfile.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/30" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{agencyProfile.name}</h1>
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded font-mono border border-purple-500/30 font-semibold">
                VERIFIED AGENCY
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-1">{agencyProfile.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[11px] text-slate-300">Total Agency Earnings</div>
            <div className="text-lg font-black text-purple-400">${agencyProfile.totalEarnings.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[11px] text-slate-300">Roster Count</div>
            <div className="text-lg font-black text-emerald-400">{agencyFreelancers.length} Freelancers</div>
          </div>
        </div>
      </div>

      {/* Roster & Commission Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Roster List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Agency Freelancer Roster</span>
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="email"
                value={invitedEmail}
                onChange={e => setInvitedEmail(e.target.value)}
                placeholder="freelancer@email.com"
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!invitedEmail) return;
                  alert(`Agency invitation sent to ${invitedEmail}!`);
                  setInvitedEmail('');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {agencyFreelancers.map(member => (
              <div key={member.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/20" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                    <p className="text-xs text-slate-600">{member.title}</p>
                    <span className="text-[11px] text-slate-500 font-mono">${member.hourlyRate}/hr • Earned ${member.totalEarned.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded font-mono border border-emerald-200">
                    {commissionRate}% Agency Split
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Commission Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 h-fit shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-4 h-4 text-purple-600" />
            <span>Commission Split Settings</span>
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed">
            Configure the agency commission deduction applied automatically to contract milestones executed by roster members.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agency Cut (%)</label>
            <input
              type="number"
              value={commissionRate}
              onChange={e => setCommissionRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-mono">
            On a $1,000 milestone: Agency gets ${(1000 * (commissionRate / 100)).toFixed(2)}, Freelancer receives ${(1000 * (1 - commissionRate / 100)).toFixed(2)}.
          </div>
        </div>

      </div>

    </div>
  );
};
