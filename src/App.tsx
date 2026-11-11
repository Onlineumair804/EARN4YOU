/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { Footer } from './components/Footer';

// User Views
import { DashboardOverview } from './components/UserDashboard/DashboardOverview';
import { PackagesView } from './components/UserDashboard/PackagesView';
import { MyPackagesView } from './components/UserDashboard/MyPackagesView';
import { AvailableTasksView } from './components/UserDashboard/AvailableTasksView';
import { MyTasksView } from './components/UserDashboard/MyTasksView';
import { DepositView } from './components/UserDashboard/DepositView';
import { WithdrawView } from './components/UserDashboard/WithdrawView';
import { WalletView } from './components/UserDashboard/WalletView';
import { TransactionHistoryView } from './components/UserDashboard/TransactionHistoryView';
import { ReferralProgramView } from './components/UserDashboard/ReferralProgramView';
import { MyTeamView } from './components/UserDashboard/MyTeamView';
import { EarningsHistoryView } from './components/UserDashboard/EarningsHistoryView';
import { WhatsAppChannelView } from './components/UserDashboard/WhatsAppChannelView';
import { SupportTicketsView } from './components/UserDashboard/SupportTicketsView';
import { ProfileSettingsView } from './components/UserDashboard/ProfileSettingsView';

// Admin Views
import { AdminDashboardOverview } from './components/AdminPanel/AdminDashboardOverview';
import { AdminUserManagement } from './components/AdminPanel/AdminUserManagement';
import { AdminPackageManagement } from './components/AdminPanel/AdminPackageManagement';
import { AdminDepositManagement } from './components/AdminPanel/AdminDepositManagement';
import { AdminWithdrawalManagement } from './components/AdminPanel/AdminWithdrawalManagement';
import { AdminTaskManagement } from './components/AdminPanel/AdminTaskManagement';
import { AdminSettings } from './components/AdminPanel/AdminSettings';
import { AdminSupportManagement } from './components/AdminPanel/AdminSupportManagement';
import { AdminAuditLogs } from './components/AdminPanel/AdminAuditLogs';
import { AdminFirebaseBlueprint } from './components/AdminPanel/AdminFirebaseBlueprint';

// Auth Modals
import { LoginModal } from './components/Auth/LoginModal';
import { RegisterModal } from './components/Auth/RegisterModal';
import { ForgotPasswordModal } from './components/Auth/ForgotPasswordModal';

import {
  LayoutDashboard,
  Package,
  Layers,
  CheckSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  History,
  Users,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Settings,
  Shield,
  FileCode2,
  ListOrdered,
  ChevronRight,
  Play,
  Lock,
  Mail,
  AlertCircle,
  Crown
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, deposits, withdrawals, login } = useApp();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Dedicated Admin Login State
  const [adminEmail, setAdminEmail] = useState('syedumair56300@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const isAtAdminPath = window.location.pathname.startsWith('/admin');
  const isAdmin = currentUser?.role === 'admin';

  // Handle URL path synchronization on mount and history changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        if (currentUser?.role === 'admin' && !activeTab.startsWith('admin-')) {
          setActiveTab('admin-overview');
        }
      } else {
        if (activeTab.startsWith('admin-')) {
          setActiveTab('dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser, activeTab, setActiveTab]);

  // Handle tab & path navigation
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setActiveTab('admin-overview');
  };

  const navigateToUser = () => {
    window.history.pushState({}, '', '/');
    setActiveTab('dashboard');
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    const res = await login(adminEmail, adminPassword);
    setAdminLoading(false);

    if (res.success) {
      window.history.pushState({}, '', '/admin');
      setActiveTab('admin-overview');
    } else {
      setAdminError(res.message);
    }
  };

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length;

  const userNavItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'packages', label: '2. Investment Packages', icon: Package },
    { id: 'my-packages', label: '3. My Packages', icon: Layers },
    { id: 'available-tasks', label: '4. Available Tasks (30s)', icon: Play, badge: 'HOT' },
    { id: 'my-tasks', label: '5. My Tasks', icon: CheckSquare },
    { id: 'deposit', label: '6. Deposit', icon: ArrowDownLeft },
    { id: 'withdraw', label: '7. Withdraw', icon: ArrowUpRight },
    { id: 'wallet', label: '8. My Wallet', icon: Wallet },
    { id: 'transactions', label: '9. Transaction History', icon: History },
    { id: 'referral', label: '10. Referral Program', icon: Users },
    { id: 'team', label: '11. My Team (3 Levels)', icon: Layers },
    { id: 'earnings', label: '12. Earnings History', icon: TrendingUp },
    { id: 'whatsapp', label: '13. WhatsApp Channel', icon: MessageCircle },
    { id: 'support', label: '14. Support Desk', icon: HelpCircle },
    { id: 'profile', label: '15. Profile Settings', icon: Settings }
  ];

  const adminNavItems = [
    { id: 'admin-overview', label: 'Analytics & KPIs', icon: LayoutDashboard },
    { id: 'admin-deposits', label: 'Deposit Requests', icon: ArrowDownLeft, count: pendingDeposits },
    { id: 'admin-withdrawals', label: 'Withdrawal Approvals', icon: ArrowUpRight, count: pendingWithdrawals },
    { id: 'admin-tasks', label: '30s YouTube Tasks', icon: Play },
    { id: 'admin-packages', label: 'Package Management', icon: Package },
    { id: 'admin-users', label: 'All Users & Wallets', icon: Users },
    { id: 'admin-settings', label: 'Payment & WhatsApp Settings', icon: Settings },
    { id: 'admin-support', label: 'Support Tickets', icon: HelpCircle },
    { id: 'admin-audit', label: 'Audit Activity Logs', icon: ListOrdered },
    { id: 'admin-firebase', label: 'Firebase Realtime Schema', icon: FileCode2 }
  ];

  // IF VISITING /admin DIRECTLY:
  if (isAtAdminPath) {
    // If user is logged in as normal user, deny access and redirect to dashboard
    if (currentUser && currentUser.role !== 'admin') {
      navigateToUser();
    }

    // If not logged in as admin, show dedicated Admin Login screen at /admin
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex flex-col bg-[#030612] text-slate-100 justify-center items-center px-4 py-12">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-[#0c142b] to-[#050814] rounded-3xl border border-amber-500/40 shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-lg shadow-amber-500/20">
                <Shield className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-white">
                EARN<span className="gold-gradient-text">4YOU</span> Admin
              </h1>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Authorized Super Admin Access Only (/admin)
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Super Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    placeholder="syedumair56300@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                {adminLoading ? 'Verifying Super Admin...' : 'Access Admin Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={navigateToUser}
                className="text-xs text-slate-400 hover:text-amber-400 font-semibold transition"
              >
                &larr; Return to Website Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100">
      {/* Main Navbar */}
      <Navbar
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Hero Banner (Always shown on dashboard) */}
      {activeTab === 'dashboard' && !activeTab.startsWith('admin-') && (
        <HeroBanner onJoinClick={() => setActiveTab('packages')} />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Selector Bar */}
        <div className="mb-6 p-2 rounded-2xl bg-[#090f24] border border-amber-500/20 shadow-lg">
          {activeTab.startsWith('admin-') && isAdmin ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Master Domain Panel (/admin)</span>
                </span>
                <button
                  onClick={navigateToUser}
                  className="text-xs text-slate-400 hover:text-amber-400 font-semibold"
                >
                  &larr; Return to User Panel
                </button>
              </div>
              <div className="flex overflow-x-auto space-x-1.5 pb-1">
                {adminNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
                        isActive
                          ? 'gold-gradient-btn text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                      {item.count && item.count > 0 ? (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  User Dashboard Navigation (15 Core Sections)
                </span>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={navigateToAdmin}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Open Admin Domain Panel (/admin)</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex overflow-x-auto space-x-1.5 pb-1">
                {userNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition cursor-pointer shrink-0 ${
                        isActive
                          ? 'gold-gradient-btn text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1 py-0.2 rounded text-[9px] bg-red-600 text-white font-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic View Router */}
        <div>
          {/* User Tab Views */}
          {activeTab === 'dashboard' && (
            <DashboardOverview onStartTaskClick={() => setActiveTab('available-tasks')} />
          )}
          {activeTab === 'packages' && <PackagesView />}
          {activeTab === 'my-packages' && <MyPackagesView />}
          {activeTab === 'available-tasks' && <AvailableTasksView />}
          {activeTab === 'my-tasks' && <MyTasksView />}
          {activeTab === 'deposit' && <DepositView />}
          {activeTab === 'withdraw' && <WithdrawView />}
          {activeTab === 'wallet' && <WalletView />}
          {activeTab === 'transactions' && <TransactionHistoryView />}
          {activeTab === 'referral' && <ReferralProgramView />}
          {activeTab === 'team' && <MyTeamView />}
          {activeTab === 'earnings' && <EarningsHistoryView />}
          {activeTab === 'whatsapp' && <WhatsAppChannelView />}
          {activeTab === 'support' && <SupportTicketsView />}
          {activeTab === 'profile' && <ProfileSettingsView />}

          {/* Admin Tab Views (Only if admin) */}
          {isAdmin && (
            <>
              {activeTab === 'admin-overview' && <AdminDashboardOverview />}
              {activeTab === 'admin-users' && <AdminUserManagement />}
              {activeTab === 'admin-packages' && <AdminPackageManagement />}
              {activeTab === 'admin-deposits' && <AdminDepositManagement />}
              {activeTab === 'admin-withdrawals' && <AdminWithdrawalManagement />}
              {activeTab === 'admin-tasks' && <AdminTaskManagement />}
              {activeTab === 'admin-settings' && <AdminSettings />}
              {activeTab === 'admin-support' && <AdminSupportManagement />}
              {activeTab === 'admin-audit' && <AdminAuditLogs />}
              {activeTab === 'admin-firebase' && <AdminFirebaseBlueprint />}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onSwitchToForgot={() => {
          setLoginOpen(false);
          setForgotOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSwitchToLogin={() => {
          setForgotOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
