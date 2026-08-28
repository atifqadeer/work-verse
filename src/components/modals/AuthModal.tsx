import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, LogIn, ShieldCheck, Mail } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, setRole } = useApp();
  const [email, setEmail] = useState('sarah.chen@freelance.io');
  const [password, setPassword] = useState('••••••••••••');
  const [roleSelect, setRoleSelect] = useState<'freelancer' | 'client' | 'agency' | 'admin' | 'support'>('freelancer');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, roleSelect, password);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">WorkVerse Authentication</h2>
          </div>
          <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Social Logins */}
        <div className="space-y-2">
          <button
            onClick={() => { loginUser('google_user@gmail.com', roleSelect, 'WorkVerse123!'); setIsAuthModalOpen(false); }}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Continue with Google Account</span>
          </button>
          
          <button
            onClick={() => { loginUser('github_user@github.com', roleSelect, 'WorkVerse123!'); setIsAuthModalOpen(false); }}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-mono">Or Email Sign In</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Role Persona</label>
            <select
              value={roleSelect}
              onChange={e => setRoleSelect(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            >
              <option value="freelancer">Freelancer Persona (Sarah Chen)</option>
              <option value="client">Client Persona (TechHorizon Inc)</option>
              <option value="agency">Agency Owner (Apex Innovations)</option>
              <option value="admin">Super Admin Console</option>
              <option value="support">Support Agent Queue</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Marketplace</span>
          </button>
        </form>

      </div>
    </div>
  );
};
