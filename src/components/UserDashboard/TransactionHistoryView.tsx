import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { transactions, currentUser } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!currentUser) return null;

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  const filtered = userTransactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Audit Trails
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Transaction <span className="gold-gradient-text">History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Searchable, verified ledger records for all account activity.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Reference, Keyword, Amount..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'package_purchase', label: 'Packages' },
            { id: 'task_reward', label: 'Tasks' },
            { id: 'referral_commission', label: 'Referrals' },
            { id: 'withdrawal', label: 'Withdrawals' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === f.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No transactions match your search filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Balance After</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-amber-400">{tx.referenceId}</td>
                    <td className="py-3 font-semibold text-slate-200 capitalize">
                      {tx.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 text-slate-300 max-w-sm truncate">{tx.description}</td>
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
        )}
      </div>
    </div>
  );
};
