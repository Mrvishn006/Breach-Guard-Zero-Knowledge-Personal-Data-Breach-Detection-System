import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  UserX, 
  FolderLock, 
  Layers, 
  RotateCcw, 
  ArrowRight, 
  Cpu, 
  Lock, 
  Sparkles, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SecurityMetrics, CorrelatedIncident, IrpTelemetryEvent } from '../types';

interface UnifiedOverviewProps {
  metrics: SecurityMetrics;
  incidents: CorrelatedIncident[];
  recentIrps: IrpTelemetryEvent[];
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onNavigateTab: (tab: 'ransomwatch' | 'breachguard' | 'copilot') => void;
  onSimulateAttack: () => void;
}

export const UnifiedOverview: React.FC<UnifiedOverviewProps> = ({
  metrics,
  incidents,
  recentIrps,
  onSelectIncident,
  onNavigateTab,
  onSimulateAttack
}) => {
  const primaryIncident = incidents[0];

  return (
    <div className="space-y-6">

      {/* Top Banner: AI Threat Correlator Highlight */}
      {primaryIncident && (
        <div className="relative overflow-hidden rounded-2xl glass-panel-red p-5 border border-rose-500/40 shadow-glow-red transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 shrink-0">
                <ShieldAlert className="w-7 h-7 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/50">
                    AI Correlation Alert: {primaryIncident.severity}
                  </span>
                  <span className="text-xs text-rose-300 font-mono">
                    {new Date(primaryIncident.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {primaryIncident.title}
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {primaryIncident.correlationSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
              <button
                onClick={() => onSelectIncident(primaryIncident)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-glow-red transition-all active:scale-95"
              >
                <span>Inspect Attack Chain</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Composite Risk Score */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Composite Risk</span>
            <Flame className={`w-4 h-4 ${metrics.compositeRiskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">{metrics.compositeRiskScore}</span>
              <span className="text-xs font-medium text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  metrics.compositeRiskScore > 70 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                    : metrics.compositeRiskScore > 40 
                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500' 
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${metrics.compositeRiskScore}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Posture: <strong className="text-white">{metrics.threatLevel}</strong>
          </span>
        </div>

        {/* Card 2: Active Ransomware Threats */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ransomware GIDs</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-cyan-400">
                {metrics.activeRansomwareThreats > 0 ? metrics.activeRansomwareThreats : '0'}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                (1 Blocked)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Kernel <code className="text-cyan-300">FsFilter.sys</code> Active
            </p>
          </div>
          <button 
            onClick={() => onNavigateTab('ransomwatch')}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View Process Tree</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Breached Accounts */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Breached Accounts</span>
            <UserX className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-indigo-400">{metrics.activeBreachedAccounts}</span>
              <span className="text-xs text-slate-400">Identities</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              k-Anonymity Verified
            </p>
          </div>
          <button 
            onClick={() => onNavigateTab('breachguard')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Launch Scanner</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Kernel IRP Operations */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IRP Operations</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-400">{metrics.totalIrpsProcessed.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Shannon Entropy Monitored
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            Buffer: <strong className="text-emerald-400">Healthy (0ms delay)</strong>
          </span>
        </div>

        {/* Card 5: Auto-Restored Files */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Restored Files</span>
            <RotateCcw className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-sky-400">{metrics.recoveredFilesCount}</span>
              <span className="text-xs text-slate-400">Files</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Azure Blob Snapshot Rollback
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0 Data Loss</span>
          </span>
        </div>

      </div>

      {/* Middle Section: Architecture & Correlated Attack Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Attack Vector Flow Pipeline */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Autonomous Threat Correlation Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time synchronization between Breach Guard identity signals and RansomWatch kernel traps
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/60">
              Agent State: ACTIVE
            </span>
          </div>

          {/* Visual Attack Chain Stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
            
            {/* Stage 1: Breach Guard */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                  1. Identity Leak
                </span>
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Breach Guard Signal</h4>
              <p className="text-[11px] text-slate-300">
                <code className="text-indigo-300">admin@enterprise-corp.com</code> dumped in dark web leak with plaintext password hash.
              </p>
              <div className="text-[10px] text-slate-400 font-mono">
                Source: XposedOrNot + HIBP
              </div>
            </div>

            {/* Stage 2: Infiltration */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                  2. Infiltration
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Credential Re-use</h4>
              <p className="text-[11px] text-slate-300">
                Threat actor authenticated via SMB service, spawning dropper <code className="text-amber-300">svchost_updater.exe</code>.
              </p>
              <div className="text-[10px] text-slate-400 font-mono">
                Lineage: GID 1042 (PID 8492)
              </div>
            </div>

            {/* Stage 3: RansomWatch Trap */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">
                  3. RansomWatch Catch
                </span>
                <Cpu className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Entropy & Trap Trip</h4>
              <p className="text-[11px] text-slate-300">
                High entropy (<strong>7.94</strong>) write detected on honeypot <code className="text-rose-300">!00_financial.xlsx</code>.
              </p>
              <div className="text-[10px] text-rose-400 font-mono">
                Driver Action: KILL_GID 1042
              </div>
            </div>

            {/* Stage 4: Cloud Rollback */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                  4. Automated Rollback
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Azure Snapshot Restore</h4>
              <p className="text-[11px] text-slate-300">
                18 modified files restored to pre-attack snapshot state via Azure Storage API.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono">
                Status: SUCCESS (100%)
              </div>
            </div>

          </div>

          {/* Quick CTA to AI Copilot */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-300">
              Want a natural-language breakdown and executive report of this incident?
            </span>
            <button
              onClick={() => onNavigateTab('copilot')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all"
            >
              <span>Ask AI Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live Kernel IRP Telemetry Feed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live IRP Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">FilterSendMessage Stream</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {recentIrps.slice(0, 5).map((irp) => (
                <div 
                  key={irp.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    irp.entropy > 7.0 
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' 
                      : irp.isTrap
                      ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                    <span>{irp.timestamp}</span>
                    <span className="font-bold">{irp.irpType}</span>
                  </div>
                  <div className="truncate text-slate-200 font-semibold" title={irp.filePath}>
                    {irp.filePath}
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400">
                    <span>PID: {irp.pid} (GID: {irp.gid})</span>
                    <span className={irp.entropy > 7.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      Entropy: {irp.entropy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Driver Port: <code className="text-cyan-300">\RWFilterPort</code></span>
            <button
              onClick={() => onNavigateTab('ransomwatch')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Full Stream &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
