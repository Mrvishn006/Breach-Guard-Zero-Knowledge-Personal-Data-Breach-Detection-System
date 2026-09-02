import React from 'react';
import { Shield, Radio, Activity, Database, Bot, Zap, Cpu, Lock } from 'lucide-react';
import { SecurityMetrics } from '../types';

interface NavbarProps {
  activeTab: 'overview' | 'ransomwatch' | 'breachguard' | 'copilot';
  setActiveTab: (tab: 'overview' | 'ransomwatch' | 'breachguard' | 'copilot') => void;
  metrics: SecurityMetrics;
  onSimulateAttack: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  onSimulateAttack
}) => {
  const getRiskBadgeColor = () => {
    switch (metrics.threatLevel) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ELEVATED': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-glow-cyan">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                AegisGuard SOC
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                Unified AI Layer
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Orchestrating</span>
              <span className="text-cyan-400 font-semibold">RansomWatch</span>
              <span>+</span>
              <span className="text-indigo-400 font-semibold">Breach Guard</span>
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Unified SOC</span>
          </button>

          <button
            onClick={() => setActiveTab('ransomwatch')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ransomwatch'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RansomWatch Live</span>
          </button>

          <button
            onClick={() => setActiveTab('breachguard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breachguard'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Breach Guard</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'copilot'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </nav>

        {/* Right: Backend Heartbeats & Risk Pill */}
        <div className="flex items-center gap-3">
          {/* Backend Status Indicators */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RW-Driver: OK</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BG-API: OK</span>
            </div>
          </div>

          {/* Unified Risk Score Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${getRiskBadgeColor()}`}>
            <Radio className="w-3.5 h-3.5" />
            <span>RISK: {metrics.compositeRiskScore}/100</span>
          </div>

          {/* Simulate Attack Trigger Button */}
          <button
            onClick={onSimulateAttack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 shadow-glow-red transition-all active:scale-95"
            title="Inject simulated ransomware & identity correlation event to test AI response"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Simulate Attack</span>
          </button>
        </div>

      </div>
    </header>
  );
};
