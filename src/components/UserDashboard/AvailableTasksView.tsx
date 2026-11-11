import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { TaskModal } from '../TaskModal';
import {
  Play,
  Clock,
  Youtube,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';

export const AvailableTasksView: React.FC = () => {
  const { tasks, currentUser, userPackages, taskSubmissions, setActiveTab } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  if (!currentUser) return null;

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

  // Filter tasks strictly associated with user's active purchased packages
  const activePackageIds = activeUserPackages.map(p => p.packageId);
  const activeTasks = tasks.filter(
    t => t.status === 'active' && activePackageIds.includes(t.packageId)
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0e1633] via-[#091124] to-[#121c3b] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 font-extrabold text-[10px] tracking-wide uppercase flex items-center space-x-1">
              <Youtube className="w-3 h-3 text-red-500" />
              <span>Package-Associated 30-Second Video Tasks</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Available <span className="gold-gradient-text">VIP Package Tasks</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Tasks are dynamically linked to your active VIP packages. Watch for 30 seconds to earn the exact package reward amount configured by administration.
          </p>
        </div>

        {/* Daily Quota Counter Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col items-end shrink-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 font-bold">Daily Tasks Quota</span>
          </div>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-400">{tasksDoneToday}</span>
            <span className="text-slate-400 text-sm font-bold">/ {totalDailyTaskLimit}</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {tasksRemainingToday > 0 ? `${tasksRemainingToday} tasks remaining today` : 'Limit reached for today'}
          </span>
        </div>
      </div>

      {/* Warning if no package purchased */}
      {activeUserPackages.length === 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">VIP Package Required to Unlock Tasks</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                You do not have an active investment package. Purchase a VIP package (e.g. VIP 1) to unlock tasks specifically assigned to that package.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('packages')}
            className="px-5 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
          >
            Explore VIP Packages &rarr;
          </button>
        </div>
      )}

      {/* Tasks Grid */}
      {activeUserPackages.length > 0 && activeTasks.length === 0 && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No tasks currently assigned to your active package(s)</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Administration is currently updating tasks for your VIP tier. Please check back shortly or contact support.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeTasks.map(task => {
          const isDoneToday = taskSubmissions.some(
            s => s.userId === currentUser.id && s.taskId === task.id && s.completedAt.startsWith(today)
          );

          return (
            <div
              key={task.id}
              className="rounded-2xl p-5 bg-gradient-to-b from-slate-900 to-[#0c142b] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-lg group"
            >
              <div>
                {/* Header bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 flex items-center space-x-1">
                    <Youtube className="w-3 h-3 text-red-500" />
                    <span>{task.category}</span>
                  </span>

                  <span className="text-xs font-black text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    +Rs. {task.reward}
                  </span>
                </div>

                {/* Video Preview Frame */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 group-hover:border-amber-500/30 transition">
                  <img
                    src={`https://img.youtube.com/vi/${task.youtubeVideoId}/hqdefault.jpg`}
                    alt={task.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                    <span>30 Sec</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-amber-300 transition">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>

                {task.channelName && (
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
                    <span className="text-slate-500">Channel:</span>
                    <span className="font-semibold text-slate-300">{task.channelName}</span>
                  </p>
                )}
              </div>

              {/* Action area */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                {isDoneToday ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed Today (+Rs. {task.reward})</span>
                  </div>
                ) : tasksRemainingToday === 0 ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center space-x-1 cursor-not-allowed"
                  >
                    <span>Daily Limit Reached</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTask(task)}
                    className="w-full py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Start 30s Task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal Runner */}
      {activeTask && (
        <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
      )}
    </div>
  );
};
