import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Package,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Play,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface DashboardOverviewProps {
  onStartTaskClick: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onStartTaskClick }) => {
  const {
    currentUser,
    getUserWallet,
    userPackages,
    taskSubmissions,
    transactions,
    setActiveTab,
    whatsappSettings,
    users
  } = useApp();

  if (!currentUser) return null;

  const wallet = getUserWallet(currentUser.id);
  const today = new Date().toISOString().split('T')[0];

  // Active user packages
  const activeUserPackages = userPackages.filter(
    p => p.userId === currentUser.id && p.status === 'active' && new Date(p.expiryDate) > new Date()
  );

  const totalDailyTaskLimit = activeUserPackages.reduce((sum, p) => sum + p.dailyTaskLimit, 0);
  const tasksDoneToday = taskSubmissions.filter(
    s => s.userId === currentUser.id && s.completedAt.startsWith(today)
  ).length;

  const tasksRemainingToday = Math.max(0, totalDailyTaskLimit - tasksDoneToday);
  const totalEarnings = wallet.totalTaskEarnings + wallet.totalReferralEarnings;

  // Referral count
  const myReferrals = users.filter(u => u.referredBy === currentUser.referralCode);

  return (
    <div className="space-y-6">
      {/* Welcome & ID Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              VIP Investor Account
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">ID: {currentUser.id}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Welcome, <span className="gold-gradient-text">{currentUser.name}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your daily YouTube tasks, wallet withdrawals, and investment yields.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-slate-950" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdraw</span>
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Upgrade VIP</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Grid - All required financial fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Available Wallet Balance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1938] border border-amber-500/30 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            Rs. {wallet.availableBalance.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ready for withdrawal</span>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="text-amber-400 hover:underline font-bold"
            >
              Payout &rarr;
            </button>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Deposits
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Rs. {wallet.totalDeposited.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Pending: Rs. {wallet.pendingDeposits.toLocaleString()}</span>
            <span className="text-emerald-400 font-semibold">Approved</span>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Withdrawals
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Rs. {wallet.totalWithdrawn.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>In Review: Rs. {wallet.pendingWithdrawals.toLocaleString()}</span>
            <span className="text-blue-400 font-semibold">Paid Out</span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Earnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
            +Rs. {totalEarnings.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tasks: Rs. {wallet.totalTaskEarnings}</span>
            <span className="text-purple-400 font-semibold">Ref: Rs. {wallet.totalReferralEarnings}</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Active Packages, Referrals, Pending Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Packages</span>
            <p className="text-sm font-bold text-white">
              {activeUserPackages.length > 0 ? activeUserPackages.map(p => p.packageName).join(', ') : 'None'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Referrals</span>
            <p className="text-sm font-bold text-white">{myReferrals.length} Members</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Deposits</span>
            <p className="text-sm font-bold text-yellow-400">Rs. {wallet.pendingDeposits.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Withdrawals</span>
            <p className="text-sm font-bold text-pink-400">Rs. {wallet.pendingWithdrawals.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Featured 30-Second YouTube Task Banner (Crucial user requirement) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1630] via-[#091124] to-[#121c3b] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] tracking-wide uppercase flex items-center space-x-1">
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>30-Second Video Tasks</span>
              </span>
              <span className="text-xs text-amber-300 font-bold">
                Daily Limit: {tasksDoneToday}/{totalDailyTaskLimit} Completed
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Watch Sponsored Videos for 30s & Earn Direct Wallet Cash
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open active YouTube tasks directly inside the website viewer. After 30 seconds of watch time, the system will automatically credit your wallet according to your VIP package quota!
            </p>

            {/* Task quota progress bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Today's Task Progress</span>
                <span className="font-bold text-amber-400">
                  {totalDailyTaskLimit > 0
                    ? `${Math.round((tasksDoneToday / totalDailyTaskLimit) * 100)}%`
                    : 'No Active Package'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{
                    width: `${totalDailyTaskLimit > 0 ? (tasksDoneToday / totalDailyTaskLimit) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 shrink-0">
            {totalDailyTaskLimit === 0 ? (
              <button
                onClick={() => setActiveTab('packages')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl gold-gradient-btn text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>Activate VIP Package First</span>
              </button>
            ) : tasksRemainingToday > 0 ? (
              <button
                onClick={() => setActiveTab('available-tasks')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 cursor-pointer animate-pulse-gold"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Today's Tasks ({tasksRemainingToday} Left)</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All daily tasks completed for today!</span>
              </div>
            )}

            <button
              onClick={() => setActiveTab('my-tasks')}
              className="text-xs text-slate-400 hover:text-amber-400 font-medium flex items-center space-x-1"
            >
              <span>View Tasks History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Official Channel Card (Admin Controlled) */}
      {whatsappSettings.showChannel && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#071d18] to-emerald-950/40 border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Verified Official Channel
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h4 className="text-base font-bold text-white mt-0.5">
                {whatsappSettings.channelTitle}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                {whatsappSettings.channelDescription}
              </p>
            </div>
          </div>

          <a
            href={whatsappSettings.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shrink-0 shadow-md shadow-emerald-900/50"
          >
            <span>Join WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Recent Ledger Transactions Table Preview */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Recent Transactions Ledger</h4>
            <p className="text-xs text-slate-400">All financial deposits, package purchases, and task credits</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Reference</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions
                .filter(t => t.userId === currentUser.id)
                .slice(0, 5)
                .map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-mono text-slate-300">{tx.referenceId}</td>
                    <td className="py-3">
                      <span className="capitalize font-semibold text-slate-300">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 max-w-xs truncate">{tx.description}</td>
                    <td className="py-3 font-bold">
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
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {new Date(tx.date).toLocaleDateString()}
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
