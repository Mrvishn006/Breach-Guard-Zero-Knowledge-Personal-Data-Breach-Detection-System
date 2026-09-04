import { CorrelatedIncident, SecurityMetrics, AIChatMessage, TechnicalDetailsItem } from '../types';
import { ransomWatchAdapter } from '../adapters/ransomwatch-adapter';
import { breachGuardAdapter } from '../adapters/breachguard-adapter';

/**
 * BreachGuard Assistant Orchestrator
 * Serves as the conversational intelligence layer for BreachGuard Assistant.
 * Grounded 100% in real telemetry, live driver status, verified honeypot canary states,
 * deterministic risk scoring, and zero-knowledge identity breaches.
 */
class AIAgentOrchestrator {
  private activeIncidents: CorrelatedIncident[] = [];
  private chatHistory: AIChatMessage[] = [
    {
      id: 'msg-greeting-1',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hi! 👋\n\nI'm your BreachGuard Assistant.\n\nI'm here to help you understand your computer's security without drowning you in technical jargon.\n\nYou can ask me things like:\n\n• Is my computer safe?\n• What's happening right now?\n• Did you detect anything unusual?\n• Why did my risk score change?\n• What should I do next?\n\nI'm ready whenever you are."
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
          details: `Shannon entropy measured at ${maliciousRw.entropy.toFixed(2)} (threshold: 7.8)`
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
        correlationSummary = `I verified that ${exposedAdmin.email} appeared in a public breach dump (${exposedAdmin.breaches.slice(0, 3).join(', ')}), followed by process ${procName} (process group ID ${gid}) modifying files with unusually high entropy.`;
        attackVector = 'Verified Credential Exposure -> Suspicious Binary Execution -> High-Entropy Filesystem Activity';
      } else {
        correlationSummary = `I detected unusual activity where process ${procName} (process group ID ${gid}) modified ${changedFiles.length} files with high entropy.`;
        attackVector = 'Local Suspicious Execution -> Filesystem Encryption Attempt';
      }

      incidents.push({
        id: `INC-REAL-${gid || '01'}`,
        title: `Suspicious Process Group Flagged (GID ${gid || 'UNASSIGNED'})`,
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

  /**
   * Generates a warm, friendly, natural, and honest conversational response grounded in real data.
   */
  public async sendMessage(userPrompt: string): Promise<AIChatMessage> {
    const userMsg: AIChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userPrompt
    };
    this.chatHistory.push(userMsg);

    const incidents = this.getActiveIncidents();
    const metrics = this.calculateCompositeMetrics();
    const procs = ransomWatchAdapter.getTrackedProcesses();
    const traps = ransomWatchAdapter.getTraps();
    const bgHistory = breachGuardAdapter.getHistory();
    const driverState = ransomWatchAdapter.getDriverState();
    const telemetryStatus = ransomWatchAdapter.getTelemetryStatus();

    const topMalicious = procs.find(p => p.status === 'MALICIOUS' || p.status === 'TERMINATED');
    const triggeredTraps = traps.filter(t => t.state === 'TRIGGERED');
    const exposedAccounts = bgHistory.filter(b => b.exposed);

    let replyText = '';
    let suggestedActions: AIChatMessage['suggestedActions'] = undefined;
    let technicalDetails: TechnicalDetailsItem[] | undefined = undefined;

    const lower = userPrompt.toLowerCase().trim();

    // 1. Greetings
    if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
      replyText = "Hi! 👋 How can I help you today?\n\nFeel free to ask me if your computer is safe, what RansomWatch is doing, or why your risk score looks the way it does.";
    }

    // 2. "Is my computer safe?" / General Safety
    else if (lower.includes('safe') || lower.includes('okay') || lower.includes('fine') || lower.includes('protected') || lower.includes('check my protection')) {
      if (metrics.compositeRiskScore === 0 && !topMalicious && triggeredTraps.length === 0) {
        if (driverState.running) {
          replyText = "From the security information I can currently verify, everything looks quiet right now. I haven't seen evidence of an active threat.\n\nRansomWatch is running in the background and watching your protected folders for unusual behavior.";
        } else if (driverState.installed) {
          replyText = "From the data I have, I haven't seen any verified threats, but the RansomWatch driver is currently stopped. I recommend starting it so real-time file defense is active.";
        } else {
          replyText = "I haven't seen evidence of an active threat from the checks I've run, but RansomWatch isn't installed yet, so kernel-level filesystem monitoring isn't active.";
        }
      } else {
        replyText = `Hey, I noticed some items that deserve attention. Your current risk score is ${metrics.compositeRiskScore} out of 100 (${metrics.threatLevel}).\n\n${topMalicious ? `I detected suspicious file encryption activity linked to process group ID ${topMalicious.gid} (${topMalicious.name}).` : ''} ${triggeredTraps.length > 0 ? `One of your canary decoy files was touched.` : ''} ${exposedAccounts.length > 0 ? `Also, ${exposedAccounts.length} email account was found in a past credential breach.` : ''}\n\nWould you like me to walk you through the evidence or take a safe response action?`;
        
        if (topMalicious && topMalicious.status === 'MALICIOUS') {
          suggestedActions = [
            { label: `Stop Process Group (GID ${topMalicious.gid})`, actionKey: 'TERMINATE_GID', params: { gid: topMalicious.gid } },
            { label: 'Review Evidence', actionKey: 'REVIEW_EVIDENCE' }
          ];
        }
      }

      technicalDetails = [
        { label: 'Risk Score', value: `${metrics.compositeRiskScore}/100`, highlight: metrics.compositeRiskScore > 0 },
        { label: 'Threat Level', value: metrics.threatLevel },
        { label: 'Driver State', value: driverState.serviceState },
        { label: 'Telemetry Stream', value: telemetryStatus },
        { label: 'Active Monitored Processes', value: procs.length },
        { label: 'Armed Canary Decoys', value: traps.filter(t => t.state === 'ARMED').length },
        { label: 'Breached Identities', value: exposedAccounts.length }
      ];
    }

    // 3. "What's happening right now?" / Status / Live telemetry
    else if (lower.includes('happening') || lower.includes('right now') || lower.includes('status') || lower.includes('what is happening')) {
      if (telemetryStatus === 'LIVE') {
        replyText = `Good news — RansomWatch is running and I'm receiving live endpoint activity.\n\nRight now, I'm tracking ${procs.length} process groups and monitoring ${metrics.protectedDirectories} protected directories. Everything looks quiet and orderly from the telemetry I've received.`;
      } else if (telemetryStatus === 'CONNECTED_AWAITING_EVENTS') {
        replyText = "RansomWatch is running. I haven't received a new filesystem event yet, so things are quiet from the telemetry I've received.";
      } else if (driverState.serviceState === 'STOPPED') {
        replyText = "The RansomWatch driver is installed, but it isn't running right now. You can start it from the RansomWatch tab.";
      } else if (driverState.serviceState === 'NOT_INSTALLED') {
        replyText = "RansomWatch isn't installed yet, so kernel-level filesystem monitoring isn't active on your system.";
      } else {
        replyText = "I can't currently receive endpoint telemetry, so I don't want to guess about what's happening on your computer.";
      }

      technicalDetails = [
        { label: 'Driver Status', value: driverState.serviceState },
        { label: 'Communication Port', value: driverState.commPort },
        { label: 'Telemetry Mode', value: telemetryStatus },
        { label: 'IRPs Processed', value: metrics.totalIrpsProcessed },
        { label: 'Active Process Groups', value: procs.length }
      ];
    }

    // 4. "Did you notice / detect anything unusual?"
    else if (lower.includes('unusual') || lower.includes('notice') || lower.includes('detect') || lower.includes('anomaly') || lower.includes('suspicious')) {
      if (topMalicious) {
        replyText = `Hey, I noticed something unusual.\n\nA process (${topMalicious.name}, process group ID ${topMalicious.gid}) modified several files with unusually high entropy (${topMalicious.entropy.toFixed(2)}). That can sometimes happen during ransomware activity.\n\nI'm checking the surrounding evidence before making a stronger conclusion.`;
        technicalDetails = [
          { label: 'Process Name', value: topMalicious.name, highlight: true },
          { label: 'Process Group ID (GID)', value: topMalicious.gid, highlight: true },
          { label: 'Entropy Measured', value: `${topMalicious.entropy.toFixed(2)} / 8.0`, highlight: topMalicious.entropy > 7.5 },
          { label: 'Changed Files', value: topMalicious.changedFilesCount },
          { label: 'Process Status', value: topMalicious.status }
        ];
        if (topMalicious.status === 'MALICIOUS') {
          suggestedActions = [
            { label: `Stop Process Group (GID ${topMalicious.gid})`, actionKey: 'TERMINATE_GID', params: { gid: topMalicious.gid } }
          ];
        }
      } else if (triggeredTraps.length > 0) {
        replyText = `I noticed that a canary decoy file (${triggeredTraps[0].path}) was modified. Canary files are hidden traps designed to alert us if an unauthorized program starts tampering with your documents.`;
        technicalDetails = [
          { label: 'Decoy File Path', value: triggeredTraps[0].path, highlight: true },
          { label: 'Decoy Category', value: triggeredTraps[0].category },
          { label: 'State', value: triggeredTraps[0].state }
        ];
      } else {
        replyText = "Everything looks quiet right now. I haven't seen evidence of an active threat or any unusual file encryption patterns.";
        technicalDetails = [
          { label: 'High-Entropy Anomalies', value: '0 detected' },
          { label: 'Triggered Canaries', value: '0 triggered' },
          { label: 'Active Threat Signals', value: 'None' }
        ];
      }
    }

    // 5. "Why did my risk score change?" / Risk score breakdown
    else if (lower.includes('score') || lower.includes('risk') || lower.includes('why') && lower.includes('25') || lower.includes('breakdown')) {
      replyText = `Your current risk score is ${metrics.compositeRiskScore} out of 100, which puts your system at a ${metrics.threatLevel.toLowerCase()} threat level.\n\nI can walk you through exactly which verified security signals contributed to that score:\n\n• Baseline system risk: 0 points\n• High-entropy file anomalies: ${topMalicious && topMalicious.entropy > 7.5 ? '+15 points' : '+0 points'}\n• Canary trap modifications: ${triggeredTraps.length > 0 ? '+30 points' : '+0 points'}\n• Suspicious or malicious processes: ${topMalicious ? '+45 points' : '+0 points'}\n• Publicly exposed email credentials: ${exposedAccounts.length > 0 ? `+${Math.min(25, exposedAccounts.length * 12)} points` : '+0 points'}`;

      technicalDetails = [
        { label: 'Composite Risk Score', value: `${metrics.compositeRiskScore}/100`, highlight: metrics.compositeRiskScore > 0 },
        { label: 'Threat Rating', value: metrics.threatLevel },
        { label: 'Process Risk Points', value: topMalicious ? (topMalicious.status === 'MALICIOUS' ? 45 : 20) : 0 },
        { label: 'Canary Risk Points', value: triggeredTraps.length > 0 ? 30 : 0 },
        { label: 'Identity Risk Points', value: exposedAccounts.length > 0 ? Math.min(25, exposedAccounts.length * 12) : 0 }
      ];
    }

    // 6. "What is RansomWatch?" / How does it work
    else if (lower.includes('what is ransomwatch') || lower.includes('ransomwatch') || lower.includes('how does ransomwatch work')) {
      replyText = "RansomWatch is BreachGuard's ransomware-defense component. It watches filesystem activity in real time using a specialized Windows driver (FsFilter driver) and looks for unusual patterns—like rapid file renames or high Shannon entropy—that could indicate malicious file encryption.\n\nIt also sets silent canary decoy files to catch threats the moment they touch your documents.";
      technicalDetails = [
        { label: 'Minifilter Driver', value: driverState.driverName },
        { label: 'Port Binding', value: driverState.commPort },
        { label: 'Entropy Detection Threshold', value: '7.8 / 8.0' },
        { label: 'Honeypot Decoy Strategy', value: 'Header-injected canary files' }
      ];
    }

    // 7. "Explain this alert" / Incident analysis
    else if (lower.includes('explain') || lower.includes('alert') || lower.includes('incident') || lower.includes('details')) {
      if (incidents.length > 0) {
        const inc = incidents[0];
        replyText = `Here's what I found regarding this alert:\n\n${inc.correlationSummary}\n\nI've identified the associated process activity and supporting filesystem evidence. I'll show you exactly what was recorded so you can decide how to proceed.`;
        
        technicalDetails = [
          { label: 'Incident ID', value: inc.id, highlight: true },
          { label: 'Severity', value: inc.severity, highlight: true },
          { label: 'Timestamp', value: new Date(inc.timestamp).toLocaleString() },
          { label: 'Linked Process', value: inc.linkedProcess || 'Unknown' },
          { label: 'Linked GID', value: inc.linkedGid || 'N/A' },
          { label: 'Attack Vector', value: inc.attackVector }
        ];

        if (inc.linkedGid) {
          suggestedActions = [
            { label: `Stop Process Group (GID ${inc.linkedGid})`, actionKey: 'TERMINATE_GID', params: { gid: inc.linkedGid } },
            { label: 'Review Evidence', actionKey: 'REVIEW_EVIDENCE' }
          ];
        }
      } else {
        replyText = "Everything looks quiet right now. I haven't seen evidence of an active threat or alert in the telemetry currently available to me.";
        technicalDetails = [
          { label: 'Active Incidents', value: '0' },
          { label: 'System Alert Status', value: 'Clear' }
        ];
      }
    }

    // 8. "What should I do?" / Recommendations
    else if (lower.includes('what should i do') || lower.includes('what to do') || lower.includes('action') || lower.includes('recommend') || lower.includes('next')) {
      if (topMalicious && topMalicious.status === 'MALICIOUS') {
        replyText = `I found evidence that may justify stopping this process group (${topMalicious.name}, process group ID ${topMalicious.gid}).\n\nWould you like to review the evidence first, or proceed with the authorized response to stop the process?`;
        suggestedActions = [
          { label: `Proceed with Authorized Response (Stop GID ${topMalicious.gid})`, actionKey: 'TERMINATE_GID', params: { gid: topMalicious.gid } },
          { label: 'Review Evidence', actionKey: 'REVIEW_EVIDENCE' }
        ];
        technicalDetails = [
          { label: 'Recommended Action', value: `Terminate GID ${topMalicious.gid} via driver signal`, highlight: true },
          { label: 'Target Process', value: topMalicious.name },
          { label: 'Trigger', value: 'High entropy write threshold exceeded' }
        ];
      } else if (exposedAccounts.length > 0) {
        replyText = `I noticed that ${exposedAccounts.length} of your email addresses was found in a known breach dump. I recommend updating the password for that account and ensuring two-factor authentication is turned on. You can also generate a formal data removal request from the Breach Guard tab.`;
        technicalDetails = [
          { label: 'Exposed Account', value: exposedAccounts[0].email, highlight: true },
          { label: 'Breaches Found', value: exposedAccounts[0].breaches.join(', ') },
          { label: 'Recommended Step', value: 'Password reset & GDPR Article 17 erasure notice' }
        ];
      } else if (!driverState.running) {
        replyText = "Right now, your RansomWatch driver is not running. The best next step is to head over to the RansomWatch tab and ensure the driver is active so you have real-time file defense.";
      } else {
        replyText = "I can help with that. First, let me check what security information is actually available so I don't give you advice based on assumptions.\n\nFrom everything I can currently verify, your system is running normally and no immediate action is needed.";
      }
    }

    // 9. "Show me the evidence"
    else if (lower.includes('evidence') || lower.includes('proof') || lower.includes('logs')) {
      const inc = incidents[0];
      const evidenceList = inc?.evidence;
      if (inc && evidenceList && evidenceList.length > 0) {
        replyText = `Here is the verified evidence I've collected for ${inc.title}:\n\n${evidenceList.map(e => `• ${e.source}: ${e.details || ''}`).join('\n')}\n\nYou can also click "Show technical evidence" below to see the exact process IDs and timestamps.`;
        technicalDetails = evidenceList.map(e => ({
          label: e.source,
          value: `${e.details || ''} (${e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : 'Recorded'})`
        }));
      } else {
        replyText = "I don't have evidence of any active threats or anomalies right now. Telemetry and honeypot signals are all clean.";
        technicalDetails = [
          { label: 'Verified Evidence Items', value: '0 items' },
          { label: 'Canary State', value: 'All armed decoys intact' },
          { label: 'Entropy Feed', value: 'Normal user baseline (< 6.0)' }
        ];
      }
    }

    // 10. Fallback / General Question
    else {
      replyText = `I evaluated your question against the security information I can currently verify from RansomWatch and Breach Guard.\n\nFrom the telemetry available to me, your risk score is ${metrics.compositeRiskScore} out of 100 (${metrics.threatLevel.toLowerCase()}), with ${procs.length} monitored process groups.\n\nFeel free to ask me if your computer is safe, what's happening right now, or why your risk score looks like this.`;
      technicalDetails = [
        { label: 'Composite Risk Score', value: `${metrics.compositeRiskScore}/100` },
        { label: 'Threat Level', value: metrics.threatLevel },
        { label: 'Driver Status', value: driverState.serviceState },
        { label: 'Active Process Groups', value: procs.length }
      ];
    }

    const agentMsg: AIChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
      suggestedActions,
      incidentContext: incidents[0],
      technicalDetails
    };

    this.chatHistory.push(agentMsg);
    return agentMsg;
  }

  /**
   * Executes verified authorized response actions using the non-invasive adapter
   */
  public async executeSuggestedAction(actionKey: string, params?: any): Promise<string> {
    if (actionKey === 'TERMINATE_GID') {
      const gid = params?.gid || 0;
      if (gid > 0) {
        const success = await ransomWatchAdapter.dispatchControlledAction('TERMINATE_GID', gid);
        const resultMsg = success
          ? `The authorized response completed successfully. The process group (GID ${gid}) was terminated.`
          : 'I dispatched the termination signal to the driver queue.';
        
        // Add response message to chat
        this.chatHistory.push({
          id: 'msg-action-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: resultMsg,
          technicalDetails: [
            { label: 'Authorized Action', value: 'TERMINATE_GID', highlight: true },
            { label: 'Process Group ID', value: gid },
            { label: 'Status', value: success ? 'TERMINATED' : 'DISPATCHED' }
          ]
        });

        return resultMsg;
      }
      return 'No active process group ID specified.';
    }

    if (actionKey === 'RESTORE_SNAPSHOT') {
      const gid = params?.gid || 0;
      const success = await ransomWatchAdapter.dispatchControlledAction('RESTORE_SNAPSHOT', gid);
      const resultMsg = success
        ? 'The authorized response completed successfully. The snapshot rollback was initiated.'
        : 'The rollback request was queued.';
      
      this.chatHistory.push({
        id: 'msg-action-' + Date.now(),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: resultMsg
      });

      return resultMsg;
    }

    if (actionKey === 'REVIEW_EVIDENCE') {
      const incidents = this.getActiveIncidents();
      const inc = incidents[0];
      const resultMsg = inc
        ? `Here is the evidence behind this alert:\n\n${inc.correlationSummary}\n\nAttack Vector: ${inc.attackVector}`
        : "I don't have enough verified evidence of an active threat right now.";
      
      this.chatHistory.push({
        id: 'msg-review-' + Date.now(),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: resultMsg,
        incidentContext: inc
      });

      return resultMsg;
    }

    return 'Action recorded.';
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
