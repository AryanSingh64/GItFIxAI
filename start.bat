@echo off
echo ==================================================
echo      AUTO-DEVOPS AGENT - ONE CLICK START
echo ==================================================
echo.

echo 1. Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing python dependencies!
    pause
    exit /b
)
echo Dependencies installed.

echo.
echo 2. Starting Backend Server...
start "Agent Backend (Port 8000)" cmd /k "python main.py"

echo.
echo 3. Starting Frontend Dashboard...
cd ../frontend
start "Agent Frontend" cmd /k "npm run dev"

echo.
echo 4. Opening Dashboard in Browser...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo ==================================================
echo      ALL SYSTEMS GO! 
echo ==================================================
echo Dashboard: http://localhost:5173
echo Backend:   http://localhost:8000
echo.
pause
