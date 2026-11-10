import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Shield, Package, TrendingUp, Search } from 'lucide-react';

export const MyTeamView: React.FC = () => {
  const { currentUser, users, userPackages, transactions } = useApp();
  const [levelFilter, setLevelFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [search, setSearch] = useState<string>('');

  if (!currentUser) return null;

  // 1. Level 1: users who have referredBy === currentUser.referralCode
  const level1Users = users.filter(u => u.referredBy === currentUser.referralCode);
  const l1Codes = level1Users.map(u => u.referralCode);

  // 2. Level 2: users who have referredBy in l1Codes
  const level2Users = users.filter(u => u.referredBy && l1Codes.includes(u.referredBy));
  const l2Codes = level2Users.map(u => u.referralCode);

  // 3. Level 3: users who have referredBy in l2Codes
  const level3Users = users.filter(u => u.referredBy && l2Codes.includes(u.referredBy));

  // Combine into team items with level tag
  const teamItems = [
    ...level1Users.map(u => ({ ...u, level: 1 })),
    ...level2Users.map(u => ({ ...u, level: 2 })),
    ...level3Users.map(u => ({ ...u, level: 3 }))
  ];

  const filteredTeam = teamItems.filter(member => {
    const matchesLevel = levelFilter === 'all' || member.level.toString() === levelFilter;
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.id.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Downline Network
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            My Referral <span className="gold-gradient-text">Team Tree</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Multi-tier downline structure across Level 1 (Direct), Level 2, and Level 3.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Downline: </span>
            <span className="font-bold text-amber-400">{teamItems.length} Members</span>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member by Name or User ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              levelFilter === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            All Levels ({teamItems.length})
          </button>
          <button
            onClick={() => setLevelFilter('1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              levelFilter === '1'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Level 1 ({level1Users.length})
          </button>
          <button
            onClick={() => setLevelFilter('2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              levelFilter === '2'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Level 2 ({level2Users.length})
          </button>
          <button
            onClick={() => setLevelFilter('3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              levelFilter === '3'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Level 3 ({level3Users.length})
          </button>
        </div>
      </div>

      {/* Team Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        {filteredTeam.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No team members found in this tier. Share your referral link to build your multi-level earning tree!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">User ID</th>
                  <th className="pb-3 font-semibold">Member Name</th>
                  <th className="pb-3 font-semibold">Tier Level</th>
                  <th className="pb-3 font-semibold">Active Packages</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTeam.map(member => {
                  const pkgs = userPackages.filter(
                    p => p.userId === member.id && p.status === 'active'
                  );

                  return (
                    <tr key={member.id} className="hover:bg-slate-800/20">
                      <td className="py-3 font-mono font-bold text-amber-400">{member.id}</td>
                      <td className="py-3 font-medium text-white">{member.name}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            member.level === 1
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : member.level === 2
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          Level {member.level}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 font-semibold">
                        {pkgs.length > 0 ? pkgs.map(p => p.packageName).join(', ') : 'No Package'}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
