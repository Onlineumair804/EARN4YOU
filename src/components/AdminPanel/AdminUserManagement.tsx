import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  DollarSign,
  Lock,
  Edit2,
  Smartphone
} from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const { users, toggleUserBlock, adjustUserBalance, getUserWallet, updateProfile } = useApp();

  const [search, setSearch] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('500');
  const [adjustReason, setAdjustReason] = useState<string>('Administrative incentive');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  const filtered = users.filter(u => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.referralCode.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const num = parseFloat(adjustAmount) || 0;
    adjustUserBalance(selectedUser.id, num, adjustReason);
    setIsAdjustModalOpen(false);
    setMsg(`Wallet adjusted by Rs. ${num} for user ${selectedUser.name}`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            User Operations
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            User <span className="gold-gradient-text">Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search members, view wallet balances, suspend/unblock accounts, and adjust balances.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
          Total Users: <span className="text-amber-400">{users.length}</span>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID (e.g. E4U-78219), Name, Email, or Ref Code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">User ID</th>
                <th className="pb-3 font-semibold">Full Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Referral Code</th>
                <th className="pb-3 font-semibold">Wallet Balance</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(user => {
                const wallet = getUserWallet(user.id);
                return (
                  <tr key={user.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-amber-400">{user.id}</td>
                    <td className="py-3 font-semibold text-white">{user.name}</td>
                    <td className="py-3 text-slate-400">{user.email}</td>
                    <td className="py-3 font-mono text-slate-300">{user.referralCode}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      Rs. {wallet.availableBalance.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsAdjustModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] cursor-pointer"
                              title="Adjust Wallet Balance"
                            >
                              Wallet ±
                            </button>

                            <button
                              onClick={() => toggleUserBlock(user.id)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                                user.status === 'active'
                                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {user.status === 'active' ? 'Block' : 'Unblock'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {isAdjustModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Adjust Wallet for {selectedUser.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">User ID: {selectedUser.id}</p>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Adjustment Amount (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  placeholder="Enter amount (positive to add, negative to deduct)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-bold"
                />
                <span className="text-[10px] text-slate-500">
                  Use negative values (e.g. -200) to deduct funds.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Special bonus or manual correction"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
