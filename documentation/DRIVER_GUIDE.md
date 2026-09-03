# RansomWatch Minifilter Driver (`FsFilter.sys`) Technical Specification

## 🛡️ Driver Architecture

RansomWatch utilizes a standard Windows File System Minifilter driver (`FsFilter.sys`) registered with the Filter Manager (`FltMgr.sys`).

### 1. Pre/Post-Operation Interceptions
* **`IRP_MJ_CREATE`**: Intercepts file open, overwrite, and creation requests. Flags fast file enumeration across protected extensions.
* **`IRP_MJ_WRITE`**: Computes Shannon entropy on target byte blocks before writes are committed to disk.
* **`IRP_MJ_SET_INFORMATION`**: Detects batch extension modifications (e.g., changing `.docx` or `.xlsx` to `.locked`, `.crypto`, or `.enc`).

---

## ⚡ Communication Port (`\\RWFilterPort`)

User-mode RansomWatch and the BreachGuard Integration Bridge communicate with `FsFilter.sys` via a bi-directional communication port established via `FltCreateCommunicationPort`:

```cpp
// Kernel Port Setup
RtlInitUnicodeString(&uniString, L"\\RWFilterPort");
InitializeObjectAttributes(&oa, &uniString, OBJ_KERNEL_HANDLE | OBJ_CASE_INSENSITIVE, NULL, NULL);
status = FltCreateCommunicationPort(
    gFilterHandle,
    &gServerPort,
    &oa,
    NULL,
    RWConnectNotifyCallback,
    RWDisconnectNotifyCallback,
    RWMessageNotifyCallback,
    1
);
```

---

## 🛑 Process Group (GID) Termination

When ransomware is detected, RansomWatch issues a driver-level kill command targeting the entire process family (GID):

```
Malicious Write Detected (H > 7.8 or Trap Tripped)
                      ↓
          MESSAGE_KILL_GID dispatched
                      ↓
  All associated PIDs terminated by kernel
                      ↓
     Incident report written to C:\Report<GID>.log
```

---

## 📊 Shannon Entropy Calculation

The Shannon entropy $H(X)$ measures randomness of data buffers on a 0.0 to 8.0 bit scale:

* **Plain text & Source code**: $H \approx 3.0 - 4.8$
* **Compiled binaries**: $H \approx 5.5 - 6.8$
* **Encrypted / Packed Ransomware Buffers**: $H \approx 7.8 - 8.0$

Buffers exceeding $H \ge 7.8$ combined with abnormal modification frequency trigger immediate mitigation.
