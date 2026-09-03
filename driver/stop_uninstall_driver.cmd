@echo off
echo ===================================================
echo   Stopping and Removing RansomWatch Minifilter Driver
echo ===================================================
echo NOTE: Run this script as Administrator.
echo.

sc stop FsFilter
sc delete FsFilter

echo Done.
pause
