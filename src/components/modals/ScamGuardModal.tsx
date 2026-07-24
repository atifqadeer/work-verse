import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ScamGuardModal: React.FC = () => {
  const { isScamGuardModalOpen, setIsScamGuardModalOpen, checkAIScam } = useApp();
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isScamGuardModalOpen) return null;

  const handleScan = async () => {
    if (!inputText) return;
    setIsScanning(true);
    try {
      const res = await checkAIScam(inputText);
      setScanResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">AI Scam & Safety Guard</h2>
          </div>
          <button onClick={() => setIsScamGuardModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <p className="text-xs text-slate-600">
          Paste any suspicious job description, client message, or external link to analyze against phishing, off-platform payment scams, and fraud patterns.
        </p>

        <div className="space-y-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste message or job posting text here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning || !inputText}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
            <span>{isScanning ? 'Scanning with Gemini AI...' : 'Scan Content for Scam Indicators'}</span>
          </button>
        </div>

        {scanResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            scanResult.isFlagged ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {scanResult.isFlagged ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                <span>Safety Rating: {scanResult.safetyScore} / 100 ({scanResult.riskLevel} RISK)</span>
              </span>
            </div>

            <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90">
              {scanResult.reasons?.map((r: string, idx: number) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
