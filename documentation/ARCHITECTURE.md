# BreachGuard — Technical Architecture & Integration Specification

## 🏛️ System Overview

BreachGuard is an integrated, privacy-preserving cybersecurity operations and endpoint ransomware defense platform. It pairs real-time kernel-level file system interception with zero-knowledge identity breach detection.

```
                         BREACHGUARD
                              │
                  Windows Desktop Application
                              │
                 ┌────────────┴────────────┐
                 │                         │
          React/Vite UI              Desktop Backend (Electron)
                 │                         │
                 └────────────┬────────────┘
                              │
                    Integration / IPC Layer
                              │
                       RansomWatch
                              │
                       FsFilter.sys
                              │
                 Windows File System
                              │
                    REAL FILES / PROCESSES
```

---

## 🔍 Core Subsystems

### 1. RansomWatch Endpoint Engine (Authoritative)
* **Kernel Minifilter Driver (`FsFilter.sys`)**: Intercepts low-level filesystem IRPs (`IRP_MJ_CREATE`, `IRP_MJ_WRITE`, `IRP_MJ_SET_INFORMATION`) system-wide across all active storage volumes.
* **Shannon Entropy Engine**: Computes exact byte randomness:
  $$H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$$
  Modifications exceeding entropy threshold ($H > 7.8$) flag active encryption in flight.
* **Canary Trap Network (`TrapHandler.cpp`)**: Seeds decoy bait files across critical user directories (`!00_financial_2026.xlsx`, `!00_users_prod.mdf`). Any unauthorized touch trips an instant process-group kill switch.
* **Process-Group (GID) Tracking**: Tracks process parent/child trees to terminate entire malicious execution families simultaneously.
* **Automated Cloud Recovery**: Integrates with Azure snapshot storage (`BackupService.h`) to rollback affected files to pre-encryption timestamps.

### 2. Breach Guard Zero-Knowledge Engine
* **Client-Side $k$-Anonymity SHA-1 Hashing**: Raw passwords never leave the client device. Only the first 5 hexadecimal characters of the SHA-1 hash are queried against HaveIBeenPwned / range databases; suffix matching is performed entirely in local browser memory.
* **Secured Email Breach Proxy**: Validates and routes queries through a rate-limited server proxy with SHA-256 hashed caching, preventing IP tracking and protecting user privacy.
* **Data Privacy & GDPR Remediation**: Generates legally sound GDPR Article 15 (Subject Access Request) and Article 17 (Right to Erasure) compliance notices.

### 3. Desktop Application & Integration Bridge
* **Electron Desktop Shell**: Native Windows windowing, sandboxing, secure context-isolated IPC (`electron/preload.cjs`), and system tray controls.
* **Real-Time Telemetry Bridge (`server/bridge.js`)**: Runs on port `5174` (WebSocket `ws://localhost:5174/ws/telemetry` + REST API) to normalize and transport genuine kernel and file events without duplicating detection logic.
* **Deterministic AI SOC Orchestrator**: Evaluates multi-source evidence into a 0–100 composite risk score (0–24 LOW, 25–49 MEDIUM, 50–74 HIGH, 75–100 CRITICAL) and provides conversational incident triage grounded strictly in verifiable telemetry.
