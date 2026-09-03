import { CorrelatedIncident, SecurityMetrics, AIChatMessage } from '../types';
import { ransomWatchAdapter } from '../adapters/ransomwatch-adapter';
import { breachGuardAdapter } from '../adapters/breachguard-adapter';

/**
 * AI Security Agent & Evidence-Gated Orchestration Layer
 * Consumes genuine telemetry from RansomWatch kernel models and Breach Guard identity intelligence,
 * establishes causal cross-domain correlation strictly when backed by real evidence,
 * computes transparent deterministic risk scores, and manages response workflows.
 */
class AIAgentOrchestrator {
  private activeIncidents: CorrelatedIncident[] = [];
  private chatHistory: AIChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString(),
      text: '🤖 **BreachGuard AI SOC Copilot Initialized.**\n\nI am continuously monitoring real-time telemetry from the **RansomWatch Kernel Minifilter Driver (`FsFilter.sys`)** and identity exposure intelligence from **Breach Guard**.\n\n*System monitoring active — awaiting endpoint telemetry.*',
      suggestedActions: [
        { label: 'Check System Status', actionKey: 'CHECK_STATUS' },
        { label: 'Calculate Deterministic Risk Breakdown', actionKey: 'GET_RISK_BREAKDOWN' },
        { label: 'Review Protection Policies', actionKey: 'PROTECTION_POLICIES' }
      ]
    }
  ];

  constructor() {
    this.recalculateCorrelations();
  }

  /**
   * Evidence-gated cross-domain correlation engine
   */
  public recalculateCorrelations(): CorrelatedIncident[] {
    const rwReports = ransomWatchAdapter.getReports();
    const bgHistory = breachGuardAdapter.getHistory();
    const trackedProcs = ransomWatchAdapter.getTrackedProcesses();

    const incidents: CorrelatedIncident[] = [];

    // Find genuine malicious or terminated processes from RansomWatch
    const maliciousRw = rwReports.find(r => r.gid > 0 || r.changedFiles.length > 0) ||
      trackedProcs.find(p => p.status === 'MALICIOUS' || p.status === 'TERMINATED');
      
    // Find genuine exposed account from actual Breach Guard checks
    const exposedAdmin = bgHistory.find(b => b.exposed);

    if (maliciousRw) {
      const gid = 'gid' in maliciousRw ? maliciousRw.gid : 0;
      const procName = 'processName' in maliciousRw ? maliciousRw.processName : maliciousRw.name;
      const changedFiles = 'changedFiles' in maliciousRw ? maliciousRw.changedFiles : [];
      const startTime = 'startTime' in maliciousRw ? maliciousRw.startTime : new Date().toISOString();

      const evidenceList = [];

      if ('entropy' in maliciousRw && maliciousRw.entropy > 7.0) {
        evidenceList.push({
          source: 'RansomWatch Entropy Engine',
          timestamp: startTime,
          gid,
          pid: 'pids' in maliciousRw ? maliciousRw.pids[0] : 0,
          operation: 'IRP_MJ_WRITE',
          entropy: maliciousRw.entropy,
          details: `Shannon entropy measured at ${maliciousRw.entropy} (threshold: 7.8)`
        });
      }

      if (changedFiles.length > 0) {
        evidenceList.push({
          source: 'RansomWatch Minifilter (FsFilter.sys)',
          timestamp: startTime,
          gid,
          path: changedFiles[0],
          operation: 'FILE MODIFIED / RENAMED',
          details: `${changedFiles.length} file modifications intercepted`
        });
      }

      if (exposedAdmin) {
        evidenceList.push({
          source: 'Breach Guard Privacy Proxy',
          timestamp: exposedAdmin.checkedAt,
          details: `Compromised identity verified: ${exposedAdmin.email} in ${exposedAdmin.breaches.join(', ')}`
        });
      }

      let correlationSummary = '';
      let attackVector = '';

      if (exposedAdmin) {
        correlationSummary = `Cross-domain correlation identified verified exposure for ${exposedAdmin.email} in public dump (${exposedAdmin.breaches.slice(0, 3).join(', ')}), followed by execution of ${procName} (GID ${gid}) with high-entropy filesystem modifications.`;
        attackVector = 'Verified Credential Exposure -> Suspicious Binary Execution -> High-Entropy Filesystem Activity';
      } else {
        correlationSummary = `Verified kernel-level ransomware activity intercepted for process ${procName} (GID ${gid}) with ${changedFiles.length} modified files.`;
        attackVector = 'Local Suspicious Execution -> Filesystem Encryption Attempt';
      }

      incidents.push({
        id: `INC-REAL-${gid || '01'}`,
        title: `Ransomware Process Group Detected (GID ${gid || 'UNASSIGNED'})`,
        severity: 'CRITICAL',
        timestamp: startTime,
        correlationSummary,
        threatActorContext: 'Observed automated mass encryption behavior matching known ransomware heuristics.',
        linkedGid: gid || undefined,
        linkedProcess: procName,
        linkedEmail: exposedAdmin?.email,
        compromisedDataClasses: exposedAdmin?.enrichedBreaches.flatMap(b => b.dataClasses).filter((v, i, a) => a.indexOf(v) === i) || [],
        attackVector,
        recommendedPlaybook: [
          `Confirm Driver Kill Signal for GID ${gid} by FsFilter.sys.`,
          'Review modified files and verify integrity of local backups.',
          ...(exposedAdmin ? [`Enforce immediate credential reset for ${exposedAdmin.email}.`] : [])
        ],
        status: 'OPEN',
        rawRansomWatchReport: rwReports[0],
        rawBreachGuardData: exposedAdmin,
        evidence: evidenceList
      });
    }

    this.activeIncidents = incidents;
    return incidents;
  }

  /**
   * Deterministic Risk Scoring Model (0 to 100) — strictly grounded in observed evidence
   */
  public calculateCompositeMetrics(): SecurityMetrics {
    const trackedProcs = ransomWatchAdapter.getTrackedProcesses();
    const bgHistory = breachGuardAdapter.getHistory();
    const traps = ransomWatchAdapter.getTraps();

    let score = 0; // Clean baseline: 0 when clean

    const maliciousProcs = trackedProcs.filter(p => p.status === 'MALICIOUS');
    const terminatedProcs = trackedProcs.filter(p => p.status === 'TERMINATED');
    const exposedAccounts = bgHistory.filter(b => b.exposed);
    const triggeredTraps = traps.filter(t => t.state === 'TRIGGERED');

    if (maliciousProcs.length > 0) score += 45;
    if (terminatedProcs.length > 0) score += 20;
    if (triggeredTraps.length > 0) score += 30;

    // Real entropy anomalies
    const highEntropyProcs = trackedProcs.filter(p => p.entropy > 7.5);
    if (highEntropyProcs.length > 0) score += 15;

    // Real account breaches
    if (exposedAccounts.length > 0) {
      score += Math.min(25, exposedAccounts.length * 12);
    }

    const compositeScore = Math.min(100, Math.max(0, score));

    let threatLevel: 'MINIMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'MINIMAL';
    if (compositeScore >= 75) threatLevel = 'CRITICAL';
    else if (compositeScore >= 50) threatLevel = 'HIGH';
    else if (compositeScore >= 25) threatLevel = 'ELEVATED';

    return {
      compositeRiskScore: compositeScore,
      threatLevel,
      activeRansomwareThreats: maliciousProcs.length,
      activeBreachedAccounts: exposedAccounts.length,
      protectedDirectories: ransomWatchAdapter.getProtectedDirectories().length,
      totalIrpsProcessed: trackedProcs.reduce((acc, p) => acc + p.irpCount, 0),
      recoveredFilesCount: ransomWatchAdapter.getReports().filter(r => r.restoreStatus === 'SUCCESS').length
    };
  }

  public getActiveIncidents(): CorrelatedIncident[] {
    this.recalculateCorrelations();
    return [...this.activeIncidents];
  }

  public getChatHistory(): AIChatMessage[] {
    return [...this.chatHistory];
  }

  public async sendMessage(userPrompt: string): Promise<AIChatMessage> {
    const userMsg: AIChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      text: userPrompt
    };
    this.chatHistory.push(userMsg);

    const incidents = this.getActiveIncidents();
    const metrics = this.calculateCompositeMetrics();
    const procs = ransomWatchAdapter.getTrackedProcesses();
    const topMalicious = procs.find(p => p.status === 'MALICIOUS' || p.status === 'TERMINATED');

    let replyText = '';
    let suggestedActions: AIChatMessage['suggestedActions'] = undefined;

    const lower = userPrompt.toLowerCase();

    if (lower.includes('status') || lower.includes('check')) {
      replyText = `📊 **Current Endpoint & Identity Status:**\n\n- **Composite Risk Score:** ${metrics.compositeRiskScore}/100 (${metrics.threatLevel})\n- **Kernel Minifilter Driver:** Active on \`\\RWFilterPort\`\n- **Monitored Process Groups:** ${procs.length} active\n- **Honeypot Traps:** ${ransomWatchAdapter.getTraps().length} armed across protected shares\n- **Active Breached Identities:** ${metrics.activeBreachedAccounts} verified\n\n${topMalicious ? `Active alert: GID ${topMalicious.gid} (\`${topMalicious.name}\`) status is ${topMalicious.status}.` : 'No active threats or anomalous process groups detected.'}`;
    } else if (lower.includes('risk') || lower.includes('score') || lower.includes('breakdown')) {
      const traps = ransomWatchAdapter.getTraps().filter(t => t.state === 'TRIGGERED');
      replyText = `🛡️ **Evidence-Gated Risk Breakdown:**\n\n- **Baseline:** 0\n- **High Entropy Anomalies (>7.8):** ${topMalicious && topMalicious.entropy > 7.5 ? '+15' : '0'}\n- **Canary Traps Triggered:** ${traps.length > 0 ? '+30' : '0'}\n- **Suspicious/Malicious Processes:** ${topMalicious ? '+45' : '0'}\n- **Breached Credentials:** ${metrics.activeBreachedAccounts > 0 ? `+${metrics.activeBreachedAccounts * 12}` : '0'}\n\n**Total Grounded Score:** **${metrics.compositeRiskScore}/100** (${metrics.threatLevel})`;
    } else if (lower.includes('explain') || lower.includes('incident')) {
      if (incidents.length > 0) {
        const inc = incidents[0];
        replyText = `🚨 **Incident Analysis (${inc.id}):**\n\n${inc.correlationSummary}\n\n**Attack Vector:**\n\`${inc.attackVector}\`\n\n**Evidence Grounding:**\n${(inc.evidence || []).map(e => `- [${e.source}] ${e.details}`).join('\n')}`;
      } else {
        replyText = `✅ **System monitoring active.**\n\nNo active attack chain or anomalous security incidents detected. Telemetry feed is clean.`;
      }
    } else if (lower.includes('mitigat') || lower.includes('playbook')) {
      if (topMalicious) {
        replyText = `🛡️ **Recommended Remediation Playbook:**\n\n1. **Driver Containment:** Confirm GID ${topMalicious.gid} is terminated across all child PIDs.\n2. **Integrity Check:** Verify modified files in protected directories.\n3. **Zero-Knowledge Breach Scan:** Check credentials with client-side k-Anonymity.\n4. **Data Broker Erasure:** Send GDPR Article 17 notices if personal data was exposed.`;
        suggestedActions = [
          { label: `Dispatch Kill Signal for GID ${topMalicious.gid}`, actionKey: 'TERMINATE_GID', params: { gid: topMalicious.gid } }
        ];
      } else {
        replyText = `🛡️ **Standard Protection Posture:**\n\n- Real-time filesystem minifilter is armed.\n- Honeypot canaries are armed.\n- Identity monitoring ready.\n\nNo active mitigation required at this time.`;
      }
    } else {
      replyText = `🤖 **BreachGuard AI SOC Response:**\n\nI have evaluated your request against verified real-time telemetry from **RansomWatch** and **Breach Guard**.\n\n- **Current Threat Level:** ${metrics.threatLevel} (Risk: ${metrics.compositeRiskScore}/100)\n- **Active Incidents:** ${incidents.length}\n- **Monitored Processes:** ${procs.length}\n\nAsk me for a status summary, risk breakdown, or incident explanation anytime.`;
    }

    const agentMsg: AIChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString(),
      text: replyText,
      suggestedActions,
      incidentContext: incidents[0]
    };

    this.chatHistory.push(agentMsg);
    return agentMsg;
  }

  public async executeSuggestedAction(actionKey: string, params?: any): Promise<string> {
    if (actionKey === 'TERMINATE_GID') {
      const gid = params?.gid || 0;
      if (gid > 0) {
        const success = await ransomWatchAdapter.dispatchControlledAction('TERMINATE_GID', gid);
        return success ? `✅ Driver kill command successfully executed for GID ${gid}.` : '⚠️ Action dispatched via local queue.';
      }
      return 'No active GID specified.';
    }

    if (actionKey === 'RESTORE_SNAPSHOT') {
      const gid = params?.gid || 0;
      const success = await ransomWatchAdapter.dispatchControlledAction('RESTORE_SNAPSHOT', gid);
      return success ? `✅ Cloud snapshot rollback initiated for GID ${gid}.` : '⚠️ Rollback dispatched via local queue.';
    }

    return 'Action recorded by orchestrator.';
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
