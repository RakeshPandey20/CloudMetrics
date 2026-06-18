/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { RegisteredUser, CloudEnvironment } from '../types';
import { 
  Users, 
  Settings, 
  ShieldAlert, 
  Database, 
  Sliders, 
  Check, 
  AlertTriangle,
  Lock,
  Crown
} from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [envs, setEnvs] = useState<CloudEnvironment[]>([]);
  const [congestionMultiplier, setCongestionMultiplier] = useState(1);
  const [sysAlertActive, setSysAlertActive] = useState(false);

  useEffect(() => {
    setUsers(platformDb.getUsers());
    setEnvs(platformDb.getEnvironments());

    const unsubscribe = platformDb.subscribe(() => {
      setUsers(platformDb.getUsers());
      setEnvs(platformDb.getEnvironments());
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (uid: string, role: 'Student' | 'Researcher' | 'Admin') => {
    platformDb.setRole(uid, role);
  };

  const toggleEmergencySystemAlert = () => {
    setSysAlertActive(!sysAlertActive);
    if (!sysAlertActive) {
      platformDb.addNotification('alert', 'Emergency Alert', 'High-priority administrator alert broadcasted to monitoring heads.');
      platformDb.log('Broadcasted system emergency security alert across hybrid zones.', 'admin', 'all', 'warning');
    } else {
      platformDb.addNotification('success', 'Emergency Cleared', 'System health restored to normal settings.');
      platformDb.log('Deactivated global system emergency broadcast alerts.', 'admin', 'all', 'success');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User privilege management list */}
        <div className="lg:col-span-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-blue-500" />
              Dynamic User Privilege Console
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Adjust registered researcher roles and inspect academic credentials during project presentation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-white uppercase font-mono text-[9px] tracking-wider border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Researcher Fullname / Email</th>
                  <th className="p-3">Institutional Affiliation</th>
                  <th className="p-3">Active Authority</th>
                  <th className="p-3 text-right">Adjust Privilege</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {users.map(user => (
                  <tr key={user.uid} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/10">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        {user.displayName}
                        {user.role === 'Admin' && <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                      </div>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</span>
                    </td>
                    <td className="p-3 text-slate-500 truncate max-w-[150px]">{user.institution}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        user.role === 'Admin'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/15'
                          : user.role === 'Researcher'
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex rounded border border-slate-200 dark:border-zinc-800 p-0.5 bg-slate-50 dark:bg-zinc-950">
                        {(['Student', 'Researcher', 'Admin'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(user.uid, role)}
                            className={`px-2 py-0.5 text-[10px] rounded transition ${
                              user.role === role
                                ? 'bg-blue-600 font-bold text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            {role[0]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global threshold configs */}
        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="h-4.5 w-4.5 text-blue-500" />
              Hybrid Network Threshold Tuning
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Adjust simulated external latencies or toggle emergency warnings to test dynamic UI performance alerts.
            </p>
          </div>

          <div className="space-y-4">
            {/* Congestion Slider */}
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-zinc-400 font-medium">Artificial Subnet Congestion</span>
                <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{congestionMultiplier}x Normal</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={congestionMultiplier}
                onChange={(e) => setCongestionMultiplier(Number(e.target.value))}
                className="w-full accent-blue-600 dark:accent-blue-500 h-1"
              />
              <p className="text-[9px] text-slate-400 leading-relaxed italic">
                Increases connection latencies with multiplier quotients to study database bottlenecks under busy seasons.
              </p>
            </div>

            {/* Emergency trigger */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-zinc-800/40 text-xs">
              <div>
                <strong className="font-bold text-slate-800 dark:text-slate-200">Global Emergency Broadcast</strong>
                <p className="text-[10px] text-slate-400 mt-0.5">Triggers warning indicators across panels.</p>
              </div>

              <button
                onClick={toggleEmergencySystemAlert}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  sysAlertActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
                }`}
              >
                {sysAlertActive ? 'Deactivate Broadcast' : 'Simulate Warn'}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3 text-[10px] italic text-slate-400 text-center">
            Admins bypass security rules and manage credentials centrally via telemetry vaults.
          </div>
        </div>

      </div>
    </div>
  );
}
