import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Youtube, Clock, Sparkles, Play } from 'lucide-react';

export const MyTasksView: React.FC = () => {
  const { taskSubmissions, currentUser, setActiveTab } = useApp();

  if (!currentUser) return null;

  const mySubmissions = taskSubmissions.filter(s => s.userId === currentUser.id);
  const totalEarned = mySubmissions.reduce((sum, s) => sum + s.reward, 0);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Work Ledger
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            My Completed <span className="gold-gradient-text">YouTube Tasks</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verification history of 30-second video views and credited rewards.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Task Earnings</span>
            <p className="text-lg font-black text-emerald-400">
              +Rs. {totalEarned.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Task Submission Log</h3>
          <button
            onClick={() => setActiveTab('available-tasks')}
            className="px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Do More Tasks</span>
          </button>
        </div>

        {mySubmissions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            You haven't completed any tasks yet. Go to Available Tasks and watch a 30-second video to earn.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Submission ID</th>
                  <th className="pb-3 font-semibold">Task Title</th>
                  <th className="pb-3 font-semibold">Watch Time</th>
                  <th className="pb-3 font-semibold">Reward Credited</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mySubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-slate-400">{sub.id}</td>
                    <td className="py-3 font-medium text-white max-w-xs truncate flex items-center space-x-2">
                      <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{sub.taskTitle}</span>
                    </td>
                    <td className="py-3 text-slate-300 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {sub.watchDurationSeconds}s
                      </span>
                    </td>
                    <td className="py-3 font-black text-emerald-400">
                      +Rs. {sub.reward}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(sub.completedAt).toLocaleString()}
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
