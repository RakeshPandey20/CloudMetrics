/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { CloudProvider, CloudEnvironment, CustomResourceNode } from '../types';
import { 
  Network, 
  Settings, 
  HelpCircle, 
  Server, 
  VolumeX, 
  TrendingUp, 
  Layers, 
  ShieldAlert,
  Zap,
  Repeat,
  RefreshCw,
  Power
} from 'lucide-react';

export default function TopologyVisualization() {
  const [envs, setEnvs] = useState<CloudEnvironment[]>([]);
  const [resources, setResources] = useState<CustomResourceNode[]>([]);
  const [lbAlgo, setLbAlgo] = useState<'round-robin' | 'latency' | 'failover'>('latency');
  const [activePackets, setActivePackets] = useState<{ id: number; path: CloudProvider; progress: number }[]>([]);
  const [simulatedTrafficLoad, setSimulatedTrafficLoad] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  
  // Sync state
  useEffect(() => {
    setEnvs(platformDb.getEnvironments());
    setResources(platformDb.getResources());
    setLbAlgo(platformDb.getLbAlgorithm());

    const unsubscribe = platformDb.subscribe(() => {
      setEnvs(platformDb.getEnvironments());
      setResources(platformDb.getResources());
      setLbAlgo(platformDb.getLbAlgorithm());
    });
    return unsubscribe;
  }, []);

  // Animate traffic packets
  useEffect(() => {
    const packetInterval = setInterval(() => {
      // Determine how many packets based on load
      const packetCount = simulatedTrafficLoad === 'LOW' ? 1 : simulatedTrafficLoad === 'MEDIUM' ? 2 : 4;
      const providers: CloudProvider[] = [];
      
      const activeProviders = envs.filter(e => e.isActive).map(e => e.provider);
      
      if (activeProviders.length > 0) {
        for (let idx = 0; idx < packetCount; idx++) {
          let chosenProvider: CloudProvider = activeProviders[0];
          
          if (lbAlgo === 'round-robin') {
            // cycle through
            const cycleIdx = (Date.now() + idx) % activeProviders.length;
            chosenProvider = activeProviders[cycleIdx];
          } else if (lbAlgo === 'latency') {
            // GCP generally has lowest base latency multiplier configured, let us prefer it
            const gcpActive = activeProviders.includes('gcp');
            const awsActive = activeProviders.includes('aws');
            if (gcpActive && Math.random() < 0.5) {
              chosenProvider = 'gcp';
            } else if (awsActive && Math.random() < 0.6) {
              chosenProvider = 'aws';
            } else {
              chosenProvider = activeProviders[Math.floor(Math.random() * activeProviders.length)];
            }
          } else if (lbAlgo === 'failover') {
            // Always AWS unless AWS is deactivated, then Azure, then GCP
            if (activeProviders.includes('aws')) {
              chosenProvider = 'aws';
            } else if (activeProviders.includes('azure')) {
              chosenProvider = 'azure';
            } else {
              chosenProvider = 'gcp';
            }
          }
          
          providers.push(chosenProvider);
        }
      }

      // Append new packets
      const newPackets = providers.map((provider, i) => ({
        id: Date.now() + i + Math.random(),
        path: provider,
        progress: 0
      }));

      setActivePackets(prev => [...prev, ...newPackets]);
    }, 1500);

    return () => clearInterval(packetInterval);
  }, [envs, lbAlgo, simulatedTrafficLoad]);

  // Update packet progress frames
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setActivePackets(prev => {
        return prev
          .map(p => ({ ...p, progress: p.progress + 3.5 }))
          .filter(p => p.progress < 100);
      });
    }, 60);
    return () => clearInterval(progressTimer);
  }, []);

  const handleToggleState = (id: string, name: string, prov: CloudProvider) => {
    platformDb.toggleResourceNode(id);
  };

  const handleAlgoChange = (algo: 'round-robin' | 'latency' | 'failover') => {
    platformDb.setLbAlgorithm(algo);
  };

  const toggleEnv = (id: string) => {
    platformDb.toggleEnvironment(id);
  };

  // Coordinates mapping on topology svg canvas
  // Load balancer proxy: X=120, Y=200
  // AWS primary gateway: X=480, Y=90
  // Azure primary gateway: X=480, Y=200
  // GCP primary gateway: X=480, Y=310
  const getProviderInfo = (p: CloudProvider) => {
    switch (p) {
      case 'aws': return { label: 'AWS Elastic Cluster', color: '#f97316', bg: 'bg-orange-500/20', stroke: '#f97316', y: 90 };
      case 'azure': return { label: 'Azure Core Infra', color: '#3b82f6', bg: 'bg-blue-500/20', stroke: '#3b82f6', y: 200 };
      case 'gcp': return { label: 'Google Cloud Node', color: '#10b981', bg: 'bg-emerald-500/20', stroke: '#10b981', y: 310 };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Topology Header */}
      <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-500 animate-pulse" />
              Multi-Cloud Dynamic Network Topologies
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Analyze load distribution paths, server health, and traffic redirection in real-time across multiple hyperscalers.
            </p>
          </div>
          
          {/* Simulation Load Control */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 shrink-0">Traffic Flow rate:</span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-zinc-800 p-0.5 bg-slate-50 dark:bg-zinc-800">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(load => (
                <button
                  key={load}
                  onClick={() => setSimulatedTrafficLoad(load)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                    simulatedTrafficLoad === load
                      ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {load}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Interactive Topography Canvas - Span 3 */}
        <div className="xl:col-span-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-950 p-4 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          
          {/* Overlay Tech Info */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-zinc-900/80 text-emerald-400 px-2 py-1 rounded border border-emerald-500/25 uppercase shrink-0">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Live telemetry active
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-zinc-900/80 text-blue-400 px-2 py-1 rounded border border-blue-500/25 uppercase">
              LB: {lbAlgo.toUpperCase()}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 text-[9px] font-mono text-zinc-500 text-right hidden sm:block">
            <p>PACKETS PROCESSED: {Math.floor(Date.now() / 90000) % 5000}</p>
            <p>DROP RATE: 0.003%</p>
          </div>

          {/* Canvas Node SVG Graphics */}
          <div className="w-full h-80 sm:h-96 relative flex items-center justify-center mt-6">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Visual Glow Filters */}
                <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Overlay */}
              <pattern id="topoGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#topoGrid)" />

              {/* Connecting Vector Lines */}
              {envs.map(env => {
                const info = getProviderInfo(env.provider);
                return (
                  <g key={env.id}>
                    {/* Background Connection Path */}
                    <path
                      d={`M 120,190 Q 240,${info.y} 460,${info.y}`}
                      fill="none"
                      stroke={env.isActive ? info.stroke : '#27272a'}
                      strokeWidth={env.isActive ? 2 : 1.5}
                      strokeDasharray={env.isActive ? '0' : '4,4'}
                      opacity={env.isActive ? 0.35 : 0.15}
                    />

                    {/* Outer glow during active metrics */}
                    {env.isActive && (
                      <path
                        d={`M 120,190 Q 240,${info.y} 460,${info.y}`}
                        fill="none"
                        stroke={info.stroke}
                        strokeWidth={6}
                        opacity={0.06}
                        filter={`url(#glow-${env.provider === 'aws' ? 'orange' : env.provider === 'gcp' ? 'emerald' : 'indigo'})`}
                      />
                    )}
                  </g>
                );
              })}

              {/* Animated Client Data Packets along the computed lines */}
              {activePackets.map(packet => {
                const env = envs.find(e => e.provider === packet.path);
                if (!env || !env.isActive) return null;
                const info = getProviderInfo(packet.path);
                
                // Mathematical Bezier interpolation to slide the packet along curved layout paths
                // Q(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
                const t = packet.progress / 100;
                const p0_x = 125;
                const p0_y = 190;
                const p1_x = 240;
                const p1_y = info.y;
                const p2_x = 460;
                const p2_y = info.y;

                const curr_x = (1 - t) * (1 - t) * p0_x + 2 * (1 - t) * t * p1_x + t * t * p2_x;
                const curr_y = (1 - t) * (1 - t) * p0_y + 2 * (1 - t) * t * p1_y + t * t * p2_y;

                return (
                  <circle
                    key={packet.id}
                    cx={curr_x}
                    cy={curr_y}
                    r={3.5}
                    fill={info.color}
                    filter="url(#glow-indigo)"
                  />
                );
              })}

              {/* Load Balancer Gateway Node (Left side) */}
              <g transform="translate(120, 190)">
                <circle r="36" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-indigo)" />
                <circle r="3" fill="#60a5fa" cx="-12" />
                <circle r="3" fill="#60a5fa" cx="0" />
                <circle r="3" fill="#60a5fa" cx="12" />
                <path d="M -12,8 L 12,8" stroke="#60a5fa" strokeWidth="1.5" />
                
                {/* Global Load Balancer Label */}
                <text y="-48" textAnchor="middle" fill="#fff" className="text-[11px] font-mono tracking-tight font-bold">
                  ROUTE GLOBE LB (HQ)
                </text>
                <text y="52" textAnchor="middle" fill="#60a5fa" className="text-[9px] font-mono uppercase">
                  PROXY DIRECTIVE
                </text>
              </g>

              {/* Hyperscaler Gateway Nodes (Right side) */}
              {envs.map(env => {
                const info = getProviderInfo(env.provider);
                return (
                  <g key={env.id} transform={`translate(480, ${info.y})`}>
                    <circle 
                      r="26" 
                      fill="#09090b" 
                      stroke={env.isActive ? info.stroke : '#27272a'} 
                      strokeWidth="2.2" 
                    />
                    
                    {/* Display Provider Icon initial */}
                    <text 
                      dy="5" 
                      textAnchor="middle" 
                      fill={env.isActive ? '#ffffff' : '#52525b'} 
                      className="text-xs font-bold font-mono uppercase"
                    >
                      {env.provider.toUpperCase()}
                    </text>

                    {/* Regional details and health indicators */}
                    <text 
                      x="38" 
                      y="-4" 
                      fill={env.isActive ? '#ffffff' : '#52525b'} 
                      className="text-[11px] font-semibold text-left font-sans"
                    >
                      {env.provider.toUpperCase()} Global Gateway
                    </text>
                    <text 
                      x="38" 
                      y="11" 
                      fill={env.isActive ? '#a1a1aa' : '#52525b'} 
                      className="text-[9px] font-mono uppercase text-left"
                    >
                      {env.region} • {env.isActive ? 'Uptime 99.98%' : 'OFFLINE'}
                    </text>

                    {/* Small Pulsing active dot */}
                    {env.isActive && (
                      <circle 
                        cx="-16" 
                        cy="-16" 
                        r="4" 
                        fill="#10b981" 
                        className="animate-pulse" 
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Topology Footer / Legend */}
          <div className="border-t border-zinc-800/80 pt-3 flex flex-wrap justify-between gap-4 mt-2 text-xs">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500"></span> AWS US-East
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500"></span> Azure EU-West
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span> GCP Asia-East
              </span>
            </div>
            
            <p className="text-zinc-500 text-[10px] font-mono max-w-sm hidden md:block">
              Curved Bezier lines simulate distributed routing networks based on global distance coordinates.
            </p>
          </div>

        </div>

        {/* Load Balancer Policy Tweak and server node states - span 1 */}
        <div className="space-y-4">
          
          {/* Policy controls */}
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              Routing Algorithms
            </h3>
            
            <div className="space-y-2 mt-3">
              {[
                { id: 'latency', title: 'Latency-Based Routing', desc: 'Directs packets always to the cloud showing Lowest RTT performance score.', icon: Zap },
                { id: 'round-robin', title: 'Weighted Round Robin', desc: 'Cycles incoming requests sequentially to all active cloud regions.', icon: Repeat },
                { id: 'failover', title: 'Failover (Active/Passive)', desc: 'Keeps AWS as main gateway. Automatically shifts workloads to Azure/GCP if down.', icon: RefreshCw },
              ].map(algo => {
                const Icon = algo.icon;
                return (
                  <button
                    key={algo.id}
                    onClick={() => handleAlgoChange(algo.id as any)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                      lbAlgo === algo.id
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-blue-950 dark:text-white font-bold'
                        : 'border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 shrink-0 ${lbAlgo === algo.id ? 'text-blue-500' : 'text-slate-400'}`} />
                      <strong className="font-semibold block">{algo.title}</strong>
                    </div>
                    <p className="text-[10px] line-clamp-2 text-slate-500 mt-1 pl-6 leading-relaxed">
                      {algo.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Nodes Controller */}
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm max-h-[200px] overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
              <Server className="h-4 w-4" />
              Manual Gateway Switch
            </h3>
            
            <div className="space-y-2.5 mt-3">
              {envs.map(env => {
                const info = getProviderInfo(env.provider);
                return (
                  <div key={env.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-50 dark:border-zinc-800/40 text-xs">
                    <div>
                      <strong className="font-semibold text-slate-800 dark:text-slate-100">{env.provider.toUpperCase()} Cluster</strong>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{env.region.split(' ')[0]}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleEnv(env.id)}
                      className={`flex h-7 px-2.5 gap-1 items-center rounded text-[11px] font-bold transition ${
                        env.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                      {env.isActive ? 'Active' : 'Offline'}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] italic text-slate-400 mt-3 text-center leading-normal">
              Simulates localized hardware network errors to study multi-provider resiliency metrics.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
