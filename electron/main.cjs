const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');

// --- SINGLE INSTANCE ENFORCEMENT ---
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('[BreachGuard] Another instance is already running. Exiting redundant instance.');
  app.quit();
  process.exit(0);
}

let mainWindow = null;
let bridgeModule = null;

const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development');

// Start the integrated Bridge Server
async function startBridgeServer() {
  if (bridgeModule && bridgeModule.isBridgeRunning()) {
    return { status: 'ALREADY_RUNNING' };
  }

  const bridgePath = path.join(__dirname, '../server/bridge.js');
  if (fs.existsSync(bridgePath)) {
    try {
      const bridgeUrl = `file://${path.resolve(bridgePath).replace(/\\/g, '/')}`;
      bridgeModule = await import(bridgeUrl);
      if (typeof bridgeModule.startBridge === 'function') {
        const result = await bridgeModule.startBridge(5174);
        console.log('[BreachGuard] Bridge initialization result:', result);
        return result;
      }
    } catch (err) {
      console.error('[BreachGuard] Error initializing in-process bridge:', err);
      return { status: 'ERROR', error: err.message };
    }
  }
  return { status: 'BRIDGE_NOT_FOUND' };
}

// Stop the integrated Bridge Server
async function stopBridgeServer() {
  if (bridgeModule && typeof bridgeModule.stopBridge === 'function') {
    try {
      await bridgeModule.stopBridge();
      console.log('[BreachGuard] Bridge server stopped cleanly.');
    } catch (err) {
      console.error('[BreachGuard] Error stopping bridge server:', err);
    }
  }
}

function createWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'BreachGuard SOC — Zero-Knowledge Credential Defense & Ransomware Mitigation',
    backgroundColor: '#F7F8FA',
    icon: fs.existsSync(path.join(__dirname, '../src/assets/branding/breachguard-icon.png'))
      ? path.join(__dirname, '../src/assets/branding/breachguard-icon.png')
      : path.join(__dirname, '../build/icons/breachguard.ico'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Second instance focus handler
app.on('second-instance', (event, commandLine, workingDirectory) => {
  console.log('[BreachGuard] Second instance launch detected. Focusing primary window.');
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

// IPC Handlers
ipcMain.handle('get-system-info', async () => {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    userHome: os.homedir(),
    systemDrive: process.env.SystemDrive || 'C:',
    cpus: os.cpus().length,
    totalMemoryGB: Math.round(os.totalmem() / (1024 * 1024 * 1024))
  };
});

ipcMain.handle('check-driver-status', async () => {
  return new Promise((resolve) => {
    exec('sc query FsFilter', (err, stdout) => {
      if (!err && stdout.includes('RUNNING')) {
        resolve({ installed: true, running: true, raw: stdout });
      } else if (!err && stdout.includes('STOPPED')) {
        resolve({ installed: true, running: false, raw: stdout });
      } else {
        resolve({ installed: false, running: false, raw: stdout || err?.message });
      }
    });
  });
});

ipcMain.handle('open-driver-installer', async () => {
  const driverDir = app.isPackaged
    ? path.join(process.resourcesPath, 'driver')
    : path.join(__dirname, '../driver');

  const installCmd = path.join(driverDir, 'install_driver.cmd');
  if (fs.existsSync(installCmd)) {
    shell.openPath(driverDir);
    return { success: true, path: driverDir };
  }
  return { success: false, error: 'Driver installation script directory not found.' };
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

app.whenReady().then(async () => {
  await startBridgeServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  await stopBridgeServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  await stopBridgeServer();
});
