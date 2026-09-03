const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inno = require('innosetup-compiler');

console.log('===================================================');
console.log('  Building BreachGuard Windows Desktop Package     ');
console.log('===================================================');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const electronDistDir = path.join(rootDir, 'node_modules', 'electron', 'dist');
const releaseDir = path.join(rootDir, 'release');
const unpackedDir = path.join(releaseDir, 'BreachGuard-win32-x64');

// 1. Ensure Vite production frontend is built
console.log('\n[1/5] Building Vite React Frontend...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

// 2. Clean and create release directories
console.log('\n[2/5] Preparing Desktop Package Structure...');
if (fs.existsSync(unpackedDir)) {
  fs.rmSync(unpackedDir, { recursive: true, force: true });
}
fs.mkdirSync(unpackedDir, { recursive: true });

// Copy Electron runtime binaries
console.log('Copying Electron runtime binaries...');
fs.cpSync(electronDistDir, unpackedDir, { recursive: true });

// Rename electron.exe -> BreachGuard.exe
const origExe = path.join(unpackedDir, 'electron.exe');
const targetExe = path.join(unpackedDir, 'BreachGuard.exe');
if (fs.existsSync(origExe)) {
  fs.renameSync(origExe, targetExe);
}

// 3. Assemble Application Resources (app/)
console.log('\n[3/5] Bundling Application Files & Driver Assets...');
const appResourcesDir = path.join(unpackedDir, 'resources', 'app');
fs.mkdirSync(appResourcesDir, { recursive: true });

// Copy dist/, electron/, server/, driver/, package.json
fs.cpSync(path.join(rootDir, 'dist'), path.join(appResourcesDir, 'dist'), { recursive: true });
fs.cpSync(path.join(rootDir, 'electron'), path.join(appResourcesDir, 'electron'), { recursive: true });
fs.cpSync(path.join(rootDir, 'server'), path.join(appResourcesDir, 'server'), { recursive: true });
fs.cpSync(path.join(rootDir, 'driver'), path.join(appResourcesDir, 'driver'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(appResourcesDir, 'package.json'));

// Copy node_modules needed by server (ws)
const appNodeModules = path.join(appResourcesDir, 'node_modules');
fs.mkdirSync(appNodeModules, { recursive: true });
const wsModule = path.join(rootDir, 'node_modules', 'ws');
if (fs.existsSync(wsModule)) {
  fs.cpSync(wsModule, path.join(appNodeModules, 'ws'), { recursive: true });
}

// Also copy driver to top-level resources/driver for easy accessibility
const topDriverDir = path.join(unpackedDir, 'resources', 'driver');
fs.mkdirSync(topDriverDir, { recursive: true });
fs.cpSync(path.join(rootDir, 'driver'), topDriverDir, { recursive: true });

// 4. Create Windows Desktop Installer Package (BreachGuard-Setup.exe via Inno Setup)
console.log('\n[4/5] Compiling Standalone Inno Setup Installer (BreachGuard-Setup.exe)...');
const issFile = path.join(rootDir, 'installer', 'BreachGuard.iss');
inno(issFile, { verbose: false }, (err) => {
  if (err) {
    console.error('Inno Setup build failed:', err);
    process.exit(1);
  }

  // 5. Also create ZIP distribution archive
  console.log('\n[5/5] Creating Archive Distribution...');
  const setupZip = path.join(releaseDir, 'BreachGuard-Setup-v1.0.0.zip');
  try {
    if (fs.existsSync(setupZip)) fs.unlinkSync(setupZip);
    execSync(`powershell -Command "Compress-Archive -Path '${unpackedDir}' -DestinationPath '${setupZip}'"`, { cwd: releaseDir });
    console.log(`Created Installer Archive: ${setupZip}`);
  } catch (e) {
    console.warn('Zip creation skipped:', e.message);
  }

  const setupExe = path.join(releaseDir, 'BreachGuard-Setup.exe');
  console.log('\n===================================================');
  console.log('  SUCCESS: BreachGuard Desktop App & Setup Built!  ');
  console.log(`  Standalone Installer: ${setupExe}`);
  console.log(`  Binary Executable:    ${targetExe}`);
  console.log(`  Archive Package:      ${setupZip}`);
  console.log('===================================================\n');
});
