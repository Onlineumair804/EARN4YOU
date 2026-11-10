import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Sparkles, Users, Award, Calendar, CheckCircle2 } from 'lucide-react';

export const EarningsHistoryView: React.FC = () => {
  const { currentUser, transactions } = useApp();

  if (!currentUser) return null;

  const earningTx = transactions.filter(
    t => t.userId === currentUser.id && (t.type === 'task_reward' || t.type === 'referral_commission')
  );

  const totalTask = earningTx
    .filter(t => t.type === 'task_reward')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRef = earningTx
    .filter(t => t.type === 'referral_commission')
    .reduce((sum, t) => sum + t.amount, 0);

  const grandTotal = totalTask + totalRef;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Revenue Analytics
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Earnings <span className="gold-gradient-text">Breakdown</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete record of income from 30-second YouTube tasks and multi-level referral commissions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Grand Total Earned</span>
            <p className="text-xl font-black text-emerald-400">
              +Rs. {grandTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">30s YouTube Tasks</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">
              +Rs. {totalTask.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Direct video views & subscribe tasks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">3-Tier Referral Commissions</span>
            <h3 className="text-2xl font-black text-purple-400 mt-1">
              +Rs. {totalRef.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Network downline package purchases</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">Itemized Earnings Log</h3>

        {earningTx.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No earnings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Income Source</th>
                  <th className="pb-3 font-semibold">Details</th>
                  <th className="pb-3 font-semibold">Amount Credited</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {earningTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-amber-400">{tx.referenceId}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tx.type === 'task_reward'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {tx.type === 'task_reward' ? '30s Task' : 'Referral Comm'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">{tx.description}</td>
                    <td className="py-3 font-black text-emerald-400">+Rs. {tx.amount.toLocaleString()}</td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(tx.date).toLocaleString()}
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
