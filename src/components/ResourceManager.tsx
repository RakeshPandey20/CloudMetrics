/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { platformDb } from '../services/db';
import { CloudEnvironment, CustomResourceNode } from '../types';
import { 
  Server, 
  Cpu, 
  Trash2, 
  Plus, 
  Sliders, 
  Database, 
  HardDrive, 
  ToggleLeft, 
  ToggleRight,
  TrendingDown,
  Power
} from 'lucide-react';

export default function ResourceManager() {
  const [envs, setEnvs] = useState<CloudEnvironment[]>([]);
  const [resources, setResources] = useState<CustomResourceNode[]>([]);
  const [selectedEnvId, setSelectedEnvId] = useState<string>('');
  
  // Provisioning form inputs
  const [provisionName, setProvisionName] = useState('');
  const [provisionType, setProvisionType] = useState<'compute' | 'storage' | 'database'>('compute');

  useEffect(() => {
    const loadedEnvs = platformDb.getEnvironments();
    setEnvs(loadedEnvs);
    setResources(platformDb.getResources());
    if (loadedEnvs.length > 0 && !selectedEnvId) {
      setSelectedEnvId(loadedEnvs[0].id);
    }

    const unsubscribe = platformDb.subscribe(() => {
      const e = platformDb.getEnvironments();
      setEnvs(e);
      setResources(platformDb.getResources());
    });
    return unsubscribe;
  }, []);

  const handleScaleSliderChange = (envId: string, count: number) => {
    platformDb.scaleEnvironmentInstance(envId, count);
  };

  const handleToggleNode = (nodeId: string) => {
    platformDb.toggleResourceNode(nodeId);
  };

  const selectedEnv = envs.find(e => e.id === selectedEnvId);
  const filteredResources = resources.filter(r => r.envId === selectedEnvId);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'compute': return <Cpu className="h-4 w-4 text-blue-500" />;
      case 'database': return <Database className="h-4 w-4 text-emerald-500" />;
      case 'storage': return <HardDrive className="h-4 w-4 text-orange-500" />;
      default: return <Server className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cluster selector bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
            <Sliders className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Deployment Block Selector</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Select a cloud core to analyze compute utilization variables and scale clusters.</p>
          </div>
        </div>

        {/* Cloud Select Tabs */}
        <div className="flex gap-1.5 p-0.5 border border-slate-100 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-800">
          {envs.map(env => (
            <button
              key={env.id}
              onClick={() => setSelectedEnvId(env.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                selectedEnvId === env.id
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {env.provider.toUpperCase()} ({env.serverCount}x)
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource Scaling Knobs - Span 1 */}
        {selectedEnv && (
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-5">
            <div>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded font-bold font-mono text-[10px] text-blue-700 dark:text-blue-400 uppercase">
                {selectedEnv.provider.toUpperCase()} Settings
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white mt-1.5">
                Elastic Resource Scaling
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Slide to scale cluster instances. High scale configurations accommodate heavy database operations, with proportional increases in cost variables.
              </p>
            </div>

            {/* Scale count dial slider */}
            <div className="bg-slate-50 dark:bg-zinc-800/45 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 dark:text-zinc-400">VM Compute Nodes</span>
                <span className="font-mono bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded font-bold text-blue-600 dark:text-blue-400">
                  {selectedEnv.serverCount} Instances
                </span>
              </div>
              
              <input 
                type="range"
                min="1"
                max="12"
                value={selectedEnv.serverCount}
                onChange={(e) => handleScaleSliderChange(selectedEnv.id, Number(e.target.value))}
                className="w-full accent-blue-600 dark:accent-blue-500 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>1 (Min)</span>
                <span>6 (Optimized)</span>
                <span>12 (Burst Scale)</span>
              </div>
            </div>

            {/* Cloud metadata indicators */}
            <div className="divide-y divide-slate-50 dark:divide-zinc-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Node Cluster Spec:</span>
                <strong className="text-slate-800 dark:text-slate-300 font-mono">{selectedEnv.instanceType.split(' ')[0]}</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Core DBMS Engine:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-mono">{selectedEnv.dbType.split(' ').pop()}</strong>
              </div>
              <div className="py-2.5 flex justify-between font-sans">
                <span className="text-slate-500">Region/Multiprovider Zone:</span>
                <strong className="text-slate-800 dark:text-zinc-300">{selectedEnv.region}</strong>
              </div>
              <div className="py-2.5 flex justify-between font-mono">
                <span className="text-slate-500">Estimated Cost:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₹{selectedEnv.costPerHour}/hour</strong>
              </div>
            </div>
            
            <p className="text-[9.5px] italic text-slate-400 text-center select-none">
              Scaling updates are synced across cluster registries on standard multi-region CDN gateways instantly.
            </p>
          </div>
        )}

        {/* Resources Cards Grid output - Span 2 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="h-4.5 w-4.5 text-blue-500" />
              Cluster Node Registry: {selectedEnv?.name}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Provides granular tracking of CPU/RAM indices for active virtual servers. Toggle nodes to examine failover dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(node => (
              <div 
                key={node.id}
                className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950 p-3.5 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Node Top info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow-xs">
                      {getResourceIcon(node.type)}
                    </span>
                    <div>
                      <strong className="text-xs font-mono font-bold text-slate-900 dark:text-white">{node.name}</strong>
                      <span className="block text-[8px] uppercase font-bold text-zinc-400 mt-0.5">{node.type}</span>
                    </div>
                  </div>

                  {/* Active/Pause button */}
                  <button
                    onClick={() => handleToggleNode(node.id)}
                    className={`flex h-6 items-center gap-1 px-2 rounded font-mono font-bold text-[9px] uppercase transition ${
                      node.status === 'running'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : node.status === 'heavy-load'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse'
                          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                    }`}
                  >
                    <Power className="h-3 w-3" />
                    {node.status}
                  </button>
                </div>

                {/* Simulated Telemetry bars */}
                <div className="mt-4.5 space-y-2 border-t border-slate-100 dark:border-zinc-800/80 pt-3 text-[10px]">
                  <div>
                    <div className="flex justify-between font-mono mb-0.5 opacity-80">
                      <span>CPU Loading</span>
                      <strong>{node.cpuUtilization}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded overflow-hidden">
                      <div className={`h-full ${node.status === 'heavy-load' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${node.cpuUtilization}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono mb-0.5 opacity-80">
                      <span>RAM Allocation</span>
                      <strong>{node.ramUtilization}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: `${node.ramUtilization}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Background warning indicators */}
                {node.status === 'heavy-load' && (
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-rose-500 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="flex flex-col h-48 items-center justify-center p-4 border border-dashed rounded-xl gap-2 font-sans">
              <Server className="h-6 w-6 text-zinc-400 animate-bounce" />
              <p className="text-xs text-slate-500 text-center">Cluster represents zero virtual servers. Scale instances above to generate active nodes.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
