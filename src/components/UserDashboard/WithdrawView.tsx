import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowUpRight,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Percent,
  Info
} from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const { paymentSettings, submitWithdrawal, currentUser, getUserWallet, withdrawals, setActiveTab } = useApp();

  const [method, setMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
  const [accountHolderName, setAccountHolderName] = useState<string>(currentUser?.accountDetails.accountHolderName || currentUser?.name || '');
  const [accountNumber, setAccountNumber] = useState<string>(
    currentUser?.accountDetails.easypaisaNumber || ''
  );
  const [amount, setAmount] = useState<string>('500');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!currentUser) return null;
  const wallet = getUserWallet(currentUser.id);

  const numAmount = parseFloat(amount) || 0;
  const feeAmount = (numAmount * paymentSettings.withdrawalFeePercentage) / 100;
  const netAmount = Math.max(0, numAmount - feeAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (numAmount < paymentSettings.minWithdrawal) {
      setResult({
        success: false,
        message: `Minimum withdrawal amount is Rs. ${paymentSettings.minWithdrawal}`
      });
      return;
    }

    if (numAmount > paymentSettings.maxWithdrawal) {
      setResult({
        success: false,
        message: `Maximum withdrawal limit is Rs. ${paymentSettings.maxWithdrawal}`
      });
      return;
    }

    if (wallet.availableBalance < numAmount) {
      setResult({
        success: false,
        message: `Insufficient balance! Your available balance is Rs. ${wallet.availableBalance.toLocaleString()}`
      });
      return;
    }

    if (!accountNumber || accountNumber.trim().length < 8) {
      setResult({
        success: false,
        message: 'Please enter a valid mobile account number.'
      });
      return;
    }

    setSubmitting(true);
    const res = submitWithdrawal(method, accountHolderName.trim(), accountNumber.trim(), numAmount);
    setSubmitting(false);
    setResult(res);

    if (res.success) {
      setAmount('');
    }
  };

  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Withdrawal Terminal
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Cash Out Into <span className="gold-gradient-text">Easypaisa & JazzCash</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Withdraw your verified earnings directly to your mobile wallet. Processing typically takes {paymentSettings.withdrawalProcessingTime}.
          </p>
        </div>

        {/* Current Balance */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Available To Cash Out</span>
            <p className="text-lg font-black text-amber-400">
              Rs. {wallet.availableBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Request Withdrawal
            </h3>

            {/* Method selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Payout Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('Easypaisa');
                    if (currentUser.accountDetails.easypaisaNumber) {
                      setAccountNumber(currentUser.accountDetails.easypaisaNumber);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    method === 'Easypaisa'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold">Easypaisa</span>
                  <span className="text-[10px] text-emerald-400/80">Direct Mobile Payout</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('JazzCash');
                    if (currentUser.accountDetails.jazzcashNumber) {
                      setAccountNumber(currentUser.accountDetails.jazzcashNumber);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    method === 'JazzCash'
                      ? 'bg-red-500/15 border-red-500 text-red-400 shadow-md shadow-red-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold">JazzCash</span>
                  <span className="text-[10px] text-red-400/80">Fast Mobile Payout</span>
                </button>
              </div>
            </div>

            {/* Account Title / Holder Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Holder Full Name
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                required
                placeholder="e.g. Syed Umair"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-medium text-sm outline-none transition"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {method} Account Number (Mobile)
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                required
                placeholder="e.g. 03051234567"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-mono font-bold text-sm outline-none transition"
              />
            </div>

            {/* Withdrawal Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Withdrawal Amount (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                  Rs.
                </span>
                <input
                  type="number"
                  min={paymentSettings.minWithdrawal}
                  max={paymentSettings.maxWithdrawal}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 500"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-bold text-base outline-none transition"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[300, 500, 1000, 2500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold cursor-pointer transition"
                  >
                    Rs. {val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount(wallet.availableBalance.toString())}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold cursor-pointer transition"
                >
                  Max (Rs. {wallet.availableBalance})
                </button>
              </div>
            </div>

            {/* Fee Calculation Breakdown Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Requested Amount:</span>
                <span className="font-bold text-white">Rs. {numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Processing Fee ({paymentSettings.withdrawalFeePercentage}%):</span>
                <span className="font-bold text-amber-400">-Rs. {feeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                <span className="text-slate-200">Net Receivable to Mobile Wallet:</span>
                <span className="text-emerald-400">Rs. {netAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Status alerts */}
            {result && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  result.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                    : 'bg-red-500/15 border border-red-500/40 text-red-200'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || wallet.availableBalance < paymentSettings.minWithdrawal}
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              {submitting ? 'Processing Request...' : 'Confirm & Submit Withdrawal'}
            </button>
          </form>
        </div>

        {/* Withdrawal Policy & Limits Sidebar */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Withdrawal Rules & Limits</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Minimum Payout:</span>
                <span className="font-bold text-white">Rs. {paymentSettings.minWithdrawal.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Maximum Per Request:</span>
                <span className="font-bold text-white">Rs. {paymentSettings.maxWithdrawal.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Service Fee:</span>
                <span className="font-bold text-amber-400">{paymentSettings.withdrawalFeePercentage}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Standard Payout Time:</span>
                <span className="font-bold text-emerald-400">{paymentSettings.withdrawalProcessingTime}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Atomic Security Lock:</p>
              <p>
                When a withdrawal is requested, funds are atomically reserved from your available balance to prevent overdrafts. If rejected by admin, the amount is automatically refunded.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Withdrawal Requests History */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">Your Withdrawal Requests</h3>

        {userWithdrawals.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No withdrawal requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Withdrawal ID</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Account Number</th>
                  <th className="pb-3 font-semibold">Gross</th>
                  <th className="pb-3 font-semibold">Fee (5%)</th>
                  <th className="pb-3 font-semibold">Net Received</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-slate-300">{w.id}</td>
                    <td className="py-3 font-semibold text-slate-300">{w.paymentMethod}</td>
                    <td className="py-3 font-mono text-slate-300">{w.accountNumber}</td>
                    <td className="py-3 font-bold text-slate-200">Rs. {w.amount.toLocaleString()}</td>
                    <td className="py-3 text-slate-400">Rs. {w.fee.toLocaleString()}</td>
                    <td className="py-3 font-black text-emerald-400">Rs. {w.netAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : w.status === 'pending'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : w.status === 'processing'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
