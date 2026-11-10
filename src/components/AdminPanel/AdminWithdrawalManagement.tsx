import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const AdminWithdrawalManagement: React.FC = () => {
  const { withdrawals, approveWithdrawal, rejectWithdrawal } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [search, setSearch] = useState<string>('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Account details mismatch or network issue');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filtered = withdrawals.filter(w => {
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesSearch =
      w.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.userName.toLowerCase().includes(search.toLowerCase()) ||
      w.accountHolderName.toLowerCase().includes(search.toLowerCase()) ||
      w.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingId) return;
    const res = approveWithdrawal(payingId, paymentRef.trim());
    setPayingId(null);
    setPaymentRef('');
    if (res.success) {
      setActionMsg({ text: res.message, type: 'success' });
    } else {
      setActionMsg({ text: res.message, type: 'error' });
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    const res = rejectWithdrawal(rejectingId, rejectReason);
    setRejectingId(null);
    if (res.success) {
      setActionMsg({ text: res.message, type: 'success' });
    } else {
      setActionMsg({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Disbursement Terminal
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Withdrawal <span className="gold-gradient-text">Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review user cashout requests, mark transfers as paid, or refund balances back to wallets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
            {withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length} Pending Payouts
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
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Mobile No, Name, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['pending', 'paid', 'rejected', 'all'].map(st => (
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
      </div>

      {/* Withdrawals Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No withdrawal requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Withdrawal ID</th>
                  <th className="pb-3 font-semibold">User Details</th>
                  <th className="pb-3 font-semibold">Gateway</th>
                  <th className="pb-3 font-semibold">Account Number</th>
                  <th className="pb-3 font-semibold">Gross</th>
                  <th className="pb-3 font-semibold">Fee (5%)</th>
                  <th className="pb-3 font-semibold">Net Payable</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(w => (
                  <tr key={w.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-amber-400">{w.id}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-bold text-white">{w.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{w.userId}</p>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-slate-200">{w.paymentMethod}</td>
                    <td className="py-3 font-mono font-bold text-white bg-slate-950/60 px-2 py-1 rounded w-max">
                      {w.accountNumber}
                      <span className="text-[10px] text-slate-400 block font-sans font-normal">
                        {w.accountHolderName}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">Rs. {w.amount.toLocaleString()}</td>
                    <td className="py-3 text-slate-400">Rs. {w.fee.toLocaleString()}</td>
                    <td className="py-3 font-black text-emerald-400 text-sm">
                      Rs. {w.netAmount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : w.status === 'pending'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {w.status === 'pending' || w.status === 'processing' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setPayingId(w.id);
                              setPaymentRef(`PAID-${w.paymentMethod.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer transition shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(w.id);
                              setRejectReason('Invalid mobile account number or name mismatch');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold text-xs flex items-center space-x-1 cursor-pointer transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject & Refund</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          {w.status === 'paid' ? `Disbursed (${w.paymentReference || 'Success'})` : w.rejectionReason}
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

      {/* Mark Paid Modal */}
      {payingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Disburse Withdrawal Payment</h3>
            <p className="text-xs text-slate-400">
              Enter the bank/mobile transfer reference number after sending money to the user.
            </p>

            <form onSubmit={handleConfirmPay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Payment Reference / TID
                </label>
                <input
                  type="text"
                  required
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  placeholder="e.g. EP-8492019"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPayingId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Confirm Disbursed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reject & Refund Withdrawal</h3>
            <p className="text-xs text-slate-400">
              The requested amount will be immediately and automatically refunded to the user's available wallet balance.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Specify reason for rejection..."
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
                  Confirm Reject & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
