/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CheckSquare, Gift, HelpCircle, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'available-tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'referral', label: 'Invite', icon: Gift },
    { id: 'support', label: 'Help', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-teal-500/20 shadow-2xl rounded-full px-4 py-2 sm:hidden max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'dashboard' && activeTab === 'packages') ||
            (item.id === 'available-tasks' && (activeTab === 'my-tasks' || activeTab === 'available-tasks')) ||
            (item.id === 'referral' && (activeTab === 'referral' || activeTab === 'team')) ||
            (item.id === 'support' && activeTab === 'support') ||
            (item.id === 'profile' && (activeTab === 'profile' || activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw'));

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profile' && !currentUser) {
                  setActiveTab('dashboard');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex items-center space-x-1.5 py-2 px-3 rounded-full transition cursor-pointer ${
                isActive
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-500 hover:text-teal-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isActive && <span className="text-xs font-bold tracking-tight">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
