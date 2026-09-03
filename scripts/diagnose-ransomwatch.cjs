const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const crypto = require('crypto');
const http = require('http');
const WebSocket = require('ws');

const testDir = 'C:\\BreachGuard-Live-Test';

// Shannon Entropy Calculation
function calculateShannonEntropy(buffer) {
  if (!buffer || buffer.length === 0) return 0;
  const frequencies = new Map();
  for (const byte of buffer) {
    frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
  }
  let entropy = 0;
  const len = buffer.length;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return +entropy.toFixed(2);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDiagnostics() {
  console.log('===============================================================');
  console.log('  RANSOMWATCH & FSFILTER.SYS DEEP TELEMETRY DIAGNOSTIC SUITE   ');
  console.log('===============================================================\n');

  // Step 1: Check Windows Service and Driver State
  console.log('>>> [1/7] Checking Windows Service & Driver Registry State...');
  let serviceInstalled = false;
  let serviceRunning = false;
  let scOutput = '';

  try {
    scOutput = execSync('cmd /c "sc query FsFilter"', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (scOutput.includes('RUNNING')) {
      serviceInstalled = true;
      serviceRunning = true;
    } else if (scOutput.includes('STOPPED')) {
      serviceInstalled = true;
      serviceRunning = false;
    }
  } catch (err) {
    scOutput = err.stdout || err.stderr || err.message;
  }
  console.log('  sc query FsFilter raw output:');
  console.log('  ' + scOutput.trim().replace(/\r?\n/g, '\n  '));
  console.log(`  Summary: Installed = ${serviceInstalled}, Running = ${serviceRunning}\n`);

  // Step 2: Check Filter Manager State (fltmc)
  console.log('>>> [2/7] Checking Filter Manager (fltmc filters / instances)...');
  let fltmcOutput = '';
  try {
    fltmcOutput = execSync('cmd /c "fltmc filters"', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    fltmcOutput = err.stdout || err.stderr || err.message;
  }
  console.log('  fltmc raw output:');
  console.log('  ' + fltmcOutput.trim().replace(/\r?\n/g, '\n  ') + '\n');

  // Step 3: Check Report*.log on System Drive
  console.log('>>> [3/7] Checking for C:\\Report*.log Incident Logs...');
  try {
    const cFiles = fs.readdirSync('C:\\');
    const reports = cFiles.filter(f => /^Report\d+\.log$/i.test(f));
    console.log(`  Found ${reports.length} report logs on C:\\:`, reports);
    for (const r of reports) {
      const content = fs.readFileSync(path.join('C:\\', r), 'utf8');
      console.log(`  --- Content of C:\\${r} (first 200 chars) ---`);
      console.log('  ' + content.substring(0, 200).replace(/\r?\n/g, '\n  '));
    }
  } catch (err) {
    console.log('  Error reading C:\\ directory:', err.message);
  }
  console.log();

  // Step 4: Check Canaries on Disk
  console.log('>>> [4/7] Checking Honeypot Canaries on Disk...');
  const userHome = process.env.USERPROFILE || 'C:\\Users\\vishn';
  const userDocs = path.join(userHome, 'Documents');
  const expectedCanaries = [
    path.join(userDocs, '!00_financial_2026.xlsx'),
    'C:\\BreachGuard-Test\\!00_canary_test.dat',
    path.join(userDocs, '!00_backup_key.zip')
  ];
  for (const c of expectedCanaries) {
    const exists = fs.existsSync(c);
    console.log(`  Canary: ${c} -> Exists: ${exists}`);
  }
  console.log();

  // Step 5: Real Filesystem Test on C:\BreachGuard-Live-Test\
  console.log('>>> [5/7] Executing Real Multi-Step Filesystem Operations in C:\\BreachGuard-Live-Test\\...');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
    console.log(`  Created directory: ${testDir}`);
  }

  const file1 = path.join(testDir, 'live_test_doc.txt');
  const file1Renamed = path.join(testDir, 'live_test_doc_renamed.txt');
  const file2HighEntropy = path.join(testDir, 'live_test_entropy.bin');

  // 1. Create text file
  fs.writeFileSync(file1, 'Initial normal text payload for RansomWatch live diagnostic test.\n');
  const buf1 = fs.readFileSync(file1);
  const entropy1 = calculateShannonEntropy(buf1);
  console.log(`  1. Created: ${file1} (Size: ${buf1.length} bytes, Shannon Entropy H: ${entropy1})`);
  await sleep(500);

  // 2. Append text
  fs.appendFileSync(file1, 'Appending additional lines of plain structured text logging data.\n');
  const buf1Appended = fs.readFileSync(file1);
  const entropy1App = calculateShannonEntropy(buf1Appended);
  console.log(`  2. Appended to: ${file1} (New Size: ${buf1Appended.length} bytes, Shannon Entropy H: ${entropy1App})`);
  await sleep(500);

  // 3. Rename file
  if (fs.existsSync(file1Renamed)) fs.unlinkSync(file1Renamed);
  fs.renameSync(file1, file1Renamed);
  console.log(`  3. Renamed: ${file1} -> ${file1Renamed}`);
  await sleep(500);

  // 4. Create high-entropy random binary file (simulating encrypted ransomware payload)
  const highEntropyBytes = crypto.randomBytes(8192);
  fs.writeFileSync(file2HighEntropy, highEntropyBytes);
  const entropy2 = calculateShannonEntropy(highEntropyBytes);
  console.log(`  4. Created High-Entropy File: ${file2HighEntropy} (Size: ${highEntropyBytes.length} bytes, Shannon Entropy H: ${entropy2})`);
  await sleep(500);

  // 5. Modify high-entropy file
  const extraRand = crypto.randomBytes(4096);
  fs.appendFileSync(file2HighEntropy, extraRand);
  const buf2Appended = fs.readFileSync(file2HighEntropy);
  const entropy2App = calculateShannonEntropy(buf2Appended);
  console.log(`  5. Modified High-Entropy File: ${file2HighEntropy} (New Size: ${buf2Appended.length} bytes, Shannon Entropy H: ${entropy2App})`);
  await sleep(500);

  // 6. Delete test files
  fs.unlinkSync(file1Renamed);
  fs.unlinkSync(file2HighEntropy);
  console.log(`  6. Deleted test files from disk.`);
  await sleep(500);

  console.log('  Filesystem operations completed.\n');

  // Step 6: Test Bridge / WebSocket Transport
  console.log('>>> [6/7] Checking Bridge Server & WebSocket Telemetry Delivery...');
  try {
    const statusRes = await fetch('http://localhost:5174/api/status');
    const statusData = await statusRes.json();
    console.log('  Bridge /api/status HTTP Response:', JSON.stringify(statusData, null, 2));
  } catch (err) {
    console.log('  Bridge HTTP server not currently reachable on port 5174 (expected if bridge not started in this terminal session):', err.message);
  }
  console.log();

  // Step 7: Architecture Diagnosis & Findings
  console.log('>>> [7/7] Summary of Diagnostic Findings:');
  console.log('  1. FsFilter.sys service registered: ' + serviceInstalled);
  console.log('  2. FsFilter.sys service running: ' + serviceRunning);
  console.log('  3. Plaintext file measured entropy: ' + entropy1);
  console.log('  4. High-entropy crypto payload measured entropy: ' + entropy2);
  console.log('===============================================================\n');
}

runDiagnostics().catch(console.error);
