/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { PerformanceMetric, CloudEnvironment } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Download, 
  Flame, 
  AlertTriangle, 
  Gauge, 
  Database,
  RefreshCw,
  Scale,
  Info
} from 'lucide-react';

export default function PerformanceDashboard() {
  const [telemetry, setTelemetry] = useState<PerformanceMetric[]>([]);
  const [envs, setEnvs] = useState<CloudEnvironment[]>([]);
  const [globalScores, setGlobalScores] = useState({ security: 0, performance: 0, health: 0, cost: 0 });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [showDdosWarning, setShowDdosWarning] = useState(false);

  // Sync state
  useEffect(() => {
    setTelemetry(platformDb.getTelemetryData());
    setEnvs(platformDb.getEnvironments());
    setGlobalScores(platformDb.getGlobalOverallScores());

    const unsubscribe = platformDb.subscribe(() => {
      setTelemetry(platformDb.getTelemetryData());
      setEnvs(platformDb.getEnvironments());
      setGlobalScores(platformDb.getGlobalOverallScores());
    });
    return unsubscribe;
  }, []);

  const triggerPingBenchmark = () => {
    setIsMeasuring(true);
    platformDb.log('Manually initiated micro-latency ping benchmark on all nodes.', 'performance', 'all', 'success');
    
    setTimeout(() => {
      setIsMeasuring(false);
      platformDb.addNotification('success', 'Ping Swarm Complete', 'Tested connections of 32 endpoints globally. Calculated multi-cloud optimal route (RTT 31ms).');
    }, 1500);
  };

  const triggerDdosInvasion = () => {
    setShowDdosWarning(true);
    platformDb.triggerThreatTest('ddos');
    
    setTimeout(() => {
      setShowDdosWarning(false);
    }, 4000);
  };

  const getMetricAverages = () => {
    if (telemetry.length === 0) return { aws: 0, azure: 0, gcp: 0, multi: 0 };
    const sum = telemetry.reduce((acc, curr) => {
      acc.aws += curr.awsLatency;
      acc.azure += curr.azureLatency;
      acc.gcp += curr.gcpLatency;
      acc.multi += curr.multiCloudLatency;
      return acc;
    }, { aws: 0, azure: 0, gcp: 0, multi: 0 });

    const len = telemetry.length;
    return {
      aws: Math.round(sum.aws / len),
      azure: Math.round(sum.azure / len),
      gcp: Math.round(sum.gcp / len),
      multi: Math.round(sum.multi / len),
    };
  };

  const avgs = getMetricAverages();

  return (
    <div className="space-y-6">
      
      {/* Project Purpose & Architecture Overview Card */}
      <div className="rounded-xl border border-blue-100 dark:border-zinc-800 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400">Research & Thesis Overview</span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Project Scope: Real-time Multi-Cloud Performance Tuning & Security Simulation</h2>
          </div>
        </div>
        
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans mt-1">
          This system is an academic research sandbox representing a <strong>secure multi-cloud infrastructure study</strong>. It monitors live performance metrics across disparate regional clusters (<strong>AWS Virginia</strong>, <strong>Azure Ireland</strong>, and <strong>GCP Taiwan</strong>). 
          The main objective is to establish how dynamic multi-cloud proxy delegation and smart load balancers (e.g. Weighted Latency, Round-Robin, Least-Connections) optimize response rates, reduce billing egress, and defend against security threat vectors (such as DDoS flood attacks and server hijackings).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] font-sans">
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-slate-100 dark:border-zinc-800/40">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
            <div>
              <strong className="block text-slate-800 dark:text-zinc-200">Active Aggregation</strong>
              <span className="text-slate-500 dark:text-zinc-400">Simulates real-time telemetry across three major public cloud providers.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-slate-100 dark:border-zinc-800/40">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
            <div>
              <strong className="block text-slate-800 dark:text-zinc-200">Dynamic Load Balancing</strong>
              <span className="text-slate-500 dark:text-zinc-400">Tweak routing and switch algorithms to compare multi-cloud latency versus isolated setups.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-zinc-900/60 rounded-lg border border-slate-100 dark:border-zinc-800/40">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
            <div>
              <strong className="block text-slate-800 dark:text-zinc-200">Security Testbed</strong>
              <span className="text-slate-500 dark:text-zinc-400">Inject simulated attacks (like volumetric DDoS) to verify network resiliency levels.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Alerts notification overlay */}
      {showDdosWarning && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-800 p-4 shrink-0 flex items-start gap-3 animate-bounce">
          <Flame className="h-5 w-5 text-rose-600 animate-pulse shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-rose-950 dark:text-rose-400">Volumetric DDoS Storm Simulated</h4>
            <p className="text-rose-800 dark:text-zinc-400 mt-0.5 leading-relaxed">
              150,000 requests are flooded into standard gateways. Notice how individual servers experience major latency spikes (&gt;280ms) while the <strong>Multi-Cloud Load Balancer</strong> absorbs, routes, and caps cluster latency to only 85ms!
            </p>
          </div>
        </div>
      )}

      {/* Primary Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg AWS Latency</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-orange-600 dark:text-orange-500">{avgs.aws}ms</span>
            <span className="text-[10px] text-zinc-400 font-mono">us-east</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (avgs.aws / 150) * 100)}%` }}></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Azure Latency</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-500">{avgs.azure}ms</span>
            <span className="text-[10px] text-zinc-400 font-mono">eu-west</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (avgs.azure / 150) * 100)}%` }}></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg GCP Latency</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-500">{avgs.gcp}ms</span>
            <span className="text-[10px] text-zinc-400 font-mono">asia-east</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (avgs.gcp / 150) * 100)}%` }}></div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-zinc-900 ring-1 ring-blue-500/20 p-4.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Multi-Cloud Optimised (SLA)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black font-mono text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <Zap className="h-4.5 w-4.5 text-blue-500 fill-blue-500 shrink-0" />
              {avgs.multi}ms
            </span>
            <span className="text-[10px] text-blue-500 font-mono font-semibold">Globally caching</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" style={{ width: `${Math.min(100, (avgs.multi / 150) * 100)}%` }}></div>
          </div>
        </div>

      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Latency Chart Card - Span 2 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-blue-500" />
                Comparative Cloud Performance Matrix (RTT)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculates latency (milliseconds) over standard database network roundtrip times. Updated real-time.
              </p>
            </div>

            {/* Micro benchmark Actions */}
            <div className="flex gap-2">
              <button
                disabled={isMeasuring}
                onClick={triggerPingBenchmark}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold text-xs rounded-lg transition"
              >
                <Gauge className={`h-3.5 w-3.5 ${isMeasuring ? 'animate-spin' : ''}`} />
                {isMeasuring ? 'Benchmarking...' : 'Swarm ping test'}
              </button>

              <button
                onClick={triggerDdosInvasion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition"
              >
                <Flame className="h-3.5 w-3.5" />
                Simulate DDoS storm
              </button>
            </div>
          </div>

          {/* Latency Area Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMulti" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#888888" />
                <XAxis dataKey="timestamp" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} unit="ms" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(9, 9, 11, 0.95)', 
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Area type="monotone" name="AWS Latency" dataKey="awsLatency" stroke="#f97316" fillOpacity={1} fill="url(#colorAws)" strokeWidth={1.8} />
                <Area type="monotone" name="Azure Latency" dataKey="azureLatency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAzure)" strokeWidth={1.8} />
                <Area type="monotone" name="GCP Latency" dataKey="gcpLatency" stroke="#10b981" fillOpacity={1} fill="url(#colorGcp)" strokeWidth={1.8} />
                <Area type="monotone" name="Multi-Cloud" dataKey="multiCloudLatency" stroke="#2563eb" fillOpacity={1} fill="url(#colorMulti)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Throughput performance analysis card */}
        <div className="rounded-xl border border-slate-205 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-blue-550 text-blue-500" />
              Bandwidth & Throughput (req/sec)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Reflects concurrent user processing thresholds before network interface choking occurs.
            </p>
          </div>

          <div className="h-48 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telemetry.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#888888" />
                <XAxis dataKey="timestamp" stroke="#71717a" fontSize={8} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(9, 9, 11, 0.95)', 
                    borderColor: '#27272a',
                    borderRadius: '8px', 
                    fontSize: '10px' 
                  }} 
                />
                <Bar name="AWS" dataKey="awsThroughput" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar name="Azure" dataKey="azureThroughput" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar name="GCP" dataKey="gcpThroughput" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
                <Bar name="Multi" dataKey="multiCloudThroughput" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] font-mono text-slate-400 border-t border-slate-200 dark:border-zinc-800 pt-3 text-center leading-relaxed">
            Multi-cloud combined channel capabilities allow throughput of up to 4x standard provider averages.
          </p>
        </div>

      </div>

      {/* Structured Comparative Table (SLA VS Performance VS Security) */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-4.5 w-4.5 text-blue-500" />
            Empirical Architecture Comparison: Single vs. Multi-Cloud
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Academic benchmark comparison indicating availability, vendor lock-in risk scoring, failover duration, and compliance weights.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white uppercase font-mono text-[9px] tracking-wider border-b border-slate-200 dark:border-zinc-700">
              <tr>
                <th className="p-3">Architectural Parameter</th>
                <th className="p-3 text-orange-600">Single Cloud (AWS Static)</th>
                <th className="p-3 text-emerald-600">Single Cloud (GCP Static)</th>
                <th className="p-3 text-blue-600 font-bold bg-blue-50/20 dark:bg-zinc-800/40">Multi-Cloud Ecosystem (Hybrid Active)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">Guaranteed SLA Uptime</td>
                <td className="p-3">99.95% (~4.38 hours yearly downtime)</td>
                <td className="p-3">99.99% (~52.6 minutes yearly downtime)</td>
                <td className="p-3 font-bold bg-blue-50/10 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400">99.999% (&lt; 5.26 minutes yearly downtime)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">Egress / Networking Fees</td>
                <td className="p-3">Base (₹7.50 per GB public transfer)</td>
                <td className="p-3">Standard (₹6.65 per GB data exit)</td>
                <td className="p-3 bg-blue-50/5 dark:bg-blue-950/5 text-blue-600 dark:text-blue-400">Moderate-High (+12-25% inter-cloud transit fees)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">Disaster Recovery (RTO / RPO)</td>
                <td className="p-3">RTO: ~30 min (Cold site swap) / RPO: 4 hrs</td>
                <td className="p-3">RTO: ~15 min (Hot region sync) / RPO: 1 hr</td>
                <td className="p-3 font-bold bg-blue-50/10 dark:bg-blue-950/10 text-emerald-600 dark:text-emerald-400">Instant RTO (&lt; 3.2 seconds) / RPO Real-time</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">Vendor Lock-In Severity</td>
                <td className="p-3 text-rose-500 font-medium">HIGH (Using proprietary DynamoDB, SQS)</td>
                <td className="p-3 text-rose-500 font-medium">HIGH (Using BigQuery, Spanner APIs)</td>
                <td className="p-3 font-bold bg-blue-50/10 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400">ZERO (Uses Kubernetes, PostgreSQL containers)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">Global Coverage Index</td>
                <td className="p-3">Dependent on AWS edge CDN presence</td>
                <td className="p-3">Dependent on GCP network fiber presence</td>
                <td className="p-3 font-bold bg-blue-50/10 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400">SUPERIOR (Spans 150+ regional transit headers)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
