import React from 'react';
import { useApp } from '../context/AppContext';
import { Crown, ShieldCheck, MessageCircle, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, whatsappSettings } = useApp();

  return (
    <footer className="mt-16 border-t border-amber-500/20 bg-[#040712] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-wider">
                EARN<span className="gold-gradient-text">4YOU</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your Smart Investment Partner for a Better Tomorrow. Premier daily 30-second YouTube task rewards, VIP investment tiers, and atomic financial wallet system.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Financial Platform</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="hover:text-amber-400 transition"
                >
                  VIP Investment Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('available-tasks')}
                  className="hover:text-amber-400 transition"
                >
                  30s YouTube Video Tasks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('referral')}
                  className="hover:text-amber-400 transition"
                >
                  3-Level Referral Program
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="hover:text-amber-400 transition"
                >
                  Immutable Wallet Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('support')}
                  className="hover:text-amber-400 transition"
                >
                  Helpdesk Support Tickets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Gateways */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Supported Gateways
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Easypaisa</span>
                <span className="text-[10px] text-slate-500">Instant Deposit & Cashout</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-red-400 font-bold">JazzCash</span>
                <span className="text-[10px] text-slate-500">Fast Mobile Banking</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-orange-400 font-bold">NayaPay</span>
                <span className="text-[10px] text-slate-500">Zero Fee Digital Wallet</span>
              </div>
            </div>
          </div>

          {/* Col 4: Community & Support */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Official Community
            </h4>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Connect with 15,000+ members on our official verified WhatsApp Channel for daily tasks, payment withdrawal proofs, and live announcements.
            </p>
            {whatsappSettings.showChannel && (
              <a
                href={whatsappSettings.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Join Official WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Disclaimer / Compliance Notice (Prompt rule: transparent risk disclosure & actual-profit rules) */}
        <div className="pt-8 border-t border-slate-800/80 text-[10px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400">Financial Rules & Transparent Risk Disclosure:</strong>{' '}
            EARN4YOU operates on real advertiser and partner sponsorships. Daily tasks are powered by 30-second YouTube sponsored media and verified digital activities. Depositing money funds your wallet and does not automatically purchase packages or guarantee daily returns. Package purchase is an independent, user-confirmed action.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 text-slate-600 text-[11px]">
            <span>© {new Date().getFullYear()} EARN4YOU. All rights reserved.</span>
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <span className="flex items-center space-x-1 text-slate-500">
                <Lock className="w-3 h-3 text-amber-500" />
                <span>256-Bit SSL Secured Ledger</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
