import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UnifiedOverview } from './components/UnifiedOverview';
import { RansomWatchMonitor } from './components/RansomWatchMonitor';
import { BreachGuardConsole } from './components/BreachGuardConsole';
import { AICopilot } from './components/AICopilot';
import { CorrelatedIncidentModal } from './components/CorrelatedIncidentModal';

import { SecurityMetrics, CorrelatedIncident, IrpTelemetryEvent, LiveEndpointEvent, AIChatMessage, EmailBreachResult } from './types';
import { ransomWatchAdapter } from './adapters/ransomwatch-adapter';
import { breachGuardAdapter } from './adapters/breachguard-adapter';
import { aiAgentOrchestrator } from './services/ai-agent-orchestrator';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ransomwatch' | 'breachguard' | 'copilot'>('overview');
  
  // State from Orchestrator & Adapters
  const [metrics, setMetrics] = useState<SecurityMetrics>(aiAgentOrchestrator.calculateCompositeMetrics());
  const [incidents, setIncidents] = useState<CorrelatedIncident[]>(aiAgentOrchestrator.getActiveIncidents());
  const [recentIrps, setRecentIrps] = useState<IrpTelemetryEvent[]>([]);
  const [endpointEvents, setEndpointEvents] = useState<LiveEndpointEvent[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedIncident | null>(null);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(aiAgentOrchestrator.getChatHistory());
  const [breachHistory, setBreachHistory] = useState<EmailBreachResult[]>(breachGuardAdapter.getHistory());

  // RansomWatch data
  const [processes, setProcesses] = useState(ransomWatchAdapter.getTrackedProcesses());
  const [traps, setTraps] = useState(ransomWatchAdapter.getTraps());
  const [reports, setReports] = useState(ransomWatchAdapter.getReports());
  const [directories, setDirectories] = useState(ransomWatchAdapter.getProtectedDirectories());

  // Subscribe to genuine real-time WebSocket telemetry from RansomWatch Bridge
  useEffect(() => {
    const unsubscribe = ransomWatchAdapter.subscribeTelemetry((irp, epEvent) => {
      setRecentIrps(prev => [irp, ...prev.slice(0, 24)]);
      if (epEvent) {
        setEndpointEvents(prev => [epEvent, ...prev.slice(0, 49)]);
      }
      refreshOrchestrator();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshOrchestrator = () => {
    setIncidents(aiAgentOrchestrator.getActiveIncidents());
    setMetrics(aiAgentOrchestrator.calculateCompositeMetrics());
    setProcesses(ransomWatchAdapter.getTrackedProcesses());
    setTraps(ransomWatchAdapter.getTraps());
    setReports(ransomWatchAdapter.getReports());
  };

  const handleSendMessage = async (query: string) => {
    await aiAgentOrchestrator.sendMessage(query);
    setChatMessages(aiAgentOrchestrator.getChatHistory());
    refreshOrchestrator();
  };

  const handleEmailChecked = (result: EmailBreachResult) => {
    setBreachHistory(breachGuardAdapter.getHistory());
    refreshOrchestrator();
  };

  const handleMitigateIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'MITIGATED' } : inc));
    setMetrics(prev => ({
      ...prev,
      compositeRiskScore: 0,
      threatLevel: 'MINIMAL',
      activeRansomwareThreats: 0
    }));
  };

  const handleActionExecute = async (actionKey: string, params?: any) => {
    const resText = await aiAgentOrchestrator.executeSuggestedAction(actionKey, params);
    setChatMessages(aiAgentOrchestrator.getChatHistory());
    refreshOrchestrator();
    return resText;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Main Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        metrics={metrics}
        onSimulateAttack={() => {}}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Tab 1: Unified Security Operations Overview */}
        {activeTab === 'overview' && (
          <UnifiedOverview 
            metrics={metrics}
            incidents={incidents}
            recentIrps={recentIrps}
            endpointEvents={endpointEvents}
            onSelectIncident={setSelectedIncident}
            onNavigateTab={setActiveTab}
            onSimulateAttack={() => {}}
          />
        )}

        {/* Tab 2: RansomWatch Kernel Defense */}
        {activeTab === 'ransomwatch' && (
          <RansomWatchMonitor 
            processes={processes}
            traps={traps}
            reports={reports}
            directories={directories}
            recentIrps={recentIrps}
            onTriggerTestAttack={() => {}}
          />
        )}

        {/* Tab 3: Breach Guard Intelligence & Privacy */}
        {activeTab === 'breachguard' && (
          <BreachGuardConsole 
            history={breachHistory}
            onEmailChecked={handleEmailChecked}
          />
        )}

        {/* Tab 4: AI SOC Copilot & Autonomous Triage */}
        {activeTab === 'copilot' && (
          <AICopilot 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onSelectIncident={setSelectedIncident}
            onSimulateAttack={() => {}}
          />
        )}

      </main>

      {/* Root Cause Analysis & Forensic Incident Modal */}
      <CorrelatedIncidentModal 
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onMitigate={handleMitigateIncident}
      />

      {/* Footer Status Line */}
      <footer className="border-t border-slate-800/80 py-4 px-6 bg-slate-950/40 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>BreachGuard Unified Endpoint Defense &bull; Zero-Knowledge Security Platform</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Shannon Entropy Engine: <strong className="text-slate-400">Armed</strong></span>
          <span>k-Anonymity Cache: <strong className="text-slate-400">Active</strong></span>
          <span>FsFilter: <strong className="text-emerald-400">\\RWFilterPort</strong></span>
        </div>
      </footer>

    </div>
  );
}

export default App;
