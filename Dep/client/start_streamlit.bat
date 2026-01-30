@echo off
echo ========================================
echo  Image to LaTeX Converter (Streamlit)
echo ========================================
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

REM Check and install dependencies
echo Checking dependencies...
pip show streamlit >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting Streamlit app at http://localhost:8501
echo Press Ctrl+C to stop the server
echo.

streamlit run app.py

pause
