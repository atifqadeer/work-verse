'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Building2,
  Headphones,
  Lock,
  LogIn,
  Shield,
  UserCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOGIN_ROLES } from '../../lib/roles';
import type { UserRole } from '../../types';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  freelancer: <UserCheck className="w-5 h-5" />,
  client: <Briefcase className="w-5 h-5" />,
  agency: <Building2 className="w-5 h-5" />,
  admin: <Shield className="w-5 h-5" />,
  support: <Headphones className="w-5 h-5" />
};

const ROLE_STYLES: Record<string, string> = {
  freelancer: 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-emerald-500',
  client: 'border-indigo-300 bg-indigo-50 text-indigo-800 ring-indigo-500',
  agency: 'border-purple-300 bg-purple-50 text-purple-800 ring-purple-500',
  admin: 'border-rose-300 bg-rose-50 text-rose-800 ring-rose-500',
  support: 'border-amber-300 bg-amber-50 text-amber-800 ring-amber-500'
};

const DEMO_ACCOUNTS: Record<Exclude<UserRole, 'guest'>, { email: string; name: string }> = {
  freelancer: { email: 'sarah.chen@example.com', name: 'Sarah Chen' },
  client: { email: 'm.vance@techhorizon.io', name: 'Marcus Vance' },
  agency: { email: 'contact@apexdigital.com', name: 'Apex Digital Studio' },
  admin: { email: 'admin@workverse.com', name: 'Elena Rostova' },
  support: { email: 'support.alex@workverse.com', name: 'Alex Rivera' }
};

export const LoginPage: React.FC = () => {
  const { loginUser, loginAsGuest, loginIntentRole } = useApp();
  const [role, setRole] = useState<Exclude<UserRole, 'guest'>>(
    loginIntentRole === 'guest' ? 'freelancer' : (loginIntentRole as Exclude<UserRole, 'guest'>)
  );
  const [email, setEmail] = useState(DEMO_ACCOUNTS.freelancer.email);
  const [password, setPassword] = useState('WorkVerse123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loginIntentRole && loginIntentRole !== 'guest') {
      setRole(loginIntentRole as Exclude<UserRole, 'guest'>);
      setEmail(DEMO_ACCOUNTS[loginIntentRole as Exclude<UserRole, 'guest'>].email);
    }
  }, [loginIntentRole]);

  const selectRole = (next: Exclude<UserRole, 'guest'>) => {
    setRole(next);
    setEmail(DEMO_ACCOUNTS[next].email);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser(email, role, password);
    setLoading(false);
    if (result) setError(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <div className="hidden lg:flex w-[46%] relative overflow-hidden flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-emerald-950">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-black text-xl">
            W
          </div>
          <div>
            <div className="font-extrabold text-2xl tracking-tight">WorkVerse</div>
            <div className="text-[11px] text-emerald-400 font-mono uppercase tracking-widest">Marketplace</div>
          </div>
        </div>

        <div className="space-y-5 max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs text-indigo-200">
            <Sparkles className="w-4 h-4" />
            Role-based access · Escrow protected
          </div>
          <h1 className="text-4xl font-black leading-tight">
            Sign in to the workspace that matches your role.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Freelancers, clients, agencies, admins, and support each get a dedicated dashboard. Options that do not belong to your role stay hidden.
          </p>
        </div>

        <p className="text-xs text-slate-500 font-mono">Demo password for every role: WorkVerse123!</p>
      </div>

      <div className="flex-1 bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-black text-white">
              W
            </div>
            <span className="font-extrabold text-xl">WorkVerse</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Role-based sign in</h2>
              <p className="text-xs text-slate-500 mt-1">Choose your role, then enter that account’s email and password.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOGIN_ROLES.map(item => {
                const active = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectRole(item.id)}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      active ? `${ROLE_STYLES[item.id]} ring-2` : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {ROLE_ICONS[item.id]}
                      <span>{item.label}</span>
                    </div>
                    <p className="text-[11px] mt-1 opacity-80">{item.blurb}</p>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {error && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing in…' : `Sign in as ${LOGIN_ROLES.find(r => r.id === role)?.label}`}</span>
              </button>
            </form>

            <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5" />
                Demo account for this role
              </div>
              <p>{DEMO_ACCOUNTS[role].name} · {DEMO_ACCOUNTS[role].email}</p>
            </div>

            <button
              type="button"
              onClick={() => loginAsGuest()}
              className="w-full text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 py-2"
            >
              <Eye className="w-3.5 h-3.5" />
              Continue as guest (view jobs only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
