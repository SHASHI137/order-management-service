@echo off
echo ==========================================
echo   Product & Order System - Setup & Run
echo ==========================================

echo check node version...
node -v
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js.
    pause
    exit /b
)

echo.
echo [1/4] Installing Root Dependencies...
call npm install

echo.
echo [2/4] Installing Client & Server Dependencies...
call npm run install-all

echo.
echo [3/4] Setting up Database...
cd server
call npx prisma migrate dev --name init
cd ..

echo.
echo [4/4] Starting Application...
echo Frontend will be at: http://localhost:5173
echo Backend will be at: http://localhost:3000
echo.
npm run dev

pause
