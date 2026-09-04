# 🛡️ BreachGuard

### Zero-Knowledge Credential Defense & Ransomware Mitigation

BreachGuard is an open-source, privacy-focused cybersecurity platform that combines **credential breach detection**, **Windows ransomware defense**, **endpoint telemetry**, and an **AI-assisted Security Operations Center (SOC)** into a unified desktop application.

The platform is designed around a privacy-first principle: sensitive credential information is processed using client-side cryptographic techniques, while ransomware monitoring is performed through a Windows kernel-mode filesystem minifilter architecture.

---

## ✨ Overview

Modern users face multiple security threats at the same time:

- Credential exposure from data breaches
- Password reuse
- Phishing and account compromise
- Ransomware and mass file modification
- Suspicious process behavior
- Malicious file encryption
- Lack of visibility into endpoint activity
- Difficult incident investigation and recovery

BreachGuard brings these capabilities together into a single Windows desktop security application.

```text
                     ┌─────────────────────────┐
                     │       BreachGuard       │
                     │       Desktop SOC       │
                     └────────────┬────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ RansomWatch  │  │ Breach Guard │  │   AI SOC     │
        │              │  │              │  │ Orchestrator │
        └──────┬───────┘  └──────────────┘  └──────┬───────┘
               │                                    │
               ▼                                    ▼
        ┌──────────────┐                    ┌──────────────┐
        │ FsFilter.sys │                    │ Risk &       │
        │ Kernel Driver│                    │ Correlation  │
        └──────┬───────┘                    └──────────────┘
               │
               ▼
        Real Windows Filesystem
             Telemetry
🚀 Key Features
🔐 Zero-Knowledge Credential Protection

BreachGuard can check whether a password has appeared in known breach datasets without sending the user's raw password to the breach-checking service.

The password is processed locally using cryptographic hashing and the k-Anonymity model.

Privacy flow
User Password
      │
      ▼
Client-Side SHA-1 Hash
      │
      ├──────────────► Raw password NEVER leaves device
      │
      ▼
Hash Prefix
      │
      ▼
Breach Intelligence Service
      │
      ▼
Matching Hash Suffixes
      │
      ▼
Local Comparison
      │
      ▼
Exposure Result
Privacy principles
Raw passwords are not transmitted.
Only the required hash prefix is sent for breach lookup.
Results are processed locally.
The architecture avoids maintaining a persistent database of user passwords.
The system is designed to minimize unnecessary tracking.
📧 Email Breach Intelligence

BreachGuard provides email exposure intelligence through a server-side proxy architecture.

The proxy provides:

Input validation
Rate limiting
Response caching
Hashed cache keys
Reduced direct exposure of client network information
Controlled access to breach intelligence services

The system is designed to avoid unnecessarily storing user identity information.

🦠 RansomWatch

RansomWatch is the endpoint ransomware-defense component of BreachGuard.

It uses a Windows kernel-mode filesystem minifilter driver (FsFilter.sys) as the authoritative filesystem monitoring layer.

The architecture is designed to observe filesystem activity such as:

File creation
File modification
File writes
File renaming
File deletion
Suspicious high-volume file activity
Abnormal file modification patterns
🧠 Shannon Entropy Analysis

RansomWatch uses Shannon entropy as one signal for identifying potentially encrypted or randomized file content.

Normal Document
      │
      ▼
Entropy Analysis
      │
      ▼
Normal entropy range
      │
      ▼
Low Risk

versus:

Mass File Modification
      │
      ▼
High-Entropy Content
      │
      ▼
Behavioral Correlation
      │
      ▼
Potential Ransomware Activity

Entropy is treated as a detection signal rather than a standalone ransomware verdict.

Example development test observations:

Plaintext test file:
H ≈ 4.23

High-entropy test buffer:
H ≈ 7.98

These values are test observations and are not hard-coded production telemetry.

🧬 Process & GID Tracking

RansomWatch can associate filesystem behavior with process families using process/GID tracking.

Parent Process
      │
      ├── Child Process
      │       │
      │       └── File Activity
      │
      └── Related Process
              │
              └── File Activity

When malicious behavior is confirmed by the existing RansomWatch logic, the system can use the associated process family for controlled response.

🪤 Canary / Honeypot Protection

RansomWatch supports canary/honeypot files designed to provide an early signal of suspicious file modification activity.

Example configured canaries:

!00_financial_2026.xlsx
!00_canary_test.dat
!00_backup_key.zip

Canary state is intended to be derived from actual file existence and RansomWatch registration rather than being represented as a static UI claim.

⚡ Controlled Response

BreachGuard is designed around controlled and authorized response, rather than unrestricted autonomous execution.

Detection
    │
    ▼
Evidence Collection
    │
    ▼
Risk Assessment
    │
    ▼
AI/SOC Correlation
    │
    ▼
Recommended Response
    │
    ▼
Authorized Action
    │
    ▼
Existing RansomWatch Mechanism

Supported response mechanisms include the existing RansomWatch process-group termination mechanism.

The system does not provide arbitrary shell execution as an AI capability.

☁️ Recovery

BreachGuard is designed to support recovery of protected files using trusted cloud snapshots.

Protected Files
      │
      ▼
Trusted Cloud Snapshot
      │
      ▼
Ransomware Detection
      │
      ▼
Incident Response
      │
      ▼
Authorized Recovery
      │
      ▼
File Restoration

Current limitation: live Azure storage/recovery integration is not fully connected to an active production Azure tenant in the current development environment. Local rollback/report parsing has been tested, but production cloud recovery should not be considered verified until configured and tested against a real Azure environment.

🤖 AI SOC Orchestrator

The AI SOC layer provides security-event correlation and analyst assistance.

Capabilities include:

Event correlation
Threat severity assessment
Security reasoning
Root-cause analysis assistance
Attack-chain interpretation when sufficient telemetry exists
Response recommendations
Controlled authorized response

The AI layer does not invent security incidents.

If insufficient telemetry exists, the system should report:

Insufficient telemetry for attack-chain attribution.

rather than generating an unsupported attack narrative.

📊 Risk Scoring

BreachGuard uses deterministic signals to calculate a composite security risk score.

Example signals include:

Ransomware indicator       +45
Canary activity            +35
High entropy activity      +25

The final score is bounded within a 0–100 range.

The exact score shown in the application must always be calculated from actual observed telemetry.

🖥️ BreachGuard SOC Desktop Application

BreachGuard provides a Windows desktop SOC interface built using:

React
TypeScript
Vite
Tailwind CSS
Electron
Lucide React

The interface provides dedicated views for:

Unified SOC

Central security overview and correlated endpoint activity.

RansomWatch

Filesystem and ransomware-defense telemetry.

Breach Guard

Credential and email breach intelligence.

AI Copilot

Security analysis and SOC assistance.

🔄 Real-Time Telemetry Architecture

The endpoint telemetry architecture follows:

Windows Filesystem
       │
       ▼
FsFilter.sys
       │
       ▼
RansomWatch
       │
       ▼
\\RWFilterPort
       │
       ▼
User-Mode Adapter / Bridge
       │
       ▼
WebSocket
       │
       ▼
React SOC
       │
       ▼
AI SOC Correlation

The kernel driver remains the authoritative endpoint monitoring layer.

The bridge is intended to collect, normalize, and transport telemetry, rather than becoming a second ransomware-detection engine.

🔌 RansomWatch Communication

The existing RansomWatch architecture uses the Windows Filter Manager communication mechanism:

\\RWFilterPort

Existing message types include:

MESSAGE_GET_OPS
MESSAGE_ADD_SCAN_DIRECTORY
MESSAGE_REM_SCAN_DIRECTORY
MESSAGE_KILL_GID
MESSAGE_SET_PID
MESSAGE_SET_COMM_PORT

The desktop integration communicates with the existing RansomWatch implementation rather than replacing it.

🔒 Privacy & Security Design

BreachGuard follows several privacy-oriented principles.

Passwords

Raw passwords should remain on the user's device during breach checks.

Email Intelligence

Email-related requests are processed through a controlled proxy with validation and rate limiting.

Caching

Where applicable, cached responses use hashed identifiers rather than storing raw sensitive values.

User Tracking

The platform is designed without requiring a persistent database containing users' raw credentials.

AI

AI recommendations are constrained by available evidence and authorized actions.

📈 Security Status Semantics

BreachGuard intentionally avoids displaying misleading security states.

For example:

DRIVER NOT INSTALLED

means the driver is not registered with Windows.

DRIVER ACTIVE

means the actual Windows driver state confirms it is running.

CONNECTED — AWAITING EVENTS

means the telemetry connection exists but no recent event has arrived.

LIVE

should only be shown when genuine telemetry is actively arriving.

NOT DEPLOYED

means a security component such as a canary has not been physically deployed/verified.

This prevents the dashboard from presenting simulated or unsupported security claims.

🛠️ Technology Stack
Component	Technology
Desktop Framework	Electron
Frontend	React
Language	TypeScript
Build Tool	Vite
Styling	Tailwind CSS
UI Icons	Lucide React
Endpoint Driver	Windows Kernel Minifilter
Driver	FsFilter.sys
Driver Communication	\\RWFilterPort
Telemetry	WebSocket
Credential Protection	SHA-1 + k-Anonymity
Entropy Analysis	Shannon Entropy
Cloud Recovery	Azure Snapshots
AI Layer	AI SOC Orchestrator
Platform	Windows
⚙️ Installation
Requirements

BreachGuard's complete endpoint protection functionality requires:

Windows
Administrator privileges for kernel driver installation
Electron/Node.js development environment for building from source
Properly configured/signing-compatible driver environment
Development

Clone the repository:

git clone https://github.com/YOUR-USERNAME/breachguard.git
cd breachguard

Install dependencies:

npm install

Run the development application:

npm run dev

Build the frontend:

npm run build
🪟 Windows Driver Installation

The RansomWatch kernel driver requires elevated Windows privileges.

The repository contains the existing driver package:

driver/
├── FsFilter.sys
├── FsFilter.inf
├── FsFilter.cer
├── install_driver.cmd
└── uninstall_driver.cmd

Run the driver installation process with Administrator privileges where required.

After installation, verify the Windows service/driver state:

sc query FsFilter

The application should only report the driver as active when the actual Windows driver state confirms that it is running.

⚠️ Driver Signing Notice

The development driver package may use a test certificate.

Therefore:

The included driver configuration should be treated as a development/testing configuration unless the driver has been properly signed and deployed according to Microsoft's supported kernel-driver signing requirements.

Do not disable Windows security features or Secure Boot simply to make the driver appear operational.

For production deployment, use an appropriately signed kernel driver and follow Microsoft's driver deployment requirements.

🧪 Testing

BreachGuard should be tested using disposable test files and directories.

Example:

C:\BreachGuard-Live-Test\

Test operations:

CREATE
WRITE
MODIFY
RENAME
DELETE

Verify the complete telemetry path:

Filesystem Event
      ↓
FsFilter.sys
      ↓
RansomWatch
      ↓
\\RWFilterPort
      ↓
Bridge
      ↓
WebSocket
      ↓
SOC
🧪 Entropy Test

A safe entropy test can use:

Normal text file

and:

High-entropy test buffer

The test must use disposable data.

Never use real personal documents for ransomware simulations.

🧪 Ransomware Testing

Do not test ransomware behavior against real personal files.

Use:

C:\BreachGuard-Live-Test\

with disposable test data.

Never intentionally encrypt:

C:\Users\
C:\Windows\
C:\Program Files\

or other important system/user data for testing.

📁 Project Structure

The exact structure may evolve, but the project is organized conceptually as:

BreachGuard/
│
├── driver/
│   ├── FsFilter.sys
│   ├── FsFilter.inf
│   ├── FsFilter.cer
│   ├── install_driver.cmd
│   └── uninstall_driver.cmd
│
├── server/
│   └── bridge.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── ...
│
├── electron/
│   ├── main
│   └── preload
│
├── installer/
│   └── BreachGuard.iss
│
├── package.json
├── vite.config.*
├── tailwind.config.*
└── README.md

Adjust the structure above to match the actual repository before publishing if filenames differ.

🖥️ Windows Installer

The project supports packaging a Windows installer for the desktop application.

The intended user experience is:

Download BreachGuard
        ↓
BreachGuard-Setup.exe
        ↓
Windows Installer
        ↓
BreachGuard Desktop
        ↓
RansomWatch Driver
        ↓
SOC Dashboard

The installer should install the application and the required driver assets.

Kernel-driver installation may require explicit Administrator approval.

🧭 Project Status
Component	Status
React SOC	✅ Implemented
Electron Desktop App	✅ Implemented
Breach Guard	✅ Implemented
SHA-1 k-Anonymity	✅ Implemented
Email Proxy	✅ Implemented
Shannon Entropy	✅ Tested
RansomWatch Architecture	✅ Implemented
FsFilter Driver Package	⚠️ Requires installation/signing configuration
Kernel Telemetry	⚠️ Requires active driver
WebSocket Telemetry	✅ Implemented
AI SOC	✅ Implemented
Controlled Response	✅ Implemented
Canary Protection	⚠️ Requires physical deployment verification
Azure Cloud Recovery	⚠️ Requires production Azure configuration
Second-machine Deployment	⚠️ Requires additional validation

Do not interpret this table as a guarantee that every component is production-ready. Kernel-driver deployment and cloud recovery require environment-specific validation.

🛡️ Design Principles

BreachGuard follows these principles:

1. Privacy First

Sensitive credential information should remain on the user's device whenever possible.

2. Evidence Before Claims

The SOC should only display security states supported by real telemetry.

3. Kernel-Level Visibility

RansomWatch uses a Windows minifilter as the authoritative filesystem monitoring layer.

4. No Fake Telemetry

The dashboard must never generate fake attacks, events, timestamps, risk scores, or recovery results.

5. Controlled Response

Security response should remain bounded and authorized.

6. Modular Architecture

Credential protection, endpoint protection, telemetry, AI correlation, and recovery remain modular components.

🤖 AI Safety Model

The AI SOC is designed as an assistant and correlation layer rather than an unrestricted autonomous administrator.

Evidence
   ↓
Correlation
   ↓
Risk Score
   ↓
Explanation
   ↓
Recommendation
   ↓
Authorized Response

If evidence is insufficient, the system should explicitly state that attribution cannot be established.

🔮 Future Improvements

Potential future work includes:

Production-grade kernel driver signing
Broader validated volume coverage
Improved endpoint telemetry visualization
Additional ransomware behavioral signals
Production Azure snapshot integration
Automated incident timelines
More advanced attack-chain correlation
Security event export
Enterprise policy management
Multi-endpoint SOC capabilities
Secure update mechanism
Independent security auditing
Additional Windows deployment testing
⚠️ Disclaimer

BreachGuard is a cybersecurity research and development project.

It should be thoroughly tested and independently reviewed before being used to protect critical production systems.

Kernel-mode software can affect system stability. Improper driver installation or development signing configurations may cause Windows security or compatibility issues.

Do not use ransomware-response or recovery functionality against systems or data without proper authorization.

The authors do not guarantee protection against every form of malware, ransomware, credential theft, or data breach.

📜 License

Add your chosen open-source license here.

For example:

MIT License

See LICENSE for the complete license text.

🤝 Contributing

Contributions are welcome.

Before submitting changes:

Do not introduce fake security telemetry.
Do not weaken credential privacy.
Do not bypass Windows security controls.
Do not add unrestricted AI command execution.
Do not modify kernel-driver behavior without documenting the security impact.
Test changes on disposable environments.
Preserve the separation between detection, telemetry, AI correlation, and controlled response.
⭐ Project Vision

BreachGuard aims to bring multiple layers of personal cybersecurity into a single privacy-focused platform:

       ┌─────────────────────────┐
       │       BREACHGUARD       │
       │   Unified Protection    │
       └────────────┬────────────┘
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
  Credential    Endpoint       AI SOC
  Protection    Protection     Analysis
       │            │            │
       ▼            ▼            ▼
  k-Anonymity   RansomWatch   Correlation
  Breach Intel  FsFilter.sys  Risk Scoring
       │            │            │
       └────────────┼────────────┘
                    ▼
             Controlled Response
                    │
                    ▼
                Recovery
BreachGuard

Privacy-first credential defense meets endpoint ransomware protection.
