import React from 'react';
import { useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { FreelancerDashboard } from './components/dashboards/FreelancerDashboard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { AgencyDashboard } from './components/dashboards/AgencyDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { SupportDashboard } from './components/dashboards/SupportDashboard';
import { GuestDashboard } from './components/dashboards/GuestDashboard';

// Modals & Drawers
import { PostJobModal } from './components/modals/PostJobModal';
import { ProposalModal } from './components/modals/ProposalModal';
import { ChatDrawer } from './components/modals/ChatDrawer';
import { WalletModal } from './components/modals/WalletModal';
import { ContractTrackerModal } from './components/modals/ContractTrackerModal';
import { SkillTestModal } from './components/modals/SkillTestModal';
import { ScamGuardModal } from './components/modals/ScamGuardModal';
import { AuthModal } from './components/modals/AuthModal';
import { JobDetailsOffcanvas } from './components/modals/JobDetailsOffcanvas';

export function App() {
  const { currentRole } = useApp();

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Role Simulation Switcher Bar */}
      <RoleSwitcherBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Dynamic Role Dashboard Content */}
      <main className="flex-1 pb-16">
        {renderDashboard()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm">WorkVerse</span>
            <span className="text-slate-500 font-mono">© 2026 Enterprise Freelance Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500 font-mono text-[11px]">
            <span>Escrow Protected</span>
            <span>•</span>
            <span>Gemini AI Engine</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PostJobModal />
      <ProposalModal />
      <ChatDrawer />
      <WalletModal />
      <ContractTrackerModal />
      <SkillTestModal />
      <ScamGuardModal />
      <AuthModal />
      <JobDetailsOffcanvas />
    </div>
  );
}

export default App;
