@echo off
echo ========================================
echo  Starting Test Server for Web App
echo ========================================
echo.
echo This is a mock server for testing the web interface.
echo For real predictions, use Docker container.
echo.

cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing FastAPI...
    pip install fastapi uvicorn
)

echo.
echo Starting server at http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

python test_server.py

pause
