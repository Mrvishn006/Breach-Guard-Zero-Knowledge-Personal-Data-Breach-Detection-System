import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  Radio, 
  Activity, 
  Crosshair,
  HardDrive
} from 'lucide-react';
import { SecurityMetrics } from '../types';
import { BreachGuardLogo } from './BreachGuardLogo';

interface SidebarLeftProps {
  metrics: SecurityMetrics;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  trackedProcessesCount: number;
  uptimeText: string;
  lastUpdateText: string;
  isTelemetryLive: boolean;
  driverStatus?: 'RUNNING' | 'STOPPED' | 'NOT_INSTALLED';
  armedCanariesCount?: number;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  metrics,
  searchQuery,
  onSearchChange,
  trackedProcessesCount,
  uptimeText,
  lastUpdateText,
  isTelemetryLive,
  driverStatus = 'NOT_INSTALLED',
  armedCanariesCount = 0
}) => {
  // Threat Gauge calculation
  const score = metrics.compositeRiskScore;
  const isClean = score === 0;

  // Determine threat level display and color
  let threatColor = 'text-emerald-600';
  let threatBg = 'bg-emerald-50 border-emerald-200';
  let threatStroke = '#10B981';

  if (metrics.threatLevel === 'CRITICAL') {
    threatColor = 'text-rose-600';
    threatBg = 'bg-rose-50 border-rose-200';
    threatStroke = '#EF4444';
  } else if (metrics.threatLevel === 'HIGH' || metrics.threatLevel === 'ELEVATED') {
    threatColor = 'text-amber-600';
    threatBg = 'bg-amber-50 border-amber-200';
    threatStroke = '#F59E0B';
  }

  // Calculate SVG arc stroke dashoffset for gauge (circumference of circle r=38 is ~238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.max(2, Math.min(100, score)) / 100) * circumference;

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      
      {/* 1. Brand Anchor Card with Official Logo */}
      <div className="bg-card rounded-3xl p-5 border border-slate-200 shadow-card flex items-center justify-between">
        <BreachGuardLogo 
          size="lg"
          showWordmark={true}
          subtitle="SECURITY OPERATIONS CENTER"
          isOnline={isTelemetryLive}
        />
      </div>

      {/* 2. Global Search Box */}
      <div className="bg-card rounded-2xl p-3.5 border border-slate-200 shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all font-sans"
          />
        </div>
      </div>

      {/* 3. System Status Overview Card */}
      <div className="bg-card rounded-3xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Status
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            driverStatus === 'RUNNING' && isClean 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${driverStatus === 'RUNNING' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {driverStatus === 'RUNNING' ? 'PROTECTED' : 'ACTION REQUIRED'}
          </span>
        </div>

        <div className="space-y-2.5 pt-1 text-xs">
          {/* RansomWatch driver */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-500" />
              <span className="font-medium text-slate-700">RansomWatch Driver</span>
            </div>
            <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
              driverStatus === 'RUNNING' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
              driverStatus === 'STOPPED' ? 'text-amber-600 bg-amber-50 border-amber-200' :
              'text-rose-600 bg-rose-50 border-rose-200'
            }`}>
              {driverStatus === 'RUNNING' ? 'FsFilter.sys' : driverStatus === 'STOPPED' ? 'STOPPED' : 'NOT INSTALLED'}
            </span>
          </div>

          {/* Canary Bait Traps */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-brand-500" />
              <span className="font-medium text-slate-700">Canary Honeypots</span>
            </div>
            <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
              armedCanariesCount > 0 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                : 'text-slate-500 bg-slate-100 border-slate-200'
            }`}>
              {armedCanariesCount > 0 ? `${armedCanariesCount} ARMED` : 'NOT DEPLOYED'}
            </span>
          </div>

          {/* Zero-knowledge identity protection */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span className="font-medium text-slate-700">ZK Identity Protection</span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              k-Anonymity
            </span>
          </div>

          {/* Telemetry status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-500" />
              <span className="font-medium text-slate-700">Telemetry Stream</span>
            </div>
            <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
              isTelemetryLive 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                : 'text-slate-500 bg-slate-100 border-slate-200'
            }`}>
              {isTelemetryLive ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Threat Level Gauge Card */}
      <div className="bg-card rounded-3xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Threat Level
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Real-Time</span>
        </div>

        <div className="flex flex-col items-center justify-center py-2">
          {/* Circular Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={threatStroke}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${threatColor}`}>
                {score}
              </span>
              <span className="text-[10px] font-medium text-slate-400 -mt-1 font-mono">/ 100</span>
            </div>
          </div>

          <div className="mt-3 text-center space-y-0.5">
            <div className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${threatBg} ${threatColor} inline-block`}>
              {metrics.threatLevel}
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Evidence-Gated &bull; Real-Time Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* 5. Quick Stats Card */}
      <div className="bg-card rounded-3xl p-5 border border-slate-200 shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Stats
          </span>
          <Activity className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Endpoints Monitored</span>
            <span className="font-semibold text-slate-800 font-mono">1 (Localhost)</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Files Checked</span>
            <span className="font-semibold text-slate-800 font-mono">
              {metrics.totalIrpsProcessed > 0 ? metrics.totalIrpsProcessed.toLocaleString() : '0'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Processes Monitored</span>
            <span className="font-semibold text-slate-800 font-mono">
              {trackedProcessesCount > 0 ? trackedProcessesCount : '0'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Uptime</span>
            <span className="font-semibold text-slate-800 font-mono">
              {uptimeText || 'Active'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Last Update</span>
            <span className="font-semibold text-slate-800 font-mono text-[11px]">
              {lastUpdateText || 'Real-time'}
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
};
