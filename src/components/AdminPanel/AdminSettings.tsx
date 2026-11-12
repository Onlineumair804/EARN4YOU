import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Smartphone,
  MessageCircle,
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    paymentSettings,
    updatePaymentSettings,
    whatsappSettings,
    updateWhatsAppSettings,
    websiteSettings,
    updateWebsiteSettings,
    resetAllDataToDefault
  } = useApp();

  // Local form states
  const [payState, setPayState] = useState(paymentSettings);
  const [waState, setWaState] = useState(whatsappSettings);
  const [webState, setWebState] = useState(websiteSettings);
  const [savedMsg, setSavedMsg] = useState<string>('');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(payState);
    updateWhatsAppSettings(waState);
    updateWebsiteSettings(webState);
    setSavedMsg('All platform configurations saved and broadcast to user panel!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            System Administration
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Platform <span className="gold-gradient-text">Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Realtime control of Easypaisa/JazzCash accounts, WhatsApp channel URL, and 3-tier commission rates.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all demo records back to initial factory data?')) {
              resetAllDataToDefault();
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* SECTION 1: WHATSAPP CHANNEL SETTINGS (Specifically requested in Prompt 11 & 15) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Official WhatsApp Channel Settings</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-xs text-slate-400">Show Channel in User Panel:</span>
              <input
                type="checkbox"
                checked={waState.showChannel}
                onChange={e => setWaState({ ...waState, showChannel: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                WhatsApp Channel URL
              </label>
              <input
                type="text"
                required
                value={waState.channelUrl}
                onChange={e => setWaState({ ...waState, channelUrl: e.target.value })}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Channel Display Title
                </label>
                <input
                  type="text"
                  required
                  value={waState.channelTitle}
                  onChange={e => setWaState({ ...waState, channelTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Channel Description
                </label>
                <input
                  type="text"
                  required
                  value={waState.channelDescription}
                  onChange={e => setWaState({ ...waState, channelDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PAYMENT RECEIVING ACCOUNTS (Easypaisa, JazzCash, NayaPay) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Deposit Receiving Accounts Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Easypaisa */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase">Easypaisa Account</span>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Number</label>
                <input
                  type="text"
                  value={payState.easypaisa.accountNumber}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      easypaisa: { ...payState.easypaisa, accountNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Title</label>
                <input
                  type="text"
                  value={payState.easypaisa.accountTitle}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      easypaisa: { ...payState.easypaisa, accountTitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            {/* JazzCash */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-red-400 uppercase">JazzCash Account</span>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Number</label>
                <input
                  type="text"
                  value={payState.jazzcash.accountNumber}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      jazzcash: { ...payState.jazzcash, accountNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Title</label>
                <input
                  type="text"
                  value={payState.jazzcash.accountTitle}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      jazzcash: { ...payState.jazzcash, accountTitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase">Bank Transfer / IBAN</span>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Account / IBAN</label>
                <input
                  type="text"
                  value={payState.bankTransfer.accountNumber}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      bankTransfer: { ...payState.bankTransfer, accountNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Title</label>
                <input
                  type="text"
                  value={payState.bankTransfer.accountTitle}
                  onChange={e =>
                    setPayState({
                      ...payState,
                      bankTransfer: { ...payState.bankTransfer, accountTitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: LIMITS & FEES */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Deposit & Withdrawal Financial Limits</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Min Deposit (PKR)</label>
              <input
                type="number"
                value={payState.minDeposit}
                onChange={e => setPayState({ ...payState, minDeposit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Max Deposit (PKR)</label>
              <input
                type="number"
                value={payState.maxDeposit}
                onChange={e => setPayState({ ...payState, maxDeposit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Min Withdrawal (PKR)</label>
              <input
                type="number"
                value={payState.minWithdrawal}
                onChange={e => setPayState({ ...payState, minWithdrawal: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Withdrawal Fee (%)</label>
              <input
                type="number"
                value={payState.withdrawalFeePercentage}
                onChange={e =>
                  setPayState({ ...payState, withdrawalFeePercentage: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: THREE-LEVEL REFERRAL COMMISSIONS */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>3-Level Referral Commission Rates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1">Level 1 Direct Rate (%)</label>
              <input
                type="number"
                value={webState.level1CommissionRate}
                onChange={e =>
                  setWebState({ ...webState, level1CommissionRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-400 mb-1">Level 2 Indirect Rate (%)</label>
              <input
                type="number"
                value={webState.level2CommissionRate}
                onChange={e =>
                  setWebState({ ...webState, level2CommissionRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-400 mb-1">Level 3 Network Rate (%)</label>
              <input
                type="number"
                value={webState.level3CommissionRate}
                onChange={e =>
                  setWebState({ ...webState, level3CommissionRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          Save All System Settings
        </button>
      </form>
    </div>
  );
};
