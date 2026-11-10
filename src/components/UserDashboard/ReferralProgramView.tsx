import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReferralProgramView: React.FC = () => {
  const { currentUser, websiteSettings, transactions, users, setActiveTab } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!currentUser) return null;

  const referralLink = `${window.location.origin}?ref=${currentUser.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate earnings per level for this user
  const refTx = transactions.filter(
    t => t.userId === currentUser.id && t.type === 'referral_commission'
  );

  const l1Earnings = refTx
    .filter(t => t.description.toLowerCase().includes('level 1'))
    .reduce((sum, t) => sum + t.amount, 0);

  const l2Earnings = refTx
    .filter(t => t.description.toLowerCase().includes('level 2'))
    .reduce((sum, t) => sum + t.amount, 0);

  const l3Earnings = refTx
    .filter(t => t.description.toLowerCase().includes('level 3'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReferralEarnings = l1Earnings + l2Earnings + l3Earnings;

  // Level 1 members
  const level1Members = users.filter(u => u.referredBy === currentUser.referralCode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Affiliate Network
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            3-Level <span className="gold-gradient-text">Referral System</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Invite friends and investors. Earn up to {websiteSettings.level1CommissionRate + websiteSettings.level2CommissionRate + websiteSettings.level3CommissionRate}% total commissions when your network members purchase VIP packages.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('team')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-2 border border-slate-700 transition cursor-pointer"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>View Team Tree ({level1Members.length} Direct)</span>
        </button>
      </div>

      {/* Shareable Link Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Your Invitation Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">
              Exclusive Referral Link
            </label>
            <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-transparent text-xs text-slate-200 font-mono outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">
              Referral Code
            </label>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                {currentUser.referralCode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUser.referralCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1.5 rounded text-amber-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Tier Commission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Level 1 */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e172e] border border-amber-500/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Level 1 (Direct)
            </span>
            <span className="text-2xl font-black text-amber-400">
              {websiteSettings.level1CommissionRate}%
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Earned when a person directly registered with your code purchases any VIP plan.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Your L1 Earnings:</span>
            <span className="text-lg font-bold text-emerald-400">+Rs. {l1Earnings.toLocaleString()}</span>
          </div>
        </div>

        {/* Level 2 */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e172e] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Level 2 (Indirect)
            </span>
            <span className="text-2xl font-black text-blue-400">
              {websiteSettings.level2CommissionRate}%
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Earned when someone invited by your direct referrals activates an investment package.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Your L2 Earnings:</span>
            <span className="text-lg font-bold text-emerald-400">+Rs. {l2Earnings.toLocaleString()}</span>
          </div>
        </div>

        {/* Level 3 */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e172e] border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Level 3 (Network)
            </span>
            <span className="text-2xl font-black text-purple-400">
              {websiteSettings.level3CommissionRate}%
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Earned on tertiary team package activations across your 3rd generation downline.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-xs text-slate-400">Your L3 Earnings:</span>
            <span className="text-lg font-bold text-emerald-400">+Rs. {l3Earnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1 leading-relaxed">
        <p className="font-bold text-white flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Strict Anti-Abuse Commission Rules</span>
        </p>
        <p>• Signup alone gives NO commission. No free referral bonuses are provided.</p>
        <p>• Deposit alone gives NO commission. The referred user must actively purchase a VIP package.</p>
        <p>• Commissions are immediately and atomically added to your available balance upon package activation.</p>
      </div>
    </div>
  );
};
