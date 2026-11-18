import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package as PackageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  ShieldAlert,
  Wallet,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PackagesView: React.FC = () => {
  const { packages, currentUser, getUserWallet, purchasePackage, setActiveTab, userPackages } = useApp();
  const [customAmount, setCustomAmount] = useState<string>('1000');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [buying, setBuying] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!currentUser) return null;
  const wallet = getUserWallet(currentUser.id);
  const pkg = packages[0] || { id: 'pkg-fixed-plan', name: 'FIXED PLAN', dailyTaskLimit: 5, proposedReturnRate: 2, durationDays: 30 };

  const numAmount = parseFloat(customAmount) || 0;
  const dailyEarning = (numAmount * 2) / 100;
  const totalReturn = numAmount + (dailyEarning * 30);

  const handleActivate = () => {
    setBuying(true);
    setMessage(null);

    if (numAmount < 500 || numAmount > 50000) {
      setMessage({ text: 'Fixed Plan amount must be between PKR 500 and PKR 50,000.', type: 'error' });
      setBuying(false);
      setConfirmModal(false);
      return;
    }

    if (wallet.availableBalance < numAmount) {
      setMessage({
        text: `Insufficient wallet balance! Your available balance is Rs. ${wallet.availableBalance.toLocaleString()}. Please deposit funds first.`,
        type: 'error'
      });
      setBuying(false);
      setConfirmModal(false);
      return;
    }

    const res = purchasePackage(pkg.id, numAmount);
    setBuying(false);
    setConfirmModal(false);

    if (res.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
      setMessage({ text: res.message, type: 'success' });
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  const activeFixedPlans = userPackages.filter(
    up => up.userId === currentUser.id && up.status === 'active' && new Date(up.expiryDate) > new Date()
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Single Fixed Plan System
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            EARN4YOU <span className="gold-gradient-text">Fixed Plan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Invest any custom amount from PKR 500 to PKR 50,000. Earn 2% daily promotional rewards by completing 5 daily 30-second YouTube tasks.
          </p>
        </div>

        {/* Current Wallet Balance Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Available In Wallet</span>
            <p className="text-lg font-black text-amber-400">
              Rs. {wallet.availableBalance.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('deposit')}
            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 gold-gradient-btn"
          >
            + Deposit
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
              : 'bg-red-500/20 border border-red-500/40 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Single Fixed Plan Card & Custom Amount Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  Active Promotional Plan
                </span>
                <h3 className="text-2xl font-black text-white mt-2">FIXED PLAN (Custom Amount)</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Daily Return</span>
                <span className="text-lg font-black text-emerald-400">2.0% / Day</span>
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Enter Investment Amount (PKR 500 – PKR 50,000)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-amber-400">
                  Rs.
                </span>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-black text-xl outline-none transition"
                  placeholder="e.g. 5000"
                />
              </div>

              {/* Quick Amount Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[500, 1000, 2500, 5000, 10000, 25000, 50000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCustomAmount(val.toString())}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      numAmount === val
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    Rs. {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Selected Investment:</span>
                <span className="font-bold text-white text-sm">Rs. {numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Daily Task Allowance:</span>
                <span className="font-bold text-amber-400">5 Daily 30s Tasks</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Daily Earning (2%):</span>
                <span className="font-bold text-emerald-400">~Rs. {dailyEarning.toLocaleString()} / day</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan Duration:</span>
                <span className="font-bold text-slate-200">30 Days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                <span className="text-slate-200">Total Estimated Return (30 Days):</span>
                <span className="text-amber-400">Rs. {totalReturn.toLocaleString()}</span>
              </div>
            </div>

            {/* Activate Button */}
            <button
              onClick={() => setConfirmModal(true)}
              disabled={numAmount < 500 || numAmount > 50000 || wallet.availableBalance < numAmount}
              className="w-full py-4 rounded-2xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Activate Fixed Plan (Rs. {numAmount.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Info & Active Plans */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Fixed Plan Guidelines</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Minimum Investment:</span>
                <span className="font-bold text-white">Rs. 500</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Maximum Investment:</span>
                <span className="font-bold text-white">Rs. 50,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Daily Task Quota:</span>
                <span className="font-bold text-amber-400">5 Tasks / Day</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Validity Period:</span>
                <span className="font-bold text-emerald-400">30 Days</span>
              </div>
            </div>
          </div>

          {/* User Active Plans Summary */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Your Active Plans ({activeActiveCount(activeFixedPlans)})
            </h4>

            {activeFixedPlans.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No active plans at the moment. Activate a Fixed Plan above to unlock daily task earnings.</p>
            ) : (
              <div className="space-y-3">
                {activeFixedPlans.map(up => (
                  <div key={up.id} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-white">{up.packageName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">Active</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Purchased: {new Date(up.purchaseDate).toLocaleDateString()}</span>
                      <span>Expires: {new Date(up.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('available-tasks')}
                      className="w-full mt-2 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                    >
                      <span>Complete Daily Tasks ({up.tasksCompletedToday}/{up.dailyTaskLimit})</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Confirm Plan Activation</h3>
              <p className="text-xs text-slate-400">
                You are about to activate the Fixed Plan with an investment amount of <span className="text-amber-400 font-bold">Rs. {numAmount.toLocaleString()}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Deduction from Wallet:</span>
                <span className="font-bold text-red-400">-Rs. {numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Remaining Wallet Balance:</span>
                <span className="font-bold text-white">Rs. {(wallet.availableBalance - numAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Daily Rewards (2%):</span>
                <span className="font-bold text-emerald-400">+Rs. {dailyEarning.toLocaleString()} / day</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={buying}
                onClick={handleActivate}
                className="flex-1 py-3 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {buying ? 'Activating...' : 'Confirm & Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function activeActiveCount(arr: any[]) {
  return arr.length;
}
