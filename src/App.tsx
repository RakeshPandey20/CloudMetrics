/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { platformDb } from './services/db';
import { RegisteredUser } from './types';

// Importing custom modular sub-components
import Navbar from './components/Navbar';
import TopologyVisualization from './components/TopologyVisualization';
import PerformanceDashboard from './components/PerformanceDashboard';
import SecurityCenter from './components/SecurityCenter';
import ResourceManager from './components/ResourceManager';
import ResearchSection from './components/ResearchSection';
import ActivityLogsPanel from './components/ActivityLogsPanel';
import AdminPanel from './components/AdminPanel';

import { 
  Cloud, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  UserPlus, 
  ExternalLink,
  Lock,
  Compass,
  AlertOctagon
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [globalScores, setGlobalScores] = useState({ security: 0, performance: 0, health: 0, cost: 0 });
  const [runningInstancesCount, setRunningInstancesCount] = useState(0);

  // Quick Auth Form States
  const [authEmail, setAuthEmail] = useState('vivekfalkoti11@gmail.com');
  const [authRole, setAuthRole] = useState<'Student' | 'Researcher' | 'Admin'>('Admin');

  useEffect(() => {
    setUser(platformDb.getCurrentUser());
    setGlobalScores(platformDb.getGlobalOverallScores());
    setRunningInstancesCount(platformDb.getResources().filter(r => r.status === 'running').length);
    
    const unsubscribe = platformDb.subscribe(() => {
      setUser(platformDb.getCurrentUser());
      setGlobalScores(platformDb.getGlobalOverallScores());
      setRunningInstancesCount(platformDb.getResources().filter(r => r.status === 'running').length);
    });
    return unsubscribe;
  }, []);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authEmail) {
      platformDb.login(authEmail, authRole);
    }
  };

  return (
    <div className={darkMode ? 'dark text-zinc-100 bg-zinc-950 font-sans min-h-screen' : 'text-slate-900 bg-slate-50 font-sans min-h-screen'}>
      
      {/* Auth Gate overlay */}
      {!user ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-sm">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <span className="text-[9px] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold px-2 py-0.5 rounded">
                  University Exam Defense Gate
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
                  Uttaranchal University CloudMetrics Auditor
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-2.5">
                  Study on Multi-Cloud Architecture & Its Impact on Performance and Security. Please supply academic credentials for immediate platform verification.
                </p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Email / Student identifier</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/40 font-mono"
                  placeholder="vivekfalkoti11@gmail.com"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Assigned Academic Privileges</label>
                <select
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/40 font-medium"
                >
                  <option value="Student">Student (Evaluation View)</option>
                  <option value="Researcher">Researcher (Advanced Thesis Annotate)</option>
                  <option value="Admin">Admin (Full Control, Threat Injection)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs rounded-lg shadow-sm cursor-pointer transition-colors duration-150"
              >
                Launch Research Simulation Panel
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 dark:border-zinc-800/80 pt-3 flex justify-between items-center text-[10px] text-zinc-400">
              <span>Uttaranchal University</span>
              <span>Year 2026</span>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Main Project Console Layout */
        <div className="flex flex-col min-h-screen">
          
          {/* Header Navbar navigation */}
          <Navbar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Master high-level status indicator board */}
          <div className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900/60 py-5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Master Health score of hybrid setup */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
                    <ShieldCheck className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">Unified Health Rating</span>
                    <strong className="text-lg font-black font-mono text-slate-900 dark:text-white leading-tight">
                      {globalScores.health}/100
                    </strong>
                  </div>
                </div>

                {/* Efficiency improvement statistics */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-xs">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">SLA Latency optimized</span>
                    <strong className="text-lg font-black font-mono text-blue-600 dark:text-blue-400 leading-tight">
                      +39.5%
                    </strong>
                  </div>
                </div>

                {/* Redundancy nodes live */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-xs">
                  <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">Redundant Nodes Live</span>
                    <strong className="text-lg font-black font-mono text-slate-900 dark:text-white leading-tight">
                      {runningInstancesCount} Clusters
                    </strong>
                  </div>
                </div>

                {/* Master Cost quotient */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-emerald-600 dark:text-emerald-400">
                    <span className="font-bold text-xs font-mono">₹</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">Ecosystem Egress Rate</span>
                    <strong className="text-lg font-black font-mono text-slate-900 dark:text-white leading-tight">
                      ₹{globalScores.cost}/hr
                    </strong>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Quick Sub-navigation tabs on mobile view */}
          <div className="lg:hidden flex items-center justify-start gap-1 p-2 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'topology' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Topology
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Resources
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Audit Logs
            </button>
            {user.role === 'Admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                Admin
              </button>
            )}
            <button
              onClick={() => setActiveTab('study')}
              className={`px-3 py-1.5 rounded transition shrink-0 ${activeTab === 'study' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Thesis Chap
            </button>
          </div>

          {/* Main Workspace Frame container */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 font-sans">
            <div className="grid grid-cols-1 gap-6">
              
              {/* Tab Display Router */}
              {activeTab === 'dashboard' && <PerformanceDashboard />}
              {activeTab === 'topology' && <TopologyVisualization />}
              {activeTab === 'security' && <SecurityCenter />}
              {activeTab === 'resources' && <ResourceManager />}
              {activeTab === 'logs' && <ActivityLogsPanel />}
              {activeTab === 'admin' && <AdminPanel />}
              {activeTab === 'study' && <ResearchSection />}

            </div>
          </main>

          {/* Navigation sidebar anchor panels (Desktop-only split tabs for logs and academic assistant) */}
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 pb-6 pt-2">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-805 rounded-xl px-4 py-3 shadow-xs">
              
              <div className="flex gap-2 text-xs text-slate-500 dark:text-zinc-400 font-medium tracking-tight">
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`hover:text-blue-600 transition flex items-center gap-1.5 ${activeTab === 'logs' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Terminal className="h-4 w-4 text-blue-500 animate-pulse" />
                  Audit logs Console
                </button>
                <span className="opacity-40">|</span>
                {user.role === 'Admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`hover:text-blue-600 transition flex items-center gap-1 md:inline-flex hidden ${activeTab === 'admin' ? 'text-blue-600 font-bold' : ''}`}
                  >
                    <Lock className="h-4 w-4 text-amber-500" />
                    Admin controls
                  </button>
                )}
                {user.role === 'Admin' && <span className="opacity-40 md:inline-flex hidden">|</span>}
                <button
                  onClick={() => setActiveTab('study')}
                  className={`hover:text-blue-600 transition flex items-center gap-1 ${activeTab === 'study' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Compass className="h-4 w-4 text-emerald-500" />
                  Read Academic Thesis
                </button>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                <span>MCA FINAL YEAR MASTER THESIS</span>
                <span className="p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-bold">1.0.0</span>
              </div>

            </div>
          </div>

          {/* Academic Footer */}
          <footer className="border-t border-slate-200 dark:border-zinc-900/60 bg-white/50 dark:bg-zinc-950/20 py-4.5 text-center text-[11px] text-slate-400 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p>© 2026 Rakesh Pandey • All simulation models validated under university inspection.</p>
              <div className="flex gap-3 text-blue-600 dark:text-blue-400 font-semibold font-sans">
                <span>PROJECT CODE: UU-MCA-2026-MC09</span>
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
