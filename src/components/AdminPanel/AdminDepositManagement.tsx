import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  X
} from 'lucide-react';

export const AdminDepositManagement: React.FC = () => {
  const { deposits, approveDeposit, rejectDeposit } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Invalid Transaction ID or unverified receipt');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filtered = deposits.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || d.paymentMethod === methodFilter;
    const matchesSearch =
      d.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      d.userName.toLowerCase().includes(search.toLowerCase()) ||
      d.userId.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const handleApprove = (id: string) => {
    const res = approveDeposit(id);
    if (res.success) {
      setActionMsg({ text: res.message, type: 'success' });
    } else {
      setActionMsg({ text: res.message, type: 'error' });
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    const res = rejectDeposit(rejectingId, rejectReason);
    setRejectingId(null);
    if (res.success) {
      setActionMsg({ text: res.message, type: 'success' });
    } else {
      setActionMsg({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Administrative Verification
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Deposit <span className="gold-gradient-text">Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted Transaction IDs (TID), verify Easypaisa/JazzCash screenshots, and credit user wallets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold">
            {deposits.filter(d => d.status === 'pending').length} Pending Requests
          </div>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-500/15 border border-red-500/30 text-red-200'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by TID, User ID, Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Status filters */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['pending', 'approved', 'rejected', 'all'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Method filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none"
          >
            <option value="all">All Methods</option>
            <option value="Easypaisa">Easypaisa</option>
            <option value="JazzCash">JazzCash</option>
            <option value="NayaPay">NayaPay</option>
          </select>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No deposits found matching criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Deposit ID</th>
                  <th className="pb-3 font-semibold">User Details</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Transaction ID (TID)</th>
                  <th className="pb-3 font-semibold">Proof Screenshot</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-amber-400">{d.id}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-bold text-white">{d.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{d.userId}</p>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-slate-200">{d.paymentMethod}</td>
                    <td className="py-3 font-black text-amber-400 text-sm">
                      Rs. {d.amount.toLocaleString()}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-200 bg-slate-950/60 px-2 py-1 rounded w-max">
                      {d.transactionId}
                    </td>
                    <td className="py-3">
                      {d.screenshotUrl ? (
                        <button
                          onClick={() => setSelectedScreenshot(d.screenshotUrl!)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 flex items-center space-x-1 border border-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">No Image</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          d.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : d.status === 'pending'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {d.status === 'pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(d.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer transition shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(d.id);
                              setRejectReason('Invalid Transaction ID or unverified receipt');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold text-xs flex items-center space-x-1 cursor-pointer transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          {d.status === 'approved' ? `Approved by ${d.reviewedBy || 'Admin'}` : d.rejectionReason}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h4 className="text-sm font-bold text-white">Payment Receipt Proof</h4>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto flex items-center justify-center bg-slate-950">
              <img
                src={selectedScreenshot}
                alt="Proof screenshot"
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reject Deposit Request</h3>
            <p className="text-xs text-slate-400">
              Specify the reason for rejection. This remark will be visible to the user.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for rejecting this deposit..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-red-500"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
