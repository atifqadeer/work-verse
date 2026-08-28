import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  MessageSquare,
  PlusCircle,
  Coins,
  Wallet,
  ShieldCheck,
  Bot,
  LogOut
} from 'lucide-react';
import {
  canManageBilling,
  canPostJob,
  canSearchJobs,
  canUseConnects,
  canUseMessages,
  canUseNotifications,
  canUseScamGuard,
  canUseSkillTests,
  canUseWallet
} from '../lib/roles';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsPostJobModalOpen,
    setIsChatOpen,
    setIsWalletModalOpen,
    setIsSkillTestModalOpen,
    setIsScamGuardModalOpen,
    notifications,
    markNotificationRead,
    conversations,
    logoutUser,
    goToLogin
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);
  const totalUnreadMsgs = conversations.reduce((acc, c) => acc + (c.unreadCount[currentUser.id] || 0), 0);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab(currentRole === 'client' ? 'client-jobs' : currentRole === 'admin' ? 'admin-analytics' : 'find-work')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                W
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  WorkVerse
                </span>
                <span className="block text-[10px] text-emerald-600 font-mono tracking-wider -mt-1 uppercase font-bold">
                  Marketplace
                </span>
              </div>
            </button>

            {/* Navigation Tabs based on Role */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              {currentRole === 'freelancer' && (
                <>
                  <button
                    onClick={() => setActiveTab('find-work')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'find-work' ? 'bg-slate-100 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Find Work
                  </button>
                  <button
                    onClick={() => setActiveTab('my-proposals')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'my-proposals' ? 'bg-slate-100 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Proposals
                  </button>
                  <button
                    onClick={() => setActiveTab('my-contracts')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'my-contracts' ? 'bg-slate-100 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Contracts
                  </button>
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'wallet' ? 'bg-slate-100 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Wallet & Earnings
                  </button>
                  <button
                    onClick={() => setIsSkillTestModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-slate-600 hover:text-amber-600 transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Skill Tests</span>
                  </button>
                </>
              )}

              {currentRole === 'client' && (
                <>
                  <button
                    onClick={() => setActiveTab('client-jobs')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'client-jobs' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('talent-search')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'talent-search' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Find Talent
                  </button>
                  <button
                    onClick={() => setActiveTab('my-contracts')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'my-contracts' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active Contracts
                  </button>
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'wallet' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Escrow & Invoices
                  </button>
                </>
              )}

              {currentRole === 'agency' && (
                <>
                  <button
                    onClick={() => setActiveTab('agency-overview')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'agency-overview' ? 'bg-slate-100 text-purple-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Agency Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('agency-roster')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'agency-roster' ? 'bg-slate-100 text-purple-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Freelancer Roster
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-analytics')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'admin-analytics' ? 'bg-slate-100 text-rose-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Revenue Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-disputes')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'admin-disputes' ? 'bg-slate-100 text-rose-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dispute Center
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-security')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'admin-security' ? 'bg-slate-100 text-rose-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Security & Logs
                  </button>
                </>
              )}

              {currentRole === 'support' && (
                <>
                  <button
                    onClick={() => setActiveTab('support-tickets')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'support-tickets' ? 'bg-slate-100 text-amber-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Support Queue
                  </button>
                  <button
                    onClick={() => setIsScamGuardModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-slate-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                  >
                    <Bot className="w-4 h-4 text-amber-600" />
                    <span>AI Scam Inspector</span>
                  </button>
                </>
              )}

              {currentRole === 'guest' && (
                <>
                  <button
                    onClick={() => setActiveTab('guest-explore')}
                    className="px-3 py-2 rounded-lg text-emerald-700 font-semibold"
                  >
                    Marketplace Directory
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Search Input */}
          {canSearchJobs(currentRole) && (
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4 relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={currentRole === 'client' ? 'Search freelancers, skills...' : 'Search jobs, projects...'}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
            />
          </div>
          )}

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-3">
            
            {/* Post Job CTA for Clients */}
            {canPostJob(currentRole) && (
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Job</span>
              </button>
            )}

            {canUseScamGuard(currentRole) && (
              <button
                onClick={() => setIsScamGuardModalOpen(true)}
                title="AI Safety & Scam Detection Guard"
                className="hidden sm:flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-indigo-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI ScamGuard</span>
              </button>
            )}

            {canUseConnects(currentRole) && (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.connects} Connects</span>
              </button>
            )}

            {canUseWallet(currentRole) && (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                <span>${currentUser.walletBalance.toFixed(0)}</span>
              </button>
            )}

            {canUseMessages(currentRole) && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Messages & Live Chat"
              >
                <MessageSquare className="w-4 h-4" />
                {totalUnreadMsgs > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalUnreadMsgs}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Dropdown */}
            {canUseNotifications(currentRole) && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
                      <span>Notifications</span>
                      <span className="text-slate-500 font-normal">{notifications.length} total</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.isRead ? 'bg-indigo-50/50 border-l-2 border-indigo-600' : ''
                            }`}
                          >
                            <div className="font-semibold text-slate-800 flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400">{n.createdAt.split('T')[0]}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Avatar & Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-slate-500 text-[11px]">{currentUser.email}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">{currentRole}</p>
                  </div>
                  
                  <div className="py-1">
                    {canManageBilling(currentRole) && (
                      <button
                        onClick={() => { setIsWalletModalOpen(true); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Billing & Payment Methods</span>
                      </button>
                    )}
                    {canUseSkillTests(currentRole) && (
                      <button
                        onClick={() => { setIsSkillTestModalOpen(true); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Skills & Certifications</span>
                      </button>
                    )}
                    {currentRole === 'guest' && (
                      <button
                        onClick={() => { setShowUserMenu(false); goToLogin('freelancer'); }}
                        className="w-full text-left px-3 py-2 text-indigo-700 hover:bg-slate-50 font-semibold"
                      >
                        Sign in to an account
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => { setShowUserMenu(false); logoutUser(); }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{currentRole === 'guest' ? 'Leave guest view' : 'Log out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
