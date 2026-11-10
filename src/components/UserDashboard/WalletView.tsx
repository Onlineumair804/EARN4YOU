import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Package,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { currentUser, getUserWallet, transactions, setActiveTab } = useApp();

  if (!currentUser) return null;

  const wallet = getUserWallet(currentUser.id);
  const userTx = transactions.filter(t => t.userId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Financial Ledger
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            My <span className="gold-gradient-text">Wallet Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable transaction records, balance breakdown, and verified payouts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs cursor-pointer"
          >
            + Deposit Funds
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
          >
            Cash Out
          </button>
        </div>
      </div>

      {/* 7 Required Wallet Sections from Prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. Available Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#101c40] border border-amber-500/40 shadow-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">1. Available Balance</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            Rs. {wallet.availableBalance.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Spendable or withdrawable</span>
        </div>

        {/* 2. Total Deposit */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">2. Total Deposit</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            Rs. {wallet.totalDeposited.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Approved & verified</span>
        </div>

        {/* 3. Total Package Purchases */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">3. Total Package Purchases</span>
          <p className="text-xl font-bold text-blue-400 mt-1">
            Rs. {wallet.totalPurchased.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">VIP plan allocations</span>
        </div>

        {/* 4. Referral Commission */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">4. Referral Commission</span>
          <p className="text-xl font-bold text-purple-400 mt-1">
            Rs. {wallet.totalReferralEarnings.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">3-Tier network income</span>
        </div>

        {/* 5. Verified Earnings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">5. Verified Earnings</span>
          <p className="text-xl font-bold text-yellow-400 mt-1">
            Rs. {(wallet.totalTaskEarnings + wallet.totalReferralEarnings).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Tasks + Commissions</span>
        </div>

        {/* 6. Withdrawal Amount */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">6. Withdrawal Amount</span>
          <p className="text-xl font-bold text-pink-400 mt-1">
            Rs. {wallet.totalWithdrawn.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Successfully disbursed</span>
        </div>

        {/* 7. Pending Amount */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-[10px] uppercase font-bold text-slate-400">7. Pending Amount</span>
          <p className="text-xl font-bold text-orange-400 mt-1">
            Rs. {(wallet.pendingDeposits + wallet.pendingWithdrawals).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Deposits + Withdrawals</span>
        </div>
      </div>

      {/* Ledger Security Note */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center space-x-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold text-white">Cryptographic Atomic Consistency: </span>
          Balances cannot be manipulated client-side. Every increase or decrease requires a signed, typed, and timestamped ledger transaction.
        </div>
      </div>

      {/* Full Transaction History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">Full Transaction Ledger History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Unique Reference</th>
                <th className="pb-3 font-semibold">User ID</th>
                <th className="pb-3 font-semibold">Transaction Type</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Balance After</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userTx.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/20">
                  <td className="py-3 font-mono font-bold text-amber-300">{tx.referenceId}</td>
                  <td className="py-3 font-mono text-slate-400">{tx.userId}</td>
                  <td className="py-3 font-semibold text-slate-200 capitalize">
                    {tx.type.replace('_', ' ')}
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">{tx.description}</td>
                  <td className="py-3 font-black">
                    <span
                      className={
                        tx.amount > 0
                          ? 'text-emerald-400'
                          : tx.amount < 0
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }
                    >
                      {tx.amount > 0 ? `+Rs. ${tx.amount.toLocaleString()}` : `Rs. ${tx.amount.toLocaleString()}`}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-300">
                    Rs. {tx.balanceAfter.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {new Date(tx.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
