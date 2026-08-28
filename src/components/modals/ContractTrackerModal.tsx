import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Play, Pause, Camera, CheckCircle2, FileText, Send } from 'lucide-react';

export const ContractTrackerModal: React.FC = () => {
  const {
    isContractModalOpen,
    setIsContractModalOpen,
    selectedContract,
    addTimeTrackerEntry,
    releaseMilestoneEscrow,
    submitMilestone,
    currentRole
  } = useApp();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState('Implementing REST router handlers and UI components');
  const [milestoneNote, setMilestoneNote] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isTimerRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, seconds]);

  if (!isContractModalOpen || !selectedContract) return null;

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveTimer = async () => {
    const hoursLogged = Math.max(0.1, Number((seconds / 3600).toFixed(2)));
    await addTimeTrackerEntry(selectedContract.id, hoursLogged, notes);
    setIsTimerRunning(false);
    setSeconds(0);
    alert(`Logged ${hoursLogged} hours to timesheet!`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Timesheet & Milestone Manager</span>
            </h2>
            <p className="text-xs text-slate-500">{selectedContract.jobTitle}</p>
          </div>
          <button onClick={() => setIsContractModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Stopwatch Section for Freelancer */}
        {currentRole === 'freelancer' && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center space-y-4">
            <div className="text-3xl font-black font-mono text-emerald-700 tracking-wider">
              {formatTime(seconds)}
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Automatic Tracker</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Tracker</span>
                </button>
              )}

              {seconds > 0 && (
                <button
                  onClick={handleSaveTimer}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs"
                >
                  Save Log to Contract
                </button>
              )}
            </div>

            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Session notes for client review..."
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contract Milestones (${selectedContract.totalBudget})</h3>
          {selectedContract.milestones.map(m => (
            <div key={m.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{m.title}</span>
                <span className="text-emerald-700 font-mono font-bold">${m.amount}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Due Date: {m.dueDate}</span>
                <span className="uppercase font-mono text-indigo-700 font-semibold">{m.status}</span>
              </div>

              {currentRole === 'freelancer' && m.status === 'in_escrow' && (
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={milestoneNote}
                    onChange={e => setMilestoneNote(e.target.value)}
                    placeholder="Provide submission details & repository URL..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={async () => {
                      await submitMilestone(
                        selectedContract.id,
                        m.id,
                        milestoneNote || 'Delivered milestone code artifact'
                      );
                      alert('Milestone work submitted to Client for review & escrow release!');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
