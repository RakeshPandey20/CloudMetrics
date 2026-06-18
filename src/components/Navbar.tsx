/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { RegisteredUser, SystemNotification } from '../types';
import { 
  CloudRain, 
  Bell, 
  User, 
  Database, 
  ShieldCheck, 
  LogOut, 
  TrendingUp, 
  Check, 
  AlertTriangle,
  Lock,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ darkMode, setDarkMode, activeTab, setActiveTab }: NavbarProps) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  useEffect(() => {
    setUser(platformDb.getCurrentUser());
    setNotifications(platformDb.getNotifications());
    
    const unsubscribe = platformDb.subscribe(() => {
      setUser(platformDb.getCurrentUser());
      setNotifications(platformDb.getNotifications());
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    platformDb.markAllNotificationsRead();
  };

  const handleClearAll = () => {
    platformDb.clearNotifications();
  };

  const handleRoleChange = (role: 'Student' | 'Researcher' | 'Admin') => {
    if (user) {
      platformDb.setRole(user.uid, role);
      setShowRoleSelector(false);
    }
  };

  const handleLogout = () => {
    platformDb.logout();
    setShowProfileDropdown(false);
  };

  const handleLogin = () => {
    // Show quick sign in
    const email = prompt('Enter candidate email to authenticate:', 'vivekfalkoti11@gmail.com');
    if (email) {
      platformDb.login(email);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-sm shadow-blue-500/10">
            <CloudRain className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-md font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-950 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              MCA CloudMetrics™
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">
              Final Year project
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 font-sans text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'topology'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Topology Graph
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'security'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Security Auditor
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'resources'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Resource Manager
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'study'
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white font-medium border-l border-slate-200 dark:border-zinc-800'
            }`}
          >
            Research Thesis
          </button>
        </nav>

        {/* Global Controls & Auth info */}
        <div className="flex items-center gap-3">
          
          {/* Light/Dark Toggle */}
          <button
            aria-label="Toggle Dark Mode"
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Notifications Panel */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 h-96 w-80 overflow-y-auto rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-slate-950/10 ring-1 ring-slate-950/5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 px-4 py-3">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">Active Alerts ({notifications.length})</span>
                  <div className="flex gap-2">
                    <button onClick={handleMarkAllRead} className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold">Mark read</button>
                    <button onClick={handleClearAll} className="text-[10px] text-rose-500 hover:underline">Clear</button>
                  </div>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-zinc-800">
                  {notifications.length === 0 ? (
                    <div className="flex h-56 flex-col items-center justify-center gap-2 p-4 text-center">
                      <ShieldCheck className="h-8 w-8 text-emerald-500" />
                      <p className="text-xs text-slate-500">Security & telemetry indicators are normal. No active alarms.</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-3 text-xs leading-relaxed transition ${notif.read ? 'opacity-60' : 'bg-slate-50/50 dark:bg-zinc-800/30 font-medium'}`}>
                        <div className="flex items-start gap-1.5">
                          {notif.type === 'alert' && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-rose-500 shrink-0" />}
                          {notif.type === 'warning' && <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          {notif.type === 'success' && <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                          {notif.type === 'info' && <Database className="mt-0.5 h-3.5 w-3.5 text-sky-500 shrink-0" />}
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                            <p className="text-slate-600 dark:text-zinc-400 mt-0.5">{notif.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1">{notif.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile and Authority System */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  <User className="h-3.5 w-3.5 text-blue-500" />
                  <span className="max-w-[80px] truncate sm:max-w-[120px] font-bold text-blue-600 dark:text-blue-400">
                    {user.role}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 z-50 w-64 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-xl shadow-slate-950/10 ring-1 ring-slate-950/5">
                    <div className="border-b border-slate-100 dark:border-zinc-800 pb-2 mb-2">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{user.displayName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono truncate">{user.email}</p>
                      <p className="text-[10px] italic text-blue-600 dark:text-blue-400 mt-1 font-sans">{user.institution}</p>
                    </div>

                    <div className="space-y-1">
                      {/* Active authority toggle */}
                      <div>
                        <button
                          onClick={() => setShowRoleSelector(!showRoleSelector)}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                        >
                          <span className="flex items-center gap-1.5">
                            <Lock className="h-3 w-3 text-amber-500" />
                            Role: <strong className="text-blue-600 dark:text-blue-400 font-bold">{user.role}</strong>
                          </span>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-bold font-mono">Tweak</span>
                        </button>

                        {showRoleSelector && (
                          <div className="mt-1 ml-4 border-l-2 border-blue-100 dark:border-zinc-800 pl-2 space-y-1">
                            {(['Student', 'Researcher', 'Admin'] as const).map(role => (
                              <button
                                key={role}
                                onClick={() => handleRoleChange(role)}
                                className={`flex w-full items-center justify-between rounded px-2 py-1 text-[11px] transition ${
                                  user.role === role 
                                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold' 
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 text-left'
                                }`}
                              >
                                <span>{role}</span>
                                {user.role === role && <Check className="h-3 w-3" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition text-left font-medium"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        End Session / Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
