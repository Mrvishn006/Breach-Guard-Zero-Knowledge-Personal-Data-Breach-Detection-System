# BreachGuard — Windows Installation & Deployment Guide

This guide details how to install, configure, and run **BreachGuard** on any compatible Windows 10 or Windows 11 system.

---

## 💻 System Requirements

* **Operating System**: Windows 10 (Build 19041+) or Windows 11 (64-bit x64)
* **Privileges**: Standard user permissions for desktop application; Administrator privileges required for kernel driver installation.
* **Architecture**: x64 (AMD64 / Intel 64)
* **Memory**: Minimum 4 GB RAM (8 GB recommended)
* **Disk Space**: ~300 MB for BreachGuard + ~50 MB for driver assets

---

## 🚀 Installation Steps

### Option A: Standard Windows Installer (Recommended)

1. **Run Installer**:
   Double-click `BreachGuard Setup 1.0.0.exe` (or `BreachGuard-Setup.exe`).
2. **Installation Directory**:
   Choose destination directory (defaults to `%LOCALAPPDATA%\Programs\BreachGuard` or `%PROGRAMFILES%\BreachGuard`).
3. **Shortcuts**:
   Select whether to create Desktop and Start Menu shortcuts.
4. **Launch Application**:
   Finish the installation wizard to launch BreachGuard.

---

### Option B: Installing the RansomWatch Kernel Driver (`FsFilter.sys`)

The kernel minifilter provides system-wide filesystem IRP interception:

1. Open **Command Prompt / PowerShell as Administrator**.
2. Navigate to the BreachGuard `driver/` directory:
   ```cmd
   cd "%PROGRAMFILES%\BreachGuard\resources\driver"
   ```
   *(Or in development: `cd <project_dir>\driver`)*
3. Execute `install_driver.cmd`:
   ```cmd
   .\install_driver.cmd
   ```
4. **What this script does**:
   - Imports test security certificates (`certutil -addstore -f Root FsFilter.cer`).
   - Registers the minifilter INF section (`rundll32.exe setupapi.dll,InstallHinfSection DefaultInstall 132 .\FsFilter.inf`).
   - Starts the Windows driver service (`sc start FsFilter`).

5. Verify driver status at any time:
   ```cmd
   sc query FsFilter
   ```
   *Expected Output: `STATE : 4 RUNNING`*

---

## 🛑 Uninstallation

1. Open **Windows Settings &rarr; Apps &rarr; Installed Apps**.
2. Locate **BreachGuard Cyber Defense SOC** and click **Uninstall**.
3. To stop and remove the kernel driver:
   - Run `driver/stop_uninstall_driver.cmd` as Administrator (`sc stop FsFilter` && `sc delete FsFilter`).
