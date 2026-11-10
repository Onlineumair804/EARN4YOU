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
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PackagesView: React.FC = () => {
  const { packages, currentUser, getUserWallet, purchasePackage, setActiveTab, userPackages } = useApp();
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [buying, setBuying] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!currentUser) return null;
  const wallet = getUserWallet(currentUser.id);

  const handlePurchase = (pkgId: string) => {
    setBuying(true);
    setMessage(null);

    const res = purchasePackage(pkgId);
    setBuying(false);

    if (res.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
      setMessage({ text: res.message, type: 'success' });
      setSelectedPkgId(null);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            VIP Investment Packages
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Choose Your <span className="gold-gradient-text">Earning Tier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Each VIP tier unlocks daily 30-second YouTube task slots and estimated daily returns. Manual purchase from your available wallet balance.
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

      {/* Financial Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-amber-500/20 text-xs text-slate-400 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Important Financial & Regulatory Disclosure: </span>
          Earnings are derived from completed sponsored advertiser tasks and actual business revenue. Deposited funds are not auto-compounded; package purchase is a conscious manual activation.
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map(pkg => {
          const isAffordable = wallet.availableBalance >= pkg.price;
          const isUserOwned = userPackages.some(
            up => up.userId === currentUser.id && up.packageId === pkg.id && up.status === 'active'
          );

          return (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                isUserOwned
                  ? 'vip-card-glass border-emerald-500/40 ring-1 ring-emerald-500/30'
                  : 'vip-card-glass hover:scale-[1.02]'
              }`}
            >
              {/* Badge */}
              {isUserOwned ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  Active Package ✓
                </div>
              ) : pkg.name === 'VIP 2' ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              ) : null}

              <div>
                {/* Package Title & Price */}
                <div className="text-center pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Package Plan
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{pkg.name}</h3>
                  <div className="mt-3 flex items-baseline justify-center">
                    <span className="text-sm font-bold text-amber-300 mr-1">Rs.</span>
                    <span className="text-3xl font-black text-white tracking-tight">
                      {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Validity: {pkg.durationDays} Days</span>
                </div>

                {/* Features list */}
                <div className="py-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Daily 30s Tasks</span>
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      {pkg.dailyTaskLimit} Tasks/day
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Proposed Return Rate</span>
                    </span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      {pkg.proposedReturnRate}% / day
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Est. Daily Reward</span>
                    </span>
                    <span className="font-extrabold text-amber-300 text-sm">
                      ~Rs. {pkg.dailyEarningEst}/day
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800">
                {isUserOwned ? (
                  <button
                    onClick={() => setActiveTab('available-tasks')}
                    className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-emerald-500/30 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Go to Daily Tasks</span>
                  </button>
                ) : isAffordable ? (
                  <button
                    disabled={buying}
                    onClick={() => handlePurchase(pkg.id)}
                    className="w-full py-3 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>Purchase with Wallet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <span>Deposit Rs. {(pkg.price - wallet.availableBalance).toLocaleString()} more</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
