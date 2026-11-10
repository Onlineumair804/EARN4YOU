import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { Footer } from './components/Footer';
import { TaskModal } from './components/TaskModal';

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
  Sparkles,
  Play
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, switchUserRole, deposits, withdrawals } = useApp();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isAdminTab = activeTab.startsWith('admin-');

  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').length;

  // 15 User Navigation items (per user specification)
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

  // Admin Navigation items
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

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100">
      {/* Reviewer Role Switcher Notice Bar */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">
            Active Testing Session:
          </span>
          <span className="font-bold text-amber-300">
            {currentUser ? `${currentUser.name} (${currentUser.role.toUpperCase()})` : 'Guest'}
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Easily toggle views below to review both User & Admin flows:
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              switchUserRole('user');
              setActiveTab('dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              !isAdmin
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Switch to User Panel (Syed Umair)
          </button>
          <button
            onClick={() => {
              switchUserRole('admin');
              setActiveTab('admin-overview');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
              isAdmin
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Switch to Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Hero Banner (Always shown on dashboard to highlight user's provided asset) */}
      {activeTab === 'dashboard' && (
        <HeroBanner onJoinClick={() => setActiveTab('packages')} />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Selector Bar */}
        <div className="mb-6 p-2 rounded-2xl bg-[#090f24] border border-amber-500/20 shadow-lg">
          {isAdminTab || isAdmin ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Master Controls</span>
                </span>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs text-slate-400 hover:text-amber-400 font-semibold"
                >
                  &larr; Switch to User Dashboard View
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
                    onClick={() => setActiveTab('admin-overview')}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Open Admin Panel</span>
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

          {/* Admin Tab Views */}
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
