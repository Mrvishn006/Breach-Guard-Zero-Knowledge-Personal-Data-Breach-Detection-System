# BreachGuard — Troubleshooting & Diagnostic Guide

## 1. RansomWatch Driver Communication Issues

### Symptom: Dashboard shows `Driver: STANDBY` or `Driver: OFFLINE`
1. Verify if the Windows driver service is running:
   ```cmd
   sc query FsFilter
   ```
2. If state is not `RUNNING`, start the driver as Administrator:
   ```cmd
   sc start FsFilter
   ```
3. If not installed, execute `driver\install_driver.cmd` with Administrator privileges.

---

## 2. Port Binding Conflicts (Port 5174 or 5173)

### Symptom: `EADDRINUSE: address already in use :::5174`
1. Check what process is holding port 5174:
   ```cmd
   netstat -ano | findstr :5174
   ```
2. Terminate the conflicting process:
   ```cmd
   taskkill /F /PID <PID>
   ```

---

## 3. Rate Limiting on Email Queries

### Symptom: `Rate limit exceeded (HTTP 429)`
* The built-in privacy proxy enforces a sliding window limit of **15 queries per minute per client IP** to protect user anonymity and prevent abuse.
* Wait 60 seconds before submitting further email queries.

---

## 4. Test Mode vs Live Telemetry Verification

* In **LIVE MODE**, all IRP events, process groups, and file alerts reflect actual system operations.
* Use the **"Test Scenario"** button in the top navbar to inject a safe, isolated encryption test workload to verify driver alert and AI correlation pipelines without harming any real files.
