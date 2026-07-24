import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_SKILL_TESTS } from '../../lib/mockData';
import { ShieldCheck, Award, Clock, CheckCircle2 } from 'lucide-react';

export const SkillTestModal: React.FC = () => {
  const { isSkillTestModalOpen, setIsSkillTestModalOpen, freelancerProfile } = useApp();
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isSkillTestModalOpen) return null;

  const handleStartTest = (quiz: any) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setTestResult(null);
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctOptionIndex) correct += 1;
    });
    const score = Math.round((correct / activeQuiz.questions.length) * 100);
    if (score >= activeQuiz.passingScore) {
      setTestResult(`🎉 PASSED (${score}%)! Verified Badge added to your profile.`);
      freelancerProfile.certifications.push({
        id: `cert_${Date.now()}`,
        name: `${activeQuiz.title} - Verified Expert`,
        issuer: 'WorkVerse Skill Testing Standard',
        issueDate: '2026-07-24'
      });
    } else {
      setTestResult(`❌ Score ${score}%. Passing threshold is ${activeQuiz.passingScore}%. You can retake in 24 hours.`);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Skill Verification Assessment</h2>
          </div>
          <button onClick={() => { setIsSkillTestModalOpen(false); setActiveQuiz(null); }} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {!activeQuiz ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">Earn official verified technical badges to increase proposal win rate by up to 300%.</p>
            
            <div className="space-y-3">
              {MOCK_SKILL_TESTS.map(test => (
                <div key={test.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{test.title}</h3>
                    <p className="text-xs text-slate-500">{test.category} • {test.questionsCount} Questions • {test.timeLimitMinutes} Mins</p>
                  </div>
                  <button
                    onClick={() => handleStartTest(test)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    <span>Take Assessment</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{activeQuiz.title}</span>
              <span className="text-amber-700 font-mono font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>10:00 Mins</span>
              </span>
            </div>

            {testResult ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                <p className="text-sm font-bold text-slate-900">{testResult}</p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
                >
                  Back to Assessments
                </button>
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                {activeQuiz.questions.map((q: any, idx: number) => (
                  <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-900">{idx + 1}. {q.question}</p>
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                            answers[q.id] === optIdx ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quiz & Verify Score</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
