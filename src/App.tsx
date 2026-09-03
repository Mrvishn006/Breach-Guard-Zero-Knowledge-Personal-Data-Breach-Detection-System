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
  const [incidents, setIncidents] = useState<CorrelatedIncident[]>(aiAgentOrchestrator.getCorrelatedIncidents());
  const [recentIrps, setRecentIrps] = useState<IrpTelemetryEvent[]>([
    ransomWatchAdapter.generateNextIrpTelemetry(),
    ransomWatchAdapter.generateNextIrpTelemetry(),
    ransomWatchAdapter.generateNextIrpTelemetry(),
    ransomWatchAdapter.generateNextIrpTelemetry()
  ]);
  const [endpointEvents, setEndpointEvents] = useState<LiveEndpointEvent[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedIncident | null>(null);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(aiAgentOrchestrator.getChatHistory());
  const [breachHistory, setBreachHistory] = useState<EmailBreachResult[]>(breachGuardAdapter.getHistory());

  // RansomWatch data
  const [processes, setProcesses] = useState(ransomWatchAdapter.getTrackedProcesses());
  const [traps, setTraps] = useState(ransomWatchAdapter.getTraps());
  const [reports, setReports] = useState(ransomWatchAdapter.getReports());
  const [directories, setDirectories] = useState(ransomWatchAdapter.getProtectedDirectories());

  // Subscribe to live WebSocket telemetry from RansomWatch Bridge
  useEffect(() => {
    const unsubscribe = ransomWatchAdapter.subscribeTelemetry((irp, epEvent) => {
      setRecentIrps(prev => [irp, ...prev.slice(0, 24)]);
      if (epEvent) {
        setEndpointEvents(prev => [epEvent, ...prev.slice(0, 49)]);
      }
    });

    // Fallback polling for local simulation
    const interval = setInterval(() => {
      const nextIrp = ransomWatchAdapter.generateNextIrpTelemetry();
      setRecentIrps(prev => [nextIrp, ...prev.slice(0, 24)]);
    }, 2800);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const refreshOrchestrator = () => {
    setIncidents(aiAgentOrchestrator.getCorrelatedIncidents());
    setMetrics(aiAgentOrchestrator.calculateCompositeMetrics());
    setProcesses(ransomWatchAdapter.getTrackedProcesses());
    setTraps(ransomWatchAdapter.getTraps());
    setReports(ransomWatchAdapter.getReports());
  };

  // Simulate Attack Scenario (For controlled demonstration)
  const handleSimulateAttack = () => {
    const { process, report } = ransomWatchAdapter.triggerTestAttack();
    refreshOrchestrator();

    const alertMsg: AIChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString(),
      text: `🚨 **NEW HIGH-PRIORITY ATTACK CORRELATED!**\n\nRansomWatch detected rogue process \`${process.name}\` (GID: ${process.gid}, Main PID: ${process.mainPid}) attempting unauthorized high-entropy writes (**Shannon Entropy: ${process.entropy}**). Minifilter driver \`FsFilter.sys\` dispatched **MESSAGE_KILL_GID** to terminate the process tree. Azure snapshot restore triggered for affected database files.`,
      suggestedActions: [
        { label: 'View Incident Report', actionKey: 'EXPLAIN_INCIDENT' },
        { label: 'Verify Azure Snapshot Integrity', actionKey: 'RESTORE_AZURE' }
      ]
    };

    setChatMessages(prev => [...prev, alertMsg]);
  };

  const handleSendMessage = async (query: string) => {
    await aiAgentOrchestrator.handleUserQuery(query);
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
      compositeRiskScore: Math.max(15, prev.compositeRiskScore - 30),
      threatLevel: 'MINIMAL'
    }));
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top SOC Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        onSimulateAttack={handleSimulateAttack}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        
        {activeTab === 'overview' && (
          <UnifiedOverview
            metrics={metrics}
            incidents={incidents}
            recentIrps={recentIrps}
            endpointEvents={endpointEvents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSimulateAttack={handleSimulateAttack}
          />
        )}

        {activeTab === 'ransomwatch' && (
          <RansomWatchMonitor
            processes={processes}
            traps={traps}
            reports={reports}
            directories={directories}
            recentIrps={recentIrps}
            onTriggerTestAttack={handleSimulateAttack}
          />
        )}

        {activeTab === 'breachguard' && (
          <BreachGuardConsole
            history={breachHistory}
            onEmailChecked={handleEmailChecked}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilot
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onSimulateAttack={handleSimulateAttack}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 px-4 py-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BreachGuard Unified Cybersecurity Platform &bull; Zero-Knowledge Credential Defense & Real-Time Ransomware Mitigation</span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-cyan-400">RansomWatch (Kernel FsFilter.sys): Authoritative</span>
            <span className="text-indigo-400">Breach Guard (k-Anonymity): Client-Side Hashed</span>
          </div>
        </div>
      </footer>

      {/* Correlated Incident Detail Modal */}
      {selectedIncident && (
        <CorrelatedIncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onMitigate={handleMitigateIncident}
        />
      )}

    </div>
  );
}

export default App;
