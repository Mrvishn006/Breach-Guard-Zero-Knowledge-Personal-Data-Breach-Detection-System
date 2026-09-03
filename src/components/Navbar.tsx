import React from 'react';
import { Shield, Radio, Activity, Database, Bot, Zap, Cpu, Lock, Terminal, Play } from 'lucide-react';
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
                BreachGuard SOC
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                Unified Protection
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Orchestrating</span>
              <span className="text-cyan-400 font-semibold">RansomWatch (Kernel)</span>
              <span>+</span>
              <span className="text-indigo-400 font-semibold">Breach Guard (ZK)</span>
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Unified SOC</span>
          </button>

          <button
            onClick={() => setActiveTab('ransomwatch')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ransomwatch'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RansomWatch</span>
          </button>

          <button
            onClick={() => setActiveTab('breachguard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breachguard'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Breach Guard</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'copilot'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          </button>
        </nav>

        {/* Right: Telemetry Badges & Simulation Button */}
        <div className="flex items-center gap-3">
          {/* Live Driver Telemetry Status Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">Live Driver Telemetry:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>

          {/* Threat Level Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold font-mono uppercase ${getRiskBadgeColor()}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{metrics.threatLevel}</span>
          </div>

          {/* Controlled Simulation Test Button */}
          <button
            onClick={onSimulateAttack}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Inject controlled high-entropy attack scenario for end-to-end driver response verification"
          >
            <Play className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Test Scenario</span>
          </button>
        </div>

      </div>
    </header>
  );
};
