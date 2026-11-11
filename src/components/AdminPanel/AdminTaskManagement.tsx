import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  Youtube,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Play
} from 'lucide-react';

export const AdminTaskManagement: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, taskSubmissions, packages } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [reward, setReward] = useState<string>('15');
  const [packageId, setPackageId] = useState<string>('pkg-vip-1');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>('');
  const [channelSubscribeUrl, setChannelSubscribeUrl] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [category, setCategory] = useState<'Video Watch' | 'Channel Subscribe' | 'Video & Subscribe'>('Video & Subscribe');

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setInstructions('Watch for 30 seconds inside website player. Subscribe to channel to complete.');
    setReward('15');
    setPackageId('pkg-vip-1');
    setYoutubeVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setChannelSubscribeUrl('https://youtube.com/@earn4you_official?sub_confirmation=1');
    setChannelName('EARN4YOU Network');
    setCategory('Video & Subscribe');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setInstructions(task.instructions);
    setReward(task.reward.toString());
    setPackageId(task.packageId || 'pkg-vip-1');
    setYoutubeVideoUrl(task.youtubeVideoUrl);
    setChannelSubscribeUrl(task.channelSubscribeUrl || '');
    setChannelName(task.channelName || '');
    setCategory(task.category);
    setIsModalOpen(true);
  };

  // Helper to extract clean youtube video id
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'dQw4w9WgXcQ';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractVideoId(youtubeVideoUrl);
    const numReward = parseFloat(reward) || 10;

    if (editingTask) {
      updateTask(editingTask.id, {
        packageId,
        title,
        description,
        instructions,
        reward: numReward,
        youtubeVideoUrl,
        youtubeVideoId: vidId,
        channelSubscribeUrl,
        channelName,
        category,
        durationSeconds: 30
      });
    } else {
      addTask({
        packageId,
        title,
        description,
        instructions,
        reward: numReward,
        youtubeVideoUrl,
        youtubeVideoId: vidId,
        channelSubscribeUrl,
        channelName,
        durationSeconds: 30,
        category,
        status: 'active'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1a1226] to-[#0a0714] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wide flex items-center space-x-1">
              <Youtube className="w-3 h-3 text-white" />
              <span>30-Second Video Engine</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            YouTube Task <span className="gold-gradient-text">Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create sponsored tasks linked to specific VIP Packages. Users only see tasks for their purchased packages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New YouTube Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">Active Task Inventory ({tasks.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map(task => {
            const pkg = packages.find(p => p.id === task.packageId);
            return (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-500/30 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pkg ? pkg.name : 'VIP Package'}
                    </span>
                    <span className="text-xs font-black text-amber-400">
                      +Rs. {task.reward}
                    </span>
                  </div>

                  {/* Video thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-2">
                    <img
                      src={`https://img.youtube.com/vi/${task.youtubeVideoId}/hqdefault.jpg`}
                      alt={task.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-amber-400">
                      30s Required
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{task.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                  {task.channelName && (
                    <p className="text-[11px] text-slate-500 mt-1">Channel: {task.channelName}</p>
                  )}
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      task.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.status === 'active' ? 'Active' : 'Inactive'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Task Submissions Audit Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">
          All User Task Completions Log ({taskSubmissions.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Submission ID</th>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Task Title</th>
                <th className="pb-3 font-semibold">Watch Time</th>
                <th className="pb-3 font-semibold">Reward Paid</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {taskSubmissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-800/20">
                  <td className="py-3 font-mono font-bold text-amber-400">{sub.id}</td>
                  <td className="py-3">
                    <p className="font-bold text-white">{sub.userName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{sub.userId}</p>
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">{sub.taskTitle}</td>
                  <td className="py-3 font-mono text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                      {sub.watchDurationSeconds}s
                    </span>
                  </td>
                  <td className="py-3 font-black text-emerald-400">+Rs. {sub.reward}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                      {sub.status}
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
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {editingTask ? 'Edit YouTube Task' : 'Add New 30-Second YouTube Task'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Watch & Subscribe: Digital Wealth Masterclass"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Assign VIP Package
                  </label>
                  <select
                    value={packageId}
                    onChange={e => setPackageId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-bold"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Rs. {p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Reward Amount (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={reward}
                    onChange={e => setReward(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Video & Subscribe">Video & Subscribe</option>
                    <option value="Video Watch">Video Watch Only</option>
                    <option value="Channel Subscribe">Channel Subscribe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  YouTube Video URL or Video ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={youtubeVideoUrl}
                  onChange={e => setYoutubeVideoUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Channel Subscribe URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/@channel?sub_confirmation=1"
                    value={channelSubscribeUrl}
                    onChange={e => setChannelSubscribeUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EARN4YOU Official"
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Task Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief summary of video content..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Instructions for User
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Watch 30 seconds and subscribe to claim..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
