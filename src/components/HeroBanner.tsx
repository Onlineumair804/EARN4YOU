import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Headphones,
  Sparkles,
  TrendingUp,
  PlayCircle
} from 'lucide-react';

interface HeroBannerProps {
  onJoinClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onJoinClick }) => {
  const { setActiveTab, currentUser } = useApp();

  return (
    <div className="relative overflow-hidden pt-4 pb-12">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Visual Frame - Using the user-provided banner */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#0c152e] to-[#060a17]">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/20 to-transparent pointer-events-none" />

          {/* The Hero Banner Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/10] max-h-[500px]">
            <img
              src="/assets/aistudio/file_00000000855c8211acd951f3d8fd765e_54a3ba05.png"
              alt="EARN4YOU - Invest, Earn, Grow Together. Your Smart Investment Partner for a Better Tomorrow"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle bottom gradient overlay for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070c1d] via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Floating Quick Action Overlay on larger displays */}
            <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between pointer-events-auto">
              <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-200">
                  Daily 30-Second YouTube Tasks Live Now
                </span>
                <span className="text-xs text-amber-400 font-extrabold">• Instant PKR Credits</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('available-tasks')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-amber-500/40 font-bold text-xs flex items-center space-x-2 transition cursor-pointer backdrop-blur"
                >
                  <PlayCircle className="w-4 h-4 text-red-500" />
                  <span>Start 30s Task</span>
                </button>
                <button
                  onClick={onJoinClick}
                  className="px-6 py-2.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  <span>Join Now & Start Earning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar for Mobile & Tablet */}
        <div className="mt-4 md:hidden flex flex-col sm:flex-row gap-3">
          <button
            onClick={onJoinClick}
            className="w-full py-3.5 px-6 rounded-2xl gold-gradient-btn text-slate-950 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 cursor-pointer"
          >
            <span>Join Now & Start Earning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('available-tasks')}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-red-500" />
            <span>Watch 30-Sec Tasks</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/15 backdrop-blur flex items-center space-x-3 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Secure Platform</h4>
              <p className="text-[11px] text-slate-400">Verified Ledger & Strict RBAC</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/15 backdrop-blur flex items-center space-x-3 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Fast Transactions</h4>
              <p className="text-[11px] text-slate-400">Easypaisa, JazzCash, NayaPay</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/15 backdrop-blur flex items-center space-x-3 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">3-Level Referral</h4>
              <p className="text-[11px] text-slate-400">5% L1 • 3% L2 • 2% L3</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/15 backdrop-blur flex items-center space-x-3 hover:border-amber-500/30 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Support</h4>
              <p className="text-[11px] text-slate-400">Direct WhatsApp & Tickets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
