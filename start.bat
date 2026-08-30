@echo off
title Belgrade Arbor - Local Web Server
echo ========================================================
echo   Launching Belgrade Arbor Website on Local Server...
echo ========================================================
echo.
echo Opening browser at http://localhost:3000
start http://localhost:3000
echo.
echo Starting local static server on port 3000...
npx -y serve . -l 3000
pause
