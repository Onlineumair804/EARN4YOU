import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  Wallet,
  Shield,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  MessageCircle,
  TrendingUp,
  Layers,
  CheckSquare
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const {
    currentUser,
    logout,
    getUserWallet,
    activeTab,
    setActiveTab,
    whatsappSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const wallet = currentUser ? getUserWallet(currentUser.id) : null;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#070c1d]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#070c1d] rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                  EARN<span className="gold-gradient-text">4YOU</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VIP
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Invest • Earn • Grow
              </span>
            </div>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'packages'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              VIP Packages
            </button>
            <button
              onClick={() => setActiveTab('available-tasks')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                activeTab === 'available-tasks'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>30s Tasks</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded-full">
                HOT
              </span>
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'deposit'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'withdraw'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Withdraw
            </button>
            {whatsappSettings.showChannel && (
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1 ${
                  activeTab === 'whatsapp'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-950/40'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin-overview')}
                className={`px-3.5 py-2 rounded-lg text-sm font-bold transition flex items-center space-x-1.5 ${
                  activeTab.startsWith('admin-')
                    ? 'text-amber-300 bg-amber-500/20 border border-amber-500/50 shadow-md shadow-amber-500/20'
                    : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Wallet Balance Badge */}
            {currentUser && wallet && !isAdmin && (
              <div
                onClick={() => setActiveTab('wallet')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-[#0e172e] border border-amber-500/30 shadow-inner cursor-pointer hover:border-amber-400 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                    Wallet Balance
                  </span>
                  <span className="text-sm font-extrabold text-amber-400 leading-tight">
                    Rs. {wallet.availableBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab(isAdmin ? 'admin-overview' : 'profile')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 gold-gradient-btn flex items-center space-x-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {currentUser && wallet && !isAdmin && (
              <div
                onClick={() => setActiveTab('wallet')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-right"
              >
                <span className="text-xs font-bold text-amber-400">
                  Rs. {wallet.availableBalance.toLocaleString()}
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070c1d] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('packages');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              VIP Packages
            </button>
            <button
              onClick={() => {
                setActiveTab('available-tasks');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-amber-400 hover:bg-slate-800"
            >
              30s Tasks (Watch)
            </button>
            <button
              onClick={() => {
                setActiveTab('deposit');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Deposit Funds
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Withdraw
            </button>
            <button
              onClick={() => {
                setActiveTab('referral');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 text-left text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Referral (3 Levels)
            </button>
            <button
              onClick={() => {
                setActiveTab('whatsapp');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-emerald-950/40 text-left text-sm font-medium text-emerald-400 hover:bg-emerald-900/40"
            >
              WhatsApp Channel
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin-overview');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-left text-sm font-bold text-amber-300"
              >
                Full Admin Panel
              </button>
            )}
          </div>

          {currentUser ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="py-2 rounded-xl bg-slate-800 text-center text-xs font-bold text-white"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onOpenRegister();
                  setMobileMenuOpen(false);
                }}
                className="py-2 rounded-xl gold-gradient-btn text-center text-xs font-bold text-slate-900"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
