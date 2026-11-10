import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';

export const SupportTicketsView: React.FC = () => {
  const { supportTickets, currentUser, createSupportTicket, replySupportTicket } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<'Deposit' | 'Withdrawal' | 'Task' | 'Package' | 'Other'>('Deposit');
  const [message, setMessage] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');

  if (!currentUser) return null;

  const myTickets = supportTickets.filter(t => t.userId === currentUser.id);
  const activeTicket = myTickets.find(t => t.id === activeTicketId) || (myTickets.length > 0 ? myTickets[0] : null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    createSupportTicket(subject, category, message);
    setSubject('');
    setMessage('');
    setShowNewModal(false);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;
    replySupportTicket(activeTicket.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Helpdesk & Support
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Support <span className="gold-gradient-text">Tickets</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Direct 24/7 ticket messaging with EARN4YOU administration.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Your Tickets ({myTickets.length})
            </h3>
            {myTickets.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No open tickets.</p>
            ) : (
              <div className="space-y-2">
                {myTickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
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
                            : t.status === 'open'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1 truncate">{t.subject}</p>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{t.category}</span>
                      <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Messages Pane */}
        <div className="lg:col-span-8">
          {activeTicket ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col h-[520px] justify-between">
              {/* Ticket header */}
              <div className="pb-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    {activeTicket.id} • {activeTicket.category}
                  </span>
                  <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    activeTicket.status === 'answered'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {activeTicket.status}
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {activeTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-300">{msg.senderName}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        msg.senderRole === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReply} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              Select or create a ticket to begin conversation.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Support Ticket</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Deposit">Deposit Issue</option>
                  <option value="Withdrawal">Withdrawal Issue</option>
                  <option value="Task">30-Second Task Issue</option>
                  <option value="Package">Package Inquiry</option>
                  <option value="Other">General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deposit TID verification delay"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about your query..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
