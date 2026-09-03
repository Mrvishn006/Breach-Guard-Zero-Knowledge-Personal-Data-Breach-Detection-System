const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const WebSocket = require('ws');

const installedAppDir = 'C:\\Users\\vishn\\AppData\\Local\\Programs\\BreachGuard';
const exePath = path.join(installedAppDir, 'BreachGuard.exe');
const testDir = 'C:\\BreachGuard-Test';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDataIntegrityValidation() {
  console.log('=====================================================');
  console.log('  BREACHGUARD FINAL DATA INTEGRITY VALIDATION        ');
  console.log('=====================================================\n');

  try { execSync('powershell -Command "Stop-Process -Name BreachGuard -Force -ErrorAction SilentlyContinue"'); } catch (e) {}
  await sleep(1000);

  // 1. Launch Installed Application
  console.log('>>> [1/6] Launching Packaged Desktop Executable...');
  const appProc = spawn(exePath, [], { detached: true, stdio: 'ignore' });
  appProc.unref();
  await sleep(5000);

  // 2. Query Bridge Backend Status & Clean State
  console.log('>>> [2/6] Verifying Clean Initial Production State...');
  const statusRes = await fetch('http://localhost:5174/api/status');
  console.log('Bridge Status HTTP:', statusRes.status);
  const statusJson = await statusRes.json();
  console.log('Backend Status:', JSON.stringify(statusJson));

  const metaRes = await fetch('http://localhost:5174/api/ransomwatch/metadata');
  const metaJson = await metaRes.json();
  console.log('Active Tracked Processes (Should be 0 in clean state):', metaJson.trackedProcesses.length);
  console.log('Incident Reports on Disk (Should be 0 if no Report*.log):', metaJson.reports.length);

  if (metaJson.trackedProcesses.length !== 0) {
    throw new Error('FAIL: Synthetic tracked processes detected in initial state!');
  }
  if (metaJson.reports.length !== 0) {
    throw new Error('FAIL: Synthetic reports detected in initial state!');
  }
  console.log('CLEAN STATE VERIFICATION: PASS\n');

  // 3. Connect to WebSocket & Listen for Real Telemetry
  console.log('>>> [3/6] Connecting to Real-Time Telemetry Stream (ws://localhost:5174/ws/telemetry)...');
  const receivedEvents = [];
  const ws = new WebSocket('ws://localhost:5174/ws/telemetry');

  await new Promise((resolve, reject) => {
    ws.on('open', () => {
      console.log('WebSocket connection established.');
      resolve();
    });
    ws.on('error', reject);
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'IRP_TELEMETRY' && parsed.data) {
        receivedEvents.push(parsed.data);
        console.log(`  [REAL IRP INTERCEPTED] ${parsed.data.irpType} | Path: ${parsed.data.filePath} | Entropy: ${parsed.data.entropy} | PID: ${parsed.data.pid}`);
      }
    } catch (e) {}
  });

  // 4. Perform Real Filesystem Operations in C:\BreachGuard-Test
  console.log('\n>>> [4/6] Performing Real Filesystem Operations in C:\\BreachGuard-Test...');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  const testFile1 = path.join(testDir, 'audit_report.txt');
  fs.writeFileSync(testFile1, 'Real production audit log telemetry test 2026');
  console.log('  - Wrote test file:', testFile1);
  await sleep(1500);

  fs.appendFileSync(testFile1, '\nAdditional modified buffer telemetry.');
  console.log('  - Modified test file:', testFile1);
  await sleep(1500);

  const testHighEntropy = path.join(testDir, 'entropy_encrypted.bin');
  const randBuffer = crypto.randomBytes(4096);
  fs.writeFileSync(testHighEntropy, randBuffer);
  console.log('  - Wrote high-entropy byte sequence:', testHighEntropy);
  await sleep(1500);

  fs.unlinkSync(testFile1);
  fs.unlinkSync(testHighEntropy);
  console.log('  - Deleted test files from disk.');
  await sleep(2000);

  console.log(`Total Genuine IRP Events Intercepted via WebSocket: ${receivedEvents.length}`);
  if (receivedEvents.length === 0) {
    throw new Error('FAIL: No real filesystem telemetry was captured by the watcher/bridge!');
  }
  console.log('REAL TELEMETRY PIPELINE: PASS\n');

  // 5. Test Real k-Anonymity & Email Breach Verification (Zero Fake Dumps)
  console.log('>>> [5/6] Testing Real Breach Proxy with Input Sanitization...');
  const checkEmailRes = await fetch('http://localhost:5174/api/breach/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test-unexposed-user-2026@domain-safe.org' })
  });
  const emailJson = await checkEmailRes.json();
  console.log('Real Breach Check Result for unexposed address:', {
    email: emailJson.email,
    exposed: emailJson.exposed,
    riskScore: emailJson.riskScore
  });
  if (emailJson.exposed !== false) {
    throw new Error('FAIL: Synthetic exposure triggered on safe email address!');
  }
  console.log('REAL BREACH VERIFICATION: PASS\n');

  // 6. Final Clean Teardown
  ws.close();
  execSync('powershell -Command "Stop-Process -Name BreachGuard -Force -ErrorAction SilentlyContinue"');
  console.log('>>> [6/6] Clean Application Teardown Complete.\n');

  console.log('=====================================================');
  console.log('  ALL DATA INTEGRITY VALIDATION TESTS PASSED!        ');
  console.log('=====================================================');
}

runDataIntegrityValidation().catch(err => {
  console.error('Validation Failed:', err);
  process.exit(1);
});
