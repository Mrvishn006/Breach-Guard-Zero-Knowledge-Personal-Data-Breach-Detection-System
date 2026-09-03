// Unified Types for AegisGuard SOC

export type ServiceStatus = 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'OFFLINE';

export interface BackendStatus {
  ransomWatch: {
    status: ServiceStatus;
    driverLoaded: boolean;
    commPort: string;
    activeGids: number;
    trapsActive: number;
    lastTelemetry: string;
  };
  breachGuard: {
    status: ServiceStatus;
    port: number;
    kAnonymityReady: boolean;
    rateLimiterActive: boolean;
    lastChecked: string;
  };
}

// --- RansomWatch Data Models ---
export interface RansomWatchProcess {
  gid: number;
  mainPid: number;
  name: string;
  pids: number[];
  status: 'MONITORED' | 'SUSPICIOUS' | 'MALICIOUS' | 'TERMINATED';
  entropy: number; // 0.0 - 8.0 Shannon entropy
  irpCount: number;
  changedFilesCount: number;
  createdFilesCount: number;
  detectedTriggers: string[];
  startTime: string;
  killTime?: string;
  reportPath?: string;
}

export interface RansomWatchTrap {
  id: string;
  path: string;
  extension: string;
  category: 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'DATABASE';
  state: 'ARMED' | 'TRIGGERED' | 'RESTORED' | 'NOT_DEPLOYED';
  lastModified?: string;
}

export interface RansomWatchReport {
  id: string;
  gid: number;
  processName: string;
  startTime: string;
  killTime: string;
  isKilled: boolean;
  pids: number[];
  changedFiles: string[];
  createdFiles: string[];
  restoreStatus: 'SUCCESS' | 'PARTIAL' | 'PENDING' | 'FAILED';
  azureSnapshotTimestamp?: string;
}

export interface IrpTelemetryEvent {
  id: string;
  timestamp: string;
  gid: number;
  pid: number;
  processName: string;
  irpType: 'IRP_MJ_CREATE' | 'IRP_MJ_READ' | 'IRP_MJ_WRITE' | 'IRP_MJ_SET_INFORMATION';
  filePath: string;
  entropy: number;
  isTrap: boolean;
  source?: 'KERNEL_RANSOMWATCH' | 'USER_MODE_FALLBACK' | string;
}

// --- Breach Guard Data Models ---
export interface EnrichedBreach {
  name: string;
  title: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  pwnCount: number;
  description: string;
  dataClasses: string[];
  isVerified: boolean;
  isFabricated: boolean;
  isSensitive: boolean;
  isRetired: boolean;
  isSpamList: boolean;
  logoPath?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface EmailBreachResult {
  email: string;
  exposed: boolean;
  breaches: string[];
  enrichedBreaches: EnrichedBreach[];
  checkedAt: string;
  riskScore: number;
}

export interface PasswordBreachResult {
  sha1Prefix: string;
  sha1FullMasked: string;
  exposed: boolean;
  breachCount: number;
  evaluationTimeMs: number;
  strengthScore: number; // 0-4
  checkedAt: string;
}

// --- AI / Agentic Layer Models ---
export interface CorrelatedIncident {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  timestamp: string;
  correlationSummary: string;
  threatActorContext: string;
  linkedGid?: number;
  linkedProcess?: string;
  linkedEmail?: string;
  compromisedDataClasses: string[];
  attackVector: string;
  recommendedPlaybook: string[];
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATED';
  rawRansomWatchReport?: RansomWatchReport;
  rawBreachGuardData?: EmailBreachResult;
  evidence?: {
    source: string;
    eventId?: string;
    timestamp: string;
    pid?: number;
    gid?: number;
    operation?: string;
    path?: string;
    entropy?: number;
    details?: string;
  }[];
}

export interface SecurityMetrics {
  compositeRiskScore: number; // 0 - 100
  threatLevel: 'MINIMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  activeRansomwareThreats: number;
  activeBreachedAccounts: number;
  protectedDirectories: number;
  totalIrpsProcessed: number;
  recoveredFilesCount: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  text: string;
  suggestedActions?: { label: string; actionKey: string; params?: any }[];
  incidentContext?: CorrelatedIncident;
}

export interface DataBrokerEntry {
  name: string;
  category: string;
  optOutUrl: string;
  method: string;
  estimatedRemovalDays: string;
  dataCollected: string[];
  legalBasis: string;
}

export interface GdprRequestPayload {
  fullName: string;
  email: string;
  targetCompany: string;
  requestType: 'ERASURE' | 'ACCESS';
}

export interface LiveEndpointEvent {
  id: string;
  timestamp: string;
  eventType: 'FILE CREATED' | 'FILE MODIFIED' | 'FILE RENAMED' | 'FILE DELETED' | 'ENTROPY ANOMALY' | 'CANARY TRIGGERED' | 'RANSOMWARE DETECTED' | 'PROCESS GROUP CONTAINED' | 'RECOVERY INITIATED';
  path: string;
  processName: string;
  gid?: number;
  pid?: number;
  entropy?: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
}
