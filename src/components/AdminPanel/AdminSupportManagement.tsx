import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const AdminSupportManagement: React.FC = () => {
  const { supportTickets, replySupportTicket } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState<string>('');

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || (supportTickets.length > 0 ? supportTickets[0] : null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !reply.trim()) return;
    replySupportTicket(activeTicket.id, reply.trim());
    setReply('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
          Customer Relations
        </span>
        <h2 className="text-2xl font-black text-white mt-1">
          Support <span className="gold-gradient-text">Tickets Desk</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Direct administrator communication channel with registered platform users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              All Tickets ({supportTickets.length})
            </h3>
            {supportTickets.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No tickets logged.</p>
            ) : (
              <div className="space-y-2">
                {supportTickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      activeTicket?.id === t.id
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] text-amber-400 font-bold">{t.id}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          t.status === 'answered'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1 truncate">{t.subject}</p>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>User: {t.userName}</span>
                      <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="lg:col-span-8">
          {activeTicket ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col h-[520px] justify-between">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {activeTicket.id} • User: {activeTicket.userName} ({activeTicket.userEmail})
                  </span>
                  <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {activeTicket.category}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {activeTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-300">{msg.senderName}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        msg.senderRole === 'admin'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type official admin reply..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              Select a ticket to respond to user inquiry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
