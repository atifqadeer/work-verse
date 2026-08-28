'use client';

import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { FreelancerDashboard } from './components/dashboards/FreelancerDashboard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { AgencyDashboard } from './components/dashboards/AgencyDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { SupportDashboard } from './components/dashboards/SupportDashboard';
import { GuestDashboard } from './components/dashboards/GuestDashboard';
import { PostJobModal } from './components/modals/PostJobModal';
import { ProposalModal } from './components/modals/ProposalModal';
import { ChatDrawer } from './components/modals/ChatDrawer';
import { WalletModal } from './components/modals/WalletModal';
import { ContractTrackerModal } from './components/modals/ContractTrackerModal';
import { SkillTestModal } from './components/modals/SkillTestModal';
import { ScamGuardModal } from './components/modals/ScamGuardModal';
import { JobDetailsOffcanvas } from './components/modals/JobDetailsOffcanvas';
import {
  canPostJob,
  canSubmitProposal,
  canUseMessages,
  canUseScamGuard,
  canUseSkillTests,
  canUseWallet
} from './lib/roles';

export function App() {
  const { currentRole, isAuthenticated, authChecked } = useApp();

  const renderDashboard = () => {
    switch (currentRole) {
      case 'freelancer':
        return <FreelancerDashboard />;
      case 'client':
        return <ClientDashboard />;
      case 'agency':
        return <AgencyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'support':
        return <SupportDashboard />;
      case 'guest':
      default:
        return <GuestDashboard />;
    }
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16">
        {renderDashboard()}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm">WorkVerse</span>
            <span className="text-slate-500 font-mono">© 2026 Enterprise Freelance Platform</span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 font-mono text-[11px]">
            <span>Escrow Protected</span>
            <span>•</span>
            <span>Signed in as {currentRole}</span>
          </div>
        </div>
      </footer>

      {canPostJob(currentRole) && <PostJobModal />}
      {canSubmitProposal(currentRole) && <ProposalModal />}
      {canUseMessages(currentRole) && <ChatDrawer />}
      {canUseWallet(currentRole) && <WalletModal />}
      {(currentRole === 'freelancer' || currentRole === 'client') && <ContractTrackerModal />}
      {canUseSkillTests(currentRole) && <SkillTestModal />}
      {canUseScamGuard(currentRole) && <ScamGuardModal />}
      <JobDetailsOffcanvas />
    </div>
  );
}

export default App;
