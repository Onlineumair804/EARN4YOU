import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package } from '../../types';
import { Package as PackageIcon, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, ShieldAlert, Zap, Clock } from 'lucide-react';

export const AdminPackageManagement: React.FC = () => {
  const { packages, addPackage, updatePackage, togglePackageStatus, deletePackage } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);

  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('500');
  const [dailyTaskLimit, setDailyTaskLimit] = useState<string>('2');
  const [proposedReturnRate, setProposedReturnRate] = useState<string>('2');
  const [dailyEarningEst, setDailyEarningEst] = useState<string>('10');
  const [description, setDescription] = useState<string>('');
  const [durationDays, setDurationDays] = useState<string>('30');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const openAdd = () => {
    setEditingPkg(null);
    setName(`VIP ${packages.length + 1}`);
    setPrice('1000');
    setDailyTaskLimit('5');
    setProposedReturnRate('2');
    setDailyEarningEst('20');
    setDescription('High reward tier with steady task quotas.');
    setDurationDays('30');
    setIsModalOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPrice(pkg.price.toString());
    setDailyTaskLimit(pkg.dailyTaskLimit.toString());
    setProposedReturnRate(pkg.proposedReturnRate.toString());
    setDailyEarningEst(pkg.dailyEarningEst.toString());
    setDescription(pkg.description);
    setDurationDays(pkg.durationDays.toString());
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price) || 500;
    const numLimit = parseInt(dailyTaskLimit, 10) || 2;
    const numRate = parseFloat(proposedReturnRate) || 2;
    const numDailyEst = parseFloat(dailyEarningEst) || 10;
    const numDays = parseInt(durationDays, 10) || 30;

    if (editingPkg) {
      updatePackage(editingPkg.id, {
        name,
        price: numPrice,
        dailyTaskLimit: numLimit,
        proposedReturnRate: numRate,
        dailyEarningEst: numDailyEst,
        description,
        durationDays: numDays
      });
      setMsg({ text: `Package ${name} updated successfully!`, type: 'success' });
    } else {
      addPackage({
        name,
        price: numPrice,
        dailyTaskLimit: numLimit,
        proposedReturnRate: numRate,
        dailyEarningEst: numDailyEst,
        description,
        durationDays: numDays,
        status: 'active',
        minPurchase: 1,
        maxPurchase: 5
      });
      setMsg({ text: `Package ${name} created successfully!`, type: 'success' });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const res = deletePackage(id);
    if (res.success) {
      setMsg({ text: res.message, type: 'success' });
    } else {
      setMsg({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#181f33] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Catalog Management
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            VIP Package <span className="gold-gradient-text">Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure pricing, daily 30s task allowances, validity durations, and tier active status.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New Package</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
            msg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-500/15 border border-red-500/30 text-red-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-500/40 transition"
          >
            <div>
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <span className="text-sm font-extrabold text-amber-400">
                    Rs. {pkg.price.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    pkg.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {pkg.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Daily Task Quota:</span>
                  <span className="font-bold text-white">{pkg.dailyTaskLimit} Tasks / Day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Return Rate:</span>
                  <span className="font-bold text-emerald-400">{pkg.proposedReturnRate}% / Day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-200">{pkg.durationDays} Days</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => togglePackageStatus(pkg.id)}
                className="text-xs text-slate-400 hover:text-white font-semibold"
              >
                {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEdit(pkg)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingPkg ? `Edit Package: ${editingPkg.name}` : 'Add New VIP Package'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Daily Task Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={dailyTaskLimit}
                    onChange={e => setDailyTaskLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Return Rate (%)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={proposedReturnRate}
                    onChange={e => setProposedReturnRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={durationDays}
                    onChange={e => setDurationDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
