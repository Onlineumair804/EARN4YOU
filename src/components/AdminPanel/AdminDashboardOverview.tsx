import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  TrendingUp,
  Clock,
  Sparkles,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const {
    users,
    deposits,
    withdrawals,
    packages,
    userPackages,
    taskSubmissions,
    transactions,
    setActiveTab
  } = useApp();

  // 18. ADMIN DASHBOARD STATISTICS (as specified by user prompt):
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const totalDepositsCount = deposits.length;
  const approvedDepositsAmount = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;
  const pendingDepositsAmount = deposits
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPackagePurchases = userPackages.length;
  const activePackagesCount = userPackages.filter(p => p.status === 'active').length;
  const totalPackageVolume = userPackages.reduce((sum, p) => sum + p.price, 0);

  const paidWithdrawalsAmount = withdrawals
    .filter(w => w.status === 'paid' || w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawalsCount = withdrawals.filter(
    w => w.status === 'pending' || w.status === 'processing'
  ).length;
  const pendingWithdrawalsAmount = withdrawals
    .filter(w => w.status === 'pending' || w.status === 'processing')
    .reduce((sum, w) => sum + w.amount, 0);

  const verifiedTaskRewards = taskSubmissions
    .filter(s => s.status === 'approved' || s.status === 'completed')
    .reduce((sum, s) => sum + s.reward, 0);

  const referralCommissionsPaid = transactions
    .filter(t => t.type === 'referral_commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Platform Net Revenue: Total Package Purchases - Task Rewards - Referral Commissions
  const platformRevenue = Math.max(0, totalPackageVolume - (verifiedTaskRewards + referralCommissionsPaid));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171307] via-[#221a08] to-[#0c0903] border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Chief Admin Console
            </span>
            <span className="text-xs text-amber-400 font-mono">Realtime Database Authoritative</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            EARN4YOU Platform <span className="gold-gradient-text">Command Center</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time financial telemetry, deposit verification queues, and system management.
          </p>
        </div>

        {/* Quick Review Indicators */}
        <div className="flex items-center space-x-3">
          {pendingDepositsCount > 0 && (
            <button
              onClick={() => setActiveTab('admin-deposits')}
              className="px-3.5 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold flex items-center space-x-1.5 animate-pulse cursor-pointer"
            >
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{pendingDepositsCount} Deposits Pending</span>
            </button>
          )}

          {pendingWithdrawalsCount > 0 && (
            <button
              onClick={() => setActiveTab('admin-withdrawals')}
              className="px-3.5 py-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center space-x-1.5 animate-pulse cursor-pointer"
            >
              <Clock className="w-4 h-4 text-pink-400" />
              <span>{pendingWithdrawalsCount} Withdrawals Pending</span>
            </button>
          )}
        </div>
      </div>

      {/* 12 Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => setActiveTab('admin-users')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalUsers} Users</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">{activeUsers} Active Accounts</span>
        </div>

        {/* Approved Deposits */}
        <div
          onClick={() => setActiveTab('admin-deposits')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold">
            <span>Approved Deposits</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            Rs. {approvedDepositsAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{deposits.filter(d => d.status === 'approved').length} completed</span>
        </div>

        {/* Pending Deposits */}
        <div
          onClick={() => setActiveTab('admin-deposits')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-yellow-500/30 hover:border-yellow-400 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-yellow-400 text-xs uppercase font-bold">
            <span>Pending Deposits</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-300 mt-2">
            Rs. {pendingDepositsAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-yellow-400 mt-1 block">{pendingDepositsCount} pending review</span>
        </div>

        {/* Total Package Purchases */}
        <div
          onClick={() => setActiveTab('admin-packages')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold">
            <span>Package Volume</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 mt-2">
            Rs. {totalPackageVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{totalPackagePurchases} total activations</span>
        </div>

        {/* Total Withdrawals Paid */}
        <div
          onClick={() => setActiveTab('admin-withdrawals')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold">
            <span>Paid Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 mt-2">
            Rs. {paidWithdrawalsAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Successfully transferred</span>
        </div>

        {/* Pending Withdrawals */}
        <div
          onClick={() => setActiveTab('admin-withdrawals')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/30 hover:border-pink-400 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-pink-400 text-xs uppercase font-bold">
            <span>Pending Withdrawals</span>
            <Clock className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-300 mt-2">
            Rs. {pendingWithdrawalsAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-pink-400 mt-1 block">{pendingWithdrawalsCount} awaiting dispatch</span>
        </div>

        {/* Verified Task Rewards */}
        <div
          onClick={() => setActiveTab('admin-tasks')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase font-bold">
            <span>30s Task Rewards</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2">
            Rs. {verifiedTaskRewards.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{taskSubmissions.length} tasks completed</span>
        </div>

        {/* Platform Revenue */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#1b1502] border border-amber-500/50 shadow-lg">
          <div className="flex justify-between items-center text-amber-400 text-xs uppercase font-bold">
            <span>Platform Revenue</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            Rs. {platformRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Net revenue retained</span>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('admin-deposits')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Manage Deposits ({pendingDepositsCount} Pending)</span>
          </div>
          <p className="text-xs text-slate-400">
            View submitted transaction IDs, Easypaisa/JazzCash receipts, and approve wallet credits.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('admin-tasks')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Manage 30s YouTube Tasks</span>
          </div>
          <p className="text-xs text-slate-400">
            Add new YouTube video URLs, channel subscribe links, edit rewards, and view watch logs.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('admin-settings')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Payment & WhatsApp Config</span>
          </div>
          <p className="text-xs text-slate-400">
            Configure Easypaisa, JazzCash, NayaPay receiving numbers, WhatsApp channel URL, and 3-level commissions.
          </p>
        </div>
      </div>
    </div>
  );
};
