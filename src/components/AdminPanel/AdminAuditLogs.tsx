import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Clock, UserCheck } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#161f38] to-[#0a1024] border border-amber-500/25 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            Security Compliance
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Admin <span className="gold-gradient-text">Activity Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit record of all financial approvals, balance interventions, and configuration updates.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          Total Logs: <span className="font-bold text-amber-400">{auditLogs.length}</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Log ID</th>
                <th className="pb-3 font-semibold">Administrator</th>
                <th className="pb-3 font-semibold">Action Type</th>
                <th className="pb-3 font-semibold">Event Description</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/20">
                  <td className="py-3 font-mono font-bold text-amber-400">{log.id}</td>
                  <td className="py-3 font-semibold text-white flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{log.adminName}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-md truncate">{log.details}</td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
