const { contextBridge, ipcRenderer } = require('electron');

// Secure Preload Bridge for BreachGuard Desktop
contextBridge.exposeInMainWorld('breachGuardDesktop', {
  isDesktop: true,
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  checkDriverStatus: () => ipcRenderer.invoke('check-driver-status'),
  installDriverElevated: () => ipcRenderer.invoke('install-driver-elevated'),
  openDriverInstaller: () => ipcRenderer.invoke('open-driver-installer'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
