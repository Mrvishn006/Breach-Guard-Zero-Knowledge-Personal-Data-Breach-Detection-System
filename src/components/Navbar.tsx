import React from 'react';
import { Radio, Activity, Cpu, Lock, Sparkles, Play } from 'lucide-react';
import { SecurityMetrics } from '../types';
import { BreachGuardLogo } from './BreachGuardLogo';

interface NavbarProps {
  activeTab: 'overview' | 'ransomwatch' | 'breachguard' | 'copilot';
  setActiveTab: (tab: 'overview' | 'ransomwatch' | 'breachguard' | 'copilot') => void;
  metrics: SecurityMetrics;
  onSimulateAttack: () => void;
  isTelemetryLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onSimulateAttack,
  isTelemetryLive = false
}) => {
  const getRiskBadgeColor = () => {
    switch (metrics.threatLevel) {
      case 'CRITICAL': 
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      case 'HIGH': 
      case 'ELEVATED': 
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default: 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-slate-200 px-4 lg:px-8 py-3 shadow-soft">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Official BreachGuard Logo Branding */}
        <div className="flex items-center">
          <BreachGuardLogo 
            size="md"
            showWordmark={true}
            subtitle="SECURITY OPERATIONS CENTER"
            isOnline={true}
          />
        </div>

        {/* Center: Main Navigation Tabs */}
        <nav 
          aria-label="Main Navigation Tabs"
          className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-brand-500" />
            <span>Unified SOC</span>
          </button>

          <button
            onClick={() => setActiveTab('ransomwatch')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === 'ransomwatch'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-brand-500" />
            <span>RansomWatch</span>
          </button>

          <button
            onClick={() => setActiveTab('breachguard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === 'breachguard'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Breach Guard</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
              activeTab === 'copilot'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          </button>
        </nav>

        {/* Right: Telemetry & Threat Status Badges + Test Button */}
        <div className="flex items-center gap-3">
          {/* Live Telemetry Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isTelemetryLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-slate-500">Live Telemetry:</span>
            <span className={isTelemetryLive ? 'text-emerald-600 font-bold' : 'text-slate-500 font-medium'}>
              {isTelemetryLive ? 'ONLINE' : 'STANDBY'}
            </span>
          </div>

          {/* Threat Level Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono uppercase ${getRiskBadgeColor()}`}>
            <Radio className="w-3.5 h-3.5" />
            <span>{metrics.threatLevel}</span>
          </div>

          {/* Test Scenario Trigger */}
          <button
            onClick={onSimulateAttack}
            className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-soft active:scale-95"
            title="Inject test filesystem activity for end-to-end telemetry verification"
          >
            <Play className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">Test Scenario</span>
          </button>
        </div>

      </div>
    </header>
  );
};
