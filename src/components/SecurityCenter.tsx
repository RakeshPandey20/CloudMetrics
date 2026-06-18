/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { SecurityRisk, CloudEnvironment } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  Key, 
  RefreshCw, 
  Terminal, 
  Activity, 
  Lock, 
  Unlock, 
  TrendingUp,
  Server
} from 'lucide-react';

export default function SecurityCenter() {
  const [risks, setRisks] = useState<SecurityRisk[]>([]);
  const [envs, setEnvs] = useState<CloudEnvironment[]>([]);
  const [globalScores, setGlobalScores] = useState({ security: 0, performance: 0, health: 0, cost: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [activeConsoleLog, setActiveConsoleLog] = useState<string[]>(['[SYSTEM] Security Auditor initialized...', '[IDLE] Standing by for compliance triggers.']);

  useEffect(() => {
    setRisks(platformDb.getRisks());
    setEnvs(platformDb.getEnvironments());
    setGlobalScores(platformDb.getGlobalOverallScores());

    const unsubscribe = platformDb.subscribe(() => {
      setRisks(platformDb.getRisks());
      setEnvs(platformDb.getEnvironments());
      setGlobalScores(platformDb.getGlobalOverallScores());
    });
    return unsubscribe;
  }, []);

  const triggerScan = () => {
    setIsScanning(true);
    setActiveConsoleLog(prev => [...prev, `[INIT] Spawning global network scanning sockets...`, `[SCAN] Checking subnets on AWS US-East, Azure West-Europe, GCP Asia-East.`]);
    
    setTimeout(() => {
      platformDb.triggerThreatTest('portscan');
      setIsScanning(false);
      setActiveConsoleLog(prev => [
        ...prev, 
        `[AUDIT] Drift checklist parsed successfully.`, 
        `[ALERT] Discovered ${risks.filter(r => r.status === 'VULNERABLE').length} active exposures.`,
        `[SECURITY_INDEX] Global score evaluated to: ${globalScores.security}%`
      ]);
    }, 1800);
  };

  const remediate = (riskId: string, title: string) => {
    setActiveConsoleLog(prev => [
      ...prev,
      `[REMEDIATION] Initiated target patch for "${title}"`,
      `[CMD] terraform apply -auto-approve vars.tfvars`,
      `[COMPILED] Patch payload applied. Vault credential state updated.`
    ]);
    platformDb.remediateRisk(riskId);
  };

  const triggerDriftDrill = () => {
    setActiveConsoleLog(prev => [
      ...prev,
      `[ADMIN] WARNING: Triggering drift injection...`,
      `[DRIFT] Azure firewall rules altered via direct port 1433 console manipulation.`
    ]);
    platformDb.triggerThreatTest('drift');
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'aws': return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400">AWS</span>;
      case 'azure': return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">AZURE</span>;
      case 'gcp': return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">GCP</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">HYBRID</span>;
    }
  };

  // Determine compliance completion percentage
  const totalChecks = risks.length;
  const resolvedChecks = risks.filter(r => r.status === 'FIXED').length;
  const compliancePct = totalChecks > 0 ? Math.round((resolvedChecks / totalChecks) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Upper Grid (Score Gauges and Interactive Scan triggers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Auditor Score Panel */}
        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
              Global Cloud Security Index
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Derived from the proportion of satisfied CIS benchmarks and asset vulnerabilities patched.
            </p>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              {/* Simple Responsive SVG Circular Indicator */}
              <svg className="w-36 h-36">
                <circle 
                  className="text-slate-100 dark:text-zinc-800" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="58" 
                  cx="72" 
                  cy="72" 
                />
                <circle 
                  className={`${
                    globalScores.security >= 85 
                      ? 'text-emerald-500' 
                      : globalScores.security >= 65 
                        ? 'text-amber-500' 
                        : 'text-rose-500'
                  } transition-all duration-1000 ease-out`} 
                  strokeWidth="10" 
                  strokeDasharray={364.4} 
                  strokeDashoffset={364.4 - (364.4 * globalScores.security) / 100} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="58" 
                  cx="72" 
                  cy="72" 
                  transform="rotate(-90 72 72)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">{globalScores.security}%</span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 font-mono">Sec Score</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className={`text-[10px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded ${
              globalScores.security >= 85 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
            }`}>
              {globalScores.security >= 85 ? 'HIGH RESILIENCE SECURED' : 'ACTION INDICATED'}
            </span>
          </div>
        </div>

        {/* Auditor Control & Terminal Console Logs */}
        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Terminal className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                Vulnerability Auditor console
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Trigger configuration sweep audits, inject credential drift parameter drills, or view deployment console streams.
              </p>
            </div>
            
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <button
                disabled={isScanning}
                onClick={triggerScan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shrink-0"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Securing Audits...' : 'Run audit sweep'}
              </button>

              <button
                onClick={triggerDriftDrill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg transition shrink-0"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Inject Drift Drill
              </button>
            </div>
          </div>

          {/* Real-time styled terminal box */}
          <div className="flex-1 bg-zinc-950 text-zinc-200 p-3 rounded-lg font-mono text-[9.5px]/relaxed select-none h-40 overflow-y-auto mt-2 border border-zinc-800">
            {activeConsoleLog.map((logLine, i) => (
              <div 
                key={i} 
                className={`${
                  logLine.includes('[ALERT]') || logLine.includes('WARNING') 
                    ? 'text-rose-400' 
                    : logLine.includes(' applied') || logLine.includes('[COMPILED]') || logLine.includes('FIXED') 
                      ? 'text-emerald-400' 
                      : logLine.includes('vars.tfvars') 
                        ? 'text-yellow-400'
                        : 'text-zinc-400'
                }`}
              >
                {logLine}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Vulnerability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Threats list */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-rose-500" />
            Vulnerability Remediation Registry ({risks.filter(r => r.status === 'VULNERABLE').length})
          </h4>

          <div className="space-y-3.5">
            {risks.map(risk => (
              <div 
                key={risk.id}
                className={`rounded-xl border p-4 transition shadow-xs relative overflow-hidden ${
                  risk.status === 'FIXED'
                    ? 'border-emerald-100 bg-emerald-50/20 dark:border-emerald-950/20 dark:bg-emerald-950/5'
                    : 'border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                {/* Horizontal progress indicators */}
                <div className="absolute top-0 left-0 h-1 w-full bg-slate-50 dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full ${
                    risk.status === 'FIXED' 
                      ? 'bg-emerald-500' 
                      : risk.severity === 'CRITICAL' 
                        ? 'bg-rose-500' 
                        : risk.severity === 'HIGH' 
                          ? 'bg-amber-500' 
                          : 'bg-blue-400'
                  }`} style={{ width: risk.status === 'FIXED' ? '100%' : '20%' }}></div>
                </div>

                <div className="flex justify-between items-start gap-3 mt-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getProviderBadge(risk.provider)}
                      <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                        risk.severity === 'CRITICAL' 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' 
                          : risk.severity === 'HIGH' 
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {risk.severity} Severity
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium font-mono">{risk.category}</span>
                    </div>

                    <h5 className={`font-bold text-xs mt-1.5 ${risk.status === 'FIXED' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                      {risk.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed mt-1">
                      {risk.description}
                    </p>

                    {risk.status !== 'FIXED' && (
                      <div className="mt-2.5 bg-blue-50/40 dark:bg-zinc-800/40 p-2 rounded text-[10px] text-blue-900 dark:text-blue-250">
                        <strong>Remediation path:</strong> {risk.remediation}
                      </div>
                    )}
                  </div>

                  {risk.status === 'FIXED' ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle className="h-4.5 w-4.5" />
                    </div>
                  ) : (
                    <button
                      onClick={() => remediate(risk.id, risk.title)}
                      className="shrink-0 px-2.5 py-1 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 transition"
                    >
                      Remediate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Compliance checklists */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            Global Compliance audit Matrix
          </h4>

          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 dark:text-slate-200">SOC-2 Type II Uptime & Audit Compliance</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{compliancePct}% compliant</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000" style={{ width: `${compliancePct}%` }}></div>
              </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-zinc-800 text-xs">
              {[
                { framework: 'SOC 2 Type II', requirement: 'CC6.1 Logical access keys to sensitive multi-region cloud blocks unexposed.', met: risks.filter(r => r.category === 'Access Control' && r.status === 'VULNERABLE').length === 0 },
                { framework: 'ISO 27001:2022', requirement: 'A.8.24 Mandate active object encryption across edge volumes and databases.', met: risks.filter(r => r.category === 'Encryption' && r.status === 'VULNERABLE').length === 0 },
                { framework: 'HIPAA Security', requirement: 'SSL Policies explicitly reject obsolete TLS 1.0/1.1 transport algorithms.', met: risks.filter(r => r.category === 'Network' && r.status === 'VULNERABLE').length === 0 },
                { framework: 'PCI-DSS v4.0', requirement: 'Multi-factor conditional requirements applied on cloud infrastructure accounts.', met: risks.filter(r => r.id === 'risk-5' && r.status === 'VULNERABLE').length === 0 },
                { framework: 'CIS Benchmarks', requirement: 'Strict port restrictions enforced. Open SSH port 22/1433 alerts mitigated.', met: risks.filter(r => r.id === 'risk-2' && r.status === 'VULNERABLE').length === 0 },
              ].map((item, i) => (
                <div key={i} className="py-2.5 flex items-start justify-between gap-3 font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">{item.framework}</span>
                    <p className="text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">{item.requirement}</p>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[9px] uppercase shrink-0 font-mono ${
                    item.met
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-400 border border-rose-500/10'
                  }`}>
                    {item.met ? 'SATISFIED' : 'DRIFTED'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] italic text-slate-400 pt-1 leading-normal">
              Note: Resolving active threats in the left registry auto-updates compliance criteria checks in real-time.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
