import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarLeft } from './components/SidebarLeft';
import { NavRailRight, NavRailDestination } from './components/NavRailRight';
import { StatusBarBottom } from './components/StatusBarBottom';
import { UnifiedOverview } from './components/UnifiedOverview';
import { RansomWatchMonitor } from './components/RansomWatchMonitor';
import { BreachGuardConsole } from './components/BreachGuardConsole';
import { AICopilot } from './components/AICopilot';
import { CorrelatedIncidentModal } from './components/CorrelatedIncidentModal';

import { SecurityMetrics, CorrelatedIncident, IrpTelemetryEvent, LiveEndpointEvent, AIChatMessage, EmailBreachResult } from './types';
import { ransomWatchAdapter, DriverStateInfo } from './adapters/ransomwatch-adapter';
import { breachGuardAdapter } from './adapters/breachguard-adapter';
import { aiAgentOrchestrator } from './services/ai-agent-orchestrator';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ransomwatch' | 'breachguard' | 'copilot'>('overview');
  const [activeRailDest, setActiveRailDest] = useState<NavRailDestination>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State from Orchestrator & Adapters
  const [metrics, setMetrics] = useState<SecurityMetrics>(aiAgentOrchestrator.calculateCompositeMetrics());
  const [incidents, setIncidents] = useState<CorrelatedIncident[]>(aiAgentOrchestrator.getActiveIncidents());
  const [recentIrps, setRecentIrps] = useState<IrpTelemetryEvent[]>([]);
  const [endpointEvents, setEndpointEvents] = useState<LiveEndpointEvent[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedIncident | null>(null);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(aiAgentOrchestrator.getChatHistory());
  const [breachHistory, setBreachHistory] = useState<EmailBreachResult[]>(breachGuardAdapter.getHistory());
  const [isTelemetryLive, setIsTelemetryLive] = useState(false);

  // Dynamic Driver & RansomWatch State
  const [driverState, setDriverState] = useState<DriverStateInfo>(ransomWatchAdapter.getDriverState());
  const [processes, setProcesses] = useState(ransomWatchAdapter.getTrackedProcesses());
  const [traps, setTraps] = useState(ransomWatchAdapter.getTraps());
  const [reports, setReports] = useState(ransomWatchAdapter.getReports());
  const [directories, setDirectories] = useState(ransomWatchAdapter.getProtectedDirectories());

  const refreshDriverState = async () => {
    const updated = await ransomWatchAdapter.checkRealDriverStatus();
    setDriverState(updated);
    refreshOrchestrator();
  };

  // Check driver state and metadata on mount
  useEffect(() => {
    refreshDriverState();
    const interval = setInterval(refreshDriverState, 8000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to real-time WebSocket telemetry from RansomWatch Bridge
  useEffect(() => {
    const unsubscribe = ransomWatchAdapter.subscribeTelemetry((irp, epEvent) => {
      setIsTelemetryLive(true);
      setRecentIrps(prev => [irp, ...prev.slice(0, 29)]);
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
    setDirectories(ransomWatchAdapter.getProtectedDirectories());
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

  // Sync Nav Rail destination with tabs
  const handleSelectRailDestination = (dest: NavRailDestination) => {
    setActiveRailDest(dest);
    switch (dest) {
      case 'dashboard':
        setActiveTab('overview');
        break;
      case 'threats':
        if (incidents.length > 0) {
          setSelectedIncident(incidents[0]);
        } else {
          setActiveTab('overview');
        }
        break;
      case 'telemetry':
      case 'file_activity':
        setActiveTab('overview');
        break;
      case 'identities':
      case 'network':
        setActiveTab('breachguard');
        break;
      case 'processes':
      case 'reports':
      case 'recovery':
        setActiveTab('ransomwatch');
        break;
      case 'ai_analysis':
        setActiveTab('copilot');
        break;
      case 'settings':
        setActiveTab('ransomwatch');
        break;
    }
  };

  const handleTabChange = (tab: 'overview' | 'ransomwatch' | 'breachguard' | 'copilot') => {
    setActiveTab(tab);
    if (tab === 'overview') setActiveRailDest('dashboard');
    else if (tab === 'ransomwatch') setActiveRailDest('processes');
    else if (tab === 'breachguard') setActiveRailDest('identities');
    else if (tab === 'copilot') setActiveRailDest('ai_analysis');
  };

  const handleDomainShortcut = (domainKey: string) => {
    switch (domainKey) {
      case 'ransomware':
      case 'processes':
      case 'recovery':
        handleTabChange('ransomwatch');
        break;
      case 'breachguard':
      case 'identities':
      case 'network':
        handleTabChange('breachguard');
        break;
      case 'ai_soc':
        handleTabChange('copilot');
        break;
      case 'telemetry':
      case 'file_activity':
      default:
        handleTabChange('overview');
        break;
    }
  };

  const armedCanariesCount = traps.filter(t => t.state === 'ARMED').length;
  const telemetryStatus = ransomWatchAdapter.getTelemetryStatus();

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-900">
      
      {/* Top Main Application Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        metrics={metrics}
        onSimulateAttack={() => {}}
        isTelemetryLive={isTelemetryLive}
      />

      {/* Main 3-Column Desktop Application Shell */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* Left Information Panel */}
          <SidebarLeft 
            metrics={metrics}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            trackedProcessesCount={processes.length}
            uptimeText="Active"
            lastUpdateText={new Date().toLocaleTimeString()}
            isTelemetryLive={isTelemetryLive}
            driverStatus={driverState.serviceState}
            armedCanariesCount={armedCanariesCount}
          />

          {/* Central Main Content View Container */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            
            {/* Tab 1: Unified Security Operations Overview */}
            {activeTab === 'overview' && (
              <UnifiedOverview 
                metrics={metrics}
                incidents={incidents}
                recentIrps={recentIrps}
                endpointEvents={endpointEvents}
                onSelectIncident={setSelectedIncident}
                onNavigateTab={handleTabChange}
                onSimulateAttack={() => {}}
                onSelectDomain={handleDomainShortcut}
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
                driverState={driverState}
                onRefreshDriverState={refreshDriverState}
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

          {/* Right Navigation Rail */}
          <NavRailRight 
            activeDestination={activeRailDest}
            onSelectDestination={handleSelectRailDestination}
          />

        </div>
      </div>

      {/* Root Cause Analysis & Forensic Incident Modal */}
      <CorrelatedIncidentModal 
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onMitigate={handleMitigateIncident}
      />

      {/* Bottom System Status Bar with Dynamic Real Driver & Telemetry States */}
      <StatusBarBottom 
        driverStatus={driverState.serviceState}
        telemetryStatus={telemetryStatus}
      />

    </div>
  );
}

export default App;
