import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Paperclip, Mic, Search, CheckCheck, Bot } from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    activeConversation,
    messages,
    sendMessage,
    currentUser
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  if (!isChatOpen) return null;

  const currentMsgs = activeConversation
    ? messages.filter(m => m.conversationId === activeConversation.id)
    : [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleSendVoiceNote = async () => {
    await sendMessage('', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setIsRecordingVoice(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white border-l border-slate-200 w-full max-w-lg h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              💬
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Real-time Messaging Engine</h3>
              <p className="text-[11px] text-slate-500">{activeConversation?.jobTitle || 'Direct Client-Freelancer Thread'}</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {currentMsgs.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start'}`}>
                  <div className="text-[10px] text-slate-500 font-mono">{msg.senderName} • {msg.timestamp.split('T')[1]?.substring(0, 5)}</div>
                  
                  {msg.text && (
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {msg.voiceNoteUrl && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>Voice Note Received (0:15)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendVoiceNote}
            className={`p-2 rounded-xl transition-colors ${
              isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-amber-600 border border-slate-200'
            }`}
            title="Simulate Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Type your message or milestone update..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
