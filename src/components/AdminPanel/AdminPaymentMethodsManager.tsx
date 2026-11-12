/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Smartphone,
  Building2,
  Shield,
  CheckCircle2,
  Upload,
  Trash2,
  Lock
} from 'lucide-react';

export const AdminPaymentMethodsManager: React.FC = () => {
  const { paymentSettings, updatePaymentSettings, currentUser } = useApp();

  const [settings, setSettings] = useState(paymentSettings);
  const [successMsg, setSuccessMsg] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center text-red-300">
        <Lock className="w-8 h-8 mx-auto mb-2 text-red-400" />
        <h3 className="font-bold text-lg">Access Denied</h3>
        <p className="text-xs mt-1">Only authorized Super Admin can manage payment methods.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(settings);
    setSuccessMsg('Payment methods and QR codes successfully saved to Firebase Realtime Database!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleQrUpload = (methodKey: 'easypaisa' | 'jazzcash' | 'bankTransfer' | 'customQr', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({
          ...settings,
          [methodKey]: {
            ...settings[methodKey],
            qrCodeUrl: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQr = (methodKey: 'easypaisa' | 'jazzcash' | 'bankTransfer' | 'customQr') => {
    setSettings({
      ...settings,
      [methodKey]: {
        ...settings[methodKey],
        qrCodeUrl: ''
      }
    });
  };

  const methodsList: Array<{ key: 'easypaisa' | 'jazzcash' | 'bankTransfer' | 'customQr'; label: string; icon: any; color: string }> = [
    { key: 'easypaisa', label: 'Easypaisa', icon: Smartphone, color: 'text-emerald-400' },
    { key: 'jazzcash', label: 'JazzCash', icon: Smartphone, color: 'text-red-400' },
    { key: 'bankTransfer', label: 'Bank Transfer / IBAN', icon: Building2, color: 'text-blue-400' },
    { key: 'customQr', label: 'Custom QR Payment', icon: QrCode, color: 'text-amber-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center space-x-1">
            <QrCode className="w-4 h-4" />
            <span>Secure Financial Management</span>
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Payment Methods & <span className="gold-gradient-text">QR Code Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure receiving accounts, upload QR code images, set deposit limits, and enable/disable methods in real-time.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodsList.map(m => {
            const config = settings[m.key];
            const Icon = m.icon;
            return (
              <div
                key={m.key}
                className={`p-6 rounded-2xl bg-slate-900/90 border transition shadow-lg space-y-4 ${
                  config.enabled ? 'border-amber-500/40' : 'border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${m.color}`} />
                    <h3 className="text-base font-bold text-white">{m.label}</h3>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-300">
                      {config.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          [m.key]: { ...config, enabled: e.target.checked }
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500"
                    />
                  </label>
                </div>

                {/* Account Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Account Holder Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={config.accountTitle}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        [m.key]: { ...config, accountTitle: e.target.value }
                      })
                    }
                    placeholder="e.g. EARN4YOU OFFICIAL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Account Number / IBAN */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Account Number or IBAN
                  </label>
                  <input
                    type="text"
                    required
                    value={config.accountNumber}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        [m.key]: { ...config, accountNumber: e.target.value }
                      })
                    }
                    placeholder="e.g. 03049871234 or PK36MEZN..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Payment Instructions for Users
                  </label>
                  <textarea
                    rows={2}
                    value={config.instructions}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        [m.key]: { ...config, instructions: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                </div>

                {/* QR Code Upload / Preview */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">QR Code Image</span>
                    {config.qrCodeUrl && (
                      <button
                        type="button"
                        onClick={() => removeQr(m.key)}
                        className="text-[11px] text-red-400 hover:underline flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete QR</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {config.qrCodeUrl ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-amber-500/40 bg-white p-1 shrink-0">
                        <img
                          src={config.qrCodeUrl}
                          alt={`${m.label} QR`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-[10px] text-center p-1">
                        No QR Uploaded
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload QR Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleQrUpload(m.key, e)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={config.qrCodeUrl || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            [m.key]: { ...config, qrCodeUrl: e.target.value }
                          })
                        }
                        placeholder="Or paste image URL"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Limits */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Global Deposit Limits (PKR)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Minimum Deposit Amount</label>
              <input
                type="number"
                value={settings.minDeposit}
                onChange={e => setSettings({ ...settings, minDeposit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1">Maximum Deposit Amount</label>
              <input
                type="number"
                value={settings.maxDeposit}
                onChange={e => setSettings({ ...settings, maxDeposit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer"
        >
          Save All Payment Methods & QR Codes
        </button>
      </form>
    </div>
  );
};
