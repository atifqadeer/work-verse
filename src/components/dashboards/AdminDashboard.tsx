import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  Users,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  Activity,
  Layers,
  Settings,
  Scale
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { disputes, resolveDispute, activityLogs, contracts, activeTab, setActiveTab } = useApp();

  const [selectedDispute, setSelectedDispute] = useState<any>(disputes[0] || null);
  const [refundClient, setRefundClient] = useState<number>(425);
  const [releaseFreelancer, setReleaseFreelancer] = useState<number>(425);
  const [adminNotes, setAdminNotes] = useState<string>('Dispute resolved evenly based on delivered code artifact review.');

  const chartData = [
    { month: 'Jan', revenue: 42000, platformFees: 4200, activeContracts: 18 },
    { month: 'Feb', revenue: 58000, platformFees: 5800, activeContracts: 24 },
    { month: 'Mar', revenue: 71000, platformFees: 7100, activeContracts: 31 },
    { month: 'Apr', revenue: 89000, platformFees: 8900, activeContracts: 42 },
    { month: 'May', revenue: 112000, platformFees: 11200, activeContracts: 58 },
    { month: 'Jun', revenue: 138000, platformFees: 13800, activeContracts: 72 },
    { month: 'Jul', revenue: 154200, platformFees: 15420, activeContracts: 85 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Panel Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded font-mono border border-rose-500/30 uppercase tracking-wider font-semibold">
              SUPER ADMIN CONSOLE
            </span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Full Access Granted</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Platform Operations & Revenue Control</h1>
          <p className="text-slate-300 text-xs mt-1">Monitoring overall financial flows, dispute escalations, and system audit trails.</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center flex-1 sm:flex-none">
            <div className="text-[11px] text-slate-300">Total Marketplace Volume</div>
            <div className="text-lg font-black text-emerald-400">$154,200.00</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 text-center flex-1 sm:flex-none">
            <div className="text-[11px] text-slate-300">Platform Fee Income (10%)</div>
            <div className="text-lg font-black text-rose-400">$15,420.00</div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('admin-analytics')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'admin-analytics' ? 'bg-white text-rose-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Revenue Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('admin-disputes')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'admin-disputes' ? 'bg-white text-rose-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Dispute Resolution Center ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admin-security')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'admin-security' ? 'bg-white text-rose-700 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* REVENUE ANALYTICS TAB */}
      {activeTab === 'admin-analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Revenue Trend Line Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Gross Marketplace Volume ($ USD)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Fees Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-rose-600" />
                <span>Platform Earnings (10% Commission Cut)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                    <Bar dataKey="platformFees" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DISPUTE RESOLUTION TAB */}
      {activeTab === 'admin-disputes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dispute List */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Open Escrow Disputes</h3>
            {disputes.map(disp => (
              <div
                key={disp.id}
                onClick={() => setSelectedDispute(disp)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.id === disp.id ? 'bg-rose-50/50 border-rose-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-rose-700 font-mono font-bold">
                  <span>DISPUTE #{disp.id}</span>
                  <span>${disp.disputedAmount}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{disp.contractTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">Client: {disp.clientName} vs Freelancer: {disp.freelancerName}</p>
              </div>
            ))}
          </div>

          {/* Dispute Adjudication Workspace */}
          {selectedDispute && (
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="bg-rose-50 text-rose-700 text-xs font-mono px-2 py-0.5 rounded border border-rose-200 font-semibold">
                    STATUS: {selectedDispute.status.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedDispute.contractTitle}</h3>
                  <p className="text-xs text-slate-500">Disputed Escrow Pool: ${selectedDispute.disputedAmount}</p>
                </div>
              </div>

              {/* Claims Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase">Client Claim ({selectedDispute.clientName})</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedDispute.clientClaim}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-700 uppercase">Freelancer Counter-Claim ({selectedDispute.freelancerName})</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedDispute.freelancerResponse || 'No response filed yet.'}</p>
                </div>
              </div>

              {/* Resolution Form */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Execute Binding Admin Adjudication</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-medium">Refund Client ($)</label>
                    <input
                      type="number"
                      value={refundClient}
                      onChange={e => setRefundClient(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-medium">Release to Freelancer ($)</label>
                    <input
                      type="number"
                      value={releaseFreelancer}
                      onChange={e => setReleaseFreelancer(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-medium">Admin Official Ruling Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <button
                  onClick={() => {
                    resolveDispute(selectedDispute.id, adminNotes, refundClient, releaseFreelancer);
                    alert(`Dispute resolved! $${refundClient} refunded to client, $${releaseFreelancer} released to freelancer.`);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Binding Escrow Distribution</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SECURITY AUDIT LOGS TAB */}
      {activeTab === 'admin-security' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Real-time Security & System Audit Trail</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User / Persona</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action / Endpoint</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{log.createdAt.replace('T', ' ').substring(0, 19)}</td>
                    <td className="p-3 font-semibold text-slate-900">{log.userName}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono uppercase text-[10px] text-indigo-700 border border-slate-200 font-semibold">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-700 font-medium">{log.action}</td>
                    <td className="p-3 font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
