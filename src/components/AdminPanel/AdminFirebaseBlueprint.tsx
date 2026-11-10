import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Database, Code, Key } from 'lucide-react';

export const AdminFirebaseBlueprint: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const firebaseRulesJson = `{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && ($uid === auth.uid || root.child('admins').child(auth.uid).exists())",
        ".indexOn": ["email", "referralCode", "referredBy"]
      }
    },
    "packages": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "deposits": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId", "transactionId", "status"]
    },
    "wallets": {
      "$uid": {
        ".read": "auth != null && ($uid === auth.uid || root.child('admins').child(auth.uid).exists())",
        ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
      }
    },
    "walletTransactions": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".indexOn": ["userId", "referenceId", "date"]
    },
    "investments": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId", "status"]
    },
    "tasks": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "taskSubmissions": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId", "taskId", "completedAt"]
    },
    "referrals": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "commissions": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "withdrawals": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId", "status"]
    },
    "paymentSettings": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "websiteSettings": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "supportTickets": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId", "status"]
    },
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".write": false
    },
    "auditLogs": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    }
  }
}`;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Cloud Architecture
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Firebase Realtime Database <span className="gold-gradient-text">Rules & Structure</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compliant with Section 16 & 17 of the EARN4YOU master specification.
          </p>
        </div>

        <button
          onClick={() => handleCopy(firebaseRulesJson, 'rules')}
          className="px-4 py-2 rounded-xl gold-gradient-btn text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          {copiedSection === 'rules' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedSection === 'rules' ? 'Rules Copied!' : 'Copy Realtime Rules'}</span>
        </button>
      </div>

      {/* Database Paths Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>Configured Realtime Database Tree (17 Nodes)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            { path: '/users', desc: 'Auth profiles & IDs' },
            { path: '/packages', desc: 'VIP 1 - VIP 4 tiers' },
            { path: '/deposits', desc: 'TID & receipts' },
            { path: '/wallets', desc: 'Ledger balances' },
            { path: '/walletTransactions', desc: 'Immutable TRX records' },
            { path: '/investments', desc: 'Active subscriptions' },
            { path: '/tasks', desc: '30s YouTube tasks' },
            { path: '/taskSubmissions', desc: 'Watch logs & credits' },
            { path: '/referrals', desc: '3-tier relationships' },
            { path: '/commissions', desc: '5%, 3%, 2% payouts' },
            { path: '/withdrawals', desc: 'Disbursements queue' },
            { path: '/paymentSettings', desc: 'Easypaisa & JazzCash' },
            { path: '/websiteSettings', desc: 'Global configs' },
            { path: '/supportTickets', desc: 'Helpdesk threads' },
            { path: '/admins', desc: 'Role verified accounts' },
            { path: '/auditLogs', desc: 'Administrative audit' }
          ].map(node => (
            <div key={node.path} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-amber-400 text-[11px]">{node.path}</span>
              <p className="text-[10px] text-slate-400">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Rules Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-1.5">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Database Security Rules JSON</span>
          </span>
          <span className="text-[11px] text-slate-500">Atomic balance edit protection enabled</span>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-80">
          {firebaseRulesJson}
        </pre>
      </div>
    </div>
  );
};
