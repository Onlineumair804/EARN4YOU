import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  Copy,
  Check,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Info,
  Wallet
} from 'lucide-react';

export const DepositView: React.FC = () => {
  const { paymentSettings, submitDeposit, currentUser, deposits, setActiveTab } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'Easypaisa' | 'JazzCash' | 'NayaPay'>('Easypaisa');
  const [amount, setAmount] = useState<string>('1000');
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!currentUser) return null;

  const currentAccount =
    selectedMethod === 'Easypaisa'
      ? paymentSettings.easypaisa
      : selectedMethod === 'JazzCash'
      ? paymentSettings.jazzcash
      : paymentSettings.nayapay;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setResult({ success: false, message: 'Please enter a valid deposit amount.' });
      return;
    }

    if (!transactionId || transactionId.trim().length < 5) {
      setResult({ success: false, message: 'Please enter the complete 11-digit Transaction ID (TID) received in confirmation SMS.' });
      return;
    }

    setSubmitting(true);
    const res = submitDeposit(selectedMethod, numAmount, transactionId.trim(), screenshotPreview);
    setSubmitting(false);
    setResult(res);

    if (res.success) {
      setTransactionId('');
      setScreenshotPreview('');
    }
  };

  const userDeposits = deposits.filter(d => d.userId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1733] to-[#070c1d] border border-amber-500/25 shadow-xl">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
          Deposit Ledger
        </span>
        <h2 className="text-2xl font-black text-white mt-1">
          Deposit Funds Into <span className="gold-gradient-text">EARN4YOU Wallet</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Transfer via Easypaisa, JazzCash, or NayaPay. Enter the Transaction ID (TID) for rapid admin review. Deposits fund your wallet; package purchase is separate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Payment Method Selection & Instructions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
              <span>Select Payment Method</span>
            </h3>

            {/* Methods Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('Easypaisa')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                  selectedMethod === 'Easypaisa'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">Easypaisa</span>
                <span className="text-[10px] text-emerald-400/80">Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('JazzCash')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                  selectedMethod === 'JazzCash'
                    ? 'bg-red-500/10 border-red-500 text-red-400 shadow-md shadow-red-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">JazzCash</span>
                <span className="text-[10px] text-red-400/80">Fast</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NayaPay')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                  selectedMethod === 'NayaPay'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold">NayaPay</span>
                <span className="text-[10px] text-orange-400/80">Zero Fee</span>
              </button>
            </div>

            {/* Admin-Configured Receiving Account Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Payment Receiver</span>
                <span className="text-xs font-bold text-amber-400">{selectedMethod} Official</span>
              </div>

              {/* Account Number */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Account Number</span>
                <div className="flex items-center justify-between mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-mono text-base font-bold text-white tracking-wider">
                    {currentAccount.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(currentAccount.accountNumber, 'accNum')}
                    className="p-1.5 rounded text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'accNum' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Title */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Account Title</span>
                <div className="flex items-center justify-between mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {currentAccount.accountTitle}
                  </span>
                  <button
                    onClick={() => handleCopy(currentAccount.accountTitle, 'accTitle')}
                    className="p-1.5 rounded text-amber-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Copy Title"
                  >
                    {copiedField === 'accTitle' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                {currentAccount.instructions}
              </p>
            </div>

            {/* Limits info */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Min Deposit: Rs. {paymentSettings.minDeposit.toLocaleString()}</span>
              <span>Max Deposit: Rs. {paymentSettings.maxDeposit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Deposit Submission Form */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
              <span>Submit Transaction Details</span>
            </h3>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Deposit Amount (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                  Rs.
                </span>
                <input
                  type="number"
                  min={paymentSettings.minDeposit}
                  max={paymentSettings.maxDeposit}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  placeholder="e.g. 1000"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-bold text-base outline-none transition"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[500, 1000, 2500, 5000, 10000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold cursor-pointer transition"
                  >
                    Rs. {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Transaction ID (TID / TRX ID) <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                required
                placeholder="e.g. EP9081237461 or JC482910"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-mono font-bold text-sm uppercase tracking-wider outline-none transition"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the exact confirmation code received from {selectedMethod}. Duplicate IDs will be rejected.
              </p>
            </div>

            {/* Screenshot proof upload / preview */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Screenshot Proof (Optional but Recommended)
              </label>
              <div className="flex items-center space-x-3">
                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-2 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Choose Receipt Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {screenshotPreview && (
                  <span className="text-xs text-emerald-400 font-medium">
                    Image attached ✓
                  </span>
                )}
              </div>

              {screenshotPreview && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-amber-500/30">
                  <img
                    src={screenshotPreview}
                    alt="Receipt preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshotPreview('')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Status alerts */}
            {result && (
              <div
                className={`p-4 rounded-xl text-xs flex items-center space-x-2.5 ${
                  result.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                    : 'bg-red-500/15 border border-red-500/40 text-red-200'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              {submitting ? 'Submitting Request...' : 'Submit Deposit Request'}
            </button>
          </form>
        </div>
      </div>

      {/* User Deposit History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white">Your Deposit Requests History</h3>

        {userDeposits.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No deposit requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Deposit ID</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Transaction ID (TID)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userDeposits.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-mono font-bold text-slate-300">{d.id}</td>
                    <td className="py-3 font-semibold text-slate-300">{d.paymentMethod}</td>
                    <td className="py-3 font-bold text-amber-400">Rs. {d.amount.toLocaleString()}</td>
                    <td className="py-3 font-mono text-slate-300">{d.transactionId}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          d.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : d.status === 'pending'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {d.status === 'approved'
                        ? 'Wallet Credited'
                        : d.status === 'rejected'
                        ? d.rejectionReason || 'Rejected by Admin'
                        : 'Awaiting Admin Verification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
