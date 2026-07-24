import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, CreditCard, Coins, CheckCircle2, FileText } from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, currentUser, buyConnects, transactions } = useApp();
  const [depositAmount, setDepositAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'PayPal'>('Stripe');
  const [activeSubTab, setActiveSubTab] = useState<'balance' | 'connects' | 'invoices'>('balance');

  if (!isWalletModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Escrow Wallet & Connects Engine</h2>
          </div>
          <button onClick={() => setIsWalletModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('balance')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'balance' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Balances & Deposits
          </button>
          <button
            onClick={() => setActiveSubTab('connects')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'connects' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Buy Connects Packages
          </button>
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'invoices' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Invoices & Statements
          </button>
        </div>

        {activeSubTab === 'balance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500">Available Wallet Balance</span>
                <div className="text-2xl font-black text-emerald-700">${currentUser.walletBalance.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500">Held in Escrow Pool</span>
                <div className="text-2xl font-black text-indigo-700">${currentUser.escrowBalance.toFixed(2)}</div>
              </div>
            </div>

            {/* Deposit / Withdraw Action */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deposit / Funding Gateway</h4>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono flex-1 focus:outline-none"
                />
                <button
                  onClick={() => alert(`Successfully processed $${depositAmount} deposit via ${paymentMethod}!`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs"
                >
                  Deposit Funds
                </button>
              </div>
            </div>

            {/* Transactions History Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recent Transactions</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {transactions.map(tx => (
                  <div key={tx.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{tx.description}</span>
                      <p className="text-[10px] text-slate-500">{tx.createdAt.split('T')[0]} • {tx.paymentMethod}</p>
                    </div>
                    <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : `${tx.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'connects' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">Connects allow freelancers to submit proposals and boost visibility.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-center space-y-2">
                <div className="text-lg font-black text-emerald-800">20 Connects</div>
                <div className="text-xs text-slate-500">$15.00 USD</div>
                <button
                  onClick={() => buyConnects(20, 15)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs shadow-xs"
                >
                  Purchase Bundle
                </button>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 text-center space-y-2">
                <div className="text-lg font-black text-indigo-800">50 Connects (Pro)</div>
                <div className="text-xs text-slate-500">$35.00 USD</div>
                <button
                  onClick={() => buyConnects(50, 35)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs shadow-xs"
                >
                  Purchase Bundle
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'invoices' && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Invoice #INV-2026-081</span>
                <p className="text-slate-500 text-[11px]">Milestone 1 Release - TechHorizon SaaS</p>
              </div>
              <button
                onClick={() => alert('PDF Invoice generated and downloaded to device!')}
                className="bg-white hover:bg-slate-100 text-amber-700 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
