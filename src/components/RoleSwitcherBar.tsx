import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, UserCheck, Briefcase, Building2, Headphones, Eye, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setRole, currentUser } = useApp();

  const roles: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'freelancer', label: 'Freelancer', icon: <UserCheck className="w-4 h-4" />, color: 'bg-emerald-600 text-white' },
    { id: 'client', label: 'Client', icon: <Briefcase className="w-4 h-4" />, color: 'bg-indigo-600 text-white' },
    { id: 'agency', label: 'Agency', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-600 text-white' },
    { id: 'admin', label: 'Admin Panel', icon: <Shield className="w-4 h-4" />, color: 'bg-rose-600 text-white' },
    { id: 'support', label: 'Support Staff', icon: <Headphones className="w-4 h-4" />, color: 'bg-amber-600 text-white' },
    { id: 'guest', label: 'Guest', icon: <Eye className="w-4 h-4" />, color: 'bg-slate-700 text-white' }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-bold tracking-wide uppercase text-indigo-400">
          <Sparkles className="w-4 h-4 animate-pulse text-indigo-400" />
          <span>Perspective Switcher:</span>
        </div>
        <span className="text-slate-400 hidden sm:inline">Explore all 6 role dashboards live:</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {roles.map(r => {
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all text-xs whitespace-nowrap ${
                isActive
                  ? `${r.color} shadow-sm ring-2 ring-offset-1 ring-offset-slate-900 ring-indigo-400`
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-4 text-slate-400">
        <div>
          Active Persona: <strong className="text-white">{currentUser.name}</strong> ({currentRole.toUpperCase()})
        </div>
        {currentRole === 'freelancer' && (
          <div className="flex items-center gap-2 bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
            <span>Connects: {currentUser.connects}</span>
            <span>|</span>
            <span>Wallet: ${currentUser.walletBalance.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
