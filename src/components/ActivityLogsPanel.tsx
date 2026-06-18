/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { ActivityLog } from '../types';
import { 
  FileText, 
  Search, 
  Trash2, 
  Filter, 
  Check, 
  AlertTriangle, 
  X,
  RefreshCw,
  Database
} from 'lucide-react';

export default function ActivityLogsPanel() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setLogs(platformDb.getLogs(categoryFilter, searchTerm));

    const unsubscribe = platformDb.subscribe(() => {
      setLogs(platformDb.getLogs(categoryFilter, searchTerm));
    });
    return unsubscribe;
  }, [categoryFilter, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const getLogStatusBadge = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': 
        return <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>;
      case 'warning': 
        return <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-ping"></span>;
      case 'error': 
        return <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>;
    }
  };

  const getCategoryTheme = (cat: ActivityLog['category']) => {
    switch (cat) {
      case 'auth': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
      case 'resource': return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400';
      case 'security': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
      case 'performance': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'admin': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'study': return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400';
    }
  };

  const formatLogTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Filtering header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search auditing traces, user logins, error logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9.5 pr-8.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-lg outline-none bg-slate-50 dark:bg-zinc-950 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 hover:text-slate-900 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Tab selectors */}
        <div className="flex gap-1.5 overflow-x-auto p-0.5 border border-slate-100 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-800">
          {[
            { id: 'all', label: 'All Log Actions' },
            { id: 'auth', label: 'Auth' },
            { id: 'resource', label: 'Resources' },
            { id: 'security', label: 'Security' },
            { id: 'performance', label: 'Performance' },
            { id: 'study', label: 'Academic' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 text-[11px] font-bold rounded-md whitespace-nowrap transition ${
                categoryFilter === cat.id
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Logs registry list representation */}
      <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Database className="h-4.5 w-4.5 text-blue-500" />
            System Auditing Trails (Persistent Database logs)
          </h3>
          <span className="text-[10px] font-mono text-slate-400 uppercase">Records: {logs.length}</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono text-[11px]">
          {logs.map(log => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-5 transition hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 px-1 rounded">
              <div className="flex items-start gap-4">
                
                {/* Active circle indicator */}
                <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                  {getLogStatusBadge(log.status)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                      [{log.userEmail}]
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase ${getCategoryTheme(log.category)}`}>
                      {log.category}
                    </span>
                    {log.provider && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500 font-bold uppercase">
                        {log.provider.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-zinc-400 font-sans text-xs">
                    {log.action}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-zinc-400 shrink-0 font-medium">
                {formatLogTime(log.timestamp)}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="flex flex-col h-40 items-center justify-center text-center p-4 gap-2 text-slate-500 font-sans">
              <FileText className="h-6 w-6 text-zinc-400 animate-pulse" />
              <p className="text-xs">Zero historical logs match active query requirements.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
