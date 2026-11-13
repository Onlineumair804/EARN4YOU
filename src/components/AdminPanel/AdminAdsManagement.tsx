/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdsterraBannerView } from '../AdsterraBannerView';
import {
  Megaphone,
  CheckCircle2,
  Lock,
  Eye,
  Save,
  Globe,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminAdsManagement: React.FC = () => {
  const { adsterraSettings, updateAdsterraSettings, currentUser } = useApp();

  const [settings, setSettings] = useState(adsterraSettings);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center text-red-300">
        <Lock className="w-8 h-8 mx-auto mb-2 text-red-400" />
        <h3 className="font-bold text-lg">Access Denied</h3>
        <p className="text-xs mt-1">Only authorized Super Admin can manage global advertisements.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdsterraSettings(settings);
    setSuccessMsg('Global Adsterra Banner code successfully saved and applied to all video tasks automatically!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center space-x-1">
            <Megaphone className="w-4 h-4" />
            <span>Monetization & Advertising</span>
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Global Adsterra <span className="gold-gradient-text">Banner Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paste your Adsterra banner code once. It will automatically appear immediately below the video player on all video tasks across the platform.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        {/* Enable / Disable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Global Adsterra Banner Status</h4>
              <p className="text-xs text-slate-400">
                {settings.enabled ? 'Active: Banner is showing on all video tasks.' : 'Disabled: Banner is hidden from all video tasks.'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Textarea for Ad Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Adsterra Banner HTML / JavaScript Code
            </label>
            <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Applies to All Video Tasks Automatically</span>
            </span>
          </div>
          <textarea
            rows={6}
            value={settings.bannerCode}
            onChange={e => setSettings({ ...settings, bannerCode: e.target.value })}
            placeholder="Paste your Adsterra iframe or script code here..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-500 transition"
          />
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Use original Adsterra banner tags. Do not offer rewards for ad clicks or impressions to comply with network policies.</span>
          </p>
        </div>

        {/* Preview Ad Option */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Live Ad Preview</span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold flex items-center space-x-1.5 cursor-pointer transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Hide Preview' : 'Preview Banner'}</span>
            </button>
          </div>

          {showPreview && (
            <div className="pt-2 border-t border-slate-800">
              <AdsterraBannerView bannerCode={settings.bannerCode} enabled={true} />
            </div>
          )}
        </div>

        {/* Save CTA */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 cursor-pointer transition"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>Save Banner Code & Apply to All Video Tasks</span>
        </button>
      </form>
    </div>
  );
};
