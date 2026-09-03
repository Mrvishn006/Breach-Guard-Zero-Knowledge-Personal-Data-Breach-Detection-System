@echo off
echo ===================================================
echo   Installing RansomWatch Minifilter Kernel Driver
echo ===================================================
echo NOTE: Run this script as Administrator.
echo.

cd /d "%~dp0"

echo [1/3] Importing Test Certificate...
certutil -addstore -f "Root" FsFilter.cer
certutil -addstore -f "TrustedPublisher" FsFilter.cer

echo [2/3] Installing Driver via INF...
rundll32.exe setupapi.dll,InstallHinfSection DefaultInstall 132 .\FsFilter.inf

echo [3/3] Starting FsFilter Driver Service...
sc start FsFilter

echo.
echo ===================================================
echo   Installation finished.
echo   You can now run Application.exe as Administrator.
echo ===================================================
pause
