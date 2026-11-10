import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, ExternalLink, ShieldCheck, CheckCircle2, Bell, Users, Zap } from 'lucide-react';

export const WhatsAppChannelView: React.FC = () => {
  const { whatsappSettings } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#071f1a] to-[#041210] border border-emerald-500/30 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
            Verified Community
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Official <span className="text-emerald-400">WhatsApp Channel</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Stay connected directly with EARN4YOU administration and fellow members.
        </p>
      </div>

      {/* Main Channel Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30 mx-auto">
          <MessageCircle className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white">{whatsappSettings.channelTitle}</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            {whatsappSettings.channelDescription}
          </p>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Bell className="w-4 h-4" />
              <span>Daily Tasks Alerts</span>
            </div>
            <p className="text-[11px] text-slate-400">Instant notification when new YouTube tasks are added.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Payment Proofs</span>
            </div>
            <p className="text-[11px] text-slate-400">Live approved withdrawal screenshots & receipts posted daily.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Priority Updates</span>
            </div>
            <p className="text-[11px] text-slate-400">Maintenance alerts, package boosts, and official team contact.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <a
            href={whatsappSettings.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-900/50 hover:scale-105 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Join Official WhatsApp Channel</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-[11px] text-slate-500 mt-2">
            Admin configured URL: {whatsappSettings.channelUrl}
          </p>
        </div>
      </div>
    </div>
  );
};
