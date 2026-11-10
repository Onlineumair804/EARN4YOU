import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Clock, Zap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const MyPackagesView: React.FC = () => {
  const { userPackages, currentUser, setActiveTab, taskSubmissions } = useApp();

  if (!currentUser) return null;

  const today = new Date().toISOString().split('T')[0];
  const myPackages = userPackages.filter(p => p.userId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Investor Portfolio
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            My Active <span className="gold-gradient-text">VIP Packages</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View your purchased packages, daily task quotas, remaining days, and validity terms.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('packages')}
          className="px-5 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
        >
          Buy New VIP Package
        </button>
      </div>

      {myPackages.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Packages Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't activated any VIP packages yet. Choose from VIP 1 (Rs. 500) to VIP 4 (Rs. 5,000) to start earning with daily 30-second YouTube tasks.
          </p>
          <button
            onClick={() => setActiveTab('packages')}
            className="px-6 py-3 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider"
          >
            Explore VIP Packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPackages.map(pkg => {
            const isExpired = new Date(pkg.expiryDate) < new Date();
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(pkg.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            );

            // Calculate tasks completed today for this package
            const doneToday = taskSubmissions.filter(
              s => s.userId === currentUser.id && s.completedAt.startsWith(today)
            ).length;

            return (
              <div
                key={pkg.id}
                className="vip-card-glass rounded-2xl p-6 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {pkg.packageName}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isExpired ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isExpired ? 'Expired' : 'Active • ' + daysLeft + ' Days Left'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Package Price:</span>
                      <span className="font-bold text-white">Rs. {pkg.price.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily 30s Task Limit:</span>
                      <span className="font-bold text-amber-400">{pkg.dailyTaskLimit} Tasks / Day</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Return Rate:</span>
                      <span className="font-bold text-emerald-400">{pkg.proposedReturnRate}% Daily</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Activated On:</span>
                      <span className="text-slate-300">{new Date(pkg.purchaseDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Expires On:</span>
                      <span className="text-slate-300">{new Date(pkg.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Daily Task Quota Progress */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Today's Tasks Done:</span>
                      <span className="font-bold text-amber-300">
                        {doneToday} / {pkg.dailyTaskLimit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-amber-500 to-yellow-400"
                        style={{
                          width: `${Math.min(100, (doneToday / pkg.dailyTaskLimit) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('available-tasks')}
                  className="w-full py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Execute Tasks Now</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
