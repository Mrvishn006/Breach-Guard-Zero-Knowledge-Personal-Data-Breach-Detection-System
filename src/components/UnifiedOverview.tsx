import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  Cpu, 
  Lock, 
  RotateCcw, 
  ChevronRight, 
  ArrowRight, 
  Radio, 
  Sparkles, 
  Layers, 
  FileText, 
  Network, 
  UserCheck, 
  Search, 
  Activity, 
  CheckCircle2, 
  ExternalLink,
  Shield
} from 'lucide-react';
import { SecurityMetrics, CorrelatedIncident, IrpTelemetryEvent, LiveEndpointEvent } from '../types';
import { BreachGuardLogo } from './BreachGuardLogo';

interface UnifiedOverviewProps {
  metrics: SecurityMetrics;
  incidents: CorrelatedIncident[];
  recentIrps: IrpTelemetryEvent[];
  endpointEvents?: LiveEndpointEvent[];
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onNavigateTab: (tab: 'ransomwatch' | 'breachguard' | 'copilot') => void;
  onSimulateAttack: () => void;
  onSelectDomain?: (domain: string) => void;
}

export const UnifiedOverview: React.FC<UnifiedOverviewProps> = ({
  metrics,
  incidents,
  recentIrps,
  endpointEvents = [],
  onSelectIncident,
  onNavigateTab,
  onSimulateAttack,
  onSelectDomain
}) => {
  const primaryIncident = incidents[0];
  const isSystemClean = metrics.compositeRiskScore === 0 && metrics.activeRansomwareThreats === 0;

  const handleDomainClick = (domainKey: string) => {
    if (onSelectDomain) {
      onSelectDomain(domainKey);
    } else {
      switch (domainKey) {
        case 'ransomware':
        case 'processes':
        case 'recovery':
          onNavigateTab('ransomwatch');
          break;
        case 'breachguard':
        case 'identities':
          onNavigateTab('breachguard');
          break;
        case 'ai_soc':
          onNavigateTab('copilot');
          break;
        default:
          onNavigateTab('ransomwatch');
          break;
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* 1. AI Correlation Incident Banner (Shown strictly when real incident exists) */}
      {primaryIncident && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 shadow-sm transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono">
                    AI Correlation Alert &bull; {primaryIncident.severity}
                  </span>
                  <span className="text-xs text-rose-800 font-mono">
                    {new Date(primaryIncident.timestamp).toLocaleTimeString()}
                  </span>
                  {primaryIncident.linkedGid ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-mono">
                      GID: {primaryIncident.linkedGid}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-base font-bold text-rose-950">
                  {primaryIncident.title}
                </h3>
                <p className="text-xs text-rose-800 max-w-3xl leading-relaxed">
                  {primaryIncident.correlationSummary}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectIncident(primaryIncident)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-soft flex items-center gap-1.5 transition-all self-end lg:self-center shrink-0"
            >
              <span>Investigate RCA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Central Hero Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card relative overflow-hidden">
        {/* Subtle Decorative Background Rings */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Hero Text & Actions */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${isSystemClean ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>Zero-Knowledge &bull; Evidence-Gated Architecture</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                BreachGuard SOC
              </h1>
              <p className="text-sm font-semibold text-brand-600">
                Unified Security Operations &bull; Real-Time Telemetry
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time ransomware defense, credential exposure detection, security telemetry, AI-assisted SOC analysis, and controlled response.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onNavigateTab('copilot')}
                className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-accent-orange flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Open Interactive SOC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('ransomwatch')}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
              >
                Inspect Live Driver
              </button>
            </div>
          </div>

          {/* Large Central Security Visualization with Official Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-brand-50 to-white border-4 border-slate-100 shadow-card flex items-center justify-center">
              {/* Concentric Guard Rings */}
              <div className="absolute inset-2 rounded-full border border-dashed border-brand-300 animate-spin-slow" />
              
              <div className="flex flex-col items-center justify-center text-center p-3">
                <div className="w-14 h-14 mb-1">
                  <BreachGuardLogo 
                    size="xl" 
                    showWordmark={false} 
                    isOnline={isSystemClean} 
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mt-1">
                  {isSystemClean ? 'SYSTEM PROTECTED' : 'THREAT DETECTED'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isSystemClean ? 'All Filters Active' : 'Action Required'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Explore Security Domains Section */}
      <div className="bg-card rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Explore Security Domains</h2>
            <p className="text-xs text-slate-500">Quick access to authoritative security views and subsystem telemetry</p>
          </div>
          <span className="text-xs font-mono text-slate-400">9 Active Modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {[
            { key: 'ransomware', label: 'Ransomware Defense', icon: Cpu, color: 'text-brand-600 bg-brand-50 border-brand-100 hover:border-brand-300' },
            { key: 'breachguard', label: 'Breach Guard', icon: Lock, color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:border-indigo-300' },
            { key: 'ai_soc', label: 'AI SOC', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300' },
            { key: 'telemetry', label: 'Telemetry', icon: Radio, color: 'text-sky-600 bg-sky-50 border-sky-100 hover:border-sky-300' },
            { key: 'identities', label: 'Identities', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300' },
            { key: 'recovery', label: 'Recovery', icon: RotateCcw, color: 'text-teal-600 bg-teal-50 border-teal-100 hover:border-teal-300' },
            { key: 'processes', label: 'Processes', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300' },
            { key: 'file_activity', label: 'File Activity', icon: FileText, color: 'text-slate-700 bg-slate-50 border-slate-200 hover:border-slate-300' },
            { key: 'network', label: 'Network', icon: Network, color: 'text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300' },
          ].map((domain) => {
            const Icon = domain.icon;
            return (
              <button
                key={domain.key}
                onClick={() => handleDomainClick(domain.key)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all bg-card-hover group ${domain.color}`}
              >
                <Icon className="w-5 h-5 mb-1.5 transition-transform group-hover:scale-110" />
                <span className="text-[11px] font-semibold tracking-tight leading-tight line-clamp-1">
                  {domain.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Modular Security Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Enterprise Risk Score */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enterprise Risk Score</span>
            <div className={`p-2 rounded-xl border ${
              metrics.compositeRiskScore > 70 ? 'bg-rose-50 border-rose-200 text-rose-600' :
              metrics.compositeRiskScore > 35 ? 'bg-amber-50 border-amber-200 text-amber-600' :
              'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {metrics.compositeRiskScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.compositeRiskScore > 70 ? 'bg-rose-500' :
                  metrics.compositeRiskScore > 35 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(4, metrics.compositeRiskScore)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Threat Level: <strong className="text-slate-800 font-semibold">{metrics.threatLevel}</strong></span>
            <span className="text-slate-400">Evidence-Gated</span>
          </div>
        </div>

        {/* Card 2: RansomWatch Protection */}
        <div 
          onClick={() => onNavigateTab('ransomwatch')}
          className="bg-card p-5 rounded-3xl border border-slate-200 shadow-card hover:border-brand-300 cursor-pointer transition-all bg-card-hover flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">RansomWatch Protection</span>
            <div className="p-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 group-hover:scale-105 transition-all">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {metrics.activeRansomwareThreats > 0 ? `${metrics.activeRansomwareThreats} Threat` : 'PROTECTED'}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kernel Minifilter: <code className="text-brand-600 font-semibold font-mono text-[11px]">FsFilter.sys</code> (ACTIVE)
            </p>
          </div>

          <div className="text-[11px] text-brand-600 flex items-center gap-1 font-semibold pt-1 border-t border-slate-100">
            <span>Inspect Live Driver</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 3: Breached Identities */}
        <div 
          onClick={() => onNavigateTab('breachguard')}
          className="bg-card p-5 rounded-3xl border border-slate-200 shadow-card hover:border-indigo-300 cursor-pointer transition-all bg-card-hover flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Breached Identities</span>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 group-hover:scale-105 transition-all">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {metrics.activeBreachedAccounts}
              </span>
              <span className="text-xs text-slate-500">Verified Exposed</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero-Knowledge k-Anonymity & Exposure Maps
            </p>
          </div>

          <div className="text-[11px] text-indigo-600 flex items-center gap-1 font-semibold pt-1 border-t border-slate-100">
            <span>Manage Identities & GDPR</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Card 4: Cloud Rollback Health */}
        <div className="bg-card p-5 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cloud Rollback Health</span>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {metrics.recoveredFilesCount}
              </span>
              <span className="text-xs text-slate-500">Files Recovered</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Snapshot Status: <strong className="text-emerald-700 font-semibold font-mono text-[11px]">ARMED & SYNCING</strong>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>{metrics.protectedDirectories} Monitored Paths</span>
            <span className="text-slate-400 font-mono">Snapshot Sync</span>
          </div>
        </div>

      </div>

      {/* 5. Main 2-Column Section: Live Endpoint Activity Feed + AI SOC Orchestrator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live Endpoint Activity Feed */}
        <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-500 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Live Endpoint Activity Feed</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Driver Stream: LIVE
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Real-time I/O request packet telemetry intercepted by <code className="text-brand-600 font-semibold font-mono">FsFilter.sys</code> across protected shares.
          </p>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {recentIrps.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-sans space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs text-slate-700 font-medium">System monitoring active — awaiting endpoint telemetry</p>
                <p className="text-[11px] text-slate-400">Perform file operations or run tests in C:\BreachGuard-Test\ to stream real IRP events.</p>
              </div>
            ) : (
              recentIrps.map((irp) => {
                let tag = 'FILE MODIFIED';
                let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

                if (irp.isTrap) {
                  tag = 'CANARY TRIGGERED';
                  badgeColor = 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse font-bold';
                } else if (irp.entropy > 7.5) {
                  tag = 'ENTROPY ANOMALY';
                  badgeColor = 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
                } else if (irp.irpType === 'IRP_MJ_CREATE') {
                  tag = 'FILE CREATED';
                  badgeColor = 'bg-sky-50 text-sky-800 border-sky-200';
                } else if (irp.irpType === 'IRP_MJ_SET_INFORMATION') {
                  tag = 'FILE RENAMED';
                  badgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                }

                return (
                  <div 
                    key={irp.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
                      irp.isTrap ? 'bg-rose-50 border-rose-200' : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border uppercase shrink-0 ${badgeColor}`}>
                        {tag}
                      </span>
                      <span className="text-slate-800 truncate font-sans text-xs">
                        {irp.filePath}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
                      <span className="hidden sm:inline text-slate-600">
                        {irp.processName} &bull; PID {irp.pid}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-mono ${
                        irp.entropy > 7.5 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        H: {irp.entropy.toFixed(2)}
                      </span>
                      <span className="text-slate-400">{irp.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>Shannon Entropy Window: 0.0 - 8.0</span>
            <span>Real-Time Driver Filter Channel Active</span>
          </div>
        </div>

        {/* Right 1 Column: AI SOC Orchestrator */}
        <div className="bg-card p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">AI SOC Orchestrator</h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Autonomous cross-domain correlation between kernel process anomalies and public credential exposures.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="text-purple-700 font-bold text-[11px] uppercase tracking-wider">
                Attack Chain Attribution
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {primaryIncident ? (
                  <span>{primaryIncident.correlationSummary}</span>
                ) : (
                  <span className="text-slate-500 italic">Insufficient telemetry for attack-chain attribution.</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('copilot')}
              className="w-full py-2.5 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-accent-orange transition-all"
            >
              <span>Open Interactive AI SOC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
