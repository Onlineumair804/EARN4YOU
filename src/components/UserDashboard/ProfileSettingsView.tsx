import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User as UserIcon, Shield, Lock, Smartphone, CheckCircle2, Copy } from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [easypaisaNumber, setEasypaisaNumber] = useState<string>(
    currentUser?.accountDetails.easypaisaNumber || ''
  );
  const [jazzcashNumber, setJazzcashNumber] = useState<string>(
    currentUser?.accountDetails.jazzcashNumber || ''
  );
  const [accountHolderName, setAccountHolderName] = useState<string>(
    currentUser?.accountDetails.accountHolderName || ''
  );
  const [newPassword, setNewPassword] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      accountDetails: {
        easypaisaNumber,
        jazzcashNumber,
        accountHolderName
      },
      ...(newPassword ? { password: newPassword } : {})
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
          Account Preferences
        </span>
        <h2 className="text-2xl font-black text-white mt-1">
          Profile & <span className="gold-gradient-text">Withdrawal Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure your personal information, mobile payment accounts, and login security.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account ID & Referral Badge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Unique User ID</span>
            <p className="font-mono text-base font-bold text-amber-400 mt-0.5">{currentUser.id}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Your Referral Code</span>
            <p className="font-mono text-base font-bold text-white mt-0.5">{currentUser.referralCode}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Email Address</span>
            <p className="text-xs font-semibold text-slate-300 mt-0.5 truncate">{currentUser.email}</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-amber-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Mobile Banking Accounts for Fast Cashouts */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Mobile Banking Payout Accounts</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Account Holder Title / Full Name
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                placeholder="e.g. Syed Umair"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Default Easypaisa Mobile Number
                </label>
                <input
                  type="text"
                  value={easypaisaNumber}
                  onChange={e => setEasypaisaNumber(e.target.value)}
                  placeholder="e.g. 03051234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Default JazzCash Mobile Number
                </label>
                <input
                  type="text"
                  value={jazzcashNumber}
                  onChange={e => setJazzcashNumber(e.target.value)}
                  placeholder="e.g. 03051234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Security & Password</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
        </div>

        {/* Saved Alert */}
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and payment settings updated successfully!</span>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer"
        >
          Save All Changes
        </button>
      </form>
    </div>
  );
};
