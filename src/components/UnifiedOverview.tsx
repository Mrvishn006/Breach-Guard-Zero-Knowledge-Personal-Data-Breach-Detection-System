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
  ExternalLink,
  Activity,
  Terminal,
  Radio
} from 'lucide-react';
import { SecurityMetrics, CorrelatedIncident, IrpTelemetryEvent, LiveEndpointEvent } from '../types';

interface UnifiedOverviewProps {
  metrics: SecurityMetrics;
  incidents: CorrelatedIncident[];
  recentIrps: IrpTelemetryEvent[];
  endpointEvents?: LiveEndpointEvent[];
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onNavigateTab: (tab: 'ransomwatch' | 'breachguard' | 'copilot') => void;
  onSimulateAttack: () => void;
}

export const UnifiedOverview: React.FC<UnifiedOverviewProps> = ({
  metrics,
  incidents,
  recentIrps,
  endpointEvents = [],
  onSelectIncident,
  onNavigateTab,
  onSimulateAttack
}) => {
  const primaryIncident = incidents[0];

  return (
    <div className="space-y-6">

      {/* Top Banner: AI Threat Correlator Highlight (Only when real incident exists) */}
      {primaryIncident ? (
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
                  {primaryIncident.linkedGid ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 font-mono">
                      GID: {primaryIncident.linkedGid}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {primaryIncident.title}
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {primaryIncident.correlationSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
              <button
                onClick={() => onSelectIncident(primaryIncident)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
              >
                <span>Investigate RCA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">System Monitoring Active — No Active Threats Detected</h4>
              <p className="text-[11px] text-slate-400">RansomWatch kernel driver and zero-knowledge identity safeguards are continuously armed.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Posture: Clean
          </span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Composite Enterprise Risk Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Enterprise Risk Score</span>
            <div className={`p-2 rounded-xl border ${
              metrics.compositeRiskScore > 70 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
              metrics.compositeRiskScore > 35 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {metrics.compositeRiskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.compositeRiskScore > 70 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                  metrics.compositeRiskScore > 35 ? 'bg-gradient-to-r from-cyan-500 to-amber-500' :
                  'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}
                style={{ width: `${Math.max(5, metrics.compositeRiskScore)}%` }}
              />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Threat Level: <strong className="text-slate-200">{metrics.threatLevel}</strong></span>
            <span className="text-slate-500">Evidence-Gated</span>
          </div>
        </div>

        {/* Active Ransomware Threats */}
        <div 
          onClick={() => onNavigateTab('ransomwatch')}
          className="glass-panel p-5 rounded-2xl hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">RansomWatch Protection</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-all">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.activeRansomwareThreats > 0 ? `${metrics.activeRansomwareThreats} Threat` : 'Protected'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kernel Minifilter <code className="text-cyan-300 font-mono text-[11px]">FsFilter.sys</code> active
            </p>
          </div>
          <div className="mt-3 text-[11px] text-cyan-400 flex items-center gap-1 font-semibold">
            <span>Inspect Live Driver</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Exposed Identity Credentials */}
        <div 
          onClick={() => onNavigateTab('breachguard')}
          className="glass-panel p-5 rounded-2xl hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Breached Identities</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-all">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.activeBreachedAccounts}
              </span>
              <span className="text-xs text-slate-500">Verified Exposed</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Zero-Knowledge k-Anonymity & Exposure Maps
            </p>
          </div>
          <div className="mt-3 text-[11px] text-indigo-400 flex items-center gap-1 font-semibold">
            <span>Manage Identities & GDPR</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Automated Recovery Status */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cloud Rollback Health</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {metrics.recoveredFilesCount}
              </span>
              <span className="text-xs text-slate-500">Files Recovered</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Snapshot Rollback: <strong className="text-emerald-400">Armed & Syncing</strong>
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{metrics.protectedDirectories} Monitored Paths</span>
            <span className="text-emerald-400 font-mono">100% Intact</span>
          </div>
        </div>

      </div>

      {/* Main Two-Column SOC Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live Endpoint Activity Feed */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-base font-bold text-white tracking-tight">Live Endpoint Activity Feed</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Kernel Driver Stream: LIVE
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Real-time I/O request packet telemetry intercepted by <span className="text-cyan-300 font-mono">FsFilter.sys</span> across protected shares.
          </p>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {recentIrps.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-sans space-y-2 border border-dashed border-slate-800 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-75" />
                <p className="text-xs text-slate-300 font-medium">System monitoring active — awaiting endpoint telemetry</p>
                <p className="text-[11px] text-slate-500">Perform file operations or run tests in C:\BreachGuard-Test\ to stream real IRP events.</p>
              </div>
            ) : (
              recentIrps.map((irp) => {
                let tag = 'FILE MODIFIED';
                let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

                if (irp.isTrap) {
                  tag = 'CANARY TRIGGERED';
                  badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse';
                } else if (irp.entropy > 7.5) {
                  tag = 'ENTROPY ANOMALY';
                  badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
                } else if (irp.irpType === 'IRP_MJ_CREATE') {
                  tag = 'FILE CREATED';
                  badgeColor = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
                } else if (irp.irpType === 'IRP_MJ_SET_INFORMATION') {
                  tag = 'FILE RENAMED';
                  badgeColor = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
                }

                return (
                  <div 
                    key={irp.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                      irp.isTrap ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${badgeColor}`}>
                        {tag}
                      </span>
                      <span className="text-slate-200 truncate font-sans text-xs">
                        {irp.filePath}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400">
                      <span className="hidden sm:inline text-slate-500">
                        GID: <strong className="text-slate-300">{irp.gid || 'Unavailable'}</strong>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${
                        irp.entropy > 7.5 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        H: {irp.entropy.toFixed(2)}
                      </span>
                      <span className="text-slate-500">{irp.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
            <span>Shannon Entropy Window: 0.0 - 8.0</span>
            <span>Real-Time Driver Filter Channel Active</span>
          </div>
        </div>

        {/* Right 1 Column: AI SOC Copilot Quick Assist */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">AI SOC Orchestrator</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous cross-domain correlation between kernel-level process anomalies and public credential exposures.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">
                Attack Chain Attribution
              </div>
              <p className="text-slate-300 text-xs">
                {primaryIncident ? (
                  <span>{primaryIncident.correlationSummary}</span>
                ) : (
                  <span className="text-slate-400 italic">Insufficient telemetry for attack-chain attribution — endpoint is clean.</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('copilot')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Open Interactive AI SOC Triage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
